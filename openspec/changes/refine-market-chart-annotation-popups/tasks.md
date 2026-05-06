## 1. Marker Visual Treatment

- [x] 1.1 Replace direction-specific marker shapes with notification-style event dot mapping.
- [x] 1.2 Add grouped marker count treatment while keeping marker text compact.
- [x] 1.3 Add selected/high-priority marker emphasis using ring, size, or pulse treatment.
- [x] 1.4 Respect `prefers-reduced-motion` by using static emphasis instead of pulse animation.
- [x] 1.5 Keep direction/severity/confidence out of marker shape semantics and reserve them for detail content.

## 2. Popup Interaction

- [x] 2.1 Capture selected marker id and click point from chart marker hit testing.
  - Implemented through chart-local HTML notification marker hit targets synced to chart coordinates, because native canvas markers do not support the full accessible pulse/ripple treatment.
- [x] 2.2 Replace the persistent right-side annotation detail panel with a chart-local annotation popup on desktop.
- [x] 2.3 Clamp or reposition the popup so it stays inside the chart surface or viewport.
- [x] 2.4 Add popup dismiss behavior for outside action, close action, marker reselection, and asset/timeframe refresh.
- [x] 2.5 Reuse the existing annotation detail content in the popup without rendering unavailable optional fields.

## 3. Responsive And Accessible Detail

- [x] 3.1 Add a narrow-screen detail fallback using existing suitable UI such as `Sheet` or below-chart detail content.
- [x] 3.2 Preserve keyboard-focusable annotation controls outside the canvas.
- [x] 3.3 Ensure accessible controls open the same popup/detail content as marker click.
- [x] 3.4 Keep concise loading and empty states for the annotation layer without restoring a right-side detail panel.

## 4. Documentation

- [x] 4.1 Update `docs/APIMAPPING.md` or relevant change notes to describe notification-style marker interaction and marker-triggered detail.
- [x] 4.2 Update OpenSpec task notes if runtime smoke testing remains blocked by authenticated backend data.

## 5. Verification

- [x] 5.1 Run targeted lint for `app/(main)/market-charts`, `app/lib/market-charts`, and `app/api/market-charts/action.ts`.
- [x] 5.2 Run `pnpm typecheck`.
- [x] 5.3 Run `pnpm build`.
- [ ] 5.4 Smoke test marker visibility, marker click popup, popup close/reselect behavior, grouped markers, responsive fallback, and keyboard access when authenticated chart data or fixtures are available.
  - Blocked locally: no authenticated Clerk browser session, backend chart response, or market chart annotation fixture is available in the repo to exercise marker popup runtime states.
