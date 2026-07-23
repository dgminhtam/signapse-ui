## 1. Localized Prototype Copy

- [x] 1.1 Add typed EN/VI Market Chart copy for the event-settings popover title and any new accessible label, reusing existing Events, Economic Calendar, and impact labels where possible.

## 2. Toolbar Prototype

- [x] 2.1 Add the new compact Events popover command after the two existing event toggles and before Indicators without changing or removing either existing toggle.
- [x] 2.2 Build the UI-only popover with two semantic sections, default-checked prototype visibility switches, and default-checked uncontrolled High, Medium, and Low impact checkboxes using existing shadcn wrappers and canonical impact presentation.

## 3. Verification

- [x] 3.1 Run targeted lint for the touched Market Chart and dictionary files, then run project typecheck.
- [x] 3.2 Run strict OpenSpec validation and inspect the final diff to confirm there is no prototype React state, handler wiring, API call, URL state, chart-canvas change, dependency change, or removal of the existing toggles.

User-owned manual QA: Review the new command and popover beside the two existing controls at desktop and narrow widths; confirm visual hierarchy, wrapping, keyboard focus order, Escape dismissal, and that prototype interactions do not change the chart.

## 4. Visual Hierarchy Refinement

- [x] 4.1 Replace the repeated generic visibility copy with localized section-specific supporting descriptions and add a localized impact-filter label.
- [x] 4.2 Refine each section into a clear label/description/switch header row and present impact choices as a compact subordinate grid without adding state or behavior.
- [x] 4.3 Run targeted lint, project typecheck, strict OpenSpec validation, and final diff review.

## 5. Content And Impact Refinement

- [x] 5.1 Add a localized secondary popover description explaining the purpose of the event settings.
- [x] 5.2 Replace impact Badges with plain localized checkbox labels while preserving the compact grid and uncontrolled prototype behavior.
- [x] 5.3 Run targeted lint, project typecheck, strict OpenSpec validation, and final diff review.

## 6. Section Surface Refinement

- [x] 6.1 Remove the redundant localized Events and Economic Calendar visibility descriptions.
- [x] 6.2 Wrap each semantic feature fieldset in the existing muted Item surface and remove the separator between them.
- [x] 6.3 Run targeted lint, project typecheck, strict OpenSpec validation, and final diff review.

## 7. Impact Layout Refinement

- [x] 7.1 Add an internal separator, promote the impact legend to section-label treatment, and stack impact checkboxes in one column.
- [x] 7.2 Run targeted lint, project typecheck, strict OpenSpec validation, and final diff review.

## 8. Calendar Dependency Refinement

- [x] 8.1 Rename the localized impact legend to “Displayed impact levels” and add a nested visual treatment beneath Calendar.
- [x] 8.2 Add one local Calendar disclosure state so the mounted impact settings are shown only while the prototype Calendar switch is enabled.
- [x] 8.3 Run targeted lint, project typecheck, strict OpenSpec validation, and final diff review.

## 9. Impact Hierarchy Refinement

- [x] 9.1 Remove the internal horizontal separator and render the impact label with weaker secondary treatment than the Economic Calendar heading.
- [x] 9.2 Run targeted lint, project typecheck, strict OpenSpec validation, and final diff review.

## 10. Impact Spacing And Copy Refinement

- [x] 10.1 Increase the vertical gap before the nested impact controls and add localized title-case impact option labels for this prototype.
- [x] 10.2 Run targeted lint, project typecheck, strict OpenSpec validation, and final diff review.
