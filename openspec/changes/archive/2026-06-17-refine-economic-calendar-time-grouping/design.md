## Context

The economic calendar now loads a UTC+7 week window and renders a compact week strip with adjacent-week controls. The next refinement is about scan hierarchy inside the event stream. A day-only table still forces users to compare mixed release times and currencies in a flat sequence, and the current-time line can disappear when today has no event group or when a stale URL sort value remains from the previous list design.

The current list response includes `scheduledAt` and `currencyCode`, but not reliable country fields. Therefore grouping should use the available contract honestly: day -> UTC+7 time -> currency/region, where currency/region is derived from `currencyCode` only.

## Goals / Non-Goals

**Goals:**

- Render week-stream entries under nested day, time, and currency/region groups.
- Keep event rows compact under their time/currency group and preserve actual/forecast/previous/status/detail actions.
- Make the current-time line render in the current UTC+7 week even if today's group has no events.
- Normalize unsupported/stale sort values to `scheduledAt_asc` for this calendar-stream UI.
- Keep day chip navigation working with day-level group anchors.

**Non-Goals:**

- No backend contract changes or country-name inference.
- No flags, country badges, category tabs, daily counts, countdowns, or aggregate cards.
- No change to UTC+7 week-window filtering or adjacent-week navigation.
- No redesign of the economic calendar detail page.

## Decisions

### Group By Day, Then Time, Then Currency/Region

The list should build a nested view model:

```text
day
  time bucket
    currency/region bucket
      event rows
```

Time bucket keys come from `scheduledAt` formatted in UTC+7. Currency/region bucket keys come from `currencyCode` uppercased, with localized unavailable copy as the fallback.

Alternative considered: group by country. This was rejected because the current frontend contract does not provide `countryCode` or `countryName`, and inferring country from currency can be misleading.

### Render Day Shells For All Seven Days

The week stream should render a day shell for each selected UTC+7 day, even when that day has no events. Empty day shells can stay visually light, but they provide a stable target for day chips and the current-time line.

Alternative considered: render only days with events. This caused the current-time line to disappear when today had no event group.

### Place Now Line In Chronological Group Flow

The current-time line should be placed using UTC+7 time bucket comparison. If today has no events, it should still render inside today's day shell. If the selected sort is not chronological, the page should normalize to `scheduledAt_asc` before building the stream so the line remains meaningful.

Alternative considered: hide the line for unsupported sort values. This was rejected because stale URL state should not remove the user's primary orientation cue.

### Normalize Stale Sort To Scheduled Time

Only `scheduledAt_asc` and `scheduledAt_desc` should drive the week stream. Unsupported sort values from older URLs should fall back to `scheduledAt_asc` in server query handling and client sort UI state.

Alternative considered: keep synced/created sort options. This was rejected because the stream hierarchy and now line depend on chronological scheduled time.

### Keep Table Surface But Reduce Row Repetition

The shared table surface should remain, but repeated time and currency text should move into group header rows so event rows can emphasize impact, title, values, status, and actions.

Alternative considered: replace the table with nested cards. This was rejected because the current shared table surface handles dense scanning, empty state, skeletons, and horizontal overflow well.

## Risks / Trade-offs

- More group header rows can make sparse weeks feel tall -> keep headers compact and avoid extra descriptive copy.
- Empty day shells can add visual noise -> render a minimal localized empty-day row only when needed for day navigation or now-line placement.
- Currency/region is not the same as country -> label and fallback copy must avoid claiming country accuracy.
- Changing sort normalization can surprise users with stale URLs -> keep the sort dropdown options limited to scheduled time and let the URL settle to the normalized behavior.
- Now-line logic is hydration-sensitive -> keep current time client-only and avoid server-rendering a moving timestamp.

## Migration Plan

1. Replace the flat day group model with a nested day/time/currency-region view model.
2. Render all seven selected week days with compact empty-day support.
3. Move time and currency/region into group headers and keep event rows focused.
4. Update current-time line placement to work across empty today and time buckets.
5. Normalize stale sort values to scheduled time.
6. Update skeletons and localized copy, then run OpenSpec validation, targeted lint, typecheck, and static review.

## Open Questions

- Should empty day shells always render a localized "No events" row, or only show the day header and current-time line when relevant?
- Should time buckets use `HH:mm` only, or include a secondary UTC+7 timezone label in a tooltip/help text?
