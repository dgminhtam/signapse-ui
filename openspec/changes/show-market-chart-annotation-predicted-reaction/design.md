## Context

Market chart annotation popups are already shadcn-composed and render each grouped event through `MarketChartAnnotationDetail`. The popup currently reads primary outcome data from `annotation.topMarketReaction?.outcome` and localizes alignment values from BE through dictionary labels.

## Goals / Non-Goals

**Goals:**

- Show each event's annotation date above the event title.
- Add a compact predicted reaction section from `topMarketReaction.direction` before the actual reaction section.
- Make the actual reaction price and time fields easier to compare by rendering anchor-to-evaluation ranges.
- Preserve existing realized return, actual direction, alignment, and evaluated-at outcome details.

**Non-Goals:**

- Do not change annotation grouping, marker coloring, marker placement, or popup shell composition.
- Do not render non-primary `marketReactions[]`, reaction reasoning, or evidence content in this quick preview.
- Do not change the backend annotation contract.

## Decisions

- Reuse the existing annotation detail render path instead of adding a new popup data adapter. This keeps the change scoped to the current event preview component.
- Reuse existing date, number, direction, and alignment formatting helpers where possible. Add only the dictionary keys needed for new labels.
- Render predicted reaction only when `topMarketReaction.direction` is available. Render actual reaction only when at least one formatted outcome field is available.
- Keep `alignment` as BE-provided enum mapped through i18n; unknown or empty values remain hidden instead of showing raw backend strings.

## Risks / Trade-offs

- Missing anchor or evaluation values can make a range incomplete -> render only available values or omit that row when neither side is usable.
- Adding more rows can make multi-event popups taller -> rely on the existing ScrollArea containment instead of changing popup layout.
