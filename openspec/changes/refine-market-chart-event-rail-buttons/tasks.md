## 1. Event Rail Button Composition

- [x] 1.1 Update `MarketChartAnnotationControls` to render each milestone action with the existing shadcn `Button` component.
- [x] 1.2 Use `variant="outline"` for milestone actions and keep compact density with the smallest suitable existing button size.
- [x] 1.3 Preserve the current milestone dot, formatted time label, grouped annotation count badge, and click behavior.
- [x] 1.4 Preserve `aria-pressed` for selected milestones and apply only a local selected treatment that does not use a filled primary button.

## 2. Rail Layout States

- [x] 2.1 Keep the leading event count as subdued text and keep milestone actions in a horizontally scrollable trailing row.
- [x] 2.2 Ensure the loading skeleton remains compact and mirrors the final rail height.
- [x] 2.3 Ensure the empty state remains a single subdued Vietnamese message with no placeholder buttons.
- [x] 2.4 Avoid adding a custom timeline scrubber, new route params, dependencies, or global theme token changes.

## 3. Verification

- [x] 3.1 Run targeted lint for market chart files.
- [x] 3.2 Run `pnpm typecheck`.
- [x] 3.3 Run `pnpm build`.
- [x] 3.4 Run `openspec validate --changes refine-market-chart-event-rail-buttons`.
- [x] 3.5 Smoke check `/market-charts` with annotation data when an authenticated chart session is available; if unavailable, document the blocker. Blocked: no authenticated Clerk workspace/provider candle session with annotation data is available in this terminal context.
