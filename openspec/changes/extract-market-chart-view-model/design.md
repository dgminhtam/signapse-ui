## Context

`market-chart-canvas.tsx` is the KLineChart adapter boundary for the market charts feature. At 1449 lines, it currently bundles:

- **Canvas lifecycle**: `init`, `dispose`, `setSymbol`, `setPeriod`, `setDataLoader`, `setStyles`, `setLocale`
- **Pure domain logic**: candle normalization/merge/validation, lazy-history request computation, theme palettes, timeframe-to-period mapping, overlay style builders, KLineChart locale registration
- **Annotation marker rendering**: Popover buttons positioned via `chart.convertToPixel`

The vnbrokerchart research (`docs/market-chart-vnbrokerchart-learnings.md`) identified that pure domain logic should live outside the canvas adapter so it can be tested deterministically and survive chart-engine upgrades. The project already has two clean view-model modules (`market-chart-annotations.ts`, `market-chart-drawing.ts`). This design extends the pattern to the remaining logic still bundled in the canvas file.

Existing relevant specs (not modified by this change): `market-chart-klinechart-engine` (vendor boundary containment), `market-chart-annotation-markers` (annotation grouping and rendering), `market-chart-lazy-history-loading` (older-candle prepend).

## Goals / Non-Goals

**Goals:**
1. Extract ~400 lines of pure domain logic from `market-chart-canvas.tsx` into 4 new view-model modules
2. Each new module imports zero klinecharts vendor types; its public API uses only Signapse domain types and plain data structures
3. Remove the duplicate `getAnnotationMarkerColorClassNames` function from canvas (already exported from `market-chart-annotations.ts`)
4. Add deterministic unit tests for every extracted module covering core logic, edge cases, and empty/null inputs
5. Canvas adapter shrinks to ~750 lines and concerns itself only with KLineChart lifecycle and DOM marker rendering

**Non-Goals:**
- No behavior change to chart rendering, data flow, or user interaction
- No changes to `market-chart-workbench.tsx`, `market-chart-drawing-toolbar.tsx`, or any other component
- No changes to backend API contracts, server actions, or SSE live-stream handling
- No new chart features (layout presets, replay, persisted drawings)
- No changes to existing specs or requirement-level behavior
- No visual smoke / browser QA (pure internal refactor)

## Decisions

### Decision 1: Four modules, split by domain concern

| Module | Contents | ~Lines | Key exports |
|---|---|---|---|
| `candle-helpers.ts` | Normalize, merge, validate candle items; KLineData conversion; live-candle merge; volume checks | 120 | `normalizeCandleItems`, `mergeCandleItems`, `mergeLiveCandleItem`, `createKLineData`, `isValidMarketChartCandle`, `getCandleTimestamp`, `hasUsableVolume`, `hasUsableVolumeData` |
| `history-helpers.ts` | Lazy-history request creation, older-candle filtering, exhausted-state logic, interval/target constants | 100 | `createOlderHistoryRequest`, `getOldestLoadedTimestamp`, `getNewOlderCandles`, `TIMEFRAME_INTERVAL_MS`, `LAZY_HISTORY_BAR_TARGET` |
| `theme.ts` | Palette definitions, chart styles builder, drawing overlay styles builder, theme-mode resolution | 130 | `MARKET_CHART_THEME_PALETTES`, `getMarketChartThemePalette`, `createChartStyles`, `createDrawingOverlayStyles`, `resolveChartThemeMode` |
| `period.ts` | Timeframe-to-Period mapping, interval constants, bar targets, KLineChart locale registration + resolution | 80 | `createKLinePeriod`, `ensureKLineChartLocales`, `resolveKLineChartLocale`, `TIMEFRAME_INTERVAL_MS` (moved to history-helpers), `KLINE_CHART_VI_LOCALE` |

**Rationale**: Each module has a single, clear responsibility. A dev fixing a candle-merge bug opens `candle-helpers.ts` (120 lines) instead of scanning 1449 lines. A dev changing theme colors opens `theme.ts` without touching chart lifecycle code.

