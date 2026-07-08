## Context

Market Charts already loads candles, annotation markers, lazy older history, and live SSE data for a selected watchlist asset/timeframe. Economic calendar entries now have a chart-specific endpoint, `GET /market-charts/economic-calendar-events`, which accepts `assetId`, `from`, and `to`, uses a half-open `[from, to)` range, enforces a maximum 366-day range, and performs backend asset relevance matching.

The UI needs a separate calendar layer because economic calendar events are not the same data model as market chart annotations. They have scheduled macro metadata, optional values, localized `description`, and detail navigation through `/economic-calendar/{id}`.

## Goals / Non-Goals

**Goals:**
- Add a default-on Calendar layer beside the existing Events layer.
- Load calendar events through the authenticated market chart API action with the selected asset and a valid time range.
- Display candle-mapped calendar entries in a dedicated lane above the existing legend/footer.
- Keep future events without matching candles visible in the quick list only.
- Draw a red vertical guide line when a calendar event marker is hovered or focused.
- Let users open the existing economic calendar detail page for an event.

**Non-Goals:**
- Do not add a new economic calendar quick-detail drawer.
- Do not change backend asset relevance logic or add FE asset-type filtering.
- Do not add manual `from`/`to` chart controls or new route params.
- Do not extend the candle range only to show future calendar markers on the chart.

## Decisions

### Use a separate calendar event model
Add `MarketChartEconomicCalendarEventRequest` and `MarketChartEconomicCalendarEventResponse` next to the existing market chart definitions, plus a dedicated server action. Reusing the annotation model would hide contract differences such as `impact`, `currencyCode`, economic values, `status`, and `contentAvailable`.

Alternative considered: convert calendar events into annotation-shaped items. Rejected because it would create fake annotation fields and make detail/navigation behavior unclear.

### Fetch calendar events in the workbench data flow
Load calendar events in the same workbench path that loads candles and annotations. Initial load should run candles, annotations, calendar events, and live stream setup as the chart becomes ready; lazy older history should request calendar events for the older candle window when the Calendar layer is enabled.

Calendar failure should not fail candle rendering. It should behave like supporting data: show concise feedback and keep the chart usable.

### Use a calendar-specific range helper
Initial calendar range should favor actionable context instead of the full candle range:
- `from = max(candleRequest.from, now - 180 days)`
- `to = min(max(candleRequest.to, now + 14 days), from + 366 days)`

Lazy older calendar requests should cover the older candle request window, split into 366-day-or-smaller chunks when the candle window exceeds the backend maximum. This matters for `1w` and `1mo` history windows.

Future events returned for `now..now+14d` should stay in the quick list if no candle can anchor them. The chart should not create future candle space just to draw those markers.

### Render a lane, not chart-native overlays
Calendar markers should render as React overlay controls positioned from chart pixel coordinates, matching the current annotation marker approach. The dedicated lane should sit above the existing legend/footer so macro events are visually separated from price-reaction annotations.

Use `time` for placement. A marker is chart-visible only when it can be mapped to a loaded candle time; otherwise it remains list-only.

### Keep detail navigation canonical
Calendar event detail should link to `/economic-calendar/{id}` with locale-preserving navigation. This avoids expanding `LocalEntityQuickDetailDrawer` to a third entity type before the product needs it.

## Risks / Trade-offs

- Calendar data can be wider than candle windows for long timeframes -> clamp/split requests to stay within 366 days.
- Future events may surprise users if they do not appear as chart markers -> keep them in the quick list and label them with time/status.
- More controls in the toolbar can feel crowded -> reuse the existing `Toggle` treatment and short labels (`Calendar` / `Lịch kinh tế`).
- Overlay marker alignment can drift on scroll/zoom/resize -> reuse the existing scheduled marker-position update path.
