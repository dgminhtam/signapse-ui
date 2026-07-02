## Context

Market chart annotation popups currently act as a compact event preview: metadata, title, and summary. The backend annotation contract now provides `topMarketReaction.outcome`, with fields for anchor/evaluation prices, realized return, actual direction, alignment, and evaluation timestamps. The chart already uses `topMarketReaction` as the primary reaction source.

## Goals / Non-Goals

**Goals:**

- Map the nested outcome object without changing marker placement or grouping.
- Show a compact outcome section directly below an annotation summary when `topMarketReaction.outcome` exists.
- Keep the popup readable in the existing compact surface.

**Non-Goals:**

- Do not render the full `marketReactions[]` list in the chart popup.
- Do not add outcome markers, lines, overlays, or chart annotations.
- Do not show reaction reasoning or evidence blocks in the popup.
- Do not change event detail market reaction cards.

## Decisions

- Use `topMarketReaction.outcome` only.
  Alternative considered: fall back to `marketReactions[0].outcome`. Rejected because the previous top-reaction change intentionally treats null `topMarketReaction` as no primary reaction.

- Render outcome as a small section under each annotation summary.
  Alternative considered: add badges to the top metadata row. Rejected because return, actual direction, and evaluation price are outcome details, not marker metadata.

- Keep the field set short: realized return, alignment, actual direction, evaluation price/time, and optional evaluated-at metadata.
  Alternative considered: render anchor price/time as equal metrics. Rejected because the selected chart marker already provides anchor context and the popup must stay compact.

- Use existing localization and number/date formatters.
  Alternative considered: custom chart-specific formatting helpers. Rejected unless implementation needs one tiny local helper for readability.

## Risks / Trade-offs

- `realizedReturn` scale may be ambiguous between decimal and percent -> confirm backend scale before implementation or mirror the established backend contract exactly.
- Popup height can grow for grouped markers -> keep the outcome section compact and allow existing popup body scroll containment to handle overflow.
- Outcome values can be partially missing -> omit missing fields instead of rendering placeholder copy.
