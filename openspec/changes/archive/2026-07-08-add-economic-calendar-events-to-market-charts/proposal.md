## Why

Market Charts can already show market event annotations, but it does not surface scheduled economic calendar entries that are directly relevant to the selected asset. Adding these markers helps users line up recent and upcoming macro events with candles without leaving the chart.

## What Changes

- Add a default-on Calendar toggle next to the existing Events toggle in the Market Charts toolbar.
- Load asset-relevant economic calendar events from `GET /market-charts/economic-calendar-events` in parallel with candles, annotations, and live data.
- Render calendar events in a dedicated lane above the existing chart legend/controls, using `time` to place each marker.
- Show a quick list/detail popover for calendar events, including response fields such as title, currency, impact, values, description, status, and content availability.
- On hover or focus of a calendar marker, draw a red vertical guide line over the chart to align the event time with the candle.
- For future events without a matching candle, load them for the quick list only; do not extend the chart's candle range just to display future markers.

## Capabilities

### New Capabilities
- `market-chart-economic-calendar-events`: Shows asset-relevant economic calendar entries on Market Charts, including data loading, toolbar toggle, marker lane, legend text, hover guide line, quick list, and navigation to existing economic calendar detail pages.

### Modified Capabilities
- None.

## Impact

- Frontend API mapping and validation for `GET /market-charts/economic-calendar-events` using `market-chart:read`.
- Market Charts workbench data loading, lazy history loading, toolbar controls, chart canvas overlays, legend/controls, and localization dictionaries.
- No new dependency is expected.
