## Context

Market chart annotation markers currently open a chart-local popup inside `ChartSurface`. The surface clips its children with `overflow-hidden` to preserve the rounded chart shell, so a popup opened near the chart edge can be cut off. The popup detail also nests another bordered card and renders severity, confidence, reaction reasoning, evidence previews, and event links, which is too dense for a quick chart-context inspection surface.

## Goals / Non-Goals

**Goals:**

- Keep annotation detail as a lightweight chart-context popup rather than a full modal.
- Prevent the desktop popup from being clipped by chart canvas overflow.
- Keep the popup visually anchored to the selected marker while avoiding chart-edge overflow.
- Simplify content so users can quickly read the event without parsing many metadata chips or nested cards.
- Preserve keyboard-accessible annotation controls and the mobile/below-chart fallback.

**Non-Goals:**

- Do not change marker grouping, marker rendering, KLineChart data mapping, or backend DTOs.
- Do not add a new floating-positioning dependency.
- Do not add a rich event reader inside the popup.
- Do not remove the existing event detail route itself; only stop surfacing the route button inside this quick popup.

## Decisions

### Split clipping from popup layering

The chart shell should keep rounded clipping only around the actual chart/canvas visual region. The annotation popup layer should render outside that clipped wrapper but still inside the chart surface stacking context.

Rationale: raising `z-index` cannot solve clipping caused by `overflow-hidden`. Splitting the layers keeps the polished rounded chart frame while letting the popup float.

Alternative considered: remove all overflow clipping from the whole chart surface. Rejected because chart/canvas internals can bleed past rounded borders.

### Use simple collision-aware placement

Popup placement should derive from the selected marker point but choose a side based on available room:

- Prefer opening to the right/down from the marker when there is room.
- Flip left when the marker is too close to the right edge.
- Clamp top/bottom inside the chart surface.
- Cap popup height with internal scrolling if the content still exceeds available height.

Rationale: this is enough for the current popup size and avoids pulling in a floating UI dependency for one local chart surface.

Alternative considered: use a modal dialog. Rejected because the user loses spatial context with the chart marker.

### Treat popup as a preview, not a full event detail reader

The popup should show:

- Direction badge.
- Confidence badge when present.
- Event time.
- Group count when more than one annotation shares the marker.
- Each annotation title.
- Each annotation summary when present.

The popup should not show severity badges such as `MEDIUM`, reaction reasoning cards, evidence cards, or the event detail button in this change.

Rationale: the annotation marker already says "there is an event here"; the popup should answer "what happened?" quickly. Rich evidence and navigation can be revisited as a separate detail pattern if users need it.

Alternative considered: keep all details but reduce styles. Rejected because the information volume, not only the visual treatment, is the core source of noise.

## Risks / Trade-offs

- [Users lose quick access to event detail link] -> Accept for now because this surface is explicitly a preview; a future richer reading action can be proposed if needed.
- [Popup still overflows on very small heights] -> Keep existing mobile/below-chart fallback and add `max-height` plus internal scroll on desktop.
- [Placement math becomes brittle] -> Keep the first implementation simple and local; verify with markers near left/right/top/bottom chart edges.

## Migration Plan

1. Refactor chart surface markup so chart clipping and popup layer are separate.
2. Replace the current clamp-only popup style helper with a side-aware placement helper.
3. Simplify annotation detail JSX to remove nested card chrome, severity, reaction reasoning, evidence, and event link.
4. Move confidence into the top metadata row with direction/time/group count.
5. Verify popup behavior on edge markers, grouped annotations, keyboard controls, mobile fallback, lint/typecheck/build, and OpenSpec validation.

## Open Questions

- No blocking open questions.
