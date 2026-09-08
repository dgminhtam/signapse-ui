## Why

Market Chart currently loads economic calendar events only for the displayed candle interval, so users cannot reliably discover scheduled announcements before they happen. Signapse needs advance, asset-relevant calendar visibility that remains useful on short chart timeframes, outside trading sessions, and when candle data is unavailable.

## What Changes

- Load asset-relevant HIGH-impact economic calendar events for a rolling seven-day future interval independently of candle history, while retaining historical calendar loading for chart context.
- Add an always-available next-event summary and an upcoming list with 24-hour and seven-day views, countdown information, waiting-for-publication handling, and a path to the full Economic Calendar.
- Refresh upcoming calendar data every minute while the page is visible and when the user returns to the tab, without blocking or resetting loaded price data.
- Change the Calendar control to govern chart markers, lane, guide, and legend while leaving the next-event summary and upcoming list available.
- Display loaded future events as chart markers when their extrapolated time coordinates are within the viewport, without creating synthetic candles or automatically changing the visible chart range.
- Remove the aggregate calendar-count popover from the chart footer while retaining marker-specific popovers.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-economic-calendar-events`: Extend the existing calendar layer contract with independent future loading, upcoming and waiting views, future marker behavior, revised marker visibility control, refresh semantics, and removal of the aggregate footer popover.

## Impact

- Market Chart workbench state, calendar requests, filtering, refresh lifecycle, toolbar and footer controls, calendar marker placement, and localized copy.
- Economic calendar request/response contract verification for future coverage and the semantics of `time`, `scheduledAt`, `PENDING`, and `AVAILABLE`.
- Existing Market Chart helper, action, fixture-backed browser, responsive, keyboard, and accessibility coverage.
- No new chart engine or notification delivery integration is introduced.
