## ADDED Requirements

### Requirement: Upcoming calendar summary and list
The system SHALL provide an asset-relevant next-event summary and upcoming economic calendar list independently of displayed candle availability.

#### Scenario: Show the next event
- **WHEN** one or more selected-impact events are scheduled after the current time within the active lookahead interval
- **THEN** the system identifies the earliest event as the next upcoming economic calendar event
- **AND** it displays available event identity, scheduled time, impact, and time remaining in a compact summary
- **AND** activating the summary opens the upcoming list

#### Scenario: Open the list without a next event
- **WHEN** no selected-impact event qualifies as the next event
- **THEN** the summary area provides an explicit accessible action to open the upcoming list
- **AND** the list communicates whether it is empty, filtered, loading, stale, or unavailable

#### Scenario: Select the upcoming interval
- **WHEN** the user selects 24 hours or seven days
- **THEN** the system filters the upcoming list and next-event summary to the corresponding rolling interval beginning at the current time
- **AND** the selection does not hide historical markers or future markers already loaded within the seven-day calendar coverage

#### Scenario: Open the full calendar
- **WHEN** the user needs to explore dates beyond the available lookahead choices
- **THEN** the upcoming list provides a locale-preserving path to the existing Economic Calendar page

#### Scenario: Review the upcoming list accessibly
- **WHEN** a keyboard, touch, or screen-reader user interacts with the next-event summary or upcoming list
- **THEN** the controls expose localized accessible names, visible focus, and non-hover activation
- **AND** dynamic loading, failure, stale, and empty states are announced without moving focus unexpectedly

### Requirement: Awaiting economic event publication
The system SHALL distinguish a due PENDING economic calendar event from both upcoming and published events for a bounded presentation interval.

#### Scenario: Enter awaiting publication
- **WHEN** an event remains PENDING at or after its scheduled time and less than 60 minutes have elapsed
- **THEN** the system shows the event in a localized awaiting-publication group
- **AND** the next-event summary advances to the earliest qualifying future event

#### Scenario: Receive publication
- **WHEN** an awaiting event is refreshed with status AVAILABLE
- **THEN** the system removes it from the awaiting-publication group
- **AND** it remains eligible for the applicable historical marker and event-detail behavior

#### Scenario: Expire awaiting presentation
- **WHEN** a PENDING event reaches 60 minutes after its scheduled time
- **THEN** the system removes it from the awaiting-publication group
- **AND** it does not infer that the event was published, cancelled, or deleted

#### Scenario: Preserve the waiting deadline
- **WHEN** the page reloads, the chart timeframe changes, or the document becomes visible during an event's awaiting interval
- **THEN** the system derives the deadline from the event's scheduled time
- **AND** none of those interactions extend the 60-minute interval

### Requirement: Upcoming calendar refresh and freshness
The system SHALL refresh future economic calendar data independently of price data and communicate calendar freshness without discarding usable chart context.

#### Scenario: Load future calendar independently
- **WHEN** a valid chart asset is selected
- **THEN** the system requests selected-impact economic calendar events for a rolling half-open interval from the current time through seven days later
- **AND** it performs the request even when candle loading is empty or fails
- **AND** candle failure does not prevent the upcoming list from resolving

#### Scenario: Refresh while visible
- **WHEN** the Market Chart document remains visible
- **THEN** the system refreshes future calendar data once per minute
- **AND** updates client-side time remaining without resetting price data, chart state, or the active marker interaction

#### Scenario: Pause while hidden and refresh on return
- **WHEN** the document becomes hidden
- **THEN** the system pauses periodic calendar refreshes
- **AND WHEN** the document becomes visible again
- **THEN** the system immediately requests current future calendar data and resumes the minute interval

#### Scenario: Retain stale data after refresh failure
- **WHEN** a refresh fails after a successful calendar load
- **THEN** the system retains the last successful calendar events and update time
- **AND** clearly marks the calendar data as stale or failed to refresh
- **AND** provides a retry path without resetting price data

