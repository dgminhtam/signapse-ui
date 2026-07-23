## Why

Economic calendar impact is styled consistently on the list, but the detail page uses a generic badge and Market Charts shows the raw impact as muted metadata. Using the list treatment as the shared standard makes event importance easier to scan and keeps localized labels consistent across all three surfaces.

## What Changes

- Reuse the economic calendar list's approved red, purple, sky, and outline impact badge treatments on the economic calendar detail page and Market Charts calendar quick lists.
- Use localized uppercase impact labels instead of raw backend impact text.
- Centralize the existing impact badge mapping so the list, detail, and chart quick lists cannot drift.
- Preserve Market Charts behavior that omits an impact badge when the optional impact field is absent.
- Remove obsolete per-surface impact badge mapping and detail prefix behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `economic-calendar-signal-colors`: Apply the canonical impact badge palette and localized uppercase labels consistently across the economic calendar list, detail page, and Market Charts calendar quick lists.
- `market-chart-economic-calendar-events`: Render available impact values as canonical localized badges in calendar quick lists while preserving optional-field omission and existing marker behavior.

## Impact

- Affects the shared economic calendar impact helpers, economic calendar list and detail rendering, Market Charts calendar quick-list rendering, and EN/VI dictionary cleanup.
- Updates the two existing OpenSpec capabilities listed above.
- Does not change APIs, DTOs, dependencies, marker placement, marker priority, status styling, or global theme tokens.
