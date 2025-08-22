## App Architecture (Questionnaire → Static Pages)

### Goals

- Ask a guided series of questions to capture setup intent and metadata
- Resolve a setup type (Feature Set and Features, Feature, Solution / Initial Setup, Agent Setup)
- Generate linked static HTML pages using `page_anatomy.md` components
- Style via `SLDS2 reference.md` and `styles/slds2-temp.css`
- Enforce composition and content rules from `canonical.md`
- Future: import screen specs/assets via Figma MCP

### Inputs and sources of truth

- Setup types and selection rules: `configuration_plan.md`
- Page composition and component behaviors: `page_anatomy.md`
- UI/IA rules and content standards: `canonical.md`
- Styling hooks and tokens: `SLDS2 reference.md` (+ `styles/slds2-temp.css`)
- User answers captured by the questionnaire (JSON)

### High-level flow

1) Questionnaire UI (CLI/UX) collects answers → `QuestionnaireSession` JSON
2) Type Resolver maps answers → `setupType` (from `configuration_plan.md`)
3) Validator applies rules (for example: Feature Set requires ≥2 features; screenshot required; link caps; labels)
4) Assembler converts the normalized `SetupDefinition` into a `PageModel` (components from `page_anatomy.md`)
5) Generator renders static HTML using templates and injects `styles/slds2-temp.css`
6) Exporter writes pages to `dist/` with routes and cross-links

### Core modules

- Questionnaire Engine: Renders questions, persists `QuestionnaireSession`
- Type Resolver: Chooses `feature-set-and-features | feature | solution-initial-setup | agent-setup`
- Policy Validator: Canonical rules (assets, labels, counts, states)
- Content Assembler: Builds `SetupDefinition` and `PageModel`; merges labels from `content/**/content.md` (YAML front matter validated by `schemas/content.schema.json`)
- Page Generator: Template renderer (Nunjucks/Handlebars-compatible)
- Style Layer: Includes `styles/slds2-temp.css`; resolves hooks from SLDS2
- Asset Manager: Validates/collects screenshot, video URL, Trailhead IDs, RN links
- Linker: Builds nav, breadcrumbs, and cross-references

### Data models (JSON)

- `QuestionnaireSession` (answers collected)
- `SetupDefinition` (normalized config for generation)
- `PageModel` (final page tree with components)
- `ContentFrontMatter` (labels/text from `content.md`)

See `schemas/` for JSON Schemas.

### Decision logic (from configuration_plan.md)

- Feature Set and Features when: multiple features to group AND clear JTBD
- Feature when: an existing Feature Set exists AND user-facing/sold capability
- Solution / Initial Setup when: automation handles setup; foundational; no JTBD
- Agent Setup when: Agentforce is needed

### Component mapping (from page_anatomy.md)

- Headers: Agentforce header, Feature page header, Progress badge
- Turn On section card (expand/collapse; states; actions: button/toggle)
- Divider: Neutral 90, card-width
- Agent Templates: section header (no fill/border/chevron/ring), template cards with steps + embedded resource
- Resource Section: resource card variant
- Step Component: system/manual/no-progress states, indicators, metadata insights

### Canonical constraints (from canonical.md)

- Required assets: screenshot in header; videos preferred but optional; guided tours not recommended
- Benefits section optional (2–4 benefits, strict title/desc rules)
- Activation labels (Preview Default Settings, See Considerations, Setup Help) have fixed text
- Resources: include Help container; optional RN, Trailhead badges (≤3), 360 Blog article (optional)
- Non-standard pages (for example, Agentforce) may move activation links into template cards

### Styling

- Use `styles/slds2-temp.css` tokens and classes (`.slds2-input`, `.slds2-button`, `.slds2-link`, `.slds2-card`, `.slds2-divider-neutral-90`, `.slds2-progress-badge`)
- Prefer CSS variables for theming swap later

### File outputs (dist/)

- `index.html` (optional): landing shell
- `feature-set/<slug>.html` — Feature Set page
- `feature/<slug>.html` — Standard Feature page
- `solution/<slug>.html` — Solution / Initial Setup
- `agent/<slug>.html` — Agent Setup
- Shared assets: `/assets/` (images, videos links external), `/css/slds2-temp.css`

### Content loading

- Screen-level labels come from `content/<type>/<slug>/content.md` front matter
- Framework-fixed labels follow `canonical.md`; overrides are ignored where not permitted


### Figma MCP integration (future)

- Fetch frame thumbnails/renditions for screenshots; map Figma node IDs to page components
- Optional mapping file: `figma-map.json` { componentId → figmaNodeId }
- Import copy or specifications to seed defaults in `QuestionnaireSession`

### Milestones

1) Schemas + templates skeleton
2) Questionnaire MVP (console/JSON-driven)
3) Generator renders Feature and Feature Set pages
4) Add Solution/Agent templates and stateful Turn On flows
5) Figma MCP import (screenshots, optional copy)


