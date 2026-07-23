## Why

Market Chart calendar popovers expose the required event data, but equal-looking metadata chips make the release outcome slow to scan and raw backend values such as `AVAILABLE` and `"0"` leak into the UI. The quick list should prioritize the comparison traders need while keeping secondary metadata compact and localized.

## What Changes

- Move the existing localized impact Badge onto the same metadata row as the event time.
- Render the localized publication-status Badge beside the currency code, using `Đã công bố` / `Published` for `AVAILABLE`, and stop showing event type in the quick list.
- Replace forecast, previous, and actual metadata chips with a compact comparison layout that visually prioritizes actual value.
- Remove `actualBetterWorse` and `revisionBetterWorse` from the quick list because their undocumented raw values do not help chart review.
- Keep revision and description as secondary supporting content without placeholders for missing optional data.
- Add a clear localized action to open the canonical economic calendar detail page instead of relying on the linked title alone.
- Shorten the detail action to the shared `Details` / `Chi tiết` label.
- Separate adjacent events and use the shared ScrollArea instead of the browser's native overflow treatment.
- Remove the separate content-availability sentence; publication status and the explicit detail action communicate the available next step without duplicate copy.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-economic-calendar-events`: Refine the calendar quick-list hierarchy, field visibility, localized status treatment, and full-detail affordance.

## Impact

- Affects the shared `MarketChartCalendarEventList` renderer used by marker and calendar-summary popovers, plus EN/VI Market Charts dictionary entries.
- Updates the existing Market Chart economic calendar event capability.
- Does not change APIs, DTOs, marker placement, grouping, impact mapping, navigation routes, dependencies, or global theme tokens.
