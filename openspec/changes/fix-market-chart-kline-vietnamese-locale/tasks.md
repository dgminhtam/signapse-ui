## 1. KLineCharts Locale Boundary

- [x] 1.1 Add an adapter-local KLineCharts locale setup helper that registers Vietnamese labels for `vi-VN` and `vi`.
- [x] 1.2 Add a small KLineCharts locale resolver that keeps supported locales unchanged and falls back to `en-US` for unsupported locales.
- [x] 1.3 Ensure locale registration runs before market chart `init()` and the chart receives the resolved KLineCharts locale instead of an unguarded app locale.

## 2. Runtime Safety Review

- [x] 2.1 Review KLineCharts tooltip locale keys used by the installed version and confirm the Vietnamese dictionary covers the required labels.
- [x] 2.2 Confirm locale handling remains inside the market chart adapter boundary and shared i18n/backend DTO files do not import KLineCharts APIs.
- [x] 2.3 Confirm the change does not alter candle, annotation, live SSE, lazy loading, drawing, toolbar, or route-state behavior.

## 3. Verification

- [x] 3.1 Run `openspec validate fix-market-chart-kline-vietnamese-locale --strict`.
- [x] 3.2 Run `pnpm typecheck`.
- [x] 3.3 Run `pnpm lint`.
- [x] 3.4 Run static search for `registerLocale`, `locale:`, and KLineCharts imports to confirm the chart locale boundary is scoped and guarded.
- [x] 3.5 Deterministically review the final diff against the original runtime error path to confirm `locales[locale][time]` cannot receive unregistered `vi-VN`.

User-owned manual QA note: after implementation, open `/vi/market-charts`, hover or move the crosshair over candles, and confirm the tooltip renders Vietnamese labels without the runtime `reading 'time'` crash.
