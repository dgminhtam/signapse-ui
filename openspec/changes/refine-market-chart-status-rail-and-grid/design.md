## Context

The market chart page now uses KLineChart and a simplified annotation status rail. The chart toolbar contains primary controls, while the chart surface contains the canvas and a bottom annotation rail that currently appears only when the event layer is enabled. The update timestamp is still rendered in the toolbar, which makes it feel like a control status rather than chart metadata.

The KLineChart style contract supports `grid.horizontal.style` and `grid.vertical.style` as `"solid"` or `"dashed"`, with `dashedValue` available on line styles. This lets us reduce grid visual weight without changing chart data or engine behavior.

## Goals / Non-Goals

**Goals:**

- Make chart grid lines dashed for a lighter reading surface.
- Move update-time metadata from the toolbar to the bottom chart status rail.
- Keep the bottom status rail always present so chart layout remains stable.
- Hide event milestone text when the event switch is off, while keeping update metadata visible.
- Keep existing event status labels when the event switch is on.
- Update page-level and chart-level skeletons to mirror the final status rail placement.

**Non-Goals:**

- Do not change backend APIs, query parameters, data loading windows, lazy history loading, or annotation grouping.
- Do not change annotation marker dots, popup content, or popup positioning.
- Do not add a new timeline, event carousel, or hidden overflow menu.
- Do not change global theme tokens or introduce new dependencies.
- Do not remove the event switch; it still controls marker/event visibility.

## Decisions

### 1. Use dashed KLineChart grid lines

Set both `grid.horizontal.style` and `grid.vertical.style` to `"dashed"` and provide a modest dash pattern such as `[4, 4]`.

Rationale: The current solid grid lines are helpful for orientation but compete with candle shapes. Dashed lines preserve structure while reducing perceived density.

Alternative considered: lower grid opacity while keeping solid lines. Rejected because the current styling already derives from the shared border token; using dashed style is more explicit and does not require color token tuning.

### 2. Make the bottom rail the chart metadata zone

Move the update label into the bottom rail and remove it from the toolbar. The rail should use a two-zone layout:

- Leading zone: event status only when event annotations are enabled.
- Trailing zone: update timestamp when candle data has a valid `to` value.

Rationale: The update label describes the data currently displayed by the chart, not a toolbar action. Keeping it in the rail also removes a small alignment burden from the toolbar.

Alternative considered: keep the timestamp in the trailing toolbar. Rejected because it mixes chart metadata with controls and becomes visually disconnected from the chart surface.

### 3. Render the status rail consistently

The status rail should always render below the chart body. When events are disabled, the leading event label should be hidden rather than showing an empty event state.

Rationale: A stable rail prevents chart surface height/radius shifts when users toggle events. It also gives the timestamp a persistent home.

Alternative considered: render the rail only when events are enabled or timestamp exists. Rejected because this can create layout shift and makes the chart surface treatment less predictable.

### 4. Mirror the status rail in skeletons

Page-level skeletons should include the rail cue by default. Chart-level mounted loading should either render an embedded chart body skeleton while the real rail remains below, or otherwise avoid nested/double rails.

Rationale: Skeletons should reflect the final layout to avoid shift. Because the rail is now always part of the chart surface, the loading skeleton needs to reserve that space.

Alternative considered: keep skeletons as-is and let the rail appear after load. Rejected because it undercuts the recent skeleton polish and introduces avoidable movement.

## Risks / Trade-offs

- [Dashed grid style may feel too faint on some themes] -> Use the existing border token and only change the line style, so contrast remains tied to the current shadcn baseline.
- [Always-visible rail adds persistent vertical space] -> The rail is compact and replaces toolbar metadata, so the overall surface becomes more stable rather than heavier.
- [Event switch off could leave an empty leading rail area] -> Use responsive `justify-between` / trailing alignment so the timestamp remains useful without a placeholder event label.
- [Skeleton can accidentally show duplicate rail cues] -> Keep page-level skeleton as a full surface and mounted chart loading as embedded body content with the real rail rendered once.

## Migration Plan

1. Update KLineChart grid style to dashed for horizontal and vertical lines.
2. Pass the formatted update label into the chart status rail instead of rendering it in the toolbar.
3. Render the status rail unconditionally and hide event text when annotations are disabled.
4. Adjust chart body radius so it pairs correctly with an always-present bottom rail.
5. Update skeletons to reserve the status rail and remove the toolbar update placeholder.
6. Verify with targeted lint, typecheck, build, OpenSpec validation, and browser smoke when an authenticated chart session is available.

## Open Questions

- No blocking open questions. The chosen direction is dashed grid plus an always-present status rail that owns chart metadata.