#### Scenario: Distinguish empty success from failure
- **WHEN** a future calendar request succeeds with no matching events
- **THEN** the upcoming surface communicates that no matching scheduled events were returned
- **AND** does not present that result as a loading or request failure
- **AND** does not claim the provider guarantees complete seven-day coverage

#### Scenario: Ignore stale selection responses
- **WHEN** an older future-calendar response completes after the selected asset or impact set has changed
- **THEN** the system does not commit that response to the active workbench state

### Requirement: Aggregate calendar footer behavior
The system SHALL avoid a duplicate aggregate calendar-list popover in the Market Chart footer while retaining contextual marker inspection.

#### Scenario: Render aggregate event count
- **WHEN** the workbench displays an aggregate economic calendar event count in its footer
- **THEN** the count is non-interactive metadata
- **AND** activating or focusing it does not open an aggregate event-list popover

#### Scenario: Preserve marker popovers
- **WHEN** the user activates an individual or grouped calendar marker
- **THEN** the marker continues to open its contextual calendar event list
- **AND** the contained event detail actions remain available

## MODIFIED Requirements

### Requirement: Calendar layer control
The system SHALL provide a default-enabled chart-marker visibility control for economic calendar events, independent from the existing Events annotation layer and independent from upcoming calendar data availability.

#### Scenario: Calendar markers default to enabled
- **WHEN** a user opens the Market Charts workbench for a selected watchlist asset and timeframe
- **THEN** economic calendar markers are enabled by default
- **AND** the system requests future economic calendar events for the selected asset and selected impact levels regardless of marker visibility

#### Scenario: Toggle calendar markers
- **WHEN** a user toggles the localized Show calendar on chart control
- **THEN** the system hides or shows calendar markers, marker lane content, marker guide content, and marker legend content
- **AND** the next-event summary, upcoming list, awaiting-publication group, and their loading or error state remain available
- **AND** the existing Events annotation layer remains independently controlled

#### Scenario: Preserve chart route state
- **WHEN** calendar marker visibility is toggled
- **THEN** the route continues to identify the chart by `assetId` and `timeframe`
- **AND** the system does not add manual `from`, `to`, calendar marker, or lookahead query parameters

### Requirement: Impact-driven calendar loading
The system SHALL load high-impact calendar events by default and SHALL defer other impact levels until the user selects them, independently of calendar marker visibility.

#### Scenario: Default calendar impact
- **WHEN** a user opens Market Charts without changing the calendar impact controls
- **THEN** only `HIGH` is selected
- **AND** initial historical and future calendar requests include only `impact=HIGH`

#### Scenario: Load a newly selected impact
- **WHEN** a user enables an unselected `MEDIUM` or `LOW` impact level on a loaded chart
- **THEN** the system requests that newly enabled impact for the rolling seven-day future range and applicable loaded historical ranges
- **AND** it does not request already loaded selected impacts solely because of this selection
- **AND** returned events are merged with existing calendar events by event identity

#### Scenario: Disable a selected impact
- **WHEN** a user disables an impact level
- **THEN** events of that impact are hidden locally from the next-event summary, upcoming list, awaiting group, and markers
- **AND** the system does not call the backend solely to remove or hide those events
- **AND** already loaded events of that impact remain available for later merging and display

#### Scenario: No impacts selected
- **WHEN** the user disables every calendar impact level
- **THEN** the chart renders no calendar summary, upcoming items, awaiting items, or markers
- **AND** the system does not request calendar events until an impact level is enabled
- **AND** the upcoming surface communicates that the impact filter has no selected values

#### Scenario: Reload calendar data with selected impacts
- **WHEN** the chart performs an initial load, explicit refresh, asset load, timeframe load, visibility-return refresh, periodic future refresh, or lazy older-history load
- **THEN** each applicable calendar request includes all impact levels currently selected by the user
- **AND** every date-range chunk carries the same selected impact parameters
- **AND** marker visibility alone does not suppress those calendar requests

#### Scenario: On-demand impact request fails
- **WHEN** loading a newly selected impact fails or returns an invalid response
- **THEN** previously loaded calendar events remain available
- **AND** the system shows concise calendar-specific failure feedback

