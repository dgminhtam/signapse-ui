## Context

The completed `redesign-economic-calendar-list` change makes economic calendar rows easier to scan by day and time, but the screen still carries list-page behavior such as visible pagination and page size selection. The product direction is now clearer: economic calendar should be a UTC+7 week stream with a compact week strip, a current-time line, and adjacent-week controls.

The backend already accepts scheduled time filters through `$filter`, for example:

```text
scheduledAt ge '2026-06-03T00:00:00+07:00' and scheduledAt lt '2026-06-04T00:00:00+07:00'
```

The frontend can derive this filter from a clean `week` query parameter and continue using the existing `getEconomicCalendarEntries(searchParams)` server action.

## Goals / Non-Goals

**Goals:**

- Load the selected UTC+7 week as one calendar window using a `scheduledAt` range filter.
- Add a compact navigation-only week strip with Today, previous week, next week, and seven day chips.
- Show a red current-time line only when the selected UTC+7 week contains the current time.
- Remove visible pagination and page-size controls from the economic calendar list page.
- Use top and bottom controls to move to the previous or next week.
- Preserve search, sync, sort, grouped day rows, expandable event support content, and canonical localized detail links.

**Non-Goals:**

- No backend endpoint, DTO, permission, or dependency changes.
- No daily count cards, category tabs, country flags, realtime countdowns, or trading-terminal summary deck.
- No infinite prepend/append stream in the first iteration; adjacent-week controls switch the selected week.
- No timezone preference system; UTC+7 is the fixed timezone for this iteration.
- No redesign of the economic calendar detail page.

## Decisions

### Use `week` As Clean URL State

The page should read `week=YYYY-MM-DD`, where the value is the Monday week start in UTC+7. When absent or invalid, the page defaults to the current UTC+7 week.

Alternative considered: expose `scheduledAt[ge]` and `scheduledAt[lt]` directly in the URL. This was rejected because it makes the route harder to read and couples UI state to filter syntax.

### Derive Backend Filter Server-side

The server page derives the backend filter:

```text
scheduledAt ge '{weekStart}T00:00:00+07:00' and scheduledAt lt '{nextWeekStart}T00:00:00+07:00'
```

This derived scheduled range should be combined with existing search filters so title search still works inside the selected week.

Alternative considered: keep generic `buildFilterQuery(filterParams)` as-is. This was rejected because `week` is a UI query parameter, not a backend field/operator expression.

### Load One Week With A Large Fixed Backend Size

Use backend `page=0`, a large fixed `size` such as `500`, and default `sort=scheduledAt_asc` so the selected week loads as a single ordered stream. The visible page-size selector and pagination controls should be removed from this page.

Alternative considered: keep pagination as a fallback. This was rejected because pagination undermines the calendar-stream mental model.

### Week Strip Is Navigation-only

The week strip should show Today, previous/next week buttons, the current week range label, and seven day chips. It must not show counts because the current backend request does not provide aggregate counts independent of the loaded window.

Alternative considered: add daily count cards like trading calendars. This was rejected to avoid implying aggregate data that is not explicitly returned.

### Day Chips Scroll Or Focus Loaded Groups

Because the full selected week is already loaded, day chips should not refetch by default. They should help users navigate within the loaded week by scrolling or focusing the matching day group.

Alternative considered: fetch a single-day range on day chip click. This was rejected because it makes the week strip behave like a tab filter and loses the week-stream context.

### Current-time Line Is Based On UTC+7

The red current-time line should render only when the selected week contains the current UTC+7 date/time. It should appear between surrounding events in chronological order, or inside today's group when that group exists. It should not render for past or future weeks.

Alternative considered: underline the active day chip only. This was rejected because it does not show the user's position inside the event stream.

## Risks / Trade-offs

- A week may contain more entries than the fixed backend size -> choose a high size, keep the value centralized, and note that true cursor loading can be proposed later if needed.
- UTC+7 is fixed and may not match every operator -> keep copy and implementation explicit; do not present this as user-configurable timezone.
- Combining week range filters with search filters can produce malformed `$filter` if not composed carefully -> centralize filter composition and cover with deterministic static review/typecheck.
- Now-line placement depends on client current time -> isolate it in a client component and avoid server-rendered clock values that can cause hydration mismatch.
- Removing pagination changes familiar list behavior -> keep previous/next week controls visible at both ends of the stream.

## Migration Plan

1. Add week-state parsing and UTC+7 week boundary helpers.
2. Derive a scheduledAt range filter from `week` and combine it with existing search filters.
3. Remove visible pagination/page-size controls from the economic calendar page.
4. Add the week strip and adjacent-week controls.
5. Add the current-time line and update skeletons/localized copy.
6. Verify OpenSpec, lint/typecheck, URL state, filter composition, and static UI policy checks.

Rollback is straightforward: restore the previous list page query handling and pagination controls while keeping the grouped table from the prior change.

## Open Questions

- What fixed backend size should be used for one week: `500` or `1000`?
- Should the day chip scroll behavior use native anchor links or controlled refs inside the client list component?
