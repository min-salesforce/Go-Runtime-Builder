import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs-extra';
import path from 'path';

class ValidationEngine {
  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);
    this.schemas = {};
    this.canonicalRules = {
      assets: {
        screenshotRequired: false,
        screenshotMaxSize: 300 * 1024, // 300KB
        screenshotRecommendedDimensions: ['16:9', '4:3'],
        screenshotMaxResolution: [1920, 1080],
        screenshotRecommendedDPI: 200
      },
      resources: {
        helpTopicRequired: false,
        trailheadBadgeLimit: 3,
        linksLimit: 3
      },
      benefits: {
        minItems: 2,
        maxItems: 4,
        titleMaxLength: 50,
        descriptionMaxLength: 150
      },
      features: {
        featureSetMinFeatures: 2,
        featureSetRequiresJTBD: true
      },
      labels: {
        activationLabelsFixed: {
          'Preview Default Settings': 'Preview Default Settings',
          'See Considerations': 'See Considerations', 
          'Setup Help': 'Setup Help'
        },
        nonEditableLabels: [
          'Preview Default Settings',
          'See Considerations',
          'Setup Help'
        ]
      }
    };
  }

  async loadSchemas() {
    const schemaDir = path.join(process.cwd(), 'schemas');
    const schemaFiles = await fs.readdir(schemaDir);
    
    for (const file of schemaFiles) {
      if (file.endsWith('.json')) {
        const schemaPath = path.join(schemaDir, file);
        const schemaContent = await fs.readJson(schemaPath);
        const schemaName = path.basename(file, '.json');
        
        this.schemas[schemaName] = schemaContent;
        this.ajv.addSchema(schemaContent, schemaName);
      }
    }
    
    console.log(`📋 Loaded ${Object.keys(this.schemas).length} schemas: ${Object.keys(this.schemas).join(', ')}`);
  }

  validateSchema(data, schemaName) {
    if (!this.schemas[schemaName]) {
      throw new Error(`Schema '${schemaName}' not found`);
    }
    
    const validate = this.ajv.getSchema(schemaName);
    if (!validate) {
      throw new Error(`AJV could not compile schema '${schemaName}'`);
    }
    
    const valid = validate(data);
    
    if (!valid) {
      return {
        valid: false,
        errors: validate.errors.map(error => ({
          field: error.instancePath || error.schemaPath,
          message: error.message,
          value: error.data
        }))
      };
    }
    
    return { valid: true, errors: [] };
  }

  validateCanonicalRules(session) {
    const errors = [];
    const warnings = [];

    // Assets validation (now optional)
    // Screenshot and help topic URL are no longer required

    // Trailhead badge limit
    if (session.assets?.resources?.trailheadBadges?.length > this.canonicalRules.resources.trailheadBadgeLimit) {
      errors.push(`Maximum ${this.canonicalRules.resources.trailheadBadgeLimit} Trailhead badges allowed`);
    }

    // Feature Set validation
    if (session.setupType === 'feature-set-and-features') {
      if (!session.features || session.features.length < this.canonicalRules.features.featureSetMinFeatures) {
        errors.push(`Feature Set requires at least ${this.canonicalRules.features.featureSetMinFeatures} features`);
      }
      
      if (this.canonicalRules.features.featureSetRequiresJTBD && !session.metadata?.jtbd) {
        errors.push('Feature Set requires a Job to be Done (JTBD)');
      }
    }

    // Benefits validation (if present)
    if (session.labels?.benefits?.items) {
      const benefits = session.labels.benefits.items;
      
      if (benefits.length < this.canonicalRules.benefits.minItems) {
        warnings.push(`Benefits section should have at least ${this.canonicalRules.benefits.minItems} items`);
      }
      
      if (benefits.length > this.canonicalRules.benefits.maxItems) {
        errors.push(`Benefits section cannot have more than ${this.canonicalRules.benefits.maxItems} items`);
      }
      
      benefits.forEach((benefit, index) => {
        if (benefit.title && benefit.title.length > this.canonicalRules.benefits.titleMaxLength) {
          warnings.push(`Benefit ${index + 1} title exceeds recommended ${this.canonicalRules.benefits.titleMaxLength} characters`);
        }
        
        if (benefit.description && benefit.description.length > this.canonicalRules.benefits.descriptionMaxLength) {
          warnings.push(`Benefit ${index + 1} description exceeds recommended ${this.canonicalRules.benefits.descriptionMaxLength} characters`);
        }
      });
    }

    // URL validation
    this.validateUrls(session, errors, warnings);

    // Agent-specific validation
    if (session.setupType === 'agent-setup') {
      this.validateAgentRules(session, errors, warnings);
    }

    return { errors, warnings };
  }

  validateUrls(session, errors, warnings) {
    const urlFields = [
      { path: 'assets.screenshotUrl', name: 'Screenshot URL', optional: true },
      { path: 'assets.videoUrl', name: 'Video URL', optional: true },
      { path: 'assets.guidedTourUrl', name: 'Guided Tour URL', optional: true },
      { path: 'assets.resources.helpTopicUrl', name: 'Help Topic URL', optional: true },
      { path: 'assets.resources.releaseNotesUrl', name: 'Release Notes URL', optional: true },
      { path: 'assets.resources.blogUrl', name: 'Blog URL', optional: true }
    ];

    urlFields.forEach(field => {
      const value = this.getNestedValue(session, field.path);
      
      if (!field.optional && !value) {
        errors.push(`${field.name} is required`);
        return;
      }
      
      if (value && !this.isValidUrl(value)) {
        errors.push(`${field.name} must be a valid URL`);
      }
      
      if (value && !this.isWhitelistedUrl(value)) {
        warnings.push(`${field.name} should use approved Salesforce domains`);
      }
    });

    // Validate Trailhead badge URLs
    if (session.assets?.resources?.trailheadBadges) {
      session.assets.resources.trailheadBadges.forEach((badge, index) => {
        if (!this.isValidUrl(badge.url)) {
          errors.push(`Trailhead badge ${index + 1} URL is invalid`);
        }
        if (!badge.url.includes('trailhead.salesforce.com')) {
          warnings.push(`Trailhead badge ${index + 1} should use trailhead.salesforce.com domain`);
        }
      });
    }
  }

  validateAgentRules(session, errors, warnings) {
    // AI/ML content requires legal/compliance review
    warnings.push('AI/ML related content requires legal/compliance review before publication');
    
    // Agent-specific disclaimers should be present
    if (!session.labels?.disclaimers) {
      warnings.push('Consider adding AI/agent-specific disclaimers for transparency');
    }

    // Validation for agent templates and steps
    if (session.agentforce?.templates) {
      session.agentforce.templates.forEach((template, templateIndex) => {
        if (!template.steps || template.steps.length === 0) {
          warnings.push(`Agent template '${template.name}' should have at least one step`);
        }
        
        template.steps?.forEach((step, stepIndex) => {
          if (step.links && step.links.length > 3) {
            warnings.push(`Agent template '${template.name}', step ${stepIndex + 1} has too many links (max 3)`);
          }
          
          if (!step.validation || !['system', 'manual', 'none'].includes(step.validation)) {
            errors.push(`Agent template '${template.name}', step ${stepIndex + 1} must have valid validation type`);
          }
        });
      });
    }
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  isWhitelistedUrl(url) {
    const whitelistedDomains = [
      'salesforce.com',
      'help.salesforce.com',
      'trailhead.salesforce.com',
      'play.vidyard.com',
      'developer.salesforce.com',
      'via.placeholder.com' // For demo purposes
    ];
    
    try {
      const urlObj = new URL(url);
      return whitelistedDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
      );
    } catch {
      return false;
    }
  }

  validateSetupTypeRules(session) {
    const errors = [];
    
    switch (session.setupType) {
      case 'feature-set-and-features':
        if (!session.metadata?.jtbd) {
          errors.push('Feature Set requires a Job to be Done (JTBD)');
        }
        if (!session.features || session.features.length < 2) {
          errors.push('Feature Set requires at least 2 features');
        }
        break;
        
      case 'feature':
      case 'feature-2':
        // Features can be standalone or belong to a feature set
        if (session.features && session.features.length > 1) {
          errors.push('Single Feature setup should not have multiple features (use Feature Set instead)');
        }
        break;
        
      case 'solution-initial-setup':
        if (session.metadata?.jtbd) {
          errors.push('Solution/Initial Setup should not have a JTBD (foundational setup)');
        }
        break;
        
      case 'agent-setup':
        if (!session.agentforce?.needed) {
          errors.push('Agent Setup requires Agentforce to be enabled');
        }
        if (!session.agentforce?.templates || session.agentforce.templates.length === 0) {
          errors.push('Agent Setup requires at least one agent template');
        }
        break;
        
      default:
        errors.push(`Unknown setup type: ${session.setupType}`);
    }
    
    return errors;
  }

  async validate(session) {
    console.log('🔍 Starting validation...');
    
    const results = {
      valid: true,
      errors: [],
      warnings: [],
      schemaValidation: {},
      canonicalValidation: {},
      setupTypeValidation: {}
    };

    try {
      // Schema validation
      const schemaResult = this.validateSchema(session, 'questionnaire.schema');
      results.schemaValidation = schemaResult;
      
      if (!schemaResult.valid) {
        results.valid = false;
        results.errors.push(...schemaResult.errors.map(e => `Schema: ${e.message} (${e.field})`));
      }

      // Canonical rules validation
      const canonicalResult = this.validateCanonicalRules(session);
      results.canonicalValidation = canonicalResult;
      
      if (canonicalResult.errors.length > 0) {
        results.valid = false;
        results.errors.push(...canonicalResult.errors.map(e => `Canonical: ${e}`));
      }
      
      results.warnings.push(...canonicalResult.warnings.map(w => `Canonical: ${w}`));

      // Setup type specific validation
      const setupTypeErrors = this.validateSetupTypeRules(session);
      results.setupTypeValidation = { errors: setupTypeErrors };
      
      if (setupTypeErrors.length > 0) {
        results.valid = false;
        results.errors.push(...setupTypeErrors.map(e => `Setup Type: ${e}`));
      }

      // Summary
      console.log(`✅ Validation complete. ${results.errors.length} errors, ${results.warnings.length} warnings`);
      
      if (results.errors.length > 0) {
        console.log('\nErrors:');
        results.errors.forEach(error => console.log(`  ❌ ${error}`));
      }
      
      if (results.warnings.length > 0) {
        console.log('\nWarnings:');
        results.warnings.forEach(warning => console.log(`  ⚠️ ${warning}`));
      }

    } catch (error) {
      results.valid = false;
      results.errors.push(`Validation Error: ${error.message}`);
      console.error('💥 Validation failed:', error.message);
    }

    return results;
  }

  // Utility method to generate validation report
  generateReport(validationResults) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        valid: validationResults.valid,
        errorCount: validationResults.errors.length,
        warningCount: validationResults.warnings.length
      },
      details: validationResults
    };

    return report;
  }
}

export default ValidationEngine;
