## 1. Toolbar Layout

- [x] 1.1 Remove the card-like wrapper around the market chart top controls.
- [x] 1.2 Recompose controls into a leading/trailing toolbar layout aligned with `AppListToolbar` rhythm.
- [x] 1.3 Keep the asset selector as the primary leading control with responsive full-width behavior on mobile.
- [x] 1.4 Group timeframe selector, annotation visibility switch, and refresh button as trailing controls.
- [x] 1.5 Preserve existing asset/timeframe URL updates, annotation toggle behavior, refresh behavior, pending states, and validation error rendering.

## 2. Accessible Minimal Controls

- [x] 2.1 Convert visible stacked field labels that are redundant in the toolbar into `sr-only` labels or equivalent accessible names.
- [x] 2.2 Ensure asset selector, timeframe selector, annotation switch, and refresh button expose clear accessible names.
- [x] 2.3 Keep primary toolbar controls at default shadcn primitive height without ad hoc `h-*`, `min-h-*`, or compact sizing.
- [x] 2.4 Verify mobile wrapping does not create horizontal overflow.

## 3. Chart Context Label

- [x] 3.1 Move latest freshness text out of the toolbar.
- [x] 3.2 Add a Signapse-owned chart context label inside the chart surface or canvas wrapper.
- [x] 3.3 Format loaded chart context as `asset symbol - timeframe label - Cập nhật <time>`.
- [x] 3.4 Avoid stale freshness text when chart data is loading, idle, empty, or error.
- [x] 3.5 Prevent duplicate visible chart identity with the KLineChart native title where practical.

## 4. Verification

- [x] 4.1 Run targeted lint for market chart files.
- [x] 4.2 Run `pnpm typecheck`.
- [x] 4.3 Run `pnpm build`.
- [x] 4.4 Run `openspec validate --changes refine-market-chart-control-toolbar`.
- [x] 4.5 Smoke test or visually inspect `/market-charts` toolbar and chart context label in desktop and mobile widths when an authenticated chart fixture is available; otherwise document the blocker. Blocked locally because this session does not have an authenticated Clerk workspace/browser chart fixture to inspect desktop and mobile chart data states.
