import readline from 'readline';
import fs from 'fs-extra';
import path from 'path';

class QuestionnaireEngine {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.session = {
      setupType: null,
      metadata: {},
      features: [],
      agentforce: { needed: false, templates: [] },
      assets: {}
    };
  }

  async ask(question, options = null) {
    return new Promise((resolve) => {
      let prompt = question;
      if (options) {
        prompt += '\n' + options.map((opt, i) => `${i + 1}) ${opt}`).join('\n') + '\nChoose (1-' + options.length + '): ';
      } else {
        prompt += ' ';
      }
      
      this.rl.question(prompt, (answer) => {
        if (options) {
          const choice = parseInt(answer) - 1;
          if (choice >= 0 && choice < options.length) {
            resolve({ answer: options[choice], index: choice });
          } else {
            console.log('Invalid choice. Please try again.');
            resolve(this.ask(question, options));
          }
        } else {
          resolve(answer.trim());
        }
      });
    });
  }

  async askYesNo(question) {
    const result = await this.ask(question, ['Yes', 'No']);
    return result.index === 0;
  }

  async collectBasicMetadata() {
    console.log('\n=== Basic Information ===');
    
    this.session.metadata.name = await this.ask('What is the name of your feature/solution?');
    this.session.metadata.description = await this.ask('Provide a brief description:');
    this.session.metadata.cloud = await this.ask('Which Salesforce cloud is this for? (e.g., Sales Cloud, Service Cloud, Marketing Cloud)');
    this.session.metadata.version = await this.ask('Version (default: 1.0.0):') || '1.0.0';
  }

  async determineExperienceType() {
    console.log('\n=== Experience Type ===');
    console.log('Based on the Salesforce Go Design Flow Guide, let\'s determine what type of experience you\'re creating.');
    
    const experienceType = await this.ask('What type of experience are you creating?', [
      'Initial product setup or configuration',
      'Standard feature introduction or walkthrough', 
      'AI agent setup, training, or deployment',
      'Complex multi-step process',
      'Custom pattern not covered above'
    ]);

    switch (experienceType.index) {
      case 0: // Initial product setup
        return await this.determineSolutionSetup();
      case 1: // Standard feature
        return await this.determineFeatureType();
      case 2: // AI agent setup
        return await this.determineAgentSetup();
      case 3:
      case 4: // Complex/Custom
        console.log('\nRecommendation: Contact Go CX team for consultation on complex or custom patterns.');
        const proceed = await this.askYesNo('Do you want to continue with a standard setup type anyway?');
        if (proceed) {
          return await this.determineExperienceType();
        } else {
          throw new Error('Setup requires Go CX team consultation');
        }
    }
  }

  async determineSolutionSetup() {
    console.log('\n=== Solutions/Initial Setup Details ===');
    
    const setupInvolves = await this.ask('Your setup involves:', [
      'Single product configuration',
      'Multiple connected products',
      'Data migration or import',
      'Admin vs end-user setup paths'
    ]);

    const hasAutomation = await this.askYesNo('Is the setup handled by automation?');
    const isFoundational = await this.askYesNo('Is this setup required for a Cloud to function and set up subsequent features?');
    const hasJTBD = await this.askYesNo('Is there a clear Job to be Done (JTBD) that users are trying to accomplish?');

    if (hasAutomation && isFoundational && !hasJTBD) {
      this.session.setupType = 'solution-initial-setup';
      this.session.metadata.setupPattern = setupInvolves.answer;
      return 'solution-initial-setup';
    } else {
      console.log('\nBased on your answers, this might be better suited as a Feature or Feature Set.');
      return await this.determineFeatureType();
    }
  }

  async determineFeatureType() {
    console.log('\n=== Feature Type Details ===');
    
    const hasJTBD = await this.askYesNo('Is there a clear Job to be Done (JTBD) that users are trying to accomplish?');
    
    if (hasJTBD) {
      this.session.metadata.jtbd = await this.ask('Describe the Job to be Done:');
    }

    const multipleFeatures = await this.askYesNo('Are you grouping multiple features together?');
    
    if (multipleFeatures && hasJTBD) {
      this.session.setupType = 'feature-set-and-features';
      await this.collectFeatures();
      return 'feature-set-and-features';
    } else {
      this.session.setupType = 'feature';
      
      const existingFeatureSet = await this.askYesNo('Does this feature belong to an existing Feature Set?');
      if (existingFeatureSet) {
        this.session.metadata.belongsToFeatureSet = await this.ask('Which Feature Set does it belong to?');
      }
      
      const soldToCustomers = await this.askYesNo('Is this feature sold to customers or a user-facing capability?');
      
      this.session.features.push({
        name: this.session.metadata.name,
        soldToCustomers,
        belongsToFeatureSet: this.session.metadata.belongsToFeatureSet || null
      });
      
      return 'feature';
    }
  }

  async collectFeatures() {
    console.log('\n=== Feature Collection ===');
    console.log('A Feature Set requires at least 2 features. Let\'s collect them:');
    
    let featureCount = 0;
    while (featureCount < 2 || await this.askYesNo('Do you want to add another feature?')) {
      featureCount++;
      console.log(`\nFeature ${featureCount}:`);
      
      const feature = {
        name: await this.ask('Feature name:'),
        soldToCustomers: await this.askYesNo('Is this feature sold to customers?'),
        belongsToFeatureSet: this.session.metadata.name
      };
      
      this.session.features.push(feature);
      
      if (featureCount >= 2) {
        const addMore = await this.askYesNo('Add another feature?');
        if (!addMore) break;
      }
    }
  }

  async determineAgentSetup() {
    console.log('\n=== Agentforce Setup ===');
    
    this.session.setupType = 'agent-setup';
    this.session.agentforce.needed = true;
    
    const agentPurpose = await this.ask('What is the agent setup for?', [
      'Agent creation/setup',
      'Agent training/knowledge',
      'Agent deployment', 
      'Agent performance monitoring'
    ]);

    this.session.metadata.agentPurpose = agentPurpose.answer;
    
    // Collect agent templates
    console.log('\n=== Agent Templates ===');
    let templateCount = 0;
    
    do {
      templateCount++;
      console.log(`\nTemplate ${templateCount}:`);
      
      const template = {
        name: await this.ask('Template name:'),
        steps: []
      };
      
      // Collect steps for this template
      console.log('Let\'s add steps to this template:');
      let stepCount = 0;
      
      do {
        stepCount++;
        console.log(`\nStep ${stepCount}:`);
        
        const step = {
          title: await this.ask('Step title:'),
          validation: (await this.ask('Validation type:', ['System validated', 'Manual validated', 'No progress tracking'])).answer.toLowerCase().replace(' ', '-').replace('tracking', ''),
          links: []
        };

        const hasLinks = await this.askYesNo('Add any supporting links for this step?');
        if (hasLinks) {
          let linkCount = 0;
          while (linkCount < 3) {
            const link = await this.ask(`Link ${linkCount + 1} (or press enter to skip):`);
            if (!link) break;
            step.links.push(link);
            linkCount++;
            if (linkCount < 3 && !await this.askYesNo('Add another link?')) break;
          }
        }
        
        template.steps.push(step);
      } while (await this.askYesNo('Add another step to this template?'));
      
      this.session.agentforce.templates.push(template);
    } while (await this.askYesNo('Add another template?'));
    
    return 'agent-setup';
  }

  async collectAssets() {
    console.log('\n=== Assets ===');
    console.log('Screenshots and help documentation are optional but recommended.');
    
    this.session.assets.screenshotUrl = await this.ask('Screenshot URL (optional):');
    
    const videoUrl = await this.ask('Video URL (optional, press enter to skip):');
    if (videoUrl) this.session.assets.videoUrl = videoUrl;
    
    const guidedTourUrl = await this.ask('Guided tour URL (optional, but not recommended):');
    if (guidedTourUrl) this.session.assets.guidedTourUrl = guidedTourUrl;

    // Collect resources
    console.log('\n=== Resources ===');
    this.session.assets.resources = {};
    
    this.session.assets.resources.helpTopicUrl = await this.ask('Help topic URL (optional):');
    
    const releaseNotesUrl = await this.ask('Release notes URL (optional):');
    if (releaseNotesUrl) this.session.assets.resources.releaseNotesUrl = releaseNotesUrl;
    
    const hasBlog = await this.askYesNo('Do you have a 360 Blog article?');
    if (hasBlog) {
      this.session.assets.resources.blogUrl = await this.ask('Blog article URL:');
    }
    
    // Trailhead badges (max 3)
    const hasTrailhead = await this.askYesNo('Do you have Trailhead badges to include?');
    if (hasTrailhead) {
      this.session.assets.resources.trailheadBadges = [];
      let badgeCount = 0;
      
      while (badgeCount < 3) {
        console.log(`\nTrailhead Badge ${badgeCount + 1}:`);
        const badge = {
          title: await this.ask('Badge title:'),
          moduleId: await this.ask('Module ID:'),
          url: await this.ask('Badge URL:')
        };
        
        this.session.assets.resources.trailheadBadges.push(badge);
        badgeCount++;
        
        if (badgeCount < 3 && !await this.askYesNo('Add another badge?')) break;
      }
    }
  }

  async validateSession() {
    console.log('\n=== Validation ===');
    
    const errors = [];
    
    // Required fields
    if (!this.session.metadata.name) errors.push('Feature/solution name is required');
    if (!this.session.setupType) errors.push('Setup type must be determined');
    // Assets are now optional
    // if (!this.session.assets.screenshotUrl) errors.push('Screenshot URL is required');
    // if (!this.session.assets.resources?.helpTopicUrl) errors.push('Help topic URL is required');
    
    // Setup type specific validation
    if (this.session.setupType === 'feature-set-and-features') {
      if (this.session.features.length < 2) {
        errors.push('Feature Set requires at least 2 features');
      }
      if (!this.session.metadata.jtbd) {
        errors.push('Feature Set requires a Job to be Done (JTBD)');
      }
    }
    
    // Trailhead badge limit
    if (this.session.assets.resources?.trailheadBadges?.length > 3) {
      errors.push('Maximum 3 Trailhead badges allowed');
    }
    
    if (errors.length > 0) {
      console.log('\nValidation Errors:');
      errors.forEach(error => console.log(`- ${error}`));
      throw new Error('Validation failed');
    }
    
    console.log('✅ Validation passed!');
  }

  async generateSummary() {
    console.log('\n=== Configuration Summary ===');
    console.log(`Setup Type: ${this.session.setupType}`);
    console.log(`Name: ${this.session.metadata.name}`);
    console.log(`Description: ${this.session.metadata.description}`);
    console.log(`Cloud: ${this.session.metadata.cloud}`);
    
    if (this.session.metadata.jtbd) {
      console.log(`JTBD: ${this.session.metadata.jtbd}`);
    }
    
    if (this.session.features.length > 0) {
      console.log(`Features (${this.session.features.length}):`);
      this.session.features.forEach(f => console.log(`  - ${f.name}`));
    }
    
    if (this.session.agentforce.needed) {
      console.log(`Agent Templates (${this.session.agentforce.templates.length}):`);
      this.session.agentforce.templates.forEach(t => console.log(`  - ${t.name} (${t.steps.length} steps)`));
    }
    
    console.log(`Assets: Screenshot ✅${this.session.assets.videoUrl ? ', Video ✅' : ''}${this.session.assets.guidedTourUrl ? ', Guided Tour ✅' : ''}`);
    console.log(`Resources: Help ✅${this.session.assets.resources.releaseNotesUrl ? ', Release Notes ✅' : ''}${this.session.assets.resources.blogUrl ? ', Blog ✅' : ''}`);
    
    if (this.session.assets.resources.trailheadBadges?.length > 0) {
      console.log(`Trailhead Badges: ${this.session.assets.resources.trailheadBadges.length}`);
    }
  }

  async saveSession() {
    const outputDir = path.join(process.cwd(), 'output');
    await fs.ensureDir(outputDir);
    
    const filename = `questionnaire-${Date.now()}.json`;
    const filepath = path.join(outputDir, filename);
    
    await fs.writeJson(filepath, this.session, { spaces: 2 });
    
    console.log(`\n💾 Session saved to: ${filepath}`);
    return filepath;
  }

  async run() {
    try {
      console.log('🚀 Salesforce Go Runtime Builder - Configuration Questionnaire');
      console.log('This tool will guide you through configuring your setup screens.\n');
      
      await this.collectBasicMetadata();
      await this.determineExperienceType();
      await this.collectAssets();
      await this.validateSession();
      await this.generateSummary();
      
      const shouldSave = await this.askYesNo('\nSave this configuration?');
      if (shouldSave) {
        const filepath = await this.saveSession();
        console.log('\n✅ Configuration complete! You can now run the generator with this configuration.');
        return filepath;
      }
      
    } catch (error) {
      console.error(`\n❌ Error: ${error.message}`);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }
}

export default QuestionnaireEngine;

// Allow running as standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
  const questionnaire = new QuestionnaireEngine();
  questionnaire.run();
}
