#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import QuestionnaireEngine from './questionnaire.js';
import ValidationEngine from './validator.js';
import EnhancedGenerator from './enhanced-generator.js';

const program = new Command();

// Add some style helpers
const log = {
  info: (msg) => console.log(chalk.blue('ℹ️  ') + msg),
  success: (msg) => console.log(chalk.green('✅ ') + msg),
  warning: (msg) => console.log(chalk.yellow('⚠️  ') + msg),
  error: (msg) => console.log(chalk.red('❌ ') + msg),
  title: (msg) => console.log(chalk.bold.cyan(msg))
};

program
  .name('go-runtime-builder')
  .description('Salesforce Go Runtime Builder - Generate configuration screens from questionnaire answers')
  .version('0.1.0');

// Main command: Run full questionnaire and generate pages
program
  .command('create')
  .description('Run interactive questionnaire and generate configuration pages')
  .option('-o, --output <dir>', 'Output directory for generated pages', './dist')
  .option('--no-preview', 'Skip launching preview server')
  .action(async (options) => {
    try {
      log.title('🚀 Salesforce Go Runtime Builder');
      console.log('Creating your configuration screens...\n');

      // Run questionnaire
      log.info('Starting interactive questionnaire...');
      const questionnaire = new QuestionnaireEngine();
      const sessionPath = await questionnaire.run();
      
      if (!sessionPath) {
        log.warning('Questionnaire cancelled');
        return;
      }

      // Initialize generator
      log.info('Initializing page generator...');
      const generator = new EnhancedGenerator();
      await generator.initialize();
      
      // Load and generate from session
      const session = await fs.readJson(sessionPath);
      const result = await generator.generateFromQuestionnaireSession(session);
      
      log.success(`Generated ${result.generatedPaths.length} pages`);
      log.info(`📁 Output directory: ${generator.distDir}`);
      log.info(`🏠 Home page: ${result.relativePaths.home}`);
      log.info(`🎯 Main page: ${result.relativePaths.main}`);
      
      // Launch preview server unless disabled
      if (options.preview) {
        log.info('Starting preview server...');
        await generator.createPreviewServer(3000);
        log.success('Preview server started at http://localhost:3000');
      }
      
    } catch (error) {
      log.error(`Creation failed: ${error.message}`);
      process.exit(1);
    }
  });

// Generate from existing session file
program
  .command('generate')
  .description('Generate pages from existing questionnaire session file')
  .argument('<session>', 'Path to questionnaire session JSON file')
  .option('-o, --output <dir>', 'Output directory for generated pages', './dist')
  .option('--no-preview', 'Skip launching preview server')
  .action(async (sessionPath, options) => {
    try {
      log.title('🔄 Generating from existing session');
      
      if (!await fs.pathExists(sessionPath)) {
        log.error(`Session file not found: ${sessionPath}`);
        process.exit(1);
      }
      
      const generator = new EnhancedGenerator();
      await generator.initialize();
      
      const result = await generator.generateFromSession(sessionPath);
      
      log.success(`Generated ${result.generatedPaths.length} pages`);
      log.info(`📁 Output directory: ${generator.distDir}`);
      
      if (options.preview) {
        log.info('Starting preview server...');
        await generator.createPreviewServer(3000);
        log.success('Preview server started at http://localhost:3000');
      }
      
    } catch (error) {
      log.error(`Generation failed: ${error.message}`);
      process.exit(1);
    }
  });

// Validate session file
program
  .command('validate')
  .description('Validate a questionnaire session file')
  .argument('<session>', 'Path to questionnaire session JSON file')
  .option('--report', 'Generate detailed validation report')
  .action(async (sessionPath, options) => {
    try {
      log.title('🔍 Validating session file');
      
      if (!await fs.pathExists(sessionPath)) {
        log.error(`Session file not found: ${sessionPath}`);
        process.exit(1);
      }
      
      const session = await fs.readJson(sessionPath);
      const validator = new ValidationEngine();
      await validator.loadSchemas();
      
      const result = await validator.validate(session);
      
      if (result.valid) {
        log.success('Session is valid');
      } else {
        log.error('Session validation failed');
        result.errors.forEach(error => log.error(`  ${error}`));
      }
      
      if (result.warnings.length > 0) {
        log.warning(`${result.warnings.length} warning(s):`);
        result.warnings.forEach(warning => log.warning(`  ${warning}`));
      }
      
      if (options.report) {
        const reportPath = sessionPath.replace('.json', '-validation-report.json');
        const report = validator.generateReport(result);
        await fs.writeJson(reportPath, report, { spaces: 2 });
        log.info(`Detailed report saved to: ${reportPath}`);
      }
      
      process.exit(result.valid ? 0 : 1);
      
    } catch (error) {
      log.error(`Validation failed: ${error.message}`);
      process.exit(1);
    }
  });

