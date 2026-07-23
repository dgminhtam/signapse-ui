## Context

`MarketChartCalendarEventList` is the shared renderer for both calendar marker popovers and the workbench calendar-summary popover. It currently flattens currency, release values, revision, and raw better/worse metadata into equal-looking chips; it also renders the backend status directly and uses the linked title as the only detail affordance.

The recently completed impact-badge change is the new baseline: impact already uses the shared localized economic calendar Badge mapping. The API contract remains unchanged. `actualBetterWorse` and `revisionBetterWorse` are nullable raw MDG strings with no documented enum, so the quick list will not render them.

## Goals / Non-Goals

**Goals:**

- Make actual, forecast, and previous values scannable as a comparison.
- Place impact beside time, and publication status beside currency.
- Use localized chart-specific publication copy, including `Đã công bố` / `Published` for `AVAILABLE`.
- Remove `actualBetterWorse` and `revisionBetterWorse` from the quick list.
- Provide one obvious, keyboard-accessible action to the full detail route.
- Separate adjacent events and use the shared ScrollArea for bounded overflow.
- Keep optional-field omission and compact popover behavior.

**Non-Goals:**

- Show event type in the quick list.
- Change API contracts, DTO validation, impact mapping, marker behavior, routes, global tokens, or the full economic calendar detail page.
- Remove the two better/worse fields from the API DTOs or other economic calendar surfaces.
- Introduce a new component, dependency, or general-purpose presentation layer.

## Decisions

1. Keep the change inside the shared `MarketChartCalendarEventList` renderer. Both popover callers already use it, so one surgical edit keeps the surfaces synchronized. A new component or configuration layer would add indirection without another consumer.
2. Use this event hierarchy:

   ```text
   time                                      impact
   title
   currency                         publication status
   actual              forecast              previous
   optional revision
   description
   view details
   ```

   Rows may wrap on narrow viewports. Missing optional values are omitted rather than replaced with placeholder copy.
3. Render the impact Badge in the time row using the existing shared impact helpers. Render currency and status in the next metadata row, omit `type`, and use the existing status Badge variant helper with chart-specific localized labels for `AVAILABLE` and `PENDING`.
4. Replace the generic value-chip array with a compact metric comparison. Actual appears first and receives the strongest value treatment; forecast and previous remain secondary. Revision stays below the primary comparison because it modifies historical context rather than competing with the release result.
5. Do not render `actualBetterWorse` or `revisionBetterWorse` in the quick list. Keeping the fields in the DTO preserves the backend contract without exposing undocumented raw values on this decision-focused surface.
6. Render the title as non-interactive event identity and add one localized `Details` / `Chi tiết` link as the canonical detail action, reusing `dictionary.common.detail`. This avoids duplicate links and a new dictionary key while giving keyboard users a predictable target with visible focus.
7. Remove the separate content-availability sentence. The localized publication status communicates readiness, while the explicit detail action communicates the available next step without repeating metadata.
8. Wrap the event list in the existing ScrollArea with the current `max-h-80` bound applied to both its root and viewport. Keep content padding in an inner wrapper so the scrollbar does not cover event content.
9. Insert the existing decorative Separator only between adjacent event articles. Do not render a trailing separator or combine it with CSS `divide-y`.

## Risks / Trade-offs

- [Three metrics may wrap in a narrow collision-adjusted popover] → Use a compact responsive layout inside the existing responsive popover width and preserve natural wrapping.
- [Chart-specific `Published` copy differs from the economic calendar list's generic `Available`] → Scope the new labels under `marketCharts.calendar` so other surfaces do not change.
- [Removing the title link changes an existing click target] → Provide one explicit detail link in every event article and preserve the same localized route and visible focus behavior.
- [A custom scrollbar could obscure content or keyboard focus] → Reuse the repository ScrollArea wrapper, reserve trailing content space, and preserve the native detail link as the focusable control.
