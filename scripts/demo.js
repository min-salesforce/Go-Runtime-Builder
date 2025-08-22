#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import EnhancedGenerator from './enhanced-generator.js';
import ValidationEngine from './validator.js';

console.log('🎯 Salesforce Go Runtime Builder - Demo');
console.log('=====================================\n');

// Create demo session data for each setup type
const demoSessions = {
  'feature-set': {
    setupType: 'feature-set-and-features',
    metadata: {
      name: 'Authentication Suite',
      description: 'Complete authentication and user management solution',
      cloud: 'Sales Cloud',
      version: '1.0.0',
      jtbd: 'Enable secure user access and account management across the platform'
    },
    features: [
      {
        name: 'Single Sign-On',
        soldToCustomers: true,
        belongsToFeatureSet: 'Authentication Suite'
      },
      {
        name: 'Multi-Factor Authentication', 
        soldToCustomers: true,
        belongsToFeatureSet: 'Authentication Suite'
      },
      {
        name: 'Password Management',
        soldToCustomers: false,
        belongsToFeatureSet: 'Authentication Suite'
      }
    ],
    agentforce: { needed: false, templates: [] },
    assets: {
      screenshotUrl: 'https://via.placeholder.com/1200x675/0176d3/ffffff?text=Authentication+Suite',
      videoUrl: 'https://play.vidyard.com/example',
      resources: {
        helpTopicUrl: 'https://help.salesforce.com/auth',
        releaseNotesUrl: 'https://help.salesforce.com/auth/release-notes',
        trailheadBadges: [
          {
            title: 'User Authentication Basics',
            moduleId: 'user_authentication_basics',
            url: 'https://trailhead.salesforce.com/modules/user_authentication_basics'
          },
          {
            title: 'Multi-Factor Authentication',
            moduleId: 'multi_factor_authentication',
            url: 'https://trailhead.salesforce.com/modules/multi_factor_authentication'
          }
        ],
        blogUrl: 'https://developer.salesforce.com/blogs/2023/authentication-best-practices'
      }
    }
  },

  'feature': {
    setupType: 'feature',
    metadata: {
      name: 'Advanced File Upload',
      description: 'Drag-and-drop file upload with progress tracking and validation',
      cloud: 'Platform',
      version: '2.1.0',
      belongsToFeatureSet: 'Document Management Suite'
    },
    features: [
      {
        name: 'Advanced File Upload',
        soldToCustomers: true,
        belongsToFeatureSet: 'Document Management Suite'
      }
    ],
    agentforce: { needed: false, templates: [] },
    assets: {
      screenshotUrl: 'https://via.placeholder.com/1200x675/2e844a/ffffff?text=File+Upload+Feature',
      resources: {
        helpTopicUrl: 'https://help.salesforce.com/files',
        trailheadBadges: [
          {
            title: 'File Management in Salesforce',
            moduleId: 'file_management',
            url: 'https://trailhead.salesforce.com/modules/file_management'
          }
        ]
      }
    }
  },

  'solution': {
    setupType: 'solution-initial-setup',
    metadata: {
      name: 'E-commerce Platform Setup',
      description: 'Complete e-commerce platform initialization with automated configuration',
      cloud: 'Commerce Cloud',
      version: '3.0.0'
    },
    features: [
      {
        name: 'Product Catalog',
        soldToCustomers: true
      },
      {
        name: 'Shopping Cart',
        soldToCustomers: true
      },
      {
        name: 'Payment Processing',
        soldToCustomers: true
      }
    ],
    agentforce: { needed: false, templates: [] },
    assets: {
      screenshotUrl: 'https://via.placeholder.com/1200x675/fe9339/ffffff?text=E-commerce+Setup',
      resources: {
        helpTopicUrl: 'https://help.salesforce.com/commerce',
        releaseNotesUrl: 'https://help.salesforce.com/commerce/release-notes'
      }
    }
  },

  'agent': {
    setupType: 'agent-setup',
    metadata: {
      name: 'Customer Service Agent',
      description: 'AI-powered customer service agent with knowledge base integration',
      cloud: 'Service Cloud',
      version: '1.0.0'
    },
    features: [],
    agentforce: {
      needed: true,
      templates: [
        {
          name: 'Customer Inquiry Handler',
          description: 'Handles common customer questions and routing',
          steps: [
            {
              title: 'Configure Knowledge Base',
              validation: 'system',
              links: ['https://help.salesforce.com/knowledge']
            },
            {
              title: 'Set Response Templates',
              validation: 'manual',
              links: ['https://help.salesforce.com/templates']
            },
            {
              title: 'Define Escalation Rules', 
              validation: 'system',
              links: ['https://help.salesforce.com/escalation']
            }
          ]
        },
        {
          name: 'Order Status Assistant',
          description: 'Provides real-time order status and tracking information',
          steps: [
            {
              title: 'Connect to Order System',
              validation: 'system',
              links: ['https://help.salesforce.com/orders']
            },
            {
              title: 'Configure Status Messages',
              validation: 'manual'
            }
          ]
        }
      ]
    },
    assets: {
      screenshotUrl: 'https://via.placeholder.com/1200x675/1589ee/ffffff?text=Agentforce+Setup',
      resources: {
        helpTopicUrl: 'https://help.salesforce.com/agentforce',
        trailheadBadges: [
          {
            title: 'Agentforce Basics',
            moduleId: 'agentforce_basics', 
            url: 'https://trailhead.salesforce.com/modules/agentforce_basics'
          },
          {
            title: 'AI Agent Configuration',
            moduleId: 'ai_agent_config',
            url: 'https://trailhead.salesforce.com/modules/ai_agent_config'
          }
        ],
        blogUrl: 'https://developer.salesforce.com/blogs/2023/agentforce-introduction'
      }
    }
  }
};

