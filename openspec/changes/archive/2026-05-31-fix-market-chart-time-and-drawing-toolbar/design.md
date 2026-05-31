## Context

The market chart screen uses a Signapse-owned workbench around a KLineChart canvas adapter. Candle and annotation data arrives from the backend, then the adapter and annotation helpers normalize timestamps through the backend `time` field. The current helpers assume every array item is present before reading `.time`, so a malformed backend item or transient frontend merge artifact can crash the chart.

The drawing toolbar added in the earlier drawing change is rendered as an absolute element inside the chart plot. This keeps the toolbar visually chart-local, but it covers candles and shares the same interaction plane as the chart canvas and annotation markers. The user now wants a dedicated tool area that pushes the chart to the right instead of overlaying the plot.

## Goals / Non-Goals

**Goals:**

- Prevent runtime crashes caused by reading `.time` from undefined, null, or malformed candle and annotation items.
- Keep candle and annotation normalization deterministic: valid data remains sorted, de-duplicated, and renderable; invalid items are ignored.
- Move drawing controls into a chart-local side rail that does not overlap the chart canvas.
- Preserve existing top toolbar controls, annotation markers, drawing commands, fullscreen, screenshots, and lazy history behavior.
- Keep all KLineChart-specific behavior inside the market chart canvas adapter boundary.

**Non-Goals:**

- Do not add drawing persistence, undo/redo, style editing, or `@klinecharts/pro`.
- Do not change backend API contracts or add new data fields.
- Do not add manual `from`/`to` controls or change route query state.
- Do not redesign the full market chart workstation beyond the bug fix and drawing toolbar placement.

## Decisions

### Sanitize chart collections before reading `time`

The chart code should introduce narrow local guards for candle and annotation items before any helper reads `.time`. Guards should live close to the existing market chart normalization helpers so invalid entries are dropped at the adapter/helper boundary rather than being handled repeatedly in render code.

For candles, normalization should filter to entries with a usable `time` and numeric OHLC fields before timestamp conversion and de-duplication. For annotations, merge and grouping should filter to entries with a stable id and valid time before sorting, grouping, or marker placement.

Alternative considered: rely only on Zod response validation. That catches malformed backend responses but does not protect against transient local array holes, partial lazy-merge artifacts, or future callers that pass already-parsed arrays.

### Keep invalid data invisible rather than fatal

Invalid candle or annotation items should be omitted from chart rendering. The UI should not show placeholder candles, fake markers, or technical error copy for a single bad item when enough valid data remains to render the chart.

If all candles are invalid after normalization, existing no-data/error state behavior should handle the chart state instead of rendering a broken chart instance.

### Convert the drawing toolbar into a side rail

The drawing toolbar should move from `absolute left-* top-*` placement to a normal flex child inside the chart surface body:

```text
chart surface
├─ top toolbar
├─ body
│  ├─ drawing rail
│  └─ chart viewport
└─ annotation/freshness footer
```

The rail remains chart-local and independent from the top asset/timeframe toolbar, but it no longer overlays candle content. The chart viewport should use `min-w-0 flex-1` so it resizes to the remaining width. Fullscreen mode should keep the same body split, with the viewport growing vertically and horizontally.

Alternative considered: keep the toolbar overlay but add padding/offset to the chart. That still leaves click layering and screenshot/annotation-popup positioning more fragile than a real layout split.

### Preserve shadcn composition and chart command boundaries

The side rail should reuse the existing shadcn wrappers already used by the toolbar (`Button`, `Toggle`, `ToggleGroup`, `Tooltip`, `Separator`, `AlertDialog`). The workbench should continue owning toolbar UI state while the canvas adapter owns KLineChart overlay commands through `MarketChartCanvasHandle`.

The toolbar should stop relying on overlay z-index to be clickable. Any click handling used to close annotation popups should not accidentally swallow drawing control actions.

## Risks / Trade-offs

- Side rail reduces horizontal chart width slightly -> Keep the rail compact, collapsible, and `shrink-0`; the chart still receives all remaining width and no longer loses content underneath an overlay.
- Filtering invalid data could hide a backend issue -> Keep filtering scoped and deterministic, and rely on existing action validation/error handling for truly invalid responses.
- KLineCharts beta overlay behavior can still reject a tool -> Keep the existing command failure path that rolls back active tool state and shows a toast.
- Fullscreen layout can drift after moving the toolbar -> Apply the same body split in fullscreen and trigger chart resize after fullscreen changes.

## Migration Plan

1. Add candle and annotation item guards near the existing normalization helpers.
2. Apply guards in candle normalization, KLine data creation, lazy older candle merge, annotation merge, and annotation grouping.
3. Move the drawing toolbar from absolute overlay placement to a dedicated side rail in the chart surface body.
4. Ensure the chart viewport uses remaining width and resizes after layout/fullscreen changes.
5. Run OpenSpec validation, typecheck, lint, and static review for unsafe `.time` reads and toolbar overlay classes.

## Open Questions

- None for this fix. Future drawing persistence and advanced workstation tools remain separate proposals.
