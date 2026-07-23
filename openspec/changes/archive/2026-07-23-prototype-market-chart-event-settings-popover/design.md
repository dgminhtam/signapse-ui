## Context

The Market Chart top toolbar currently renders separate controlled toggles for Events annotations and Economic Calendar events. The intended future direction is one `Events` command with a settings popover, but replacing the working controls before reviewing the new hierarchy would mix visual evaluation with state, filtering, and loading changes.

This change therefore adds a temporary UI-only command beside the two existing toggles. The prototype must use existing localized shadcn wrappers and preserve the compact, wrapping toolbar layout.

## Goals / Non-Goals

**Goals:**

- Make the proposed unified Events command and popover available for visual and keyboard review.
- Show two clearly separated sections for Events and Economic Calendar.
- Show reviewable visibility switches and High, Medium, and Low impact choices.
- Preserve the current toolbar controls and behavior without regressions.

**Non-Goals:**

- Replace or relabel either existing toggle.
- Connect prototype controls to production chart state, chart visibility, filters, legends, markers, URL state, or APIs.
- Add persistence, new dependencies, reusable abstractions, API contracts, or chart-canvas changes.

## Decisions

1. Add the prototype inline in `MarketChartTopToolbar` immediately after the existing Economic Calendar toggle and before Indicators. Keeping it beside the controls it may later replace makes comparison direct; extracting a one-use component would add indirection without reuse.
2. Use an outline, small `Button` labeled with the existing localized Events copy and an inline-start calendar-settings icon. The trigger is a command that opens settings, so it is not pressed or bound to either existing layer state.
3. Use the existing uncontrolled `Popover` behavior. Radix owns open/close, collision handling, Escape dismissal, and focus return; no application open state is needed. Pair the localized title with a short secondary description that explains the settings control event types and impact levels shown on the chart.
4. Render a localized popover title followed by two semantic fieldsets, each inside the existing muted `Item` surface. Each section uses one horizontal row with its visible label and default-checked `Switch`. The Events switch remains uncontrolled; the Calendar switch uses one local prototype boolean solely for conditional disclosure.
5. When Calendar is enabled, leave a clear vertical gap before the nested filter fieldset and indent it behind a subtle left border without a horizontal separator. Label it “Displayed impact levels” using secondary description treatment, visually weaker than the Economic Calendar heading, and stack title-case High, Medium, and Low labels in one checkbox column. Use plain text; badges and categorical colors would imply data status rather than filter options.
6. Keep the impact fieldset mounted but hidden when Calendar is disabled so its uncontrolled checkbox selections survive repeated off/on review. This local visibility state does not call handlers, change chart data, or persist outside the toolbar component.
7. Match the current disabled condition for event controls so the temporary command does not create a new toolbar availability rule.

## Risks / Trade-offs

- [The temporary toolbar contains two visible controls labeled Events] → Keep the prototype adjacent to the old controls for explicit comparison and remove the duplication only in a later approved integration change.
- [Uncontrolled controls can appear functional even though the chart does not change] → Scope the prototype and acceptance criteria explicitly; do not add loading, success, or filtering feedback.
- [The prototype now has one local UI state] → Restrict it to conditional disclosure and keep all chart, URL, persistence, and API behavior out of scope.
- [The extra command increases toolbar density on narrow screens] → Reuse the existing small control size and wrapping container; verify that no page-level horizontal overflow is introduced.