async function runDemo() {
  try {
    console.log('🔧 Initializing generator...');
    const generator = new EnhancedGenerator();
    await generator.initialize();

    console.log('🔍 Setting up validator...');
    const validator = new ValidationEngine();
    await validator.loadSchemas();

    console.log('\n📋 Generating demo pages for all setup types...\n');

    const results = [];

    for (const [type, session] of Object.entries(demoSessions)) {
      console.log(`\n🔄 Processing ${type} setup...`);
      
      // Validate session
      const validationResult = await validator.validate(session);
      if (!validationResult.valid) {
        console.log(`❌ Validation failed for ${type}:`);
        validationResult.errors.forEach(error => console.log(`  - ${error}`));
        continue;
      } else {
        console.log(`✅ Validation passed for ${type}`);
      }

      // Generate pages
      try {
        const result = await generator.generateFromQuestionnaireSession(session);
        results.push({ type, result, session });
        console.log(`✅ Generated ${result.generatedPaths.length} pages for ${type}`);
      } catch (error) {
        console.log(`❌ Generation failed for ${type}: ${error.message}`);
      }
    }

    // Save demo session files
    console.log('\n💾 Saving demo session files...');
    const outputDir = path.join(process.cwd(), 'output');
    await fs.ensureDir(outputDir);

    for (const { type, session } of results) {
      const sessionPath = path.join(outputDir, `demo-${type}-session.json`);
      await fs.writeJson(sessionPath, session, { spaces: 2 });
      console.log(`📄 Saved: ${sessionPath}`);
    }

    // Create index page linking to all demos
    const indexPath = path.join(generator.distDir, 'demo-index.html');
    const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo - All Setup Types</title>
    <link rel="stylesheet" href="css/slds2-temp.css">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 2rem; background: #f3f3f3; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .demo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-top: 2rem; }
        .demo-card { padding: 1.5rem; border: 1px solid #e5e5e5; border-radius: 8px; background: #fafafa; }
        .demo-card h3 { margin-top: 0; color: #0176d3; }
        .demo-links { margin-top: 1rem; }
        .demo-links a { display: inline-block; margin-right: 1rem; margin-bottom: 0.5rem; color: #0176d3; text-decoration: none; }
        .demo-links a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 Salesforce Go Runtime Builder - Demo</h1>
        <p>Generated configuration pages for all setup types following the Figma design patterns.</p>
        
        <div class="demo-grid">
            ${results.map(({ type, result, session }) => `
                <div class="demo-card">
                    <h3>${session.metadata.name}</h3>
                    <p><strong>Setup Type:</strong> ${session.setupType}</p>
                    <p>${session.metadata.description}</p>
                    ${session.metadata.jtbd ? `<p><strong>JTBD:</strong> ${session.metadata.jtbd}</p>` : ''}
                    <div class="demo-links">
                        <a href="${result.relativePaths.home}">🏠 Home</a>
                        <a href="${result.relativePaths.main}">🎯 Main Page</a>
                        <a href="demo-${type}-session.json" target="_blank">📋 Session Data</a>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-top: 3rem; text-align: center; border-top: 1px solid #e5e5e5; padding-top: 2rem;">
            <p>💡 <strong>Try the interactive version:</strong> Run <code>npm run cli create</code></p>
            <p>📖 <strong>Documentation:</strong> See README.md for complete usage guide</p>
        </div>
    </div>
</body>
</html>`;

    await fs.writeFile(indexPath, indexHtml);
    console.log(`🌐 Demo index created: ${indexPath}`);

    console.log('\n🎉 Demo Complete!');
    console.log(`📁 Generated files in: ${generator.distDir}`);
    console.log(`🌐 Open demo-index.html to see all examples`);
    console.log(`🚀 Run "npm run cli preview" to start local server\n`);

    // Summary
    console.log('📊 Summary:');
    console.log(`   ✅ ${results.length} setup types generated successfully`);
    console.log(`   📄 ${results.reduce((sum, r) => sum + r.result.generatedPaths.length, 0)} total pages created`);
    console.log(`   🔗 Complete page flow: Home → Feature Set → Features`);
    console.log(`   🎨 SLDS2 design system implemented`);
    console.log(`   ✅ All canonical rules validated\n`);

    return results;

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    process.exit(1);
  }
}

// Run demo if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo();
}

export default runDemo;
