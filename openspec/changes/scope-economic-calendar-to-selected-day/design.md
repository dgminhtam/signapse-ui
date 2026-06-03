## Context

The economic calendar has evolved into a dense, table-first event stream with merged time/currency cells. Its current data model still loads a full UTC+7 week and renders seven day shells, but the user now wants the screen to focus on one selected day. This reduces backend payload size, simplifies empty-state behavior, and better matches how traders inspect a specific session.

The same screen also needs more visual scanning help. Impact badges, status badges, and numeric values currently read too neutral, so important events and value direction do not stand out enough.

## Goals / Non-Goals

**Goals:**

- Use `date=YYYY-MM-DD` as the primary URL state for the economic calendar list.
- Default to today's UTC+7 date when `date` is missing or invalid.
- Fetch only the selected UTC+7 day from the backend using scheduledAt day boundaries.
- Keep the week strip as a day navigator for the week containing the selected date.
- Keep merged time/currency cells and grouping within the selected day.
- Use signal colors for impact, status, and numeric values in a restrained, theme-aware way.
- Preserve search, sync, scheduled-time sort normalization, canonical detail links, expandable support content, and the red current-time line for today.

**Non-Goals:**

- No backend API, DTO, permission, or dependency changes.
- No country-name inference, flags, category tabs, countdowns, daily aggregate cards, or pagination controls.
- No full visual QA as an archive-blocking task; implementation verification should stay agent-owned.

## Decisions

### Use Selected Day As Primary State

The list should read `date` from the URL, normalize it to a valid UTC+7 date, and default to today's UTC+7 date. Server fetching should use:

```text
scheduledAt ge '<date>T00:00:00+07:00'
and scheduledAt lt '<next-date>T00:00:00+07:00'
```

Alternative considered: keep `week` state and only render one day from the fetched week. That would keep unnecessary backend payload and continue coupling the page to a week stream.

### Reframe Week Strip As Day Navigator

The week strip should still show seven days, but the selected chip is the active day. Clicking a chip updates `date` and reloads that day. Today should remain a quick action that updates `date` to today's UTC+7 date.

Alternative considered: replace the week strip with a single date picker. A date picker is useful later, but the week strip is already a strong calendar affordance and supports quick adjacent-day scanning.

### Remove Week Body Loading

The previous/next week body controls should not remain as week loaders. Either remove them or replace them with previous-day and next-day controls if useful for keyboard/mouse scanning. The selected-day fetch should not expose visible pagination.

Alternative considered: keep previous/next week controls for navigation. That conflicts with the selected-day mental model and can surprise users by changing context too broadly.

### Keep Current-Time Line Day-Specific

The red current-time line should render only when the selected UTC+7 date is today. It should remain placed between time buckets or before the empty-day row when today has no events.

Alternative considered: render a line for any selected date using the current clock time. That would imply "now" inside historical/future dates, which is misleading.

### Use Restrained Signal Colors

Impact and status should use small colored badge treatments. Numeric values should use text-level color only, not full-cell fills:

- `high` impact: danger/warm accent.
- `medium` impact: warning/amber accent.
- `low` impact: cool/subtle accent.
- unavailable/unknown impact: neutral.
- available status: success/positive accent.
- pending status: warning accent.
- unknown status: neutral.
- positive numeric values: positive accent.
- negative numeric values: danger/negative accent.
- `N/A`, missing, or unparseable values: muted/neutral.

Implementation should prefer existing badge variants and theme tokens where possible. If feature-local color classes are needed, keep them tightly scoped to economic calendar presentation and avoid global theme token changes.

Alternative considered: strong cell backgrounds for numeric values. That risks making a dense table noisy; text-level color preserves scanability without overpowering the event title.

## Risks / Trade-offs

- Existing `week` URLs stop being the primary state -> normalize by ignoring stale `week` for fetching and using `date` as the canonical state.
- Search plus selected day can produce many empty days -> keep localized empty-day copy and avoid rendering seven empty day shells.
- Day navigation can feel less broad than week loading -> week strip still shows context, and previous/next day controls can support continuous scanning if retained.
- Color contrast can regress accessibility -> use semantic/accessible colors and verify contrast-sensitive paths with deterministic review.
- Raw Tailwind color drift can violate shadcn/theme policy -> avoid broad raw color utilities and keep any feature-local treatment narrowly justified.

## Migration Plan

1. Replace week-window helper state with selected-date state while preserving UTC+7 helpers.
2. Build selected-day scheduledAt filters and remove selected-week fetch behavior.
3. Update week strip navigation to update `date` instead of scrolling to day anchors.
4. Render only the selected day shell and its time/currency/event rows.
5. Keep or replace adjacent controls with previous-day/next-day navigation.
6. Add signal color helpers for impact/status/value rendering.
7. Update skeletons and localized copy as needed.
8. Run OpenSpec validation, targeted lint, typecheck, diff check, and deterministic static review.

## Open Questions

- Should body controls be removed entirely, or replaced with previous-day and next-day buttons? The recommended default is previous-day and next-day buttons because they preserve keyboard/mouse scanning without reintroducing week loading.
