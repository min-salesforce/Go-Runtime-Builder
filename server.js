import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';
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

// Save page permanently and get shareable URL
app.post('/api/save', async (req, res) => {
  try {
    const { session, pageType, customSlug } = req.body;
    
    // Validate required data
    if (!session || !session.setupType || !session.metadata?.name) {
      return res.status(400).json({
        success: false,
        error: 'Session data and page name are required'
      });
    }

    // Generate unique ID for this saved page
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(4).toString('hex');
    const uniqueId = `${timestamp}-${randomBytes}`;
    
    // Create a clean slug from the name
    const baseName = session.metadata.name;
    const slug = customSlug || baseName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    // Generate the page first
    const cleanSession = {
      setupType: session.setupType,
      metadata: session.metadata
    };
    if (session.features) { cleanSession.features = session.features; }
    if (session.agentforce) { cleanSession.agentforce = session.agentforce; }
    if (session.assets) { cleanSession.assets = session.assets; }
    
    const result = await generator.generateFromQuestionnaireSession(cleanSession);
    
    // Create saved pages directory
    const savedDir = path.join(__dirname, 'saved');
    await fs.ensureDir(savedDir);
    
    // Save the page data and metadata
    const pageData = {
      id: uniqueId,
      slug: slug,
      name: baseName,
      setupType: session.setupType,
      session: cleanSession,
      generatedPaths: result.generatedPaths,
      relativePaths: result.relativePaths,
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString()
    };
    
    await fs.writeJson(path.join(savedDir, `${uniqueId}.json`), pageData, { spaces: 2 });
    
    // Create shareable URL
    const shareableUrl = `/saved/${slug}/${uniqueId}`;
    
    res.json({
      success: true,
      url: shareableUrl,
      id: uniqueId,
      slug: slug,
      name: baseName,
      permanentUrl: `${req.protocol}://${req.get('host')}${shareableUrl}`
    });
    
  } catch (error) {
    console.error('Save failed:', error);
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

// Serve saved pages permanently
app.get('/saved/:slug/:id', async (req, res) => {
  try {
    const { slug, id } = req.params;
    
    // Load saved page data
    const savedDir = path.join(__dirname, 'saved');
    const pageDataPath = path.join(savedDir, `${id}.json`);
    
    if (!await fs.pathExists(pageDataPath)) {
      return res.status(404).render('error', { 
        title: '404 - Page Not Found',
        error: 'This saved page could not be found. It may have been removed or the URL is incorrect.'
      });
    }
    
    const pageData = await fs.readJson(pageDataPath);
    
    // Update last accessed time
    pageData.lastAccessed = new Date().toISOString();
    await fs.writeJson(pageDataPath, pageData, { spaces: 2 });
    
    // Regenerate the page to serve fresh content
    const result = await generator.generateFromQuestionnaireSession(pageData.session);
    
    // Determine which file to serve based on setup type
    let filePath;
    if (pageData.setupType === 'agent-setup' || pageData.setupType === 'agent') {
      filePath = path.join(__dirname, 'dist', 'agent', `${pageData.slug}.html`);
    } else {
      filePath = path.join(__dirname, 'dist', 'feature', `${pageData.slug}.html`);
    }
    
    // If the exact slug file doesn't exist, use the main generated path
    if (!await fs.pathExists(filePath)) {
      const mainPath = result.relativePaths.main;
      filePath = path.join(__dirname, 'dist', mainPath.startsWith('dist/') 
        ? mainPath.substring(5) 
        : mainPath
      );
    }
    
    if (!await fs.pathExists(filePath)) {
      return res.status(404).render('error', { 
        title: '404 - Page Not Found',
        error: 'The generated page file could not be found.'
      });
    }
    
    // Read and serve the HTML file
    const htmlContent = await fs.readFile(filePath, 'utf8');
    
    // Add some metadata to indicate this is a saved page
    const modifiedHtml = htmlContent.replace(
      '<head>',
      `<head>
    <!-- Saved Page: ${pageData.name} -->
    <!-- Created: ${pageData.createdAt} -->
    <!-- ID: ${pageData.id} -->
    <meta name="description" content="Saved Salesforce Go configuration page: ${pageData.name}">
    <meta property="og:title" content="${pageData.name} - Salesforce Go">
    <meta property="og:description" content="Saved configuration page for ${pageData.name}">
    <meta property="og:type" content="website">`
    );
    
    res.send(modifiedHtml);
    
  } catch (error) {
    console.error('Error serving saved page:', error);
    res.status(500).render('error', { 
      title: '500 - Server Error',
      error: 'An error occurred while loading this saved page.'
    });
  }
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
