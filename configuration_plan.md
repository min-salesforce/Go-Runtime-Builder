# Configuration Plan: Runtime Builder for Static Configuration Screens

## Overview

This tool is designed to build a series of static web pages that can be linked together, creating a runtime builder for configuration screens. Users can define different types of setups through two distinct experiences:

1. **"Simple" Experience**: Direct page generation with manual input
2. **"How to Go" Experience**: AI-powered conversational interface that guides users through discovery, asks intelligent questions, and pre-fills content based on Salesforce Go canonical guidelines

## AI Architecture: "How to Go" Conversational Experience

### AI Model Integration
- **Local Development**: [GPT-OSS-20b](https://huggingface.co/openai/gpt-oss-20b) via HuggingFace Transformers
- **Production (Heroku)**: GPT-OSS-20b via [Heroku Inference](https://devcenter.heroku.com/articles/heroku-inference#available-models)
- **Context Knowledge**: AI references `canonical.md` and `decision tree.md` for intelligent guidance

### Conversational Flow Architecture
```
User Input → AI Conversation Engine → Context-Aware Response
     ↓                    ↑                      ↓
AI analyzes using:   User clarifies      AI asks follow-up
- canonical.md       requirements        questions based on:
- decision tree.md   & provides          - Setup type discovery
- Previous context   feedback            - Content guidelines
                                        - Technical constraints
     ↓
Final structured data → Same page generation pipeline as "Simple" experience
```

### AI Knowledge Sources
1. **`canonical.md`**: Content guidelines, UI text standards, page hierarchy rules
2. **`decision tree.md`**: Setup type decision logic, content requirements, flow patterns
3. **Session Context**: Accumulated conversation history and user preferences

## Setup Types

The configuration system supports four primary setup types, each serving different use cases:

### 1. Feature Set and Features

**When to Use:**
- There is more than one Feature you need to group
- There is a JTBD (Job to be Done) that the group of Features solve for
Go to [Feature Set Guide](Feature%20Set%20Guide.md)

**Structure:**
```
Feature Set (Top Level)
├── Feature A
│   ├── Configuration Options
│   ├── Dependencies
│   └── Implementation Details
├── Feature B
│   ├── Configuration Options
│   ├── Dependencies
│   └── Implementation Details
└── Feature C
    ├── Configuration Options
    ├── Dependencies
    └── Implementation Details
```

**Examples:**
- **Authentication Feature Set**: Login, Registration, Password Reset
- **Payment Feature Set**: Payment Processing, Billing, Invoicing
- **Analytics Feature Set**: Tracking, Reporting, Dashboard

### 2. Feature

**When to Use:**
- There is an existing Feature Set to add the Feature to
- The thing you're defining is sold to customers or is a user-facing capability included in a cloud or edition
Go to [Feature Set Guide](Feature%20Set%20Guide.md)

**Structure:**
```
Feature
├── Configuration Options
├── Dependencies
├── Implementation Details
└── Standalone Configuration
```

**Examples:**
- File Upload functionality
- Email notification system
- Search capability

### 3. Solution / Initial Setup

**When to Use:**
- Setup is handled by automation
- The setup is required for a Cloud to function and set up subsequent features
- There is no JTBD
Go to Solution / Initial Setup Guide

**Structure:**
```
Solution
├── Feature Set A
│   └── Features...
├── Feature Set B
│   └── Features...
├── Integration Points
├── Global Configuration
└── Solution-wide Dependencies
```

**Examples:**
- E-commerce Platform Solution
- Customer Management Solution
- Content Management Solution

### 4. Agent Setup

**When to Use:**
- Agentforce is needed
Go to Agent Setup Guide

**Structure:**
```
Agent Configuration
├── Agent Behavior Rules
├── Trigger Conditions
├── Actions and Responses
├── Integration Points
└── Monitoring and Logging
```

**Examples:**
- Chatbot Agent Configuration
- Automated Deployment Agent
- Monitoring and Alerting Agent

## Configuration Screen Generation

### Page Structure

Each configuration type will generate a series of static web pages with the following structure:

1. **Overview Page**: High-level summary and navigation
2. **Detail Pages**: Specific configuration options for each component
3. **Review Page**: Summary of all configurations before implementation
4. **Implementation Guide**: Step-by-step instructions

### Linking Strategy

Pages will be linked together using:
- **Hierarchical Navigation**: Parent-child relationships
- **Cross-references**: Related configurations
- **Progressive Flow**: Logical setup sequence
- **Quick Access**: Direct links to frequently used sections

### Configuration Data Format

The tool will use a structured configuration format:

```json
{
  "setupType": "feature-set-and-features|feature|solution-initial-setup|agent-setup",
  "metadata": {
    "name": "Configuration Name",
    "description": "Description of what this configures",
    "version": "1.0.0",
    "jtbd": "Job to be Done description"
  },
  "components": [
    {
      "id": "component-id",
      "name": "Component Name",
      "type": "feature|feature-set-and-features|solution-initial-setup|agent-setup",
      "configuration": {
        // Component-specific configuration options
      },
      "dependencies": ["dependency-ids"],
      "relationships": ["related-component-ids"]
    }
  ],
  "globalSettings": {
    // Cross-cutting configuration options
  }
}
```

## User Flow

### 1. Setup Type Selection
- User chooses their setup type based on their needs
- Tool provides guidance on which type to select
- Examples and use cases are shown for each type

### 2. Configuration Definition
- User defines components based on chosen setup type
- Progressive disclosure of configuration options
- Validation and dependency checking

### 3. Page Generation
- Tool generates static HTML pages based on configuration
- Pages are linked together logically
- Navigation and cross-references are automatically created

### 4. Review and Refinement
- User reviews generated configuration screens
- Ability to modify and regenerate pages
- Export functionality for final implementation

## Technical Implementation

### Page Generation Engine
- Template-based HTML generation
- CSS styling for professional appearance
- JavaScript for interactive elements
- Responsive design for multiple devices

### Configuration Validation
- Schema validation for configuration data
- Dependency checking
- Conflict resolution
- Best practice recommendations

### Output Formats
- Static HTML pages
- Linked navigation structure
- Exportable configuration files
- Implementation documentation

## Future Enhancements

- **Template Customization**: Allow users to modify page templates
- **Integration Plugins**: Connect with external systems
- **Collaborative Editing**: Multi-user configuration development
- **Version Control**: Track configuration changes over time
- **Preview Mode**: Live preview of configuration changes

---

*This configuration plan serves as the foundation for building a flexible, user-friendly tool for creating linked static configuration screens.*
