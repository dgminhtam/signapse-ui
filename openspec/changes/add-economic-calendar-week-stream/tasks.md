## 1. Week State And Filter Helpers

- [x] 1.1 Add narrow UTC+7 date helpers for current week start, selected week parsing, previous/next week calculation, seven day generation, and backend timestamp formatting.
- [x] 1.2 Add a fixed week-window request size constant and keep it local to the economic calendar feature.
- [x] 1.3 Update server query handling to derive the scheduledAt week range filter from `week=YYYY-MM-DD`.
- [x] 1.4 Compose the derived scheduledAt range with existing search filters without passing UI-only query params into `$filter`.

## 2. Week Stream Request Flow

- [x] 2.1 Default economic calendar requests to current UTC+7 week when `week` is absent or invalid.
- [x] 2.2 Request backend `page=0`, fixed large `size`, and default `scheduledAt_asc` sort for week stream mode.
- [x] 2.3 Preserve existing search, sync, supported sort, permissions, and canonical detail route behavior.

## 3. Week Strip And Adjacent Controls

- [x] 3.1 Add a compact navigation-only week strip using existing shadcn wrappers and localized copy.
- [x] 3.2 Implement Today, previous week, and next week URL updates with locale-preserving navigation.
- [x] 3.3 Render seven day chips for the selected UTC+7 week without daily counts, category counts, flags, countdowns, or summary cards.
- [x] 3.4 Add top and bottom adjacent-week controls that change the selected week instead of using pagination.

## 4. Event Stream Interaction

- [x] 4.1 Remove visible pagination and page-size controls from the economic calendar list page.
- [x] 4.2 Make day chips scroll or focus matching loaded day groups without refetching a single-day range.
- [x] 4.3 Add a red current-time line when the selected UTC+7 week contains the current time.
- [x] 4.4 Ensure the current-time line does not render for past or future weeks.
- [x] 4.5 Preserve grouped day rows, market-calendar row hierarchy, expandable support content, and canonical localized detail links.

## 5. Localization, Loading, And Review

- [x] 5.1 Add or update English and Vietnamese dictionary keys for week strip labels, adjacent-week controls, day navigation, and current-time marker copy.
- [x] 5.2 Update skeleton/loading treatment to mirror the week strip and week stream layout.
- [x] 5.3 Review responsive table width and long-text behavior after pagination removal.

## 6. Verification

- [x] 6.1 Run `openspec validate add-economic-calendar-week-stream --strict`.
- [x] 6.2 Run targeted lint for economic calendar files touched by this change.
- [x] 6.3 Run `pnpm typecheck` or the repo slash-command equivalent.
- [x] 6.4 Perform static review for hardcoded UI copy, locale-preserving links, UTC+7 filter formatting, unsupported UI drift, shadcn composition drift, and hydration-sensitive current-time rendering.
