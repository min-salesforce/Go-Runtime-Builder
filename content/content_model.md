## Content Model for Screen Labels (content.md)

Goal: Populate all editable UI labels per screen from a discrete Markdown file with YAML front matter. Non-editable framework labels remain fixed per `canonical.md`.

### File placement

- Feature Set page: `content/feature-set/<slug>/content.md`
- Feature page: `content/feature/<slug>/content.md`
- Solution / Initial Setup: `content/solution/<slug>/content.md`
- Agent Setup: `content/agent/<slug>/content.md`

Optional locales: `content.<locale>.md` (for example, `content.ja.md`).

### Front matter shape (validated by `schemas/content.schema.json`)

```yaml
metadata:
  title: "<Page Title>"
  description: "<Short page description>"
  jtbd: "<Job to be Done>"
  cloud: "<Cloud Name>"

labels:
  header:
    featureTitle: "<Header title>"
    progressBadge: "{{on}} of {{total}} on"

  activation:
    title: "Turn On {{featureName}}"
    # Framework labels below are fixed by canonical; values here are optional overrides for preview only
    previewDefaultsLabel: "Preview Default Settings"
    seeConsiderationsLabel: "See Considerations"
    setupHelpLabel: "Setup Help"
    button:
      notStarted: "Get Started"
      loading: "Loading…"
      on: "On"
    toggle:
      offLabel: "Off"
      onLabel: "On"
      disabledOnLabel: "On (Disabled)"
      confirmTitle: "Turn off {{featureName}}?"
      confirmBody: "Turning off affects related features. Review before proceeding."

  templates:
    sectionTitle: "Agent Templates"
    cards:
      - title: "<Template Card Title>"
        steps:
          - title: "<Step Title>"
            infoBubble: "<Optional tooltip>"
            badge: "<Optional badge>"
            description: "<Optional description>"

  benefits:
    title: "Benefits"
    items:
      - title: "<Benefit Title>"
        description: "<One sentence, 20–25 words max>"
        imageUrl: "https://…"
        linkUrl: "https://…"

  resources:
    helpLabel: "<Feature or area name>"
    releaseNotesLabel: "New in {{featureName}}"
    trailheadLabels:
      - "<Trailhead Badge Title>"
```

### Mapping to components

- Header → `Header.featureTitle`, `Header.progress`
- Turn On Card → `TurnOnCard.title`, `action.*`, `links[]` labels
- Template Cards / Steps → `TemplateCard.title`, per-step titles and text
- Benefits → `BenefitsSection.title`, `items[]`
- Resources → `ResourceSection` labels and link titles

### Rules

- Where `canonical.md` declares framework text as non-editable, content here is optional and used only where permitted by the generator.
- Enforce limits from canonical (for example, up to 3 Trailhead badges, 2–4 benefits).


