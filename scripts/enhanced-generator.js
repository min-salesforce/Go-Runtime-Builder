import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import nunjucks from 'nunjucks';
import ValidationEngine from './validator.js';

class EnhancedGenerator {
  constructor() {
    this.root = path.resolve(process.cwd());
    this.distDir = path.join(this.root, 'dist');
    this.validator = new ValidationEngine();
    this.setupTypeLabels = {
      'feature-set-and-features': 'Feature Set and Features',
      'feature': 'Feature',
      'feature-2': 'Feature 2',
      'solution-initial-setup': 'Solution / Initial Setup',
      'agent-setup': 'Agent Setup'
    };
  }

  async initialize() {
    console.log('🚀 Initializing Enhanced Generator...');
    
    // Load validation schemas
    await this.validator.loadSchemas();
    
    // Setup output directories
    await this.setupDirectories();
    
    // Copy static assets
    await this.copyAssets();
    
    // Configure template engine
    this.configureTemplates();
    
    console.log('✅ Generator initialized');
  }

  async setupDirectories() {
    await fs.emptyDir(this.distDir);
    
    const subdirs = ['css', 'feature', 'feature-set', 'solution', 'agent'];
    for (const subdir of subdirs) {
      await fs.ensureDir(path.join(this.distDir, subdir));
    }
  }

  async copyAssets() {
    const cssSrc = path.join(this.root, 'styles', 'slds2-temp.css');
    const cssDest = path.join(this.distDir, 'css', 'slds2-temp.css');
    
    await fs.copyFile(cssSrc, cssDest);
    console.log('📄 Copied CSS assets');
  }

  configureTemplates() {
    const env = nunjucks.configure(path.join(this.root, 'templates'), { 
      autoescape: true, 
      noCache: true 
    });
    
    // Add custom filters
    env.addFilter('slugify', this.slugify);
    env.addFilter('setupTypeLabel', (setupType) => {
      return this.setupTypeLabels[setupType] || setupType;
    });
    
    this.nunjucksEnv = env;
  }