### Requirement: Calendar event range selection
The system SHALL request economic calendar events using separate valid half-open ranges for the rolling seven-day lookahead and displayed candle history, and SHALL constrain each request chunk to backend limits.

#### Scenario: Initial future calendar range
- **WHEN** a valid chart asset is selected and at least one impact level is selected
- **THEN** the system derives future `from` from the current time
- **AND** derives exclusive future `to` as seven days after that current time
- **AND** requests that range independently of candle availability and chart timeframe
- **AND** every request chunk is after `from` and no more than 366 days long

#### Scenario: Initial historical calendar range
- **WHEN** an initial or refreshed count-back candle request returns one or more valid candles
- **THEN** the system derives historical `from` from the earliest displayed candle timestamp
- **AND** derives exclusive historical `to` from the end of the latest displayed candle bucket, clamped to the count-back anchor when the latest candle is partial
- **AND** does not use future scheduled events to extend or synthesize the displayed candle interval
- **AND** every request chunk is after `from` and no more than 366 days long

#### Scenario: Partial candle bounds the historical calendar range
- **WHEN** the latest displayed candle has `partial=true`
- **THEN** the system uses the retained candle flag and the count-back anchor as the historical interval's exclusive end
- **AND** it does not infer a later historical boundary from wall-clock time

#### Scenario: Lazy older calendar range
- **WHEN** the user loads an older count-back candle page
- **THEN** the system requests calendar events for that page's displayed candle interval
- **AND** any calendar request chunk is no longer than 366 days

#### Scenario: No displayed candles
- **WHEN** a count-back candle request has no displayed candle interval
- **THEN** the system does not request a historical calendar range for that candle result
- **AND** the independent seven-day future calendar request remains eligible

#### Scenario: Calendar markers disabled during history load
- **WHEN** the user loads older candles while calendar markers are disabled
- **THEN** the system may omit older calendar loading needed solely for hidden marker visibility
- **AND** marker visibility does not suppress future calendar loading for the next-event summary, upcoming list, or awaiting group

### Requirement: Calendar event marker lane
The system SHALL render economic calendar events with valid visible chart coordinates in a dedicated lane below the active KLineCharts canvas area and above the existing legend/footer.

#### Scenario: Render candle-mapped event marker
- **WHEN** calendar markers are enabled and an economic calendar event has a valid time that maps to a loaded candle
- **THEN** the system renders a compact marker for that event in the calendar lane at the corresponding chart position

#### Scenario: Render visible future event marker
- **WHEN** calendar markers are enabled and a loaded future economic calendar event has a valid extrapolated chart coordinate inside the current viewport
- **THEN** the system renders the marker at its actual scheduled time in the calendar lane
- **AND** does not create a synthetic candle or clamp the event to the latest candle

#### Scenario: Future event outside the viewport
- **WHEN** a loaded future event does not have a valid coordinate inside the current viewport
- **THEN** the system does not automatically zoom or scroll the chart to display the marker
- **AND** the event remains available through the applicable next-event summary or upcoming list

#### Scenario: Invalid event time
- **WHEN** an economic calendar event has an invalid time
- **THEN** the system omits that event from chart marker placement and time-based upcoming classification
- **AND** valid calendar events continue to render

#### Scenario: Dense calendar events
- **WHEN** multiple economic calendar events map to the same candle time or lane position
- **THEN** the system groups them into one lane marker
- **AND** the grouped marker list lets the user inspect the contained events

#### Scenario: Calendar lane renders below chart canvas
- **WHEN** calendar markers are enabled and calendar events with visible coordinates are available
- **THEN** the chart canvas area is resized to leave dedicated space for the calendar lane
- **AND** the calendar lane renders in that dedicated space below the chart canvas
- **AND** candles, indicators, and the volume pane remain unobstructed by the lane

#### Scenario: Calendar lane keeps chart x-axis alignment
- **WHEN** a historical or future calendar event has a visible chart coordinate
- **THEN** its lane marker is horizontally aligned with the chart x-coordinate for that event time
- **AND** visual lane padding does not shift marker placement away from the chart coordinate system
