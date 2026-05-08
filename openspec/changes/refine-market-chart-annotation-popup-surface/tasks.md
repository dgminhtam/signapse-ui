## 1. Popup Layering And Placement

- [x] 1.1 Refactor chart surface markup so rounded chart/canvas clipping is separated from the annotation popup layer.
- [x] 1.2 Update popup placement helper to choose left/right placement based on marker position and clamp inside the chart surface.
- [x] 1.3 Add desktop popup max-height and internal scrolling so long content does not overflow the workspace.
- [x] 1.4 Preserve outside-click close behavior, close button behavior, marker reselection behavior, and mobile/below-chart fallback.

## 2. Popup Content Simplification

- [x] 2.1 Remove the nested bordered detail card wrapper inside `MarketChartAnnotationDetail`.
- [x] 2.2 Move confidence into the same top metadata row as direction, time, and grouped count.
- [x] 2.3 Remove severity badges such as `MEDIUM` from popup rendering.
- [x] 2.4 Reduce each annotation body to title and summary only.
- [x] 2.5 Remove reaction reasoning, evidence preview cards, and event-detail button from the quick popup preview.
- [x] 2.6 Keep UI text in Vietnamese and avoid adding implementation-detail copy.

## 3. Verification

- [x] 3.1 Run targeted lint for market chart files.
- [x] 3.2 Run `pnpm typecheck`.
- [x] 3.3 Run `pnpm build`.
- [x] 3.4 Run `openspec validate --changes refine-market-chart-annotation-popup-surface`.
- [x] 3.5 Smoke test or visually inspect `/market-charts` with marker positions near chart edges when authenticated chart data is available; otherwise document the blocker. Blocked locally because this session does not have an authenticated Clerk workspace/browser chart fixture to inspect marker edge cases.