  slugify(input) {
    return String(input).toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async loadContentMarkdown(setupType, slug) {
    try {
      const mdPath = path.join(this.root, 'content', setupType.replace('-and-features', ''), slug, 'content.md');
      const raw = await fs.readFile(mdPath, 'utf8');
      const parsed = matter(raw);
      return { frontmatter: parsed.data, body: parsed.content };
    } catch (error) {
      console.log(`ℹ️  No content file found for ${setupType}/${slug}, using defaults`);
      return { frontmatter: {}, body: '' };
    }
  }

  buildPageModel(session, contentData) {
    const model = {
      // Basic metadata
      title: session.metadata.name,
      description: session.metadata.description,
      setupType: session.setupType,
      setupTypeLabel: this.setupTypeLabels[session.setupType],
      metadata: {
        ...session.metadata,
        slug: this.slugify(session.metadata.name)
      },
      
      // Assets
      assets: session.assets,
      
      // Features
      features: session.features || [],
      
      // Agentforce
      agentforce: session.agentforce || { needed: false, templates: [] },
      
      // Labels from content
      labels: contentData.frontmatter.labels || {},
      
      // State flags for UI logic
      agentforceOn: session.agentforce?.needed || false,
      agentforceToggleable: session.setupType === 'agent-setup',
      salesforceFoundationsActive: true, // Would be dynamic in real implementation
      
      // Progress tracking
      featuresConfigured: this.calculateFeaturesConfigured(session.features),
      templatesOn: this.calculateTemplatesOn(session.agentforce?.templates),
      isConfigured: this.calculateOverallProgress(session),
      
      // Component data based on setup type
      components: this.buildComponents(session),
      setupSteps: this.buildSetupSteps(session),
      integrations: this.buildIntegrations(session)
    };

    // Add navigation links
    model.navigation = this.buildNavigation(session, model.metadata.slug);
    
    return model;
  }

  calculateFeaturesConfigured(features) {
    if (!features) return 0;
    return features.filter(f => f.status === 'configured').length;
  }

  calculateTemplatesOn(templates) {
    if (!templates) return 0;
    return templates.filter(t => t.status === 'active').length;
  }

  calculateOverallProgress(session) {
    switch (session.setupType) {
      case 'feature-set-and-features':
        return this.calculateFeaturesConfigured(session.features) > 0;
      case 'feature':
        return session.features?.[0]?.status === 'configured';
      case 'agent-setup':
        return this.calculateTemplatesOn(session.agentforce?.templates) > 0;
      case 'solution-initial-setup':
        return false; // Would be determined by actual setup status
      default:
        return false;
    }
  }

  buildComponents(session) {
    const components = [];
    
    if (session.setupType === 'solution-initial-setup') {
      // Group features into logical components for solutions
      if (session.features && session.features.length > 0) {
        const groupedFeatures = this.groupFeaturesByType(session.features);
        
        Object.entries(groupedFeatures).forEach(([type, features]) => {
          components.push({
            id: this.slugify(type),
            name: type,
            type: 'feature-group',
            features: features,
            description: `${features.length} feature${features.length > 1 ? 's' : ''} in this component`
          });
        });
      }
    }
    
    return components;
  }

  groupFeaturesByType(features) {
    // Simple grouping by belongsToFeatureSet or create generic groups
    const groups = {};
    
    features.forEach(feature => {
      const groupName = feature.belongsToFeatureSet || 'Core Features';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(feature);
    });
    
    return groups;
  }

  buildSetupSteps(session) {
    const steps = [];
    
    if (session.setupType === 'solution-initial-setup') {
      steps.push(
        { title: 'Initialize cloud environment', automated: true },
        { title: 'Configure base settings', automated: true },
        { title: 'Setup user permissions', automated: true },
        { title: 'Deploy core components', automated: true }
      );
    }
    
    return steps;
  }

  buildIntegrations(session) {
    const integrations = [];
    
    if (session.setupType === 'solution-initial-setup') {
      // Add common integrations based on session data
      if (session.metadata.cloud?.toLowerCase().includes('sales')) {
        integrations.push({
          name: 'Salesforce CRM Integration',
          description: 'Connect with existing CRM data and workflows',
          configUrl: '#configure-crm'
        });
      }
      
      if (session.agentforce?.needed) {
        integrations.push({
          name: 'Agentforce Integration',
          description: 'Enable AI-powered agent capabilities',
          configUrl: '#configure-agentforce'
        });
      }
    }
    
    return integrations;
  }

  buildNavigation(session, slug) {
    const nav = {
      home: 'index.html',
      current: null,
      related: []
    };

    switch (session.setupType) {
      case 'feature-set-and-features':
        nav.current = `feature-set/${slug}.html`;
        if (session.features) {
          nav.related = session.features.map(f => ({
            title: f.name,
            url: `feature/${this.slugify(f.name)}.html`,
            type: 'feature'
          }));
        }
        break;
        
      case 'feature':
        nav.current = `feature/${slug}.html`;
        if (session.metadata.belongsToFeatureSet) {
          nav.related.push({
            title: session.metadata.belongsToFeatureSet,
            url: `feature-set/${this.slugify(session.metadata.belongsToFeatureSet)}.html`,
            type: 'feature-set'
          });
        }
        break;
        
      case 'solution-initial-setup':
        nav.current = `solution/${slug}.html`;
        break;
        
      case 'agent-setup':
        nav.current = `agent/${slug}.html`;
        break;
    }

    return nav;
  }

  async renderPage(templateName, model, outputPath) {
    try {
      const html = nunjucks.render(`${templateName}.njk`, model);
      // Ensure the directory exists before writing the file
      await fs.ensureDir(path.dirname(outputPath));
      await fs.writeFile(outputPath, html, 'utf8');
      console.log(`📄 Generated: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error(`❌ Failed to render ${templateName}:`, error.message);
      throw error;
    }
  }

  async generateFromSession(sessionPath) {
    console.log(`\n🔄 Generating pages from session: ${sessionPath}`);
    
    // Load session data
    const session = await fs.readJson(sessionPath);
    
    // Validate session
    const validationResult = await this.validator.validate(session);
    if (!validationResult.valid) {
      console.error('❌ Session validation failed');
      throw new Error('Invalid session data');
    }
    
    const slug = this.slugify(session.metadata.name);
    const generatedPaths = [];

    // Load content data
    const contentData = await this.loadContentMarkdown(session.setupType, slug);
    
    // Build page model
    const pageModel = this.buildPageModel(session, contentData);
    
    // Generate home page
    const homePath = path.join(this.distDir, 'index.html');
    await this.renderPage('home', pageModel, homePath);
    generatedPaths.push(homePath);
    
    // Generate setup type specific pages
    let mainPagePath;
    
    switch (session.setupType) {
      case 'feature-set-and-features':
        mainPagePath = path.join(this.distDir, 'feature-set', `${slug}.html`);
        await this.renderPage('feature-set', pageModel, mainPagePath);
        generatedPaths.push(mainPagePath);
        
        // Generate individual feature pages
        for (const feature of session.features || []) {
          const featureSlug = this.slugify(feature.name);
          const featureModel = {
            ...pageModel,
            title: feature.name,
            description: feature.description || pageModel.description,
            currentFeature: feature
          };
          
          const featurePath = path.join(this.distDir, 'feature', `${featureSlug}.html`);
          await this.renderPage('feature', featureModel, featurePath);
          generatedPaths.push(featurePath);
        }
        break;
        
      case 'feature':
        mainPagePath = path.join(this.distDir, 'feature', `${slug}.html`);
        await this.renderPage('feature', pageModel, mainPagePath);
        generatedPaths.push(mainPagePath);
        break;
        
      case 'solution-initial-setup':
        mainPagePath = path.join(this.distDir, 'solution', `${slug}.html`);
        await this.renderPage('solution', pageModel, mainPagePath);
        generatedPaths.push(mainPagePath);
        break;
        
      case 'agent-setup':
        mainPagePath = path.join(this.distDir, 'agent', `${slug}.html`);
        await this.renderPage('agent', pageModel, mainPagePath);
        generatedPaths.push(mainPagePath);
        break;
        
      default:
        throw new Error(`Unknown setup type: ${session.setupType}`);
    }
    
    console.log(`\n✅ Generated ${generatedPaths.length} pages successfully`);
    console.log('🌐 Main entry point: index.html');
    
    return {
      sessionData: session,
      generatedPaths,
      mainPagePath,
      entryPoint: homePath
    };
  }

  async generateMultipleSessions(sessionPaths) {
    console.log(`\n🔄 Generating pages from ${sessionPaths.length} sessions`);
    
    const results = [];
    
    for (const sessionPath of sessionPaths) {
      try {
        const result = await this.generateFromSession(sessionPath);
        results.push(result);
      } catch (error) {
        console.error(`❌ Failed to generate from ${sessionPath}:`, error.message);
        results.push({ error: error.message, sessionPath });
      }
    }
    
    console.log(`\n📊 Generated pages for ${results.filter(r => !r.error).length} of ${sessionPaths.length} sessions`);
    
    return results;
  }

  async generateFromQuestionnaireSession(session) {
    console.log('\n🔄 Generating pages from questionnaire session');
    
    // Validate session
    const validationResult = await this.validator.validate(session);
    if (!validationResult.valid) {
      console.error('❌ Session validation failed');
      validationResult.errors.forEach(error => console.error(`  - ${error}`));
      throw new Error('Invalid session data');
    }
    
    const slug = this.slugify(session.metadata.name);
    const generatedPaths = [];

    // Build page model with default content
    const pageModel = this.buildPageModel(session, { frontmatter: {}, body: '' });
    
    // Generate home page
    const homePath = path.join(this.distDir, 'index.html');
    await this.renderPage('home', pageModel, homePath);
    generatedPaths.push(homePath);
    
    // Generate main setup page
    let mainPagePath;
    const templateMap = {
      'feature-set-and-features': 'feature-set',
      'feature': 'feature',
      'feature-2': 'feature-2',
      'solution-initial-setup': 'solution',
      'agent-setup': 'agent'
    };
    
    const templateName = templateMap[session.setupType];
    const pageDir = session.setupType === 'feature-set-and-features' ? 'feature-set' : 
                    session.setupType === 'solution-initial-setup' ? 'solution' :
                    session.setupType === 'agent-setup' ? 'agent' :
                    session.setupType === 'feature-2' ? 'feature-2' : 'feature';
    
    mainPagePath = path.join(this.distDir, pageDir, `${slug}.html`);
    await this.renderPage(templateName, pageModel, mainPagePath);
    generatedPaths.push(mainPagePath);
    
    // Generate individual feature pages for feature sets
    if (session.setupType === 'feature-set-and-features' && session.features) {
      for (const feature of session.features) {
        const featureSlug = this.slugify(feature.name);
        const featureModel = {
          ...pageModel,
          title: feature.name,
          description: feature.description || pageModel.description,
          currentFeature: feature
        };
        
        const featurePath = path.join(this.distDir, 'feature', `${featureSlug}.html`);
        await this.renderPage('feature', featureModel, featurePath);
        generatedPaths.push(featurePath);
      }
    }
    
    console.log(`\n✅ Generated ${generatedPaths.length} pages successfully`);
    console.log(`🏠 Home page: ${path.relative(this.root, homePath)}`);
    console.log(`🎯 Main page: ${path.relative(this.root, mainPagePath)}`);
    
    return {
      sessionData: session,
      generatedPaths,
      mainPagePath,
      entryPoint: homePath,
      relativePaths: {
        home: path.relative(this.root, homePath),
        main: path.relative(this.root, mainPagePath)
      }
    };
  }

  // Utility method to serve files for preview
  async createPreviewServer(port = 3000) {
    const express = await import('express');
    const app = express.default();
    
    app.use(express.static(this.distDir));
    
    app.listen(port, () => {
      console.log(`🌐 Preview server running at http://localhost:${port}`);
      console.log(`📂 Serving files from: ${this.distDir}`);
    });
    
    return { port, distDir: this.distDir };
  }
}

export default EnhancedGenerator;
