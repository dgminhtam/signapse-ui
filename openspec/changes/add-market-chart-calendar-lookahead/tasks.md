## 1. Confirm The Calendar Contract

- [x] 1.1 Use the live dev OpenAPI contract and `api-mapping-sync` workflow to confirm future range support, request limits, timestamp meanings and precedence, and the complete publication-status vocabulary for `GET /market-charts/economic-calendar-events`.
- [x] 1.2 Update the frontend calendar DTO validation and `docs/APIMAPPING.md` only where the confirmed contract differs, preserving backend ownership of asset relevance.

## 2. Build Deterministic Lookahead State

- [x] 2.1 Add focused calendar helpers for the rolling seven-day request interval, 24-hour/seven-day upcoming filtering, next-event selection, and scheduled-time ordering using the contract-confirmed timestamp.
- [x] 2.2 Add awaiting-publication classification for PENDING events from their scheduled time through the exclusive 60-minute deadline without mutating backend status.
- [x] 2.3 Cover boundary behavior with deterministic tests for before/due/60-minute timestamps, AVAILABLE transitions, invalid times, interval edges, reload-equivalent recomputation, and selected-impact filtering.

## 3. Decouple Future Calendar Loading From Candles

- [x] 3.1 Load the rolling seven-day future calendar range for a valid selected asset and selected impacts independently of candle success and marker visibility, while retaining candle-derived historical requests.
- [x] 3.2 Merge historical and future responses by event identity, preserve reusable future data across timeframe changes, and prevent stale asset or impact responses from committing.
- [x] 3.3 Refresh future calendar data once per minute while the document is visible, pause while hidden, and refresh immediately when visibility returns without resetting chart state.
- [x] 3.4 Preserve the last successful future events and update time after refresh failure, and expose distinct loading, successful-empty, stale/failure, and retry states.

## 4. Add The Upcoming Calendar Experience

- [x] 4.1 Add localized English and Vietnamese copy for the next-event summary, time remaining, 24-hour/seven-day choices, awaiting-publication group, empty/filtered/stale/failure states, retry, and full-calendar navigation.
- [x] 4.2 Add the compact next-event summary as the primary aggregate calendar entry point and keep an explicit upcoming-list action when no next event qualifies.
- [x] 4.3 Add the accessible upcoming list with 24-hour/seven-day selection, selected-impact filtering, awaiting-publication items, localized timestamps/timezone, and a locale-preserving link to the full Economic Calendar.
- [x] 4.4 Keep the upcoming surface usable with empty candle data, calendar refresh errors, responsive workbench layouts, fullscreen mode, keyboard navigation, touch input, and announced dynamic states.

## 5. Refine Marker Controls And Placement

- [x] 5.1 Change the Calendar control to the localized Show calendar on chart behavior so it only controls calendar markers, lane, guide, and legend while future loading and upcoming content remain active.
- [x] 5.2 Keep historical markers and loaded seven-day future markers independent of the 24-hour/seven-day upcoming-list selection and apply selected impacts consistently to all calendar presentations.
- [x] 5.3 Render future markers at their actual scheduled timestamp only when KLineCharts returns a valid coordinate inside the viewport, without synthetic candles, last-candle clamping, or automatic zoom/scroll.
- [x] 5.4 Verify and correct future marker grouping/alignment for intraday periods, market closures, weekends, and daily, weekly, and monthly boundaries while retaining list access for omitted off-viewport markers.
- [x] 5.5 Remove the aggregate event-count footer popover and make any retained count non-interactive while preserving individual and grouped marker popovers and their detail links.

## 6. Extend Contract-Backed Automated Coverage

- [x] 6.1 Extend the fixture calendar endpoint with future, PENDING, AVAILABLE, empty, delayed, failed, and stale-response scenarios plus request capture for ranges and repeated impact parameters.
- [x] 6.2 Extend server-action tests for the contract-confirmed request and response behavior, including future half-open ranges and invalid calendar payloads.
- [x] 6.3 Extend the Market Chart browser journey to cover next-event/list access, 24-hour/seven-day behavior, marker-only toggle semantics, the removed footer popover, marker popovers, empty candles, refresh recovery, asset/timeframe changes, keyboard access, and localized visible states.
- [x] 6.4 Add focused accessibility assertions for names, focus order and restoration, dynamic status announcements, touch-sized controls, zoom, and responsive/fullscreen overflow.

## 7. Verify The Completed Change

- [x] 7.1 Run the focused calendar helper, Market Chart action, component, and browser tests and resolve all failures.
- [x] 7.2 Run `pnpm lint`, `pnpm typecheck`, `pnpm test:contract`, and `pnpm build` successfully.
- [x] 7.3 Run `openspec validate add-market-chart-calendar-lookahead`, confirm no obsolete aggregate calendar popover behavior remains in active specs or code, and review the final diff against the proposal and design.
