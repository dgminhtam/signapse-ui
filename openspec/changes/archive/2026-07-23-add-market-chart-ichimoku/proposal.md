## Why

The market chart still lacks the remaining agreed trend-analysis indicator, Ichimoku. Adding the complete classic Ichimoku Kinko Hyo system gives users its five plotted lines and projected Kumo while fitting the existing KLineCharts indicator workflow.

## What Changes

- Add a custom `ICHIMOKU` price-series indicator with fixed classic parameters `9`, `26`, `52`, and displacement `26`.
- Render Tenkan-sen, Kijun-sen, Senkou Span A, Senkou Span B, Chikou Span, and bullish/bearish Kumo on the main candle pane.
- Project the leading spans and Kumo 26 bars beyond the latest candle and reserve matching right-side chart space while Ichimoku is enabled.
- Expose the indicator as `Ichimoku` through the existing localized indicator control.
- Recalculate the indicator through the existing mounted KLineCharts instance for historical, lazy-loaded, and live candle changes.
- Add one dependency-free runnable check for the custom calculation, displacement, and Kumo-crossing logic.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-control-toolbar`: Expose Ichimoku through the existing indicator selector without changing its selection behavior.
- `market-chart-klinechart-engine`: Calculate and render the complete classic Ichimoku system on the candle pane, including its 26-bar future projection.

## Impact

- Affects only the localized market chart workbench and KLineCharts adapter under `app/[lang]/(main)/market-charts`, its indicator dictionaries, and a focused assertion script.
- Extends the existing market chart toolbar and engine specifications.
- Requires no backend, DTO, database, route, or dependency changes.
