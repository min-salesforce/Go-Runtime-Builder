## Page Anatomy: Setup Process

[Back to Configuration Plan](configuration_plan.md)

This guide outlines the components that comprise a setup page and their default states/behaviors.

### 1) Headers

- **Agentforce header**
- **Feature page header**
- **Progress badge**: shows how many templates are ON (e.g., X of Y ON). Place near the header area.

### 2) Turn on Agentforce (Section card)

- Use a standard section card for the Agentforce on/off control.
- **States and defaults**:
  - **Agentforce = Off**: Card expanded by default.
  - **Agentforce = Off AND Salesforce Foundations not activated**: Show a blocked warning and open the popover by default.
  - **Agentforce = On**: Card collapsed by default.

#### Turn On section details

- **Card states**: Not On, Loading, On
- **Turn On card title**: Includes the feature name, supporting assets, and the primary action control
- **Links**:
  - Provide configuration/resource links relevant to the feature
  - Max of 3 links
  - Responsive behavior: when the page becomes narrow, links wrap/render under “Turn On [Feature Name]”
- **Actions**: Start the Turn On process and run any automations for the user
  - Two action paths:
    - **Button (for features that cannot be turned off)** — states: Not Started, Loading, On
    - **Toggle (for features that can be turned off/disabled)** — states: Not Started, Loading, On, On (Disabled)
      - Turning off shows a confirmation modal listing any affected features (content provided by the feature team)
      - For cases where disabling requires additional actions (e.g., Salesforce Support), use the modal to explain the blocking reason and how to resolve
- **Expand / Collapse**: The Turn On section can expand/collapse to show automation steps
  - If there is no automation, the Turn On section is not expandable
- **Automations**: Area within the Turn On section where automated steps/activities render
- **Description**: Brief guidance on how to navigate the section or what users get by completing it
  - Use sparingly and only when there is a real need
  - Most descriptions for sections are not editable

### 3) Horizontal page divider

- Use a **Neutral 90** horizontal divider.
- Width must match the width of the section cards.

### 4) Agent Template section header

- Use the general section pattern:
  - Without fill
  - Without a stroke border
  - Chevron hidden
  - Progress ring hidden

### 5) Agent template cards

- Use one section card per template.
- **Placeholder content structure** within each card:
  - Template title and brief description (optional)
  - Steps (use the Step component)
  - Embedded Resource component’s nested variant
- **Dividers**: Separate steps (and the embedded resource block) with Neutral 90 horizontal dividers.
- **States and defaults**:
  - **Agentforce = Off**: All template cards expanded by default.
  - **Agentforce = On**: All template cards collapsed by default.
  - Placeholder content includes template steps and the embedded resource component’s nested variant, separated by Neutral 90 horizontal dividers.

### Step Component (used within template cards)

- **Card states**:
  - **System Validated**: System checks whether the configuration is complete by scanning environment/state
  - **Manual Validated**: User manually marks the step as complete
  - **No Progress**: No definition of done provided
- **Default behavior**: Collapsed by default; expands to reveal details and controls
- **Visual Indicator — System Validated**: Not started, Completed, Error, Warning
- **Title**: Clear, action-oriented step title
- **Info Bubble**: Optional secondary info tooltip
- **Badge (optional)**: Contextual label such as Beta, New, or Deprecated
- **Metadata Insights** (read-only, system-generated):
  - Minimum isn’t met → yellow
  - Minimum is met → green
  - Unknown/insufficient data → grey (informational insight)
- **Description**: Short guidance on what the step entails; keep concise
- **Supporting Assets**: Links to docs, samples, or helpers relevant to the step
- **System Validate Info**: Surface the criteria and latest check results for transparency
- **Embedded Custom Component**: Optional nested UI for bespoke configuration within the step
- **Visual Indicator — Manual Validated**: Not started, Completed
- **Visual Indicator — No Progress**: Simple bullet indicator (no status semantics)
- **Dividers**: Use Neutral 90 horizontal dividers between major sub-sections inside the expanded step

### 6) Resource section

- Use the **Resource component’s card variant** for supplemental resources, docs, and links.

### Recommended page flow (top to bottom)

1. Agentforce header, Feature page header, Progress badge
2. Turn on Agentforce (section card)
3. Neutral 90 horizontal divider (full card width)
4. Agent Template section header (no fill, no border, chevron/progress ring hidden)
5. Agent template cards (repeat per template)
6. Resource section (card variant)

### State flags (for implementation)

- `agentforceOn: boolean`
- `salesforceFoundationsActive: boolean`
- `templatesTotal: number`, `templatesOn: number` (for the progress badge)


