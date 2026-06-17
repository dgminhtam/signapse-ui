## 1. Selected Day State And Fetching

- [x] 1.1 Replace week-primary URL handling with `date=YYYY-MM-DD` selected-day state.
- [x] 1.2 Default missing or invalid `date` to the current UTC+7 date.
- [x] 1.3 Build selected-day scheduledAt filters with UTC+7 day boundaries.
- [x] 1.4 Combine selected-day filters with existing search/list filters.
- [x] 1.5 Keep backend fetch at `page=0`, a large day-window size, and scheduled-time sort normalization.

## 2. Day Navigation And Table Rendering

- [x] 2.1 Update the week strip so day chips navigate by updating `date` instead of scrolling to day anchors.
- [x] 2.2 Render the selected day as the active week-strip chip.
- [x] 2.3 Update Today navigation to select the current UTC+7 date.
- [x] 2.4 Render only one selected-day shell and that day's merged time/currency event rows.
- [x] 2.5 Keep compact empty-day treatment when the selected day has no events.
- [x] 2.6 Replace or remove week body load controls so visible body controls do not navigate by week.
- [x] 2.7 Keep the current-time line visible only when the selected UTC+7 date is today.

## 3. Signal Colors

- [x] 3.1 Add impact badge signal treatments for high, medium, low, and unknown impact.
- [x] 3.2 Add status badge signal treatments for available, pending, and unknown statuses.
- [x] 3.3 Add numeric value signal treatment for positive, negative, and unavailable/unparseable actual/forecast/previous values.
- [x] 3.4 Keep signal colors theme-safe and narrowly scoped to economic calendar presentation.
- [x] 3.5 Confirm signal colors do not infer country names, flags, or unsupported categories.

## 4. Loading, Copy, And Cleanup

- [x] 4.1 Update skeleton/loading treatment to mirror the selected-day stream.
- [x] 4.2 Update localized copy for any changed day navigation controls or labels.
- [x] 4.3 Remove or rename stale week-stream helper names that no longer describe selected-day behavior.
- [x] 4.4 Review responsive table width and long text handling after selected-day scoping and colors.

## 5. Verification

- [x] 5.1 Run `openspec validate scope-economic-calendar-to-selected-day --strict`.
- [x] 5.2 Run targeted lint for economic calendar files touched by this change.
- [x] 5.3 Run `pnpm typecheck` or the repo slash-command equivalent.
- [x] 5.4 Run `git diff --check`.
- [x] 5.5 Perform static review for stale `week` query behavior, visible pagination, hardcoded UI copy, raw color drift, country/flag inference, shadcn composition drift, table width handling, and hydration-sensitive current-time rendering.
