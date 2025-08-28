import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import QuestionnaireEngine from './scripts/questionnaire.js';
import ValidationEngine from './scripts/validator.js';
import EnhancedGenerator from './scripts/enhanced-generator.js';
import AIService from './scripts/ai-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware - Increase body parser limits for image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));
app.use('/dist', express.static('dist'));
app.use('/generated', express.static('dist'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize services
let generator, validator, aiService;

async function initializeServices() {
  try {
    generator = new EnhancedGenerator();
    await generator.initialize();
    
    validator = new ValidationEngine();
    await validator.loadSchemas();
    
    aiService = new AIService();
    await aiService.loadContext();
    
    console.log('✅ Services initialized');
  } catch (error) {
    console.error('❌ Service initialization failed:', error.message);
    process.exit(1);
  }
}

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Salesforce Go Runtime Builder',
    subtitle: 'Generate configuration screens from guided questionnaires'
  });
});

app.get('/how-to-go', (req, res) => {
  res.render('how-to-go', { 
    title: 'How to Go - AI Configuration Assistant'
  });
});

// Redirect old questionnaire route for backward compatibility
app.get('/questionnaire', (req, res) => {
  res.redirect('/how-to-go');
});

app.get('/simple', (req, res) => {
  res.render('simple-questionnaire', { 
    title: 'Simple Page Generator'
  });
});

// API Routes

// AI Chat endpoint for "How to Go" experience
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], conversationState = {} } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    // Send message to AI service
    const aiResponse = await aiService.sendMessage(message, conversationHistory);
    
    // Merge the new state with existing conversation state
    const updatedState = {
      ...conversationState,
      ...aiResponse.state
    };
    
    // Check if we can generate pages
    const canGenerate = aiService.canGeneratePages(updatedState);
    
    res.json({
      success: true,
      ...aiResponse,
      conversationState: updatedState,
      canGenerate: canGenerate,
      autoGenerate: aiResponse.state && aiResponse.state.stage === 'ready-to-generate'
    });
    
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message',
      message: "I'm having trouble right now. Could you try rephrasing your question?"
    });
  }
});

app.post('/api/validate', async (req, res) => {
  try {
    const session = req.body;
    
    // Simple validation - just check required fields
    const errors = [];
    if (!session.setupType) errors.push('Setup type is required');
    if (!session.metadata?.name) errors.push('Name is required');
    
    res.json({
      success: errors.length === 0,
      errors: errors,
      warnings: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const session = req.body;
    
    // Simple validation - just check required fields
    if (!session.setupType || !session.metadata?.name) {
      return res.status(400).json({
        success: false,
        error: 'Setup type and name are required'
      });
    }
    
    // Clean up session data to match schema - remove AI-specific properties
    const cleanSession = {
      setupType: session.setupType,
      metadata: session.metadata
    };
    
    // Add schema-compliant top-level properties
    if (session.features) {
      cleanSession.features = session.features;
    }
    if (session.agentforce) {
      cleanSession.agentforce = session.agentforce;
    }
    if (session.assets) {
      cleanSession.assets = session.assets;
    }
    
    console.log('🔄 Generating pages from cleaned questionnaire session');
    
    // Generate pages
    const result = await generator.generateFromQuestionnaireSession(cleanSession);
    
    // Save session for reference
    const sessionId = Date.now();
    const outputDir = path.join(__dirname, 'output');
    await fs.ensureDir(outputDir);
    await fs.writeJson(path.join(outputDir, `web-session-${sessionId}.json`), session, { spaces: 2 });
    
    // Remove dist/ prefix if it exists (since /generated route already points to dist/)
    const homePath = result.relativePaths.home.startsWith('dist/') 
      ? result.relativePaths.home.substring(5) 
      : result.relativePaths.home;
    const mainPath = result.relativePaths.main.startsWith('dist/') 
      ? result.relativePaths.main.substring(5) 
      : result.relativePaths.main;
    
    res.json({
      success: true,
      sessionId,
      generatedPages: result.generatedPaths.length,
      homePath: `/generated/${homePath}`,
      mainPath: `/generated/${mainPath}`,
      setupType: session.setupType,
      name: session.metadata.name,
      warnings: []
    });
    
  } catch (error) {
    console.error('Generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/setup-types', (req, res) => {
  res.json({
    setupTypes: [
      {
        id: 'feature-set-and-features',
        name: 'Feature Set and Features',
        description: 'Group multiple features with a Job to be Done',
        requirements: ['≥2 features', 'Clear JTBD'],
        examples: ['Authentication Suite', 'Document Management', 'Analytics Package']
      },
      {
        id: 'feature',
        name: 'Feature',
        description: 'Single feature or capability',
        requirements: ['Customer-facing or sold capability'],
        examples: ['File Upload', 'Email Notifications', 'Advanced Search']
      },
      {
        id: 'solution-initial-setup',
        name: 'Solution / Initial Setup',
        description: 'Foundational automated setup',
        requirements: ['Automation-handled', 'Required for cloud function'],
        examples: ['E-commerce Platform', 'CRM Setup', 'Platform Initialization']
      },
      {
        id: 'agent-setup',
        name: 'Agent Setup',
        description: 'Agentforce AI agent configuration',
        requirements: ['Agentforce needed'],
        examples: ['Customer Service Bot', 'Sales Assistant', 'Support Agent']
      }
    ]
  });
});



// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      generator: !!generator,
      validator: !!validator
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { 
    title: '404 - Page Not Found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).render('error', { 
    title: '500 - Server Error',
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// Initialize and start server
async function startServer() {
  await initializeServices();
  
  app.listen(port, () => {
    console.log(`🚀 Salesforce Go Runtime Builder running at http://localhost:${port}`);
    console.log(`🎯 Questionnaire: http://localhost:${port}/questionnaire`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
