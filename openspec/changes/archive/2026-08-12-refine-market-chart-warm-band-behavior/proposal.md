## Why

Warm episode bands currently render on every market-chart timeframe and can expand across most or all of an intraday chart. Because the full band is also an interactive button, pointer drags that begin inside it do not reach the underlying KLineChart canvas, preventing users from panning toward older history.

## What Changes

- Show warm episode range bands only on the `1d` and `1w` timeframes.
- Keep warm episode bands hidden on `1m`, `5m`, `15m`, `30m`, `1h`, `4h`, and `1mo` while preserving hot-event markers and the annotation-layer toggle behavior.
- Make the visual warm-band surface transparent to pointer input so users can pan, scroll, and zoom the chart through it.
- Preserve warm episode inspection through a compact, keyboard-accessible trigger that opens the existing localized detail preview without turning the full band into a hit target.
- Keep warm bands as non-persisted HTML annotations rather than migrating them into drawing state or a new KLineCharts overlay implementation.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-annotation-markers`: Restrict warm episode range bands to daily and weekly charts, require non-blocking chart interaction through the visual band, and retain an accessible warm episode inspection trigger.

## Impact

- Market chart annotation grouping and rendering under `app/[lang]/(main)/market-charts/`.
- Warm-band popover trigger semantics, pointer hit-testing, keyboard focus, and touch target behavior.
- Existing market chart annotation OpenSpec requirements.
- No backend API, route, persistence, dependency, or chart-engine changes.
