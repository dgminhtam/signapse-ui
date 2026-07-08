## 1. Contract And API Action

- [x] 1.1 Add `MarketChartEconomicCalendarEventRequest` and `MarketChartEconomicCalendarEventResponse` types and Zod schemas in market chart definitions.
- [x] 1.2 Add a shared calendar request query/range helper that respects `[from, to)` and the 366-day backend maximum.
- [x] 1.3 Add `getMarketChartEconomicCalendarEvents()` in the market chart server actions using `fetchAuthenticated()`.

## 2. Workbench Data Flow

- [x] 2.1 Add Calendar layer state defaulted to enabled, plus localized toolbar toggle copy.
- [x] 2.2 Load calendar events with the initial chart data using the accepted recent-plus-upcoming range.
- [x] 2.3 Load and merge older calendar events during lazy history only when the Calendar layer is enabled.
- [x] 2.4 Keep calendar load errors scoped to the calendar layer without resetting candles, annotations, live data, or chart identity.

## 3. Chart UI

- [x] 3.1 Group calendar events by nearest loaded candle time while keeping future/unmapped events available for the quick list only.
- [x] 3.2 Render the calendar lane above the existing legend/footer with compact marker controls and grouped marker behavior.
- [x] 3.3 Add the red vertical hover/focus guide line for calendar markers.
- [x] 3.4 Add the calendar quick list with available response fields and locale-preserving links to `/economic-calendar/{id}`.
- [x] 3.5 Add calendar legend text and color treatment distinct from annotation direction colors.

## 4. Localization And Verification

- [x] 4.1 Add English and Vietnamese dictionary keys for Calendar toggle, aria text, legend, loading, empty, and error copy.
- [x] 4.2 Run `openspec.cmd validate add-economic-calendar-events-to-market-charts --type change`.
- [x] 4.3 Run `pnpm.cmd typecheck`.
