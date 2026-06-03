## 1. Grouping Model

- [x] 1.1 Replace the day-only client grouping model with a nested day -> time -> currency/region view model.
- [x] 1.2 Use UTC+7 formatted scheduled time as the time bucket key and display label.
- [x] 1.3 Use uppercased `currencyCode` as the currency/region key with localized unavailable fallback copy.
- [x] 1.4 Preserve stable day anchors for week-strip day chip navigation.

## 2. Stream Rendering

- [x] 2.1 Render day shells for all seven selected UTC+7 week days, not only days with events.
- [x] 2.2 Render compact time group rows inside day shells.
- [x] 2.3 Render compact currency/region group rows inside time groups without country inference or flags.
- [x] 2.4 Move repeated time and currency information out of event rows where practical while preserving impact, title, actual, forecast, previous, status, expand, and detail actions.
- [x] 2.5 Add a compact empty-day treatment for selected week days without events.

## 3. Current-time Line And Sort

- [x] 3.1 Update current-time line placement to compare against time groups instead of only individual event rows.
- [x] 3.2 Render the current-time line inside today's day shell when today has no events.
- [x] 3.3 Keep the current-time line hidden for non-current UTC+7 weeks.
- [x] 3.4 Normalize stale or unsupported sort values to `scheduledAt_asc` in server query handling and client list state.

## 4. Localization And Loading

- [x] 4.1 Add or update English and Vietnamese dictionary keys for currency/region group fallback and empty-day copy.
- [x] 4.2 Update skeleton/loading treatment to mirror day, time, and currency/region grouping.
- [x] 4.3 Review responsive table width and row density after nested grouping.

## 5. Verification

- [x] 5.1 Run `openspec validate refine-economic-calendar-time-grouping --strict`.
- [x] 5.2 Run targeted lint for economic calendar files touched by this change.
- [x] 5.3 Run `pnpm typecheck` or the repo slash-command equivalent.
- [x] 5.4 Perform static review for hardcoded UI copy, unsupported country/flag inference, stale sort handling, shadcn composition drift, table width handling, and hydration-sensitive current-time rendering.
