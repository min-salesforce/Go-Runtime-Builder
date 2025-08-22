## SLDS 2 Styling Hook and Property Reference

⚠️ If you feel a value for these Styling Hooks needs to change to accommodate your component, reach out to the team before making any changes. If a value is marked with a lock (🔒), it has been confirmed and cannot change.

Related resources:
- SDS Global Styling Hooks Cookbook: `https://sds-recipes-3b2955324f56.herokuapp.com/styling-hooks/?theme=sds`

### How to read this guide

- Columns show: Property, State (if applicable), Styling Hook, SLDS Value, Kondo/Alias, Notes
- “Locked” (🔒) indicates governed values

---

### Form Controls — Inputs

| Property | State | Styling Hook | SLDS Value | Alias/Kondo | Notes |
|---|---|---|---|---|---|
| background | default | `--slds-s-input-color-background` 🔒 | `#ffffff` | neutral-100 |  |
| background | focus | `--slds-s-input-color-background-focus` 🔒 | `#ffffff` | neutral-100 |  |
| background | invalid | `--slds-s-input-color-background-invalid` 🔒 | `#fddde3` | pink-100 | container on error |
| background | disabled | `--slds-s-input-color-background-disabled` 🔒 | `#ffffff` |  | previously `#e5e5e5` in legacy |
| border-width | default | `--slds-s-input-sizing-border` 🔒 | `1px` | `--slds-g-sizing-border-1` |  |
| border-color | default | `--slds-s-input-color-border` 🔒 | `#5c5c5c` | neutral-40 |  |
| border-color | hover | `--slds-s-input-color-border-hover` 🔒 | `#5c5c5c` | neutral-40 |  |
| border-color | focus | `--slds-s-input-color-border-focus` 🔒 | `#5c5c5c` |  | note: focus color shadow carries accent |
| border-color | invalid | `--slds-s-input-color-border-invalid` 🔒 | `#b60554` | pink-40 |  |
| border-color | disabled | `--slds-s-input-color-border-disabled` 🔒 | `#c9c9c9` | neutral-80 |  |
| box-shadow | focus | `--slds-s-input-shadow-focus` 🔒 | complex bevel + focus ring |  | see bevel stack in design spec |
| box-shadow | invalid | `--slds-s-input-shadow-invalid` 🔒 | `none` |  |  |
| color | default | `--slds-s-input-color` 🔒 | `#2e2e2e` | neutral-20 |  |
| color | hover | `--slds-s-input-color-hover` 🔒 | `#2e2e2e` | neutral-20 |  |
| color | focus | `--slds-s-input-color-focus` 🔒 | `#2e2e2e` | neutral-20 |  |
| color | invalid | `--slds-s-input-color-invalid` 🔒 | `#b60554` | pink-40 | text on error |
| color | disabled | `--slds-s-input-color-disabled` 🔒 | `#c9c9c9` | neutral-80 |  |
| placeholder | default | `--slds-s-input-color-placeholder` 🔒 | `#5c5c5c` | neutral-40 |  |
| font-size | default | `--slds-s-input-font-size` 🔒 | `13px` |  | base size |
| font-style | placeholder | `--slds-s-input-font-style-placeholder` 🔒 | `normal` |  | 400 (Regular SF Pro) |
| border-radius | default | `--slds-s-input-radius-border` 🔒 | `0.5rem` |  | was 0.25rem in legacy |
| padding | default | `--slds-s-input-spacing` 🔒 | `0.75rem` |  |  |
| height | default | `--slds-s-input-sizing-height` 🔒 | `1.875rem` |  | not a styling hook in legacy |
| gap | default | `--slds-s-input-spacing-gap` 🔒 | `0.5rem` |  | spacing between children |

---

### Marks (Checkbox mark)

| Property | State | Styling Hook | SLDS Value | Notes |
|---|---|---|---|---|
| background | default | `--slds-s-mark-color-background` 🔒 | `#ffffff` | checkmark background |
| background | checked | `--slds-s-mark-color-background-checked` 🔒 | `#066afe` | accent container |
| background | invalid | `--slds-s-mark-color-background-invalid` 🔒 | `#b60554` | error container |
| foreground | checked | `--slds-s-mark-color-foreground-checked` 🔒 | `#ffffff` | on-accent |
| foreground | invalid | `--slds-s-mark-color-foreground-invalid` 🔒 | `#ffffff` | on-error |
| border-color | default | `--slds-s-mark-color-border` 🔒 | `#c9c9c9` |  |
| box-shadow | checked | `--slds-s-mark-shadow-checked` 🔒 | bevel inset stack |  |
| box-shadow | focus | `--slds-s-mark-shadow-focus` 🔒 | 2px surface + 4px brand | focus ring stack |

---

### Labels

| Property | Styling Hook | SLDS Value | Alias/Kondo | Notes |
|---|---|---|---|---|
| color | `--slds-s-label-color` | `--slds-g-color-on-surface-1` | `#5c5c5c` neutral-40 |  |
| font-size | `--slds-s-label-font-size` | `--slds-g-font-size-base` | 13px |  |
| font-weight | `--slds-s-label-font-weight` | `--slds-g-font-weight-4` | 400 | SF Pro Regular |
| padding | `--slds-s-label-spacing` | `--slds-g-spacing-2` | 0.5rem |  |
| gap | `--slds-s-label-spacing-gap` | `--slds-g-spacing-1` | 0.25rem |  |

---

### Helptext

| Property | Styling Hook | SLDS Value | Alias/Kondo | Notes |
|---|---|---|---|---|
| color | `--slds-s-helptext-color` | `--slds-g-color-on-surface-1` | `#5c5c5c` neutral-40 |  |
| font-size | `--slds-s-helptext-font-size` | `--slds-g-font-scale-neg-1` | 12px |  |
| padding | `--slds-s-helptext-spacing` | `--slds-g-spacing-1` | 0.25rem | spacing semantics TBD |