**Alternative considered**: One large `market-chart-view-model.ts`. Rejected — it would still be a ~400-line file mixing unrelated concerns. Small, focused modules are easier to test and review independently.

### Decision 2: Zero klinecharts imports in view-model modules

Every new module must pass this check: `search_content("from 'klinecharts'", path="new-module")` returns zero results.

**Rationale**: This is the core architectural invariant from `market-chart-klinechart-engine` spec: "Domain helpers do not expose chart vendor types." When klinecharts v11 ships, only `market-chart-canvas.tsx` needs updating. The view-model modules continue to work because they operate on plain Signapse types (`MarketChartCandleItemResponse`, `MarketChartTimeframe`, `MarketChartThemePalette`, etc.).

**Implementation note**: `createKLineData()` currently returns `KLineData[]`. After extraction, it returns its input type aliased — the canvas adapter is responsible for the final `KLineData` cast if needed. Same for `createChartStyles()` — it returns a plain object matching `DeepPartial<Styles>` shape without importing the type. The canvas adapter re-imports and casts at the boundary.

### Decision 3: Theme module keeps CSS variable fallback

`createChartStyles()` currently calls `getCssTextVariable("--font-sans", ...)` which reads `document.documentElement` at runtime. This function stays in the theme module but is only called from the canvas adapter (client component). The theme module itself does not call it at module scope — it exports a factory that the canvas invokes.

**Alternative considered**: Move `getCssTextVariable` out of the theme module entirely. Rejected — it's theming logic and belongs with the styles builder. The canvas passes the resolved font family as an argument if we want pure testability, but that adds indirection for a one-line DOM read. The current approach keeps it co-located without blocking unit tests (tests mock or skip the font family field).

### Decision 4: Tests use plain TypeScript, no testing-library / jsdom

All extracted functions are pure: input → output, no React, no DOM, no async beyond promises. Tests use `describe`/`it`/`expect` with Vitest (or Jest, depending on project config). No browser, no canvas, no chart engine.

**Rationale**: Tests run in < 1 second total. They can run in CI without headless browser setup. They catch regression in candle math, annotation grouping, and lazy-history logic that would otherwise require visual smoke testing.

### Decision 5: Duplicate removal — keep annotations.ts version

The function `getAnnotationMarkerColorClassNames` exists identically in both `market-chart-annotations.ts` (exported as `getMarketChartAnnotationColorClassNames`) and `market-chart-canvas.tsx` (private, named `getAnnotationMarkerColorClassNames`). The annotations.ts version already has a public export with a clean type signature. The canvas.tsx copy is removed and replaced with an import from annotations.ts.

Also unify the `AnnotationMarkerColorClassNames` type — annotations.ts already exports `MarketChartAnnotationColorClassNames`; canvas.tsx defines a private duplicate. After this change, only one type exists.

## Risks / Trade-offs

- **[Risk] Extract introduces import errors or breaks the build** → **Mitigation**: Each module extraction is a single commit. After extracting one module, run `pnpm typecheck` + `pnpm lint` before proceeding to the next. If a module breaks, revert that single commit without affecting the others.
- **[Risk] Tests miss an edge case present in production** → **Mitigation**: Tests are added after extraction, using the extracted public API. They cover documented behavior from existing specs (e.g., `market-chart-lazy-history-loading` scenarios). Additional edge cases are identified by reading the extracted functions' guard clauses.
- **[Risk] `createKLineData` / `createChartStyles` return types lose precision without klinecharts imports** → **Mitigation**: These functions return typed plain objects with the same shape. The canvas adapter assigns them to klinecharts-typed variables at the call site. If klinecharts v11 changes a field name, the adapter catches it at the boundary — the view model stays unchanged.
- **[Trade-off] `TIMEFRAME_INTERVAL_MS` used by both history-helpers and period-helpers** → Resolved by placing it in `history-helpers.ts` (primary consumer). `period.ts` imports it from there. This is a minor cross-module dependency that avoids a third shared-constants file for a single constant.
