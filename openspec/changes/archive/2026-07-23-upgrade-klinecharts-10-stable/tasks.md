## 1. Stable Dependency

- [x] 1.1 Pin `klinecharts` to exact version `10.0.0` and refresh `pnpm-lock.yaml`.
- [x] 1.2 Confirm the manifest, lockfile, and installed package no longer resolve `10.0.0-beta1`.

## 2. Stable Adapter Contracts

- [x] 2.1 Replace the beta array-based initialization layout with the stable object-based y-axis gap configuration while retaining `candle_pane`.
- [x] 2.2 Migrate indicator creation to pass `name` and deterministic `paneId` through the stable indicator object and preserve main-pane stacking.
- [x] 2.3 Apply secondary indicator pane height, minimum height, and drag behavior through `setPaneOptions` after successful creation.
- [x] 2.4 Review market-chart vendor calls, styles, and custom overlays for remaining beta-only or removed API usage, changing only direct incompatibilities.

## 3. Verification

- [x] 3.1 Run `pnpm typecheck`.
- [x] 3.2 Run scoped ESLint for the changed market chart source.
- [x] 3.3 Run `pnpm build`.
- [x] 3.4 Run `openspec validate upgrade-klinecharts-10-stable --strict` and confirm the implementation diff contains no `10.0.0-beta1` or beta-only layout/indicator calls.

User-owned manual QA: Verify candles, realtime updates, lazy history, every indicator and Volume toggle, drawing creation/edit/lock/visibility, annotations, Vietnamese tooltip locale, light/dark theme, screenshot, fullscreen, and note that stable RSI values may differ from beta1.
