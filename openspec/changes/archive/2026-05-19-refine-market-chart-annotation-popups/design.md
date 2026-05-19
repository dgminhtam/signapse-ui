## Context

The current annotation implementation can fetch backend `annotations[]`, group annotations by chart time, render chart notification markers, and show annotation detail in a right-side panel. In practice, the markers can be visually quiet against the chart grid and candlesticks, while the right-side panel separates the detail from the exact chart point the user clicked.

The desired interaction is closer to a market-event notification layer: the chart shows a noticeable event dot, and clicking that dot opens event detail near the chart context. The UI must still avoid implying trade recommendations, so marker shape should not look like buy/sell advice.

## Goals / Non-Goals

**Goals:**

- Make annotation markers immediately noticeable on the candlestick chart.
- Use a notification-style red dot treatment rather than directional arrows.
- Provide a marker-click popup for quick event detail inspection.
- Keep direction, severity, confidence, reaction, evidence, and event link in the popup instead of encoding them as marker shape.
- Preserve keyboard-accessible annotation inspection outside canvas-only click behavior.
- Respect reduced-motion preferences.
- Keep the market chart workspace minimal and chart-first.

**Non-Goals:**

- Do not change the backend annotation contract or add annotation endpoints.
- Do not add buy/sell/trade recommendation semantics.
- Do not add technical indicators, drawing tools, realtime updates, or lazy historical loading.
- Do not edit shadcn primitives under `components/ui`.
- Do not add a persistent right-side annotation detail panel as the primary interaction.

## Decisions

### Use notification dots instead of directional arrows

All annotation markers should use a red notification dot as the base visual. Direction should no longer determine marker shape. Grouped markers can show a compact count, and selected markers should show a stronger active state.

Rationale: a red notification dot communicates "there is an event here" without suggesting the marker is a buy or sell signal. It also creates a consistent scan target across event types.

Alternative considered: keep bullish/bearish arrows but increase size. Rejected because arrows can imply trading advice and still fragment the visual language.

### Make marker prominence explicit

The marker should stand out through size, contrast, and a subtle pulse/ripple. The pulse should be restrained and should stop or become a static ring when `prefers-reduced-motion` is active. High severity or selected markers can use stronger emphasis, but the chart should not become visually noisy.

Rationale: the user needs to notice annotations quickly, but chart readability remains the primary task.

Alternative considered: add long labels on markers. Rejected because labels would clutter dense chart regions and compete with price data.

### Open detail in a chart-local popup

Clicking a marker should open a compact popup inside the chart surface near the selected chart point when placement data is available. The popup should include the most decision-useful event fields:

- direction and confidence badges
- event time
- title
- short summary or reaction reasoning
- evidence preview
- event detail link when available

The popup should be dismissible and should not permanently consume the right rail.

Rationale: the detail belongs near the selected chart point, so users keep spatial context. The right rail is better reserved for market stats or secondary summaries.

Alternative considered: keep right-side annotation detail panel. Rejected because it separates the event detail from the clicked marker and makes chart reading feel split.

### Use responsive fallback for small screens

On narrow screens, the selected annotation detail can open in an existing `Sheet` or a below-chart detail region instead of an anchored popup. The popup must not overflow the viewport or hide critical controls.

Rationale: canvas-anchored popup placement is fragile on small touch screens. A sheet or below-chart detail surface gives predictable reading space.

Alternative considered: always use a modal dialog. Rejected because it is heavier than needed on desktop and interrupts chart scanning.

### Preserve accessible annotation inspection

Canvas marker click cannot be the only way to inspect annotations. The annotation layer should retain an accessible list, count control, or compact event launcher outside the canvas so keyboard users can open the same detail view.

Rationale: chart canvas markers are visual primitives, not standard DOM controls.

Alternative considered: rely only on marker hit testing. Rejected because it would fail keyboard and assistive technology workflows.

### Keep the implementation local to the chart feature

Because `Dialog` and `Popover` are not currently installed, the desktop popup can be a local absolute overlay styled like a compact card inside the chart surface. Existing `Sheet` may be used for mobile. This should not require global UI primitive changes.

Rationale: a marker popup is chart-specific because its placement depends on chart mouse/crosshair coordinates. A general shadcn popover needs a DOM trigger, which chart markers do not provide.

## Risks / Trade-offs

- [Popup placement near chart edges] -> Clamp popup coordinates inside the chart surface and prefer below/above placement based on available space.
- [Motion distraction] -> Keep pulse subtle and disable animation with `prefers-reduced-motion`.
- [Canvas hit-test inconsistency] -> Keep accessible event rows or a count launcher outside the canvas as a reliable fallback.
- [Grouped event ambiguity] -> Show count on grouped markers and list all grouped annotations inside the popup.
- [Visual over-alerting] -> Use red consistently for "event exists", but reserve stronger pulse or selected ring for selected/high-priority states.
- [Mobile overflow] -> Use Sheet or below-chart detail surface at small widths instead of anchored popup.

## Migration Plan

1. Keep existing annotation fetching, grouping, and layer toggle behavior.
2. Replace direction marker mapping with notification-dot marker mapping.
3. Add a chart-local selected marker state that captures the clicked marker id and approximate click point.
4. Replace the right-side annotation detail panel with a chart-local popup on desktop.
5. Reuse the same detail content in a mobile-friendly sheet or below-chart detail fallback.
6. Keep or compact the accessible annotation rows/count control outside the canvas.
7. Verify marker visibility, popup placement, grouped marker behavior, reduced-motion behavior, keyboard access, and responsive fallback.

## Open Questions

- No blocking open questions.
- Implementation can decide whether the first version uses a custom HTML overlay dot layer or active chart-engine overlays plus an HTML popup, as long as the resulting marker is visibly notification-like and clickable.
