## Why

The market chart workbench currently uses Lightweight Charts, which introduces TradingView branding and attribution handling into a screen that should feel like a native Signapse financial workspace. Moving to KLineChart gives the chart feature a cleaner open-source engine with financial-chart primitives that better fit future annotation overlays and lazy historical loading.

## What Changes

- Replace the market chart canvas engine from `lightweight-charts` to the latest `klinecharts` package version available at implementation time.
- Keep the existing watchlist-only asset selection, timeframe selection, latest seven-day rolling window, annotation layer toggle, popup detail UX, summary rail, and shadcn UI shell behavior.
- Do not implement lazy historical loading in this change; only shape the chart adapter/data model so a later change can plug lazy loading into the engine cleanly.
- Migrate annotation marker rendering from Lightweight Charts coordinate APIs to a KLineChart-compatible overlay or DOM overlay integration.
- Remove TradingView attribution UI because the screen will no longer use TradingView's chart engine.
- Remove all obsolete Lightweight Charts code, types, docs references, dependency entries, eslint suppressions, and temporary legacy annotation panel code that no longer has a runtime path.
- Add a repository rule to `AGENTS.md` requiring clean dependency/vendor migrations: no dead imports, no stale attribution, no unused adapter code, and no disabled legacy components after a migration.

## Capabilities

### New Capabilities

- `market-chart-klinechart-engine`: Covers rendering market candle data with KLineChart, preserving current chart workbench behavior while removing Lightweight Charts/TradingView implementation dependencies and preparing the adapter boundary for future lazy historical loading.

### Modified Capabilities

- None.

## Impact

- Affected route/components: `app/(main)/market-charts/page.tsx`, `market-chart-workbench.tsx`, `market-chart-canvas.tsx`, and `market-chart-annotations.ts`.
- Affected data/API layer: market chart DTO timestamp mapping remains frontend-only; backend candle API contract stays unchanged.
- Affected dependencies: add `klinecharts` latest version; remove `lightweight-charts` from `package.json` and `pnpm-lock.yaml`.
- Affected documentation/process: update `AGENTS.md`, `docs/APIMAPPING.md`, and active market-chart OpenSpec references that currently mention Lightweight Charts or TradingView attribution.
