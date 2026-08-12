## Context

Market charts currently derive warm annotation groups whenever the annotation layer is enabled, regardless of the selected timeframe. The canvas maps each warm episode to a clipped HTML rectangle bounded horizontally by `periodStart`/`periodEnd` and vertically by loaded candle highs/lows. On short intraday windows, a longer episode can therefore cover most of the candle pane.

The same rectangle is rendered as the popover trigger button. Its hit area matches the full painted band, so a pointer drag that begins over the band targets the button instead of the KLineCharts interaction surface. The existing design intentionally keeps warm bands outside persisted drawing state and outside custom KLineCharts overlays, so the change should preserve that boundary.

## Goals / Non-Goals

**Goals:**

- Limit warm episode range bands to the timeframes where period-level context is readable: `1d` and `1w`.
- Let chart pan, scroll, and zoom interactions pass through the painted warm-band area.
- Preserve pointer, touch, and keyboard access to the existing warm episode detail preview through a compact trigger.
- Reuse current annotation grouping, selection, popup content, direction colors, localization, and responsive fallback behavior.

**Non-Goals:**

- Do not add a separate warm-layer toggle.
- Do not render warm bands on `4h` or `1mo` conditionally based on episode duration or viewport coverage.
- Do not add nested warm-event ticks, semantic-zoom heuristics, or overlap layout logic.
- Do not migrate warm bands into KLineCharts custom overlays or persisted drawing state.
- Do not change the backend annotation contract or candle request windows.

## Decisions

### 1. Gate warm-band derivation at the workbench boundary

Define the supported warm-band timeframe policy beside the market-chart timeframe/view-model logic and return no warm annotation groups unless the selected timeframe is `1d` or `1w`. This prevents unnecessary band coordinate work and ensures selection lookup receives the same visible warm-group set as the canvas.

Alternative considered: pass all warm groups into the canvas and hide them during rendering. This leaves hidden groups participating in selection state and performs avoidable coordinate calculations, so it is not preferred.

### 2. Separate the visual band from its inspection trigger

Render the full translucent range as a non-interactive HTML element with `pointer-events: none`. Render a compact button associated with the same group near the visible band's upper edge, constrained to the candle pane, and use that button as the existing controlled popover trigger.

The visual element keeps direction color, selected-state emphasis, and viewport alignment. The trigger reuses the existing localized accessible name, exposes visible focus, meets the repository's minimum target-size guidance, and remains available to pointer, touch, Enter, and Space activation. The full band is no longer clickable, which is an intentional trade-off to preserve chart manipulation.

Alternative considered: forward pointer events from the full button to KLineCharts or recreate drag behavior with chart scrolling APIs. That would duplicate gesture thresholds, pointer capture, touch behavior, and chart-engine semantics. Native CSS hit-testing plus a small explicit trigger is simpler and more robust.

Alternative considered: convert the warm range into a KLineCharts custom overlay and use figure event-ignore behavior. The existing HTML range already owns responsive popover integration and is explicitly separate from drawing overlays; migration would expand scope without being required to fix the defect.

### 3. Keep the timeframe policy explicit

Use a fixed allowlist containing `1d` and `1w`. Intraday timeframes remain focused on candle detail and hot-event point markers. `1mo` remains excluded because the current warm episode contract does not establish multi-month duration semantics and monthly candles are too coarse for the existing price-bounded range treatment.

Alternative considered: dynamically hide or restyle a band when it exceeds a percentage of the viewport. That introduces appearance changes during zoom and pan, requires threshold tuning, and is unnecessary for the agreed initial policy.

### 4. Preserve existing selection and responsive behavior

Activating the compact trigger continues to set `selectedAnnotationGroupId`; the existing controlled popover and mobile detail fallback remain responsible for showing the episode summary, outcome, and nested events. Timeframe changes already clear annotation selection, so hidden warm groups do not require a new state model.

## Risks / Trade-offs

- [Risk] Users can no longer click anywhere inside a warm band to open details. → Mitigation: provide a clearly visible, localized, focusable trigger attached to each visible band.
- [Risk] Closely overlapping warm episodes may place triggers near one another. → Mitigation: keep triggers compact and preserve the current group z-order; add overlap layout only if production data demonstrates an accessibility or selection problem.
- [Risk] Warm context is unavailable on `4h` or `1mo` even when a particular episode might be useful there. → Mitigation: treat `1d`/`1w` as an explicit initial product policy and revisit only with episode-duration evidence.
- [Risk] Pointer pass-through could regress if interactive classes are later restored to the visual rectangle. → Mitigation: keep the visual and trigger as separate elements and include a deterministic review/static check plus browser interaction verification when an authenticated environment is available.

## Migration Plan

1. Add the explicit timeframe eligibility policy and apply it before deriving warm groups.
2. Split each rendered warm band into a pointer-transparent visual surface and compact inspection trigger while retaining the current controlled selection flow.
3. Verify lint, typing, OpenSpec validity, supported/unsupported timeframe behavior, and chart interaction through the painted band.
4. Roll back by reverting the timeframe gate and split hit-target rendering; no stored data or backend migration is involved.

## Open Questions

None for implementation. Conditional `4h` or `1mo` support requires a separate product decision backed by real warm episode duration data.
