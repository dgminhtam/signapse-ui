## Context

The market chart workbench already uses KLineChart with lazy history loading, live SSE candle updates, annotation markers, drawing tools, and a compact bottom status rail. Recent usage surfaced four related UX stability issues: the chart canvas keeps a fixed height and leaves blank vertical space on large screens, annotation popups can be clipped or look visually inconsistent with marker colors, the chart has no compact marker color legend, and live candle updates currently reset chart data which can move the user's viewport back to realtime.

The affected implementation is concentrated in the market chart workbench/canvas/skeleton files. No backend contract change is needed.

## Goals / Non-Goals

**Goals:**

- Let the chart surface use available viewport height while preserving the current cardless workspace and chart frame rhythm.
- Keep mounted and page-level skeletons close to the final chart layout.
- Update live candles without calling chart-wide reset on every tick.
- Keep annotation colors consistent across chart markers, popup affordances, and the new legend.
- Keep annotation popup content readable near chart edges with clean internal scrolling.

**Non-Goals:**

- Do not change market chart backend APIs or SSE payloads.
- Do not add manual `from` or `to` controls.
- Do not redesign drawing tools, indicators, or top toolbar behavior.
- Do not add new annotation detail fields or replace the existing event drawer/detail flow.
- Do not implement full realtime auto-follow preferences beyond preventing unwanted viewport jumps.

## Decisions

### Use viewport-aware surface sizing

The chart shell should own a viewport-aware height, with the internal chart area using `flex-1 min-h-0` so KLineChart receives the actual available space. This matches the graph-style workspace pattern better than a fixed `h-[520px]` chart.

Alternative considered: only increase the fixed height. That would improve one screen size but still fail on tall or short viewports.

### Use KLineChart realtime data loader flow for live candles

Live candle changes should not call `resetData()`. KLineChart v10 exposes `DataLoader.subscribeBar`, and internally uses that callback as an `update` data path. The canvas should register a subscribe callback and push converted live candles through that path when SSE delivers a current candle.

Alternative considered: preserve visible range before `resetData()` and restore it after reload. That is more fragile, can still flicker, and treats a realtime tick like a full dataset replacement.

### Share annotation color semantics

Annotation marker color mapping should be centralized so chart marker, popup dot/pulse, footer/legend dot, and future annotation affordances use the same direction or reaction treatment.

Alternative considered: duplicate the same mapping in workbench and canvas. That is faster initially but likely drifts again.

### Keep legend compact and contextual

The annotation legend should live between the chart canvas and footer rail. It should be visible only when the annotation layer is enabled and annotation markers are present, so the screen does not gain permanent explanatory copy when there is nothing to explain.

Alternative considered: add legend into the top toolbar. That competes with primary controls and makes the toolbar busier.

### Separate popup frame from popup scroll body

The popup frame should stay visually intact with `overflow-hidden`, while event content scrolls in an inner body. Placement should clamp inside the chart surface or viewport instead of relying only on left/right flipping.

Alternative considered: use a global Dialog/Sheet for all annotation clicks. That would solve clipping, but it changes interaction weight and duplicates the existing quick popup/detail split.

## Risks / Trade-offs

- KLineChart subscribe lifecycle mismatch -> keep the callback ref local to the current chart identity and clear it when asset/timeframe/reset identity changes.
- Live candle update still shifts when the user is at the newest edge -> acceptable if it follows realtime only when naturally at the right edge; the main requirement is no reset while reviewing history.
- Viewport-aware height can be too tall in unusual app chrome sizes -> use min/max or calc values aligned with the app header rather than raw `100vh`.
- Popup clamping can place the popup slightly farther from the marker near edges -> prefer readable popup over exact anchor proximity.
- Legend adds one more row under the chart -> keep it compact and hide it when annotations are disabled or absent.
