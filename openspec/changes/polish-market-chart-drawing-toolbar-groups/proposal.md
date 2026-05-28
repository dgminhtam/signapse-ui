## Why

The market chart drawing toolbar currently mixes grouped drawing tools, standalone state toggles, and destructive actions in a way that feels visually inconsistent and harder to scan. The toolbar should use shadcn ToggleGroup semantics for tool/state groups while keeping destructive actions clearly distinct.

## What Changes

- Update the drawing tool section to use `ToggleGroup type="single"` with `orientation="vertical"` and `spacing={1}` so tools remain mutually exclusive but visually separated.
- Update the drawing state section to use `ToggleGroup type="multiple"` with `orientation="vertical"` and `spacing={1}` for magnet, lock, and visibility states.
- Preserve current drawing behavior: one active drawing tool at a time, independent magnet/lock/visibility states, selected drawing deletion, and clear-all confirmation.
- Keep the delete section as action controls rather than toggles, and distinguish selected-delete from clear-all with separate icon treatment.
- Avoid ad-hoc wrapper divs for visual spacing where the shadcn ToggleGroup `spacing` API is sufficient.

## Capabilities

### New Capabilities

- `market-chart-drawing-toolbar-composition`: Defines the shadcn composition, grouping, and action separation rules for the market chart drawing toolbar.

### Modified Capabilities

None.

## Impact

- Affected code: `app/[lang]/(main)/market-charts/market-chart-drawing-toolbar.tsx`.
- May affect drawing toolbar dictionary labels only if an action label needs to be clarified.
- No backend API, chart data, KLineChart adapter, drawing persistence, route, dependency, global theme token, or top toolbar changes.
