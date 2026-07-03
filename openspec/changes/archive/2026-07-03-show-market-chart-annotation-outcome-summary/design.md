## Context

Market chart annotation popups already show event title, event summary, and a compact reaction block for `topMarketReaction.outcome`. The backend now includes `outcome.summary`, a short explanation of the realized outcome, but the frontend response type and popup renderer do not expose it.

## Goals / Non-Goals

**Goals:**

- Preserve the API field in frontend typing.
- Show non-empty outcome summary text in the existing reaction block.
- Keep the popup dense and readable for multi-event annotation groups.

**Non-Goals:**

- Do not add a new popup section, badge, icon, or dedicated label.
- Do not change marker grouping, hover range highlighting, drawing tools, backend calls, or annotation selection behavior.
- Do not show `alignment` or `evaluatedAt` again.

## Decisions

- Add `summary?: string | null` to `MarketChartAnnotationOutcomeResponse`.
- Trim `outcome.summary` before rendering and omit empty strings.
- Render the summary as muted body text at the bottom of `MarketChartAnnotationReactionSection`, after the direction, price, and time rows. This keeps the explanation attached to the outcome metrics without competing with the event summary above it.
- Include outcome summary in the section render condition so a reaction with only summary still appears.

## Risks / Trade-offs

- Long summary text could make dense groups taller → keep it inside the existing scrollable popup body and use compact muted text.
- Summary may repeat event summary → acceptable because it describes the realized market outcome, while event summary describes the news/event itself.
