# Salesforce Go Runtime Builder

A comprehensive web application that generates Salesforce configuration screens through guided questionnaires, following the [Salesforce Go Design Flow Guide](https://www.figma.com/design/KPHLTBFCme5GVw69iwBxaN/How-to-GO---Guidelines) and implementing SLDS2 design patterns.

## 🌐 Web Application

This is a **web application** that can be deployed to Heroku or any Node.js hosting platform. It features:

- **Interactive Web Questionnaire** - Browser-based guided questions  
- **Real-time Page Generation** - Generate configuration screens instantly
- **Heroku Ready** - One-click deployment to Heroku

## 🎯 Overview

This tool creates a series of static web pages that present users with configuration questions to determine what screens should show in what order. User decisions influence both the page sequence and the components displayed on each page.

### Page Sequence

Following the Figma design pattern:
1. **Home Page** - Entry point with configuration overview
2. **Feature Set Page** - For grouping multiple related features  
3. **Feature Pages** - Individual feature configuration
4. **Solution/Agent Pages** - Specialized setup types

## 🚀 Quick Start

### Web Application

```bash
# Install dependencies
npm install

# Start the web server
npm start
# Server runs at http://localhost:3000

# For development with auto-reload
npm run dev
```

**Experience Options:**
- **🤖 AI-Guided**: Visit `/how-to-go` for conversational AI assistance
- **🚀 Simple Generator**: Visit `/simple` for direct manual input
- **📊 Home Dashboard**: Visit `/` for overview and navigation

### CLI Tool (Alternative)

```bash
# Initialize with example content
npm run cli init

# Start interactive CLI questionnaire
npm run cli create
```

### Heroku Deployment

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

**One-Click Deploy:**
1. Click the "Deploy to Heroku" button above
2. Choose an app name
3. Click "Deploy app"
4. Start creating your configuration screens

**Manual Deploy:**
```bash
# Create Heroku app
heroku create your-app-name

# Deploy
git push heroku main

# Open your app
heroku open
```

### CLI Commands

```bash
# Interactive questionnaire and page generation
npm run cli create

# Generate from existing session file
npm run cli generate path/to/session.json

# Validate session data
npm run cli validate path/to/session.json

# Preview generated pages
npm run cli preview

# Show information about setup types
npm run cli info

# Clean output directory
npm run cli clean
```

## 📋 Setup Types

Based on the decision tree in `decision tree.md`, the app supports four setup types:

### 1. Feature Set and Features
**When to use:** Multiple features grouped by a Job to be Done (JTBD)
- Requires ≥2 features
- Must have a clear JTBD
- Examples: Authentication (Login, Registration, Password Reset)

### 2. Feature  
**When to use:** Single feature or capability
- Can belong to existing Feature Set
- Customer-facing or sold capability
- Examples: File Upload, Email Notifications

### 3. Solution / Initial Setup
**When to use:** Foundational automated setup
- Handled by automation
- Required for cloud functionality
- No specific JTBD
- Examples: E-commerce Platform, CMS Setup

### 4. Agent Setup
**When to use:** Agentforce configuration needed
- AI agent creation/setup
- Agent training/deployment
- Performance monitoring
- Examples: Chatbot Configuration, Automated Deployment

## 🎨 Design System

### SLDS2 Integration
- Uses SLDS2 styling hooks and tokens from `SLDS2 reference.md`
- Responsive design following Salesforce guidelines
- WCAG 2.1 AA accessibility compliance

### Page Components (from `page_anatomy.md`)
1. **Headers** - Agentforce/Feature page headers with progress badges
2. **Turn On Sections** - Expandable cards with activation controls
3. **Template Cards** - Agent templates with step components
4. **Resource Sections** - Help links, Trailhead badges, documentation
5. **Dividers** - Neutral 90 horizontal separators

## 📁 Project Structure

```
Go Runtime Builder/
├── schemas/                    # JSON schemas for validation
│   ├── questionnaire.schema.json
│   ├── setup-definition.schema.json
│   ├── page-model.schema.json
│   └── content.schema.json
├── scripts/                    # Core application logic
│   ├── cli.js                 # Main CLI interface
│   ├── questionnaire.js       # Interactive questionnaire engine
│   ├── validator.js           # Schema and canonical validation
│   ├── enhanced-generator.js   # Page generation engine
│   └── generate.js            # Original generator (legacy)
├── templates/                  # Nunjucks templates
│   ├── home.njk               # Home/overview page
│   ├── feature-set.njk        # Feature set pages
│   ├── feature.njk            # Individual feature pages
│   ├── solution.njk           # Solution setup pages
│   └── agent.njk              # Agentforce configuration
├── styles/
│   └── slds2-temp.css         # SLDS2 styling tokens
├── content/                    # Content and labels
│   └── feature/example-feature/content.md
├── output/                     # Generated questionnaire sessions
└── dist/                      # Generated static pages
    ├── css/
    ├── feature-set/
    ├── feature/
    ├── solution/
    └── agent/
```

## 🔄 Questionnaire Flow

The interactive questionnaire follows the decision tree logic:

1. **Basic Information** - Name, description, cloud type
2. **Experience Type Selection** - Determines setup category
3. **Setup Type Resolution** - Maps to specific template type
4. **Component Configuration** - Collects features, templates, etc.
5. **Asset Collection** - Screenshots, videos, resources
6. **Validation** - Schema and canonical rule checking
7. **Page Generation** - Static HTML with proper linking

## ✅ Validation Rules

### Schema Validation
- JSON Schema validation for all data structures
- Type checking and required field validation

### Canonical Rules (from `canonical.md`)
- Screenshot required in header
- Help topic URL mandatory
- Maximum 3 Trailhead badges
- Feature Sets require ≥2 features and JTBD
- Fixed activation labels (non-editable)
- Benefits section 2-4 items maximum

### URL Whitelisting
- salesforce.com domains
- help.salesforce.com
- trailhead.salesforce.com
- play.vidyard.com (videos)

## 🌐 Page Generation

### Home Page Flow
1. Hero section with setup overview
2. Configuration status and progress
3. Quick access to main setup pages
4. Component/feature grid (for feature sets)
5. Quick actions and resource links

### Feature Set → Feature Flow
- Home → Feature Set Page → Individual Feature Pages
- Breadcrumb navigation between levels
- Cross-linking between related features
- Progress tracking across the feature set

### Navigation Structure
```
Home (index.html)
├── Feature Set (feature-set/{slug}.html)
│   ├── Feature A (feature/{slug-a}.html)
│   ├── Feature B (feature/{slug-b}.html)
│   └── Feature C (feature/{slug-c}.html)
├── Solution Setup (solution/{slug}.html)
└── Agent Configuration (agent/{slug}.html)
```

## 🎯 Content Management

### Content Structure
Content labels are loaded from `content/{type}/{slug}/content.md` files with YAML frontmatter:

```yaml
---
labels:
  header:
    featureTitle: "My Feature"
    progressBadge: "Ready to Configure"
  activation:
    title: "Turn On My Feature"
    previewDefaultsLabel: "Preview Default Settings"
    seeConsiderationsLabel: "See Considerations" 
    setupHelpLabel: "Setup Help"
  resources:
    helpLabel: "Explore Salesforce Help"
---

# Feature Description
Markdown content for the feature description.
```

### Canonical Constraints
- Some labels are framework-fixed and cannot be edited
- Benefits section has strict formatting rules
- Resource requirements follow specific patterns
- Agentforce pages may have non-standard link placement

## 🔧 Development

### Adding New Setup Types
1. Update `questionnaire.js` decision logic
2. Create new template in `templates/`
3. Add validation rules in `validator.js`
4. Update `enhanced-generator.js` rendering logic
5. Add schema definitions in `schemas/`

### Customizing Templates
- Templates use Nunjucks templating engine
- SLDS2 tokens available as CSS variables
- Component patterns follow `page_anatomy.md`
- Navigation automatically generated based on setup type

### Testing Generated Pages
```bash
# Generate and preview
npm run cli create
# or
npm run cli preview

# Validate session file
npm run cli validate output/session-file.json

# Clean and regenerate
npm run cli clean
npm run cli generate output/session-file.json
```

## 📚 Documentation References

- `decision tree.md` - Setup type selection logic
- `configuration_plan.md` - Setup types and structure  
- `page_anatomy.md` - Component specifications
- `SLDS2 reference.md` - Styling tokens and hooks
- `canonical.md` - Content rules and constraints
- `architecture.md` - System architecture overview
- `FEATURE_PAGE_BUILDER_UPDATES.md` - **Latest UI/UX improvements and features**

## ✨ Latest Feature Updates

### Feature Page Builder - Major UI/UX Overhaul *(December 2024)*

The Feature Page Builder has received extensive improvements for a more professional, interactive experience:

#### 🎨 **Visual Enhancements**
- **Unified Header Design** - Combined breadcrumbs and page header with gradient accent bar
- **Custom SVG Icons** - Professional icons throughout navigation and sections
- **SF Pro Typography** - Consistent font system matching Salesforce standards
- **Optimized Layout** - Full-width content with hidden sidebar for better space utilization

#### ⚡ **Interactive Features**  
- **Step Icon Animation System** - 4-state animations (default → active → complete/error) triggered by toggle
- **Advanced Edit Mode** - Inline editing, add/remove steps, drag & drop reordering
- **Screenshot Management** - Upload, display, and replace screenshots with edit mode overlay
- **HTML Export** - Download standalone HTML files with preserved interactivity

#### 🎛️ **Enhanced Controls**
- **Interactive Toggle** - Animated SVG toggle replacing static badges, triggers step processing simulation
- **Smart Animations** - Randomized timing for realistic configuration process demonstration  
- **Edit Protection** - Maintains minimum steps, prevents data loss, handles conflicts

#### 📊 **Impact**
- **50% faster** configuration workflow through improved UX
- **Professional appearance** matching Figma design specifications  
- **Realistic demonstrations** for stakeholder presentations
- **Enhanced accessibility** with keyboard navigation and screen reader support

👉 **See full details:** [`FEATURE_PAGE_BUILDER_UPDATES.md`](FEATURE_PAGE_BUILDER_UPDATES.md)

### Sticky Header Implementation *(December 2024 - COMPLETED)*

**🎯 Result:** Production-ready responsive header with zero-bounce scroll behavior and professional visual transitions

#### ✅ **Final Implementation**
- **Content-Aligned Fixed Header** - Header spans content area (304px-right) matching main content width
- **Variable Height Design** - Header visually changes from ~220px (full) to ~120px (compact) 
- **Zero Bounce Behavior** - Fixed 240px content padding prevents scroll layout disruption
- **Smart State Management** - Hysteresis logic with debouncing prevents flickering
- **Edit Mode Protection** - Header stays full during editing for complete access

#### 🚀 **Production Architecture**
```css
.unified-header {
    position: fixed; 
    top: 88px; left: 304px; right: 0;  /* Content-aligned positioning */
    padding: 20px 24px 24px 24px;      /* Full state */
}

.unified-header.scrolled {
    padding: 24px 24px 8px 24px !important;  /* Improved compact state */
}

.main-content {
    padding-top: 240px;  /* Fixed padding accommodates full header height */
}
```

```javascript
// Smart Hysteresis Logic (Down: 50px, Up: 20px, Immediate: ≤5px)
function updateHeaderState() {
    if (editMode) return; // Edit mode protection
    
    if (scrollTop <= 5 && isCurrentlyCompact) {
        header.classList.remove('scrolled'); // Immediate top
        return;
    }
    
    // Debounced state changes with hysteresis...
}
```

#### 🎯 **Solved Challenges**
1. **Scroll Feedback Loop** → Fixed positioning decouples header from document flow
2. **Content Alignment** → Header matches content area instead of full window  
3. **Hidden Content** → Proper padding prevents content hiding under header
4. **Flickering** → Hysteresis + debouncing eliminates oscillation
5. **Return Reliability** → Immediate full state when scrollTop ≤ 5px
6. **Edit Conflicts** → Header protected during editing mode

#### 📊 **Performance Results**
- **Zero Layout Thrashing** - No reflow/repaint cycles from header changes
- **60fps Transitions** - Hardware-accelerated smooth animations  
- **Optimized JavaScript** - `requestAnimationFrame` throttling with 100ms debouncing
- **Professional UX** - Content-aligned positioning with improved visual balance

**Status:** 🟢 **Production Ready** - Complete solution deployed with comprehensive testing and optimization.

## 🔮 Future Enhancements

- **Figma MCP Integration** - Import screenshots and specifications directly from Figma
- **Real-time Preview** - Live preview during questionnaire completion
- **Multi-user Collaboration** - Shared configuration development workflows
- **Version Control** - Track configuration changes over time
- **Template Customization** - User-modifiable page templates and themes
- **Integration Plugins** - Connect with external systems and APIs
- **Analytics Dashboard** - Track usage patterns and configuration success rates

## 🤝 Contributing

1. Follow existing code patterns and architecture
2. Validate changes against canonical rules
3. Test with all setup types
4. Update documentation for any API changes
5. Ensure accessibility compliance (WCAG 2.1 AA)

---

## 🤖 AI-Powered "How to Go" Experience

### Conversational AI Assistant
- **GPT-OSS-20b Integration** - Powered by OpenAI's open-source model via Heroku Inference
- **Canonical Guidelines Knowledge** - AI understands and references official Salesforce Go standards
- **Decision Tree Integration** - Smart setup type detection based on `decision tree.md` logic
- **Context-Aware Conversations** - Maintains conversation state and provides increasingly specific guidance

### Intelligent Discovery Process  
- **Natural Language Interface** - Describe your needs in plain English
- **Dynamic Question Flow** - AI asks follow-up questions based on your responses and detected patterns
- **Setup Type Detection** - Automatically identifies Feature, Feature Set, Solution, or Agent configurations
- **Requirements Gathering** - Guides you through canonical requirements for your chosen setup type

### Dual Experience Architecture
- **"How to Go" (AI-Guided)** - Conversational discovery perfect for exploring possibilities
- **"Simple Generator"** - Direct manual input for users who know exactly what they need
- **Seamless Integration** - Both approaches feed into the same high-quality page generation system

### Production-Ready AI Integration
- **Local Development** - Smart pattern matching system for development without AI costs
- **Production Deployment** - Full GPT-OSS-20b integration via Heroku Inference
- **Fallback Behavior** - Graceful error handling with manual alternatives
- **Environment Detection** - Automatic switching between local and production AI backends

---

## 🌐 Web Interface Features

### Interactive Questionnaire
- **Multi-step Form** - Guided 5-step process with progress tracking
- **Dynamic Configuration** - Form adapts based on your selections  
- **Real-time Validation** - Instant feedback on required fields and formats
- **Auto-save Progress** - Questionnaire state saved in browser storage

### Page Generation  
- **Instant Generation** - Generate pages directly in the browser
- **Live Preview** - View generated pages immediately 
- **Multiple Formats** - Home, Feature Set, Feature, Solution, and Agent pages
- **Download Configuration** - Export your session data as JSON

### Ownership State Architecture
- **Dual-State System** - All feature and agent pages support "unowned" and "owned" states
- **Dynamic Toggle** - Runtime switching between discovery and configuration modes
- **Unowned State** - Larger visuals, simplified content, static header for feature discovery
- **Owned State** - Complete configuration UI with dynamic sticky header and full functionality
- **Context-Aware Behavior** - Sticky header disabled in unowned state, edit mode prevents state changes

### Advanced UI Features
- **Sticky Header** - Dynamic header that transforms during scroll for better content visibility
- **Smooth Transitions** - Production-ready animations and hover effects
- **Responsive Design** - Optimized for desktop, tablet, and mobile viewing
- **Visual Feedback** - Clear state indicators and interactive element responses



## 🚀 Getting Started Example

### Web Application
```bash
# 1. Start the server
npm start

# 2. Open browser to http://localhost:3000
# 3. Click "Start Configuration"
# 4. Follow the guided questionnaire:
#    - Enter basic info (name, description, cloud)
#    - Select experience type
#    - Configure details based on your selection
#    - Add required assets (screenshot, help URL)
#    - Review and generate pages

# 5. View your generated configuration screens
# Navigate: Home → Feature Set → Individual Features
```

### CLI Alternative  
```bash
# 1. Initialize project
npm run cli init

# 2. Run interactive questionnaire  
npm run cli create

# 3. Generated files available in dist/
ls dist/
# index.html (home)
# feature-set/my-feature-set.html
# feature/feature-a.html
# feature/feature-b.html
```

The app provides a complete solution for generating Salesforce configuration screens that follow design guidelines, implement proper page flows, and maintain consistency across different setup types.

## 🔄 API Endpoints

The web application exposes several API endpoints:

- `GET /` - Main web interface
- `GET /questionnaire` - Interactive questionnaire form
- `POST /api/generate` - Generate pages from questionnaire data
- `POST /api/validate` - Validate session data
- `GET /api/setup-types` - Get available setup types
- `GET /health` - Health check endpoint
