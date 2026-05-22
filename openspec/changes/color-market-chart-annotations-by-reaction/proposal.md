## Why

Market chart annotation markers currently read as a single alert color, so users cannot quickly distinguish positive, negative, neutral, or mixed market reactions while scanning the chart. Coloring markers by reaction direction makes the annotation layer more informative without adding extra labels over the candlestick canvas.

## What Changes

- Map annotation marker color to the backend market reaction direction.
- Use green treatment for positive / `BULLISH` reactions.
- Use red treatment for negative / `BEARISH` reactions.
- Use amber treatment for neutral / `NEUTRAL` reactions so neutral events remain visible without implying positive or negative direction.
- Use a clear fallback treatment for `MIXED` or missing direction without crashing or rendering misleading color.
- Keep notification-style dot markers, grouping behavior, popup content, chart data loading, and annotation API contracts unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-annotation-markers`: Refine annotation marker visual treatment so marker color reflects market reaction direction.

## Impact

- Affected UI: `app/[lang]/(main)/market-charts/market-chart-canvas.tsx` for chart marker and pulse color mapping.
- Affected helper logic: annotation grouping already exposes dominant direction and may be reused for marker color selection.
- No backend API, route state, chart engine, dependency, or localization contract change is expected.
