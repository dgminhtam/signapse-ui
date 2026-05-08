## 1. Grid Readability

- [x] 1.1 Update KLineChart horizontal grid style from `solid` to `dashed`.
- [x] 1.2 Update KLineChart vertical grid style from `solid` to `dashed`.
- [x] 1.3 Add or confirm a modest dash pattern for both grid directions without changing grid color tokens.
- [x] 1.4 Confirm candle data, annotation data, lazy history loading, and chart interactions are not changed by the grid style update.

## 2. Status Rail Metadata

- [x] 2.1 Remove the update-time label from the toolbar trailing controls.
- [x] 2.2 Pass the formatted update-time label into the chart surface/status rail.
- [x] 2.3 Render the bottom status rail unconditionally as part of the chart surface.
- [x] 2.4 Hide event milestone text when `annotationLayerEnabled` is false.
- [x] 2.5 Preserve current event status labels when `annotationLayerEnabled` is true: loading, non-empty count, and empty message.
- [x] 2.6 Render update metadata on the trailing side of the rail when a valid `data.to` timestamp exists.
- [x] 2.7 Omit update metadata when the chart data has no valid `data.to` timestamp.
- [x] 2.8 Adjust chart body/rail radius so the always-present rail keeps a single clean `rounded-xl` surface.

## 3. Skeleton Parity

- [x] 3.1 Update the page-level chart skeleton to include the status rail cue by default.
- [x] 3.2 Remove the toolbar skeleton placeholder for update time.
- [x] 3.3 Ensure mounted chart loading renders the chart body skeleton without duplicating the status rail.
- [x] 3.4 Update the status rail skeleton cue to mirror leading event status and trailing update-time areas.

## 4. Verification

- [x] 4.1 Run targeted lint for market chart files.
- [x] 4.2 Run `pnpm typecheck`.
- [x] 4.3 Run `pnpm build`.
- [x] 4.4 Run `openspec validate --changes refine-market-chart-status-rail-and-grid`.
- [x] 4.5 Smoke check `/market-charts` in an authenticated browser session when available; if unavailable, document the blocker.
  - Blocker: no authenticated Clerk chart session is available from the terminal context, so visual smoke should be completed in the browser session.
