## 1. Canvas Pixel Path Review

- [x] 1.1 Review the market chart canvas/container sizing path and confirm KLineChart receives stable container dimensions without obvious CSS transform scaling.
- [x] 1.2 Confirm KLineChart is already using browser `devicePixelRatio` through the vendor canvas path, so the change does not add custom DPR scaling.
- [x] 1.3 Review chart wrapper classes for fractional sizing or transforms that could make canvas output appear softer.

## 2. Grid Rendering Polish

- [x] 2.1 Update the chart-local grid palette so dashed grid lines remain subtle with low-opacity neutral colors.
- [x] 2.2 Change horizontal and vertical grid line sizes from subpixel values to canvas-friendly whole-pixel values.
- [x] 2.3 Keep grid style dashed and avoid changing candle data, annotation data, lazy history loading, or chart interactions.

## 3. Drawing Overlay Palette And Stroke

- [x] 3.1 Replace neutral drawing overlay colors with a chart-local tool-blue palette for light and dark modes.
- [x] 3.2 Use same-hue muted and selected drawing colors instead of neutral gray selected/muted treatments.
- [x] 3.3 Restore line, circle, and rectangle drawing stroke sizes to crisp chart-friendly values.
- [x] 3.4 Restore selected drawing point border treatment to a visible selected state without making inactive drawings heavy.
- [x] 3.5 Keep drawing style changes scoped to the market chart KLineChart adapter and avoid global shadcn token changes.

## 4. Regression Review

- [x] 4.1 Review the final diff to confirm no backend API, dependency, route, locale, toolbar, annotation, live SSE, lazy-history, screenshot, or fullscreen behavior changed.
- [x] 4.2 Run static search for drawing palette, grid size, and global token changes to confirm the update is chart-local.
- [x] 4.3 Deterministically compare the updated style values against the proposal and specs.

## 5. Verification

- [x] 5.1 Run `openspec validate sharpen-market-chart-rendering --strict`.
- [x] 5.2 Run `pnpm typecheck`.
- [x] 5.3 Run `pnpm lint`.

User-owned manual QA note: after implementation, compare `/vi/market-charts` in light and dark mode at browser zoom 100%, draw line/circle/rectangle, and visually compare candle/grid sharpness against the previous build and TradingView reference.