// Preview generated pages
program
  .command('preview')
  .description('Start preview server for generated pages')
  .option('-p, --port <port>', 'Server port', '3000')
  .option('-d, --dir <dir>', 'Directory to serve', './dist')
  .action(async (options) => {
    try {
      const express = await import('express');
      const app = express.default();
      const port = parseInt(options.port);
      const distDir = path.resolve(options.dir);
      
      if (!await fs.pathExists(distDir)) {
        log.error(`Directory not found: ${distDir}`);
        log.info('Run "go-runtime-builder create" or "go-runtime-builder generate" first');
        process.exit(1);
      }
      
      app.use(express.static(distDir));
      
      app.listen(port, () => {
        log.success(`Preview server running at http://localhost:${port}`);
        log.info(`📂 Serving files from: ${distDir}`);
        log.info('Press Ctrl+C to stop');
      });
      
    } catch (error) {
      log.error(`Preview server failed: ${error.message}`);
      process.exit(1);
    }
  });

// List available templates and examples
program
  .command('info')
  .description('Show information about available templates and setup types')
  .action(async () => {
    try {
      log.title('📋 Salesforce Go Runtime Builder Info');
      
      console.log('\n🏗️  Setup Types:');
      console.log('  • feature-set-and-features - Group multiple features with a Job to be Done');
      console.log('  • feature - Single feature or capability');
      console.log('  • solution-initial-setup - Foundational automated setup');
      console.log('  • agent-setup - Agentforce agent configuration');
      
      console.log('\n📄 Generated Page Types:');
      console.log('  • Home Page - Overview and entry point');
      console.log('  • Feature Set Page - Feature collection overview');
      console.log('  • Feature Page - Individual feature configuration');
      console.log('  • Solution Page - Initial setup and automation');
      console.log('  • Agent Page - Agentforce configuration');
      
      console.log('\n🎨 Design System:');
      console.log('  • SLDS2 styling tokens and components');
      console.log('  • Responsive design following Salesforce guidelines');
      console.log('  • Accessibility compliant (WCAG 2.1 AA)');
      
      console.log('\n🔗 Page Flow:');
      console.log('  Home → Feature Set → Individual Features');
      console.log('  Home → Solution Setup');
      console.log('  Home → Agent Configuration');
      
      console.log('\n📚 Resources:');
      console.log('  • Documentation: page_anatomy.md, canonical.md');
      console.log('  • Schemas: schemas/*.json');
      console.log('  • Templates: templates/*.njk');
      
    } catch (error) {
      log.error(`Info command failed: ${error.message}`);
    }
  });

// Clean output directory
program
  .command('clean')
  .description('Clean the output directory')
  .option('-d, --dir <dir>', 'Directory to clean', './dist')
  .action(async (options) => {
    try {
      const distDir = path.resolve(options.dir);
      
      if (await fs.pathExists(distDir)) {
        await fs.emptyDir(distDir);
        log.success(`Cleaned directory: ${distDir}`);
      } else {
        log.info(`Directory doesn't exist: ${distDir}`);
      }
      
    } catch (error) {
      log.error(`Clean failed: ${error.message}`);
      process.exit(1);
    }
  });

// Initialize project with example content
program
  .command('init')
  .description('Initialize project with example content and configuration')
  .option('--force', 'Overwrite existing files')
  .action(async (options) => {
    try {
      log.title('📁 Initializing project');
      
      const root = process.cwd();
      const exampleDir = path.join(root, 'content', 'feature', 'example-feature');
      
      // Create example content structure
      await fs.ensureDir(exampleDir);
      
      const exampleContent = `---
labels:
  header:
    featureTitle: "Example Feature"
    progressBadge: "Ready to Configure"
  activation:
    title: "Turn On Example Feature"
    previewDefaultsLabel: "Preview Default Settings"
    seeConsiderationsLabel: "See Considerations"
    setupHelpLabel: "Setup Help"
    button:
      notStarted: "Get Started"
  resources:
    helpLabel: "Explore Salesforce Help"
    releaseNotesLabel: "What's New"
  benefits:
    title: "Benefits"
    items:
      - title: "Improved Efficiency"
        description: "Streamline your workflows and save time"
      - title: "Better User Experience"
        description: "Provide seamless experiences for your users"
      - title: "Enhanced Security"
        description: "Built-in security features protect your data"
---

# Example Feature

This is example content for a feature configuration page. You can customize the labels and content structure in the YAML frontmatter above.
`;
      
      const contentPath = path.join(exampleDir, 'content.md');
      
      if (!options.force && await fs.pathExists(contentPath)) {
        log.warning('Example content already exists. Use --force to overwrite.');
      } else {
        await fs.writeFile(contentPath, exampleContent);
        log.success(`Created example content: ${contentPath}`);
      }
      
      // Create output directory
      const outputDir = path.join(root, 'output');
      await fs.ensureDir(outputDir);
      log.info(`Created output directory: ${outputDir}`);
      
      log.success('Project initialized successfully!');
      log.info('Run "go-runtime-builder create" to start the questionnaire');
      
    } catch (error) {
      log.error(`Initialization failed: ${error.message}`);
      process.exit(1);
    }
  });

// Error handling
program.configureOutput({
  outputError: (str, write) => write(chalk.red(str))
});

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
