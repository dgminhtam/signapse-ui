## Why

Market chart still crashes on Vietnamese routes when KLineCharts renders the candle tooltip, because the chart receives `vi-VN` as its locale but KLineCharts only ships built-in locale dictionaries for `zh-CN` and `en-US`. The runtime error reads `Cannot read properties of undefined (reading 'time')`, where `time` is a KLineCharts i18n key rather than backend candle data.

## What Changes

- Register a Vietnamese KLineCharts locale before chart initialization so tooltip labels such as time, open, high, low, close, and volume resolve safely.
- Keep the chart configured with the app `intlLocale` so Vietnamese routes continue to display chart tooltip copy in Vietnamese.
- Add a safe locale resolution boundary for KLineCharts so unsupported app locales do not crash the chart tooltip in the future.
- Keep candle, annotation, SSE, lazy loading, drawing, and toolbar behavior unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-klinechart-engine`: KLineCharts integration must register or resolve chart locales before initialization and must not crash tooltip rendering for the Vietnamese app locale.

## Impact

- Affects the market chart KLineCharts adapter under `app/[lang]/(main)/market-charts/`, especially chart initialization and KLineCharts locale setup.
- No backend API, auth, route, dependency, candle data, annotation, live stream, or drawing toolbar changes.
- Verification should include OpenSpec validation, typecheck, lint, and static review that `locale: intlLocale` is guarded by registered/supported KLineCharts locale handling.
