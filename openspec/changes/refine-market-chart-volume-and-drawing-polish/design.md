## Context

Market chart candles accept optional volume from both historical candle responses and live candle responses. The current canvas always creates a dedicated `VOL` indicator pane, so assets without volume still show a volume area and indicator labels that can read like zero values. This is especially misleading for instruments where provider volume is unavailable or not meaningful.

The drawing toolbar is already a separate left rail beside the chart. Its collapse control adds state and an extra icon but does not solve a strong layout problem. Drawing overlays are styled through KLineChart overlay styles in the canvas adapter, while KLineChart text styling is partially customized and can still fall back to vendor defaults in some chart-owned text surfaces.

## Goals / Non-Goals

**Goals:**

- Render the volume pane only when there is usable numeric volume data.
- Keep missing volume distinct from zero volume.
- Preserve candle, annotation, lazy history, live SSE, indicator, screenshot, fullscreen, and route behavior.
- Simplify the drawing rail by removing collapse state and the collapse button.
- Make drawing overlays visually lighter and less dominant over candles.
- Make KLineChart-owned text use the Signapse app font more consistently.

**Non-Goals:**

- Do not change backend API contracts or request parameters.
- Do not synthesize or backfill missing volume values.
- Do not redesign the top market chart toolbar.
- Do not add new drawing tools or persist drawings.
- Do not replace KLineChart or introduce `@klinecharts/pro`.
- Do not change global shadcn tokens or app font configuration.

## Decisions

### Render volume as an optional chart pane

Introduce a small market chart helper that checks whether candles contain at least one finite numeric `volume`. The workbench can derive a `showVolumePane` boolean from loaded historical candles and the latest known live candle. The canvas uses that boolean to build the KLineChart layout with or without the `VOL` indicator pane.

Alternative considered: always keep the volume pane and display an unavailable note. This still wastes chart vertical space and keeps visual noise for assets that do not have volume.

### Do not treat missing volume as zero

Keep the current data mapping behavior where `volume` is only passed to KLineChart when it is a number. Do not coerce `null`, `undefined`, or invalid values to `0`. This keeps provider absence separate from an actual zero-volume candle.

Alternative considered: fill missing volume with zero so KLineChart always has a complete volume series. This is rejected because it creates false data and reinforces the current user confusion.

### Avoid live tick rebuild churn

If live data introduces usable volume after the historical chart was initially rendered without a volume pane, the UI may update a volume-availability boolean and rebuild the chart once for the layout boundary. The implementation should not put the raw `liveCandle` object into the chart initialization dependencies just to manage volume, because that would rebuild the KLineChart instance on every live update.

### Keep chart styling in the canvas adapter

Extend the existing deterministic chart style helper to include remaining KLineChart text surfaces that can use vendor default fonts, such as overlay text and indicator last value mark text. Drawing overlay stroke sizes should be reduced in the same adapter-local style helper so KLineChart-specific details do not leak into workbench UI code.

### Remove drawing collapse state

Remove `isCollapsed` from drawing state, reset logic, and toolbar UI. The toolbar should always render the drawing tools and utility controls because the rail is already compact and sits outside the plot area.

Alternative considered: keep collapse state but hide the button by default. This leaves dead state and future confusion for little value.

## Risks / Trade-offs

- [Risk] A symbol with sparse volume may show a volume pane if only one candle has volume. -> Mitigation: this is preferable to hiding real provider volume; the pane is data-aware, not density-aware.
- [Risk] Rebuilding the chart when volume availability flips can reset transient drawing state. -> Mitigation: only allow the rebuild on the boolean boundary rather than on every live candle; keep drawing reset behavior consistent with existing chart reset paths.
- [Risk] Fractional drawing line widths may render differently across displays. -> Mitigation: if fractional widths are not visibly supported, keep size `1` but reduce drawing color contrast/opacity in the palette.
- [Risk] Removing collapse is a UI behavior removal. -> Mitigation: the rail remains outside the plot, compact, and always available; no saved user preference exists for collapse.
