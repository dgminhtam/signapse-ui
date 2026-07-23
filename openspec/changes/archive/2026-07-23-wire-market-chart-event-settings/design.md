## Context

`MarketChartWorkbench` already owns `annotationLayerEnabled` and `calendarLayerEnabled`, their refs, the enable handlers that load missing data, and the derived annotation and calendar groups. `MarketChartTopToolbar` receives those values and handlers for the two working toolbar toggles, while the reviewed event-settings popover still uses prototype-only controls.

Economic calendar responses retain a raw nullable string impact. Existing economic-calendar label and badge helpers independently normalize that value. The backend contract exposes an optional impact request array, but the current frontend request type, validator, and query builder intentionally fetch all events.

## Goals / Non-Goals

**Goals:**

- Make the approved popover the single functional event-settings surface.
- Reuse the existing Events and Economic Calendar state, loading, error, and lazy-history behavior.
- Apply High, Medium, and Low filtering consistently to every visible calendar-derived surface.
- Keep raw loaded events intact so filter changes are immediate and reversible.
- Remove the two replaced toolbar toggles after their behavior is represented in the popover.

**Non-Goals:**

- Persist settings in the URL, browser storage, user profile, or backend.
- Add debounce, optimistic state, a new API call, or a dependency.
- Send impact filters to the backend in this change.
- Add an Unknown impact option.
- Change annotation grouping, calendar loading ranges, or marker presentation.

## Decisions

### Keep workbench state as the single source of truth

Remove the toolbar-local Calendar prototype boolean. Bind the popover Events switch to `annotationLayerEnabled` and `handleAnnotationLayerChange`, and bind the Economic Calendar switch to `calendarLayerEnabled` and `handleCalendarLayerChange`.

Impact selection also belongs in `MarketChartWorkbench` because it changes chart-derived data outside the toolbar. Represent it as a canonical array of `HIGH`, `MEDIUM`, and `LOW`, initialized with all three values, and pass the value plus a narrow toggle handler into `MarketChartTopToolbar`.

Keeping state in the toolbar was rejected because the workbench, chart surface, legend, and lazy-history callbacks would otherwise need duplicated or indirect state synchronization.

### Filter a derived calendar-event collection

Keep `chartData.economicCalendarEvents` unfiltered. Derive `visibleCalendarEvents` from the raw collection and selected impact levels, then use that same derived array for:

- `createMarketChartEconomicCalendarEventGroups`
- `ChartSurface` calendar status events
- calendar lane visibility and marker popover content
- legend visibility and event counts

Continue passing raw calendar events into the canvas data-loader cache so lazy-history merges never discard deselected events. Calendar lane visibility SHALL follow filtered calendar groups rather than the raw cache.

Filtering after marker groups are created was rejected because mixed-impact groups would retain incorrect counts and priority. Mutating `loadedData` or passing filtered events into the canvas loader cache was rejected because deselected events would need to be refetched.

### Keep filtering client-side

Changing an impact checkbox SHALL only recompute derived data. Initial loads, calendar re-enable loads, refreshes, and lazy-history loads continue fetching the existing unfiltered calendar response.

Passing the backend `impact` request field was rejected for this change because it would require extending the frontend request contract, refetching the current loaded range on each selection change, handling overlapping responses, and preserving parity across lazy-history loads. It can be reconsidered if measured payload size makes client filtering insufficient.

### Share one impact classifier

Extract a locale-independent classifier from the normalization duplicated by the existing economic-calendar label and badge helpers. It returns `HIGH`, `MEDIUM`, `LOW`, or `null`; the existing helpers and Market Chart filter consume it.

Null, empty, and unrecognized impacts match no checkbox. This keeps the three-option UI truthful rather than silently treating unknown data as Low.

### Remove the replaced toolbar toggles

After the popover switches use the workbench-controlled values and handlers, remove the separate Events and Economic Calendar toggles. Keep the consolidated command in the same toolbar group before Indicators, preserving the current disabled conditions and approved popover UI.

## Risks / Trade-offs

- **Unrecognized impact values become hidden** → Centralize classification, cover null/case/whitespace/unknown inputs with a deterministic check, and add an explicit Unknown option in a later change if product data requires it.
- **All impacts deselected while Calendar remains enabled can look empty** → Keep the switch state accurate and specify that the lane, markers, legend, and count disappear.
- **Calendar re-enable still performs the existing fetch** → Preserve current behavior; the selected impact filter is applied after the response arrives.
- **Shared normalization refactor can affect existing badges and labels** → Preserve their current outputs and verify their existing check alongside new classifier cases.
- **Removing the old toggles reduces direct one-click visibility control** → The approved consolidated command intentionally trades one click for a less crowded toolbar.

## Migration Plan

1. Add and verify the shared impact classifier without changing existing label or badge output.
2. Lift impact state into the workbench and derive filtered calendar events.
3. Bind the popover switches and checkboxes to the workbench state and handlers.
4. Feed filtered events to every calendar-derived chart surface.
5. Remove the two replaced toolbar toggles.
6. Run targeted deterministic checks, lint, typecheck, strict OpenSpec validation, and static review for obsolete prototype state.

Rollback is a local UI rollback: restore the two toggles, the prototype controls, and unfiltered calendar-event derivation. No data migration or backend rollback is required.

## Open Questions

None. Server-side impact filtering and an Unknown option remain explicit future considerations, not blockers for this change.
