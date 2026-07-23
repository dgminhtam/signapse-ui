## 1. Ichimoku Calculation and Rendering

- [x] 1.1 Add a feature-local Ichimoku module that calculates Tenkan(9), Kijun(26), Senkou A, Senkou B(52), and Chikou with displacement 26, leaving unavailable warm-up fields missing.
- [x] 1.2 Add visible-range Kumo rendering that uses current bullish/bearish chart colors, splits span crossings at their interpolated point, and draws the leading-span projection beyond the latest candle.
- [x] 1.3 Register the `ICHIMOKU` price-series indicator idempotently with five line figures and the custom Kumo draw callback.
- [x] 1.4 Add one dependency-free Node assertion script covering warm-up, hand-calculated midpoints, positive and negative displacement, empty input, and same-order and crossing cloud geometry.

## 2. Market Chart Integration

- [x] 2.1 Add `ICHIMOKU` to the shared indicator catalog and main-pane set, and register it before the existing KLineCharts initialization.
- [x] 2.2 Update indicator synchronization to reserve 26 current bar widths on the right only when Ichimoku becomes enabled and restore the existing default offset only when it becomes disabled.
- [x] 2.3 Add the exact `Ichimoku` indicator label to the English and Vietnamese market chart dictionaries.

## 3. Verification

- [x] 3.1 Run the Ichimoku assertion script and confirm all formula, displacement, and cloud-crossing checks pass.
- [x] 3.2 Run TypeScript typecheck and scoped lint for the changed application and assertion files.
- [x] 3.3 Run the production build and confirm the client-only KLineCharts boundary remains SSR-safe.
- [x] 3.4 Run strict OpenSpec validation for `add-market-chart-ichimoku`.

User-owned manual QA: toggle Ichimoku repeatedly and alongside other indicators; inspect the five lines, bullish/bearish cloud, 26-bar projection, zoom/pan, asset and timeframe changes, lazy history, live candles, light/dark theme, fullscreen, and screenshot output.
