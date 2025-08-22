## Implementation Plan: Page Builder App

### Objective

Build a page builder that asks product teams a guided series of questions, resolves a setup type, and generates linked static HTML pages.

- Source of truth for decision logic: `configuration_plan.md`
- Composition and behaviors: `page_anatomy.md`
- Styling: `SLDS2 reference.md` and `styles/slds2-temp.css`
- Copy rules and IA: `canonical.md`
- All screen labels loaded from discrete `content.md`
- Future: Figma MCP integration for screenshots/specs

### High-Level Architecture

1. Questionnaire Engine (CLI/Web) captures answers → `QuestionnaireSession`
2. Type Resolver maps answers → `setupType`
3. Policy Validator enforces schemas and canonical rules
4. Content Loader merges labels from `content.md`
5. Assembler builds `SetupDefinition` → `PageModel`
6. Generator renders static HTML → `dist/`
7. Asset Manager validates/copies assets (CSS, images)
8. Figma MCP Connector (future) pulls screens/assets

### Tech Stack

- Runtime: Node.js 18+
- Language: TypeScript for app logic (migrate current JS)
- Templates: Nunjucks (layouts, partials, block inheritance)
- Content parsing: `gray-matter` (YAML front matter) + Markdown body (optional)
- Validation: Ajv (JSON Schema) for `schemas/*.json`
- File ops: `fs-extra`
- Dev watch: `chokidar`
- Preview server: Vite preview or a tiny Express static server
- Styling: `styles/slds2-temp.css` (SLDS2 tokens)
- Lint/format: ESLint + Prettier
- Tests: Vitest/Jest (unit), Playwright (HTML/a11y smoke)
- CI: GitHub Actions (validate → build → test → artifact)

### Data Models (Schemas)

- `schemas/questionnaire.schema.json` → QuestionnaireSession
- `schemas/setup-definition.schema.json` → SetupDefinition (normalized)
- `schemas/page-model.schema.json` → PageModel (component tree)
- `schemas/content.schema.json` → Content front matter (labels)

### File Structure

- `content/<type>/<slug>/content.md` → labels per screen (optional `content.<locale>.md`)
- `templates/` → `base.njk`, `partials/` (header, turn-on, divider, section header, template card, resources, benefits), `feature.njk`, `feature-set.njk`, `solution.njk`, `agent.njk`
- `styles/` → `slds2-temp.css`
- `schemas/` → JSON Schemas
- `scripts/` → generation, dev server, validation
- `dist/` → build output

### Modules (Detailed)

- Questionnaire Engine
  - v1: CLI prompts derived from `configuration_plan.md`
  - v2: Web UI (Vite + React) with autosave to JSON
  - Output: `QuestionnaireSession`

- Type Resolver
  - Rules:
    - Feature Set & Features: JTBD defined and ≥ 2 features
    - Feature: belongs to existing Feature Set and customer-facing/sold
    - Solution / Initial Setup: automated setup, foundational, no JTBD
    - Agent Setup: Agentforce needed

- Policy Validator
  - Ajv schema checks + canonical constraints:
    - Required screenshot in header
    - Benefits 2–4, images consistent per item, no screenshots as images here
    - Trailhead badges ≤ 3
    - Fixed Activation labels (non-editable) where applicable
    - Link placement by page type; non-standard Agentforce exceptions allowed

- Content Loader
  - Read `content.md` (front matter) and validate with `schemas/content.schema.json`
  - Merge allowed labels into component props; ignore framework-fixed labels

- Assembler
  - Convert SetupDefinition → PageModel components per `page_anatomy.md`
  - Agentforce: template cards with steps and resource embeds
  - Build nav, breadcrumbs, and cross-links

- Generator
  - Render Nunjucks templates using PageModel
  - Inject `styles/slds2-temp.css`
  - Output routes: `feature-set/<slug>.html`, `feature/<slug>.html`, `solution/<slug>.html`, `agent/<slug>.html`

- Asset Manager
  - Validate screenshot (≤ 300 KB recommended, 16:9 or 4:3, 200 DPI, ≤ 1920×1080)
  - Maintain external URLs (Vidyard, Help, RN, Trailhead, 360 Blog)
  - Optional image optimization with `sharp`

- Figma MCP Connector (Future)
  - Map components ↔ Figma node IDs via `figma-map.json`
  - Fetch frame thumbnails for screenshots
  - Optionally import copy tokens/specs

### Templating Plan

- Base layout: head/meta/CSS
- Partials (match `page_anatomy.md`):
  - Header (Agentforce header, Feature page header, progress badge)
  - Turn On card (states: not on/loading/on; actions: button/toggle)
  - Divider (Neutral 90)
  - Agent Template section header (no fill/border/chevron/ring)
  - Template cards (steps separated by neutral 90; embedded resource)
  - Resource section (card variant)
  - Benefits section (optional 2–4 items)

### Styling / Theming

- Use `.slds2-*` classes and CSS variables in `styles/slds2-temp.css`
- Keep brand tokens abstract to allow stylesheet swap later
- Preserve focus/hover/active states from SLDS2 guidelines

### Accessibility

- WCAG 2.1 AA; semantic HTML; keyboard support; aria-expanded for collapsibles; color contrast

### Internationalization

- Resolve labels from `content.<locale>.md` if present; fallback to default
- Avoid text baked into images; do not localize screenshots (per 258 note)

### Security

- Whitelist/sanitize outbound links (salesforce.com, help.salesforce.com, play.vidyard.com, trailhead.salesforce.com)
- Treat labels as text; restrict HTML

### Developer Experience

- `npm run dev` → watch content/templates and serve `dist/`
- `npm run validate` → Ajv validation for all schemas and content
- `npm run build` → full generation
- `npm test` → unit + Playwright smoke

### CI Pipeline

- PR: schema validation, build, tests
- Upload `dist/` as artifact
- Optional: publish to internal static host for review

### Testing Strategy

- Unit tests: resolver, validator, assembler
- Snapshot tests: template output (normalize dynamic bits)
- E2E: open generated pages, check links/clicks, run axe for a11y

### Milestones

1. MVP: single Feature page from `content.md` (done)
2. Resolve setup type and generate all page types
3. Canonical constraints enforcement (benefits/resources/activation labels)
4. Dev server, watch mode, localization support
5. Figma MCP integration for screenshots/assets
6. CI with tests and a11y checks

### Risks & Mitigations

- SLDS2 token drift → keep variables centralized in CSS
- Non-standard Agentforce pages → flexible TemplateCard composition
- Asset gaps (videos/screenshots) → validation + clear errors + fallbacks
- Link rot → periodic CI link checks


