## Context

Market chart annotations already include a reaction `direction` field with values such as `BULLISH`, `BEARISH`, `NEUTRAL`, and `MIXED`. The annotation grouping helper also exposes a dominant group direction, but the chart marker rendering currently uses a red destructive treatment for every marker. This makes all events scan as negative alerts even when backend reaction data says the market impact is positive or neutral.

Relevant constraints:

- Keep notification-style dot markers; do not introduce arrow or buy/sell marker semantics.
- Use existing reaction direction data from the chart API; do not add frontend inference.
- Avoid global theme token changes for this local chart polish.
- Keep colors readable in both light and dark mode.
- Keep grouped marker count, selected state, pulse, and high-priority emphasis intact.

## Goals / Non-Goals

**Goals:**

- Color annotation markers by the group's dominant reaction direction.
- Use green for `BULLISH`, red for `BEARISH`, amber for `NEUTRAL`, and a clear but non-directional treatment for `MIXED`.
- Preserve a muted fallback when direction is missing or unknown.
- Keep marker labels compact and chart readability intact.

**Non-Goals:**

- Do not change backend API contracts, annotation grouping by time, lazy history loading, or popup content hierarchy.
- Do not add a legend, filter, or user-configurable color settings in this change.
- Do not change global shadcn theme tokens or chart engine options.
- Do not replace notification dots with directional arrows.

## Decisions

### Drive marker color from grouped dominant direction

Use `MarketChartAnnotationGroup.direction` as the marker color source. The grouping helper already collapses multiple annotations at the same chart time and marks the group as `MIXED` when directions conflict.

Rationale: users see one marker per time bucket, so marker color should reflect the grouped event bucket rather than an arbitrary first annotation.

Alternative considered: color by the first annotation in a group. That is simpler but misleading when a group contains both positive and negative reactions.

### Use amber for neutral reactions

Map `NEUTRAL` to amber rather than gray.

Rationale: neutral events are still meaningful chart events. Gray would be too close to grid lines, muted text, and disabled surfaces, especially in dark mode. Amber stays visible without implying bullish or bearish direction.

Alternative considered: use muted gray for neutral. This would reduce noise but risks making neutral markers look disabled or unimportant.

### Keep mixed distinct from neutral but non-directional

Map `MIXED` to an amber/orange-adjacent treatment that is visibly related to uncertainty but not identical to neutral if practical with the existing token set.

Rationale: mixed reactions indicate conflicting directional signals and deserve higher scan salience than purely neutral events.

Alternative considered: split grouped markers into multiple colored dots. That would complicate dense marker rendering and could clutter the chart.

### Keep palette local to marker rendering

Implement the color mapping as a small local helper or mapping in the market chart annotation rendering boundary. Prefer existing semantic/chart tokens such as destructive for bearish and chart tokens for bullish/neutral/mixed rather than adding global theme tokens.

Rationale: this is a local visualization concern. Global token changes would broaden the blast radius and conflict with the repo's shadcn baseline guardrails.

Alternative considered: add `success` and `warning` tokens globally. That may be useful later, but it is larger than this change needs.

## Risks / Trade-offs

- Color-only meaning can be inaccessible -> Mitigate by preserving labels, aria text, popup direction metadata, and grouped count; color improves scanning but is not the only information channel.
- Amber may compete with chart candles or indicators -> Mitigate by using compact dots and existing pulse/ring strength rather than large labels.
- Chart token hue may not be perfectly "green" or "amber" in every theme -> Mitigate by choosing the closest existing chart tokens first and only consider a local CSS variable if the result is visually poor.
- Mixed and neutral can look too similar -> Mitigate by using ring/pulse emphasis or a separate chart token for `MIXED` while keeping both non-red/non-green.
