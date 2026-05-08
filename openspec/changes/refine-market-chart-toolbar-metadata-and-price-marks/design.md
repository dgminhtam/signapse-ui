## Context

`/market-charts` currently renders a small absolute pill inside the chart plot area with symbol, timeframe, and updated time. After the chart gained annotations and lazy history, this in-chart metadata competes with KLineChart's own legend/crosshair area and can obscure candles or event markers. The same screen already has an asset selector and timeframe selector in the toolbar, so the in-chart label repeats information that is available elsewhere.

KLineChart styling is centralized in `createChartStyles()` inside `MarketChartCanvas`. The chart already resolves the app font family from `--font-sans` and applies it to tooltip, axis, and crosshair text, but it does not apply that font to `candle.priceMark.last.text`. KLineChart also shows high/low price labels by default unless `candle.priceMark.high.show` and `candle.priceMark.low.show` are disabled.

## Goals / Non-Goals

**Goals:**

- Remove metadata from the chart plot area.
- Show only freshness metadata in the trailing toolbar, near the refresh action.
- Avoid repeating symbol and timeframe in the metadata because those values are already visible in controls.
- Keep the toolbar composition aligned with existing `AppListToolbarTrailing` rhythm.
- Apply the system font family to the last price mark text.
- Hide high and low price marks while keeping the last price mark visible.

**Non-Goals:**

- Do not add a chart header row inside the chart surface.
- Do not reintroduce a right-side stats rail, main Card shell, or descriptive body copy.
- Do not add indicators, drawing tools, screenshot, fullscreen, or TradingView-style toolbar controls.
- Do not change chart data loading, annotations, lazy history, route state, backend API, or global theme tokens.
- Do not include the previously discussed dashed grid change in this scope unless a separate change requests it.

## Decisions

### 1. Put freshness metadata in trailing toolbar as subdued text

The implementation should remove the absolute `chartContextLabel` element from `ChartSurface` and render a small text item in `AppListToolbarTrailing`, after or near the refresh control.

Target copy:

```text
Cập nhật 10:17 07/05/2026
```

Do not include symbol or timeframe in this text.

Rationale: Toolbar controls already identify the asset and timeframe. Keeping only freshness metadata reduces duplication and frees the plot area.

Alternative considered: create a chart header row above the canvas. Rejected because it adds chrome inside the chart surface and repeats the card-header feeling the screen has been moving away from.

### 2. Keep freshness metadata non-interactive and low emphasis

Freshness metadata should use semantic muted text, such as `text-xs text-muted-foreground`, and should not be a `Badge`, button, pill, border, or focusable element.

Rationale: The text is status context, not an action. A bordered badge would compete with primary controls and reintroduce visual noise.

Alternative considered: place the update time inside the refresh button label. Rejected because the button label would become long and unstable across refresh states.

### 3. Scope KLineChart price mark styling to the local style object

`createChartStyles()` should set:

```text
candle.priceMark.last.text.family = fontFamily
candle.priceMark.high.show = false
candle.priceMark.low.show = false
```

It should not set `candle.priceMark.show=false` because the last price marker remains useful for chart scanning.

Rationale: This keeps vendor styling contained in the chart adapter and avoids global token changes.

Alternative considered: hide all price marks. Rejected because the last price marker is a useful current-price anchor.

## Risks / Trade-offs

- [Toolbar becomes crowded on small screens] -> Use subdued text that can wrap below controls or shrink naturally in the existing responsive toolbar layout.
- [Freshness metadata disappears during loading] -> Keep current loading button feedback; freshness text can render only when successful chart data has a valid `to`.
- [Price mark font still differs in weight/size] -> Set the family first; only adjust `weight` or `size` if implementation review shows mismatch remains.
- [High/low labels were useful for some users] -> Crosshair, y-axis, and candle tooltip still provide exact values without persistent high/low labels cluttering the chart.

## Migration Plan

1. Remove the in-chart metadata pill and related symbol/timeframe label helper if no longer needed.
2. Add a small freshness label in `AppListToolbarTrailing` using existing `data.to` and date formatting.
3. Update KLineChart local styles for last price mark font and high/low price mark visibility.
4. Run targeted market chart lint, typecheck, build, and OpenSpec validation.
5. Smoke check `/market-charts` visually when an authenticated chart session is available.

## Open Questions

- No blocking open questions. The metadata location and price mark behavior are already product decisions in this change.
