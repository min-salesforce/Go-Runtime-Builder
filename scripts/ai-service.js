/**
 * AI Service for "How to Go" Conversational Interface
 * Supports both local GPT-OSS-20b and Heroku Inference
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AIService {
    constructor() {
        this.isProduction = process.env.NODE_ENV === 'production';
        this.inferenceUrl = process.env.INFERENCE_URL;
        this.inferenceKey = process.env.INFERENCE_KEY;
        this.modelId = process.env.INFERENCE_MODEL_ID || 'gpt-oss-120b';
        this.canonicalContent = null;
        this.decisionTreeContent = null;
        this.contextLoaded = false;
        
        // Initialize context
        this.loadContext();
    }
    
    async loadContext() {
        try {
            const rootDir = path.join(__dirname, '..');
            
            // Load canonical.md
            const canonicalPath = path.join(rootDir, 'canonical.md');
            this.canonicalContent = await fs.readFile(canonicalPath, 'utf8');
            
            // Load decision tree.md
            const decisionTreePath = path.join(rootDir, 'decision tree.md');
            this.decisionTreeContent = await fs.readFile(decisionTreePath, 'utf8');
            
            this.contextLoaded = true;
            console.log('✅ AI Service: Context loaded successfully');
        } catch (error) {
            console.error('❌ AI Service: Failed to load context:', error.message);
            this.contextLoaded = false;
        }
    }
    
    buildSystemPrompt() {
        return `You are a Salesforce Go Configuration Assistant. You help users discover the right setup approach for their Salesforce Go configuration pages by asking intelligent questions and providing guidance based on official Salesforce standards.

## Your Knowledge Base

### Canonical Guidelines:
${this.canonicalContent}

### Decision Tree:
${this.decisionTreeContent}

## Your Role
- Ask clarifying questions to understand the user's needs
- Guide them through the decision tree to determine the optimal setup type
- Explain Salesforce Go standards and requirements
- Help them configure their pages according to canonical guidelines
- Be conversational but focused on getting the information needed for page generation

## IMPORTANT: Setup Type Constraints
**You must ONLY recommend these two setup types - no other types are currently supported:**

1. **Feature Page**: Use this for ALL user-facing capabilities, features, or functionality
   - Examples: File upload, search, notifications, authentication, workflows, data management
   - Perfect for ANY user-facing capability or configuration screen
   - Can handle simple features AND complex multi-step processes
   - IMPORTANT: Even if users mention multiple related features (like "login, SSO, and password reset"), guide them to create a Feature page that can handle all these capabilities together
   
2. **Agent Setup**: Use this ONLY for AI-powered Agentforce configurations
   - Examples: Customer service bots, sales assistants, automation agents
   - Ideal for AI-powered workflows and intelligent automation

## Critical Guidelines
- NEVER suggest Feature Sets, Solution Setup, or any other setup types
- If users mention multiple related features, explain that our Feature pages are flexible and can handle complex, multi-step processes
- For any AI/automation/bot requests, route to Agent setup
- For everything else (including complex multi-feature scenarios), route to Feature page
- Ask clarifying questions to understand whether they need a Feature page or Agent configuration
- When you have enough information, summarize what you've learned and offer to generate pages

## Response Format
Provide helpful, conversational responses that guide the user toward the right configuration. When you have sufficient information, indicate readiness to proceed with page generation.`;
    }
    
    async sendMessage(userMessage, conversationHistory = []) {
        if (!this.contextLoaded) {
            await this.loadContext();
        }
        
        try {
            if (this.isProduction && this.inferenceUrl && this.inferenceKey) {
                return await this.callHerokuInference(userMessage, conversationHistory);
            } else {
                return await this.callLocalAI(userMessage, conversationHistory);
            }
        } catch (error) {
            console.error('AI Service Error:', error);
            return {
                message: "I'm experiencing some technical difficulties. Let me try to help you with a more direct approach. Could you tell me which type of setup you're working on: Feature, Feature Set, Solution Setup, or Agent Configuration?",
                state: null,
                error: true
            };
        }
    }
    
    async callHerokuInference(userMessage, conversationHistory) {
        // Build messages for chat completion
        const messages = [
            { role: 'system', content: this.buildSystemPrompt() },
            ...conversationHistory,
            { role: 'user', content: userMessage }
        ];
        
        console.log('🤖 AI Service: Using GPT-OSS-120b via Heroku Inference');
        
        const response = await axios.post(`${this.inferenceUrl}/v1/chat/completions`, {
            model: this.modelId,
            messages: messages,
            max_tokens: 500,
            temperature: 0.7,
            stream: false
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.inferenceKey}`
            }
        });
        
        const aiResponse = response.data.choices[0].message.content;
        return this.parseAIResponse(aiResponse, userMessage);
    }
    
    async callLocalAI(userMessage, conversationHistory) {
        // Check if Ollama is available for real GPT-OSS-20b inference
        try {
            const ollamaResponse = await this.callOllamaAPI(userMessage, conversationHistory);
            console.log('🤖 AI Service: Using GPT-OSS-20b via Ollama');
            return ollamaResponse;
        } catch (error) {
            console.log('🤖 AI Service: Ollama unavailable, using pattern matching fallback');
            console.log('   Error:', error.message);
            
            // Fallback to pattern matching if Ollama is unavailable
            const context = this.buildConversationContext(conversationHistory, userMessage);
            const response = this.generateIntelligentResponse(userMessage.toLowerCase(), context);
            return response;
        }
    }
    
    async callOllamaAPI(userMessage, conversationHistory) {
        // Build messages for Ollama chat completion
        const messages = [
            { role: 'system', content: this.buildSystemPrompt() },
            ...conversationHistory,
            { role: 'user', content: userMessage }
        ];
        
        const response = await axios.post('http://localhost:11434/api/chat', {
            model: 'gpt-oss:20b',
            messages: messages,
            stream: false,
            options: {
                temperature: 0.7,
                top_p: 0.9,
                max_tokens: 500
            }
        });
        
        const aiResponse = response.data.message.content;
        return this.parseAIResponse(aiResponse, userMessage);
    }
    
    buildConversationContext(history, currentMessage) {
        return {
            previousMessages: history.length,
            mentions: {
                feature: /feature(?![ -]set)/i.test(currentMessage),
                featureSet: /(feature[- ]?set|group|multiple)/i.test(currentMessage),
                solution: /(solution|setup|initial|automation)/i.test(currentMessage),
                agent: /(agent|agentforce|ai|bot)/i.test(currentMessage)
            },
            intents: {
                asking: /(?:how|what|why|when|where|which|can)/i.test(currentMessage),
                building: /(?:build|create|make|develop|implement)/i.test(currentMessage),
                configuring: /(?:config|setup|set up|configure)/i.test(currentMessage)
            }
        };
    }
    
    generateIntelligentResponse(message, context) {
        // Agent/AI Detection - Route to Agent setup
        if (context.mentions.agent || /ai|bot|automation|intelligent|agentforce/i.test(message)) {
            return {
                message: `Perfect! You're looking to set up **Agentforce** - AI-powered agent configuration following the enhanced Agentforce guidelines.

I'll help you create an Agent page that includes all the necessary components for AI-powered workflows.

**🤖 Agent Configuration Details:**
1. **What type of agent** are you building? (Customer Service, Sales Assistant, Data Processing, etc.)
2. **What specific tasks** should this agent handle?
3. **What's the primary purpose** - what job will this agent do for users?

**🔌 Integration & Setup:**
4. **What Salesforce data** does the agent need access to?
5. **Any external systems** the agent should connect to?
6. **What triggers** the agent to start working?

According to the Agentforce guidelines, I'll help you structure this with the right templates and workflows.

What's the main job this agent will do for users?`,
                state: { 
                    setupType: 'agent-setup',
                    detectedIntent: 'agentforce-discovery',
                    stage: 'requirements-gathering'
                }
            };
        }
        
        // Everything else routes to Feature Page (more inclusive)
        // This includes single features, complex workflows, multi-step processes, etc.
        if (context.intents.building || context.intents.configuring || 
            /feature|capability|function|tool|screen|page|setup|config|workflow|process/i.test(message)) {
            return {
                message: `Great! I'll help you create a **Feature Page** that covers your needs. Our Feature pages are flexible and can handle everything from simple capabilities to complex multi-step processes.

Let me gather the key information following the Salesforce Go canonical guidelines:

**🎯 Feature Details:**
1. **What does this capability do** for users? (This becomes your feature benefit statement)
2. **What would you call this feature?** (Keep it user-focused and descriptive)
3. **Who are the primary users?** (Admins, end-users, or both?)

**⚙️ Technical & Usage:**
4. **Does this require** specific permissions or access levels?
5. **Are there prerequisites** users need before they can use this?
6. **What's the main use case** or example of how users would interact with it?

**📋 Content & Assets:**
7. **Do you have screenshots, videos, or help documentation** to include?

According to the Feature Page guidelines, I'll help you structure this with the right components for different ownership states (unowned for discovery vs. owned for configuration).

What's the main thing this feature or capability does for users?`,
                state: { 
                    setupType: 'feature',
                    detectedIntent: 'feature-discovery',
                    stage: 'requirements-gathering'
                }
            };
        }
        
        // General guidance when unclear - Route to Feature or Agent only
        return {
            message: `I'd love to help you build the perfect Salesforce Go configuration! I can guide you through two main setup approaches:

**🎯 Feature Page** - For any user-facing capabilities or configurations
*Perfect for:* File uploads, search functionality, authentication, workflows, data management, user interfaces, configuration screens, and any feature users interact with

**🤖 Agent Setup** - For AI-powered Agentforce configurations  
*Perfect for:* Customer service bots, sales assistants, intelligent automation, data processing agents, and AI-powered workflows

**Let's get started:** What are you trying to build? You can:
- Describe what users will do with it
- Tell me the main problem it solves
- Mention if it involves AI/automation/intelligent behavior
- Share what the end result should be

Most things can be handled beautifully with a Feature page - they're flexible and powerful!

What's the main thing you want to create?`,
            state: { 
                setupType: null,
                detectedIntent: 'needs-clarification',
                stage: 'discovery'
            }
        };
    }
    
    parseAIResponse(aiResponse, userMessage) {
        // Extract structured information from AI response and constrain to supported templates
        const response = {
            message: aiResponse,
            state: null
        };
        
        // Determine setup type from user's original intent - be more specific about agents
        let setupType = 'feature'; // Default to feature
        
        // Only classify as agent if explicitly mentioned agent/bot/AI or agentforce
        if (/\b(agent|agentforce|bot)\b/i.test(userMessage) ||
            (/\b(ai|artificial intelligence)\b/i.test(userMessage) && !/dashboard|feature|tool|manager/i.test(userMessage))) {
            setupType = 'agent-setup';
        }
        
        // Extract name from user message or AI response
        const extractedName = this.extractNameFromText(userMessage, aiResponse);
        
        // Build base state
        response.state = { 
            setupType: setupType,
            detectedIntent: setupType === 'agent-setup' ? 'agentforce-discovery' : 'feature-discovery',
            stage: 'requirements-gathering'
        };
        
        // If we have a name, generate contextual content automatically
        if (extractedName) {
            console.log(`🎯 AI Service: Auto-generating contextual content for "${extractedName}"`);
            
            const contextualContent = this.generateContextualContent(extractedName, setupType);
            
            // Structure content according to schema
            response.state.metadata = {
                name: contextualContent.name,
                description: contextualContent.description,
                cloud: contextualContent.cloud
            };
            
            // Add features or agentforce to top level
            if (setupType === 'agent-setup') {
                response.state.agentforce = contextualContent.agentforce;
            } else {
                response.state.features = contextualContent.featuresArray;
            }
            
            response.state.stage = 'ready-to-generate';
            
            // Add a message about automatic content generation
            response.message += `\n\n✨ **Great! I've automatically generated contextually appropriate content for "${extractedName}".** Based on the name, I can tell this relates to ${this.detectDomain(extractedName.toLowerCase()).primaryDomain} functionality.\n\n🚀 **Ready to generate your page?** Click the "Generate Pages" button to see your fully configured page with realistic placeholder content, or continue the conversation to refine the details.`;
        }
        
        return response;
    }
    
    extractNameFromText(userMessage, aiResponse) {
        // Look for quoted names, capitalized words, or specific patterns
        const patterns = [
            /"([^"]+)"/g,  // Quoted text
            /'([^']+)'/g,  // Single quoted text
            /called "([^"]+)"/gi,  // "called X"
            /named "([^"]+)"/gi,   // "named X"
            /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Agent|Bot|Feature|Tool|System|Manager|Assistant|Service|Platform)))\b/g  // Capitalized multi-word ending with common suffixes
        ];
        
        const text = userMessage + ' ' + aiResponse;
        
        for (const pattern of patterns) {
            const matches = [...text.matchAll(pattern)];
            if (matches.length > 0) {
                // Return the first meaningful match
                for (const match of matches) {
                    const candidate = match[1] || match[0];
                    if (candidate && candidate.length > 2 && candidate.length < 50) {
                        return candidate.trim();
                    }
                }
            }
        }
        
        return null;
    }
    
    // Generate contextual placeholder content based on feature/agent name and domain
    generateContextualContent(name, setupType, domain = null) {
        const lowerName = name.toLowerCase();
        
        // Domain-specific intelligence
        const domainKeywords = this.detectDomain(lowerName);
        const contextualDomain = domain || domainKeywords.primaryDomain;
        
        if (setupType === 'agent-setup') {
            return this.generateAgentContent(name, lowerName, contextualDomain);
        } else {
            return this.generateFeatureContent(name, lowerName, contextualDomain);
        }
    }
    
    detectDomain(lowerName) {
        const domains = {
            'sales': ['pipeline', 'opportunity', 'lead', 'prospect', 'deal', 'quote', 'forecast', 'territory', 'account', 'contact', 'sales'],
            'service': ['case', 'ticket', 'customer', 'support', 'service', 'chat', 'knowledge', 'escalation', 'sla', 'resolution'],
            'marketing': ['campaign', 'email', 'journey', 'segment', 'audience', 'content', 'social', 'automation', 'nurture'],
            'commerce': ['product', 'catalog', 'inventory', 'order', 'cart', 'checkout', 'payment', 'shipping', 'storefront'],
            'platform': ['user', 'profile', 'permission', 'role', 'security', 'integration', 'api', 'workflow', 'approval'],
            'analytics': ['report', 'dashboard', 'analytics', 'metric', 'kpi', 'insight', 'visualization', 'data']
        };
        
        let primaryDomain = 'platform';
        let matchedKeywords = [];
        
        for (const [domain, keywords] of Object.entries(domains)) {
            const matches = keywords.filter(keyword => lowerName.includes(keyword));
            if (matches.length > matchedKeywords.length) {
                primaryDomain = domain;
                matchedKeywords = matches;
            }
        }
        
        return { primaryDomain, matchedKeywords };
    }
    
    generateAgentContent(name, lowerName, domain) {
        const agentTemplates = {
            'sales': {
                description: `AI-powered sales agent that helps manage opportunities, qualify leads, and accelerate deal progression through automated insights and recommendations.`,
                cloud: 'Sales Cloud',
                steps: [
                    { title: 'Configure lead qualification criteria', validation: 'manual' },
                    { title: 'Set up opportunity progression tracking', validation: 'system' },
                    { title: 'Enable next best action recommendations', validation: 'system' },
                    { title: 'Activate pipeline forecasting support', validation: 'manual' }
                ]
            },
            'service': {
                description: `Intelligent customer service agent that provides automated support, case routing, and resolution recommendations to enhance customer satisfaction.`,
                cloud: 'Service Cloud',
                steps: [
                    { title: 'Configure automated case classification', validation: 'system' },
                    { title: 'Integrate knowledge base resources', validation: 'manual' },
                    { title: 'Set up escalation management rules', validation: 'system' },
                    { title: 'Enable customer sentiment analysis', validation: 'system' }
                ]
            },
            'marketing': {
                description: `Marketing automation agent that optimizes campaigns, personalizes customer journeys, and delivers targeted content recommendations.`,
                cloud: 'Marketing Cloud',
                steps: [
                    { title: 'Configure campaign optimization parameters', validation: 'manual' },
                    { title: 'Set up audience segmentation rules', validation: 'system' },
                    { title: 'Enable content personalization engine', validation: 'system' },
                    { title: 'Activate journey orchestration workflows', validation: 'manual' }
                ]
            },
            'platform': {
                description: `Intelligent platform agent that automates workflows, manages data processes, and provides system optimization recommendations.`,
                cloud: 'Platform',
                steps: [
                    { title: 'Configure workflow automation rules', validation: 'system' },
                    { title: 'Set up data processing pipelines', validation: 'manual' },
                    { title: 'Enable system monitoring alerts', validation: 'system' },
                    { title: 'Activate process optimization engine', validation: 'manual' }
                ]
            }
        };
        
        const template = agentTemplates[domain] || agentTemplates['platform'];
        
        // Return schema-compliant structure
        return {
            name: name,
            description: template.description,
            cloud: template.cloud,
            agentforce: {
                needed: true,
                templates: [{
                    name: name,
                    steps: template.steps
                }]
            }
        };
    }
    
    generateFeatureContent(name, lowerName, domain) {
        const featureTemplates = {
            'sales': {
                description: `Streamline your sales process with enhanced functionality for managing opportunities, leads, and customer relationships effectively.`,
                cloud: 'Sales Cloud'
            },
            'service': {
                description: `Enhance your customer service capabilities with tools designed to improve case resolution, customer satisfaction, and support efficiency.`,
                cloud: 'Service Cloud'
            },
            'marketing': {
                description: `Power your marketing efforts with advanced capabilities for campaign management, audience engagement, and performance optimization.`,
                cloud: 'Marketing Cloud'
            },
            'platform': {
                description: `Enhance your Salesforce platform with powerful tools for workflow automation, data management, and user productivity.`,
                cloud: 'Platform'
            },
            'commerce': {
                description: `Optimize your e-commerce operations with tools for product management, order processing, and customer experience enhancement.`,
                cloud: 'Commerce Cloud'
            },
            'analytics': {
                description: `Gain powerful insights with advanced analytics, reporting, and data visualization capabilities.`,
                cloud: 'Analytics Cloud'
            }
        };
        
        const template = featureTemplates[domain] || featureTemplates['platform'];
        
        // Create slug from name
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        // Return schema-compliant structure
        return {
            name: name,
            description: template.description,
            cloud: template.cloud,
            // Features should be separate for the top-level structure
            featuresArray: [{
                id: slug,
                name: name,
                slug: slug,
                soldToCustomers: true
                // belongsToFeatureSet is omitted since it's not required and we're creating standalone features
            }]
        };
    }
    
    // Enhanced method to check if we have enough information to generate pages
    canGeneratePages(conversationState) {
        // Force constraint to only supported setup types
        const supportedTypes = ['feature', 'agent-setup'];
        
        if (!conversationState.setupType || !supportedTypes.includes(conversationState.setupType)) {
            return false;
        }
        
        // Only require name - we'll generate everything else contextually
        return conversationState.metadata && conversationState.metadata.name;
    }
}

export default AIService;
