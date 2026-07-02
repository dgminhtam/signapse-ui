## Context

Market chart annotation popups render each event through the existing annotation detail path. The current preview can show predicted reaction, actual reaction, and outcome alignment as separate visual signals, which makes a quick comparison harder than necessary.

## Goals / Non-Goals

**Goals:**

- Present prediction and actual outcome in one compact per-event reaction section.
- Use localized direction badges for both predicted and actual direction.
- Keep price movement compact by leaving anchor price neutral, coloring only evaluation price, placing realized return in parentheses, and putting the movement icon at the end.
- Keep the popup concise and omit unavailable fields without placeholder text.

**Non-Goals:**

- Do not change annotation grouping, marker color, marker placement, popup shell, or scroll containment.
- Do not render non-primary `marketReactions[]`, evidence, reasoning, or raw backend enum values.
- Do not change the backend annotation contract.

## Decisions

- Replace the separate prediction and outcome sections in the event preview with one reaction section fed by `annotation.topMarketReaction`.
- Hide `outcome.alignment` in the popup preview; the user-facing comparison uses predicted direction versus `outcome.actualDirection`.
- Compare numeric price values before formatting: `evaluationPrice` against `anchorPrice`.
- Reuse existing direction label and badge tone helpers for predicted and actual direction instead of adding a second direction color map.

## Risks / Trade-offs

- Missing one side of a price range can prevent direction coloring -> render the available price neutrally and omit the movement icon.
- Removing alignment from the popup reduces diagnostic detail -> keep it out of this quick preview unless a later detail surface needs it.