---

### Actions — Buttons (brand)

| Property | State | Styling Hook | SLDS Value | Alias/Kondo | Notes |
|---|---|---|---|---|---|
| background | default | `--slds-s-button-color-background` | `--slds-g-color-accent-1` | `#066afe` kondo-50 |  |
| background | hover | `--slds-s-button-color-background-hover` | `--slds-g-color-accent-2` | `#0250D9` kondo-40 | bevel hover interaction |
| background | focus | `--slds-s-button-color-background-focus` | `--slds-g-color-accent-1` | `#066afe` |  |
| background | active | `--slds-s-button-color-background-active` | `--slds-g-color-accent-2` | `#0250D9` | includes inset bevel |
| color | default | `--slds-s-button-color` | `--slds-g-color-on-accent-1` | `#ffffff` | text color |
| color | hover | `--slds-s-button-color-hover` | `--slds-g-color-on-accent-1` | `#ffffff` |  |
| color | focus | `--slds-s-button-color-focus` | `--slds-g-color-on-accent-1` | `#ffffff` |  |
| color | active | `--slds-s-button-color-active` | `--slds-g-color-on-accent-1` | `#ffffff` |  |
| border-width | default | `--slds-s-button-sizing-border` | `--slds-g-sizing-border-1` | 1px | brand has no visible border |
| border-color | outline | `--slds-s-button-color-border` | `--slds-g-color-border-2` | `#5c5c5c` neutral-40 | outline variant |
| border-radius | default | `--slds-s-button-radius-border` | `--slds-g-radius-border-circle` | 100% | circular buttons |
| box-shadow | hover | `--slds-s-button-shadow-hover` | bevel hover stack |  |  |
| box-shadow | focus | `--slds-s-button-shadow-focus` | 2px surface + 4px brand |  | focus ring |
| box-shadow | active | `--slds-s-button-shadow-active` | bevel pressed stack |  | see figma |

---

### Links

| Property | State | Styling Hook | SLDS Value | Kondo | Notes |
|---|---|---|---|---|---|
| color | default | `--slds-s-link-color` | `--slds-g-color-accent-2` | `#0250d9` |  |
| color | hover | `--slds-s-link-color-hover` | `--slds-g-color-accent-3` | `#022ac0` |  |
| shadow | focus | `--slds-s-link-shadow-focus` | surface + brand ring |  | focus ring |

---

### Presentation — Icon

| Property | Styling Hook | SLDS Value | Notes |
|---|---|---|---|
| color | `--slds-s-icon-color-foreground` | `#ffffff` |  |
| background-color | `--slds-s-icon-color-background` | `#ffffff` |  |
| border-radius | `--slds-s-icon-radius-border` | `--slds-g-radius-border-circle` |  |

---

### Containers (Cards)

| Property | Styling Hook | SLDS Value | Notes |
|---|---|---|---|
| color | `--slds-s-container-color` | on-surface-3 | heading color |
| box-shadow | `--slds-s-container-shadow` | none | Kondo has no outer shadow |
| border-color | `--slds-s-container-color-border` | transparent |  |
| border-radius | `--slds-g-radius-border-4` | 1.25rem | cards/modals |

---

### Global — Derived System (selected)

| Hook | SLDS Value | Alias/Kondo | Notes |
|---|---|---|---|
| `--slds-g-color-surface-1` 🔒 | `#ffffff` | neutral-100 | page background |
| `--slds-g-color-surface-2` 🔒 | `#f3f3f3` | neutral-95 | app background, stacking layers |
| `--slds-g-color-surface-3` 🔒 | `#e5e5e5` | neutral-90 | hover fills |
| `--slds-g-color-on-surface-1` 🔒 | `#747474` | neutral-50/40 | body/labels/help text |
| `--slds-g-color-on-surface-2` 🔒 | `#2e2e2e` | neutral-20 | headings/filled input text |
| `--slds-g-color-on-surface-3` 🔒 | `#181818` | neutral-10 | titles |
| `--slds-g-color-border-1` 🔒 | `#c9c9c9` | neutral-80 | decorative/lines |
| `--slds-g-color-border-2` 🔒 | `#747474` | neutral-50/40 | interactive borders |
| `--slds-g-color-accent-1` 🔒 | `#1b96ff` | electric-blue-50 | brand fills |
| `--slds-g-color-accent-2` 🔒 | `#0176d3` | electric-blue-40 | hover brand |
| `--slds-g-color-accent-3` 🔒 | `#014486` | electric-blue-30 | active brand |
| `--slds-g-color-error-1` 🔒 | `#ba0517` | pink-40 | error text/borders |
| `--slds-g-color-error-container-1` 🔒 | `#fddde3` | pink-90 | error background |
| `--slds-g-color-success-1` 🔒 | `#2e844a` | teal-40 | success text |
| `--slds-g-color-success-container-1` 🔒 | `#acf3e4` | teal-90 | success background |
| `--slds-g-font-family-base` 🔒 | system stack | SF Pro/Segoe/Roboto |  |
| `--slds-g-font-size-base` 🔒 | `13px` | base |  |
| `--slds-g-radius-border-2` 🔒 | `0.5rem` | 8px | inputs/popovers |
| `--slds-g-shadow-1` | multi-stop |  | refer cookbook |

---

### Notes and governance

- Do not override locked (🔒) values. If a change appears necessary, contact the design system owners.
- Where both SLDS and Kondo values are shown, prefer SLDS global hooks in code and document Kondo token alignment.
- Many focus and bevel shadows are multi-layer stacks. Keep them as defined to meet accessibility and visual depth requirements.


