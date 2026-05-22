## 1. Marker Color Mapping

- [x] 1.1 Add a local annotation marker color mapping based on `MarketChartAnnotationGroup.direction`.
- [x] 1.2 Map `BULLISH` to a green positive marker treatment, `BEARISH` to a red negative treatment, `NEUTRAL` to amber, and `MIXED` to a distinct non-directional treatment.
- [x] 1.3 Add a muted fallback for missing or unknown direction while keeping the marker visible.

## 2. Marker Rendering Integration

- [x] 2.1 Apply the reaction color mapping to marker pulse, dot background, ring, and grouped-count marker treatment.
- [x] 2.2 Preserve existing marker size, selected/high-priority emphasis, grouped count behavior, popup opening, and reduced-motion behavior.
- [x] 2.3 Review popup and accessible fallback content to confirm direction labels remain available and color is not the only information channel.

## 3. Verification

- [x] 3.1 Run `openspec validate color-market-chart-annotations-by-reaction --strict`.
- [x] 3.2 Run `pnpm typecheck`.
- [x] 3.3 Run static code review/search to confirm marker color classes are direction-driven and no backend/API changes were introduced.

User-owned manual QA: verify marker colors visually in light and dark mode with bullish, bearish, neutral, mixed, grouped, selected, and high-priority marker examples.
