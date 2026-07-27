## Purpose

Define how Market Charts loads and displays asset-relevant economic calendar events on the chart workspace.

## Requirements

### Requirement: Calendar layer control
The system SHALL provide a default-enabled economic calendar layer on the Market Charts workbench, independent from the existing Events annotation layer.

#### Scenario: Calendar layer defaults to enabled
- **WHEN** a user opens the Market Charts workbench for a selected watchlist asset and timeframe
- **THEN** the Calendar layer is enabled by default
- **AND** the system requests economic calendar events for the selected asset and computed calendar range

#### Scenario: Toggle calendar layer
- **WHEN** a user toggles the Calendar control beside the Events control
- **THEN** the system hides or shows economic calendar markers, lane content, quick list content, and legend content for the Calendar layer
- **AND** the existing Events annotation layer remains independently controlled

#### Scenario: Preserve chart route state
- **WHEN** the Calendar layer is toggled
- **THEN** the route continues to identify the chart by `assetId` and `timeframe`
- **AND** the system does not add manual `from`, `to`, or calendar toggle query parameters

### Requirement: Calendar event API loading
The system SHALL load asset-relevant economic calendar events through `GET /market-charts/economic-calendar-events` using authenticated market chart access and SHALL constrain each request to the required impact levels.

#### Scenario: Fetch calendar endpoint data
- **WHEN** the Calendar layer is enabled for a loaded chart and one or more impact levels are selected
- **THEN** the system calls `GET /market-charts/economic-calendar-events` through an authenticated action
- **AND** it sends flat query parameters `assetId`, `from`, and `to`
- **AND** it sends each selected impact level as a repeated `impact` query parameter
- **AND** it does not send `timeframe`

#### Scenario: Preserve backend asset relevance
- **WHEN** the system requests economic calendar events for the selected chart asset
- **THEN** the frontend does not filter events by asset type, base currency, quote currency, country code, or currency code
- **AND** backend asset relevance matching determines which events are returned

#### Scenario: Accept calendar response contract
- **WHEN** the backend returns economic calendar event items
- **THEN** the frontend accepts `id`, `assetId`, `time`, optional title and metadata fields, optional value fields, optional better/worse fields, optional localized `description`, `contentAvailable`, `status`, and optional `scheduledAt`
- **AND** `status` is limited to `PENDING` or `AVAILABLE`

#### Scenario: Calendar load failure
- **WHEN** the calendar event request fails or returns invalid data
- **THEN** the chart keeps loaded candle data and previously loaded calendar events visible
- **AND** the system shows concise feedback for the calendar layer failure
- **AND** the failure does not reset the selected asset, timeframe, annotation data, live data, or chart instance

### Requirement: Impact-driven calendar loading
The system SHALL load high-impact calendar events by default and SHALL defer other impact levels until the user selects them.

#### Scenario: Default calendar impact
- **WHEN** a user opens Market Charts without changing the calendar impact controls
- **THEN** only `HIGH` is selected
- **AND** the initial calendar requests include only `impact=HIGH`

#### Scenario: Load a newly selected impact
- **WHEN** a user enables an unselected `MEDIUM` or `LOW` impact level on a loaded chart
- **THEN** the system requests that newly enabled impact for the current calendar range
- **AND** it does not request already loaded selected impacts solely because of this selection
- **AND** returned events are merged with existing calendar events by event identity

#### Scenario: Disable a selected impact
- **WHEN** a user disables an impact level
- **THEN** events of that impact are hidden locally
- **AND** the system does not call the backend solely to remove or hide those events
- **AND** already loaded events of that impact remain available for later merging and display

#### Scenario: No impacts selected
- **WHEN** the user disables every calendar impact level
- **THEN** the chart renders no calendar events or markers
- **AND** the system does not request calendar events until an impact level is enabled

#### Scenario: Reload chart data with selected impacts
- **WHEN** the chart performs an initial load, refresh, calendar-layer re-enablement, asset or timeframe load, or lazy older-history load
- **THEN** each calendar request includes all impact levels currently selected by the user
- **AND** every date-range chunk carries the same selected impact parameters

#### Scenario: On-demand impact request fails
- **WHEN** loading a newly selected impact fails or returns an invalid response
- **THEN** previously loaded calendar events remain available
- **AND** the system shows concise calendar-layer failure feedback

### Requirement: Calendar event range selection
The system SHALL request calendar events using valid half-open ranges that fit backend limits while covering recent and upcoming events.

#### Scenario: Initial calendar range
- **WHEN** the system builds the initial calendar event request for a latest candle load
- **THEN** `from` is no earlier than the later of the candle request `from` and 180 days before the current time
- **AND** `to` includes up to 14 days after the current time when possible
- **AND** `to` is exclusive, after `from`, and no more than 366 days after `from`

#### Scenario: Lazy older calendar range
- **WHEN** the user loads an older candle window and the Calendar layer is enabled
- **THEN** the system requests calendar events for the older window
- **AND** any calendar request chunk is no longer than 366 days

#### Scenario: Calendar layer disabled during history load
- **WHEN** the user loads older candles while the Calendar layer is disabled
- **THEN** the system does not fetch older calendar events solely for hidden marker visibility

### Requirement: Calendar event marker lane
The system SHALL render candle-mapped economic calendar events in a dedicated chart lane below the active KLineCharts canvas area and above the existing legend/footer.

#### Scenario: Render mapped event marker
- **WHEN** the Calendar layer is enabled and an economic calendar event has a valid `time` that can be mapped to a loaded candle
- **THEN** the system renders a compact marker for that event in the calendar lane at the corresponding chart position

#### Scenario: Future event without candle
- **WHEN** an economic calendar event is returned for a future time that cannot be mapped to a loaded candle
- **THEN** the system does not extend the candle chart range to display the marker
- **AND** the event remains available in the calendar quick list

#### Scenario: Invalid event time
- **WHEN** an economic calendar event has an invalid `time`
- **THEN** the system omits that event from chart marker placement
- **AND** valid calendar events continue to render

#### Scenario: Dense calendar events
- **WHEN** multiple economic calendar events map to the same candle time or lane position
- **THEN** the system groups them into one lane marker
- **AND** the grouped quick list lets the user inspect the contained events

#### Scenario: Calendar lane renders below chart canvas
- **WHEN** the Calendar layer is enabled and economic calendar events are available
- **THEN** the chart canvas area is resized to leave dedicated space for the calendar lane
- **AND** the calendar lane renders in that dedicated space below the chart canvas
- **AND** candles, indicators, and the volume pane remain unobstructed by the lane

#### Scenario: Calendar lane keeps chart x-axis alignment
- **WHEN** a calendar event maps to a visible chart time
- **THEN** its lane marker is horizontally aligned with the chart x-coordinate for that event time
- **AND** visual lane padding does not shift marker placement away from the chart coordinate system

### Requirement: Calendar marker styling and legend
The system SHALL distinguish calendar markers from existing event annotation markers with compact styling and legend text, while calendar quick lists SHALL use the canonical economic calendar impact badges.

#### Scenario: Calendar legend point
- **WHEN** the Calendar layer is enabled and calendar events are available
- **THEN** the workbench displays a legend point labeled `Economic calendar` in English and `Lịch kinh tế` in Vietnamese
- **AND** the legend point uses a calendar-specific color distinct from bullish, bearish, neutral, and mixed annotation colors

#### Scenario: Impact styling
- **WHEN** a calendar quick-list event includes an `impact` value
- **THEN** the quick list renders the impact as the canonical localized uppercase economic calendar Badge
- **AND** recognized high, medium, and low values use the approved red, purple, and sky treatments respectively
- **AND** unrecognized values use the neutral outline treatment
- **AND** the system does not translate raw `actualBetterWorse` or `revisionBetterWorse` values

#### Scenario: Calendar marker impact behavior remains stable
- **WHEN** a calendar event includes an `impact` value
- **THEN** existing marker grouping, priority, and calendar-specific marker color behavior remain unchanged

#### Scenario: Calendar layer disabled hides legend
- **WHEN** the Calendar layer is disabled
- **THEN** the workbench does not show calendar marker legend copy

#### Scenario: Single calendar event marker
- **WHEN** one economic calendar event maps to a lane marker position
- **THEN** the system renders a compact calendar marker without a separate count badge

#### Scenario: Multiple calendar events marker
- **WHEN** multiple economic calendar events map to the same lane marker position
- **THEN** the system renders the grouped event count inside the marker node
- **AND** the system does not render a separate floating count badge outside the marker node

### Requirement: Calendar hover guide line
The system SHALL show a red vertical guide line over the chart when users hover or focus a calendar event marker.

#### Scenario: Hover calendar marker
- **WHEN** a user hovers a calendar marker in the lane
- **THEN** the chart displays a red vertical line aligned to that event time

#### Scenario: Focus calendar marker
- **WHEN** a keyboard user focuses a calendar marker in the lane
- **THEN** the chart displays the same red vertical alignment line

#### Scenario: Leave calendar marker
- **WHEN** the calendar marker is no longer hovered or focused
- **THEN** the red vertical guide line is removed

#### Scenario: Calendar hover guide stays in chart area
- **WHEN** a user hovers or focuses a calendar lane marker
- **THEN** the red vertical guide line aligns with the marker x-coordinate
- **AND** the guide line does not render through the calendar lane itself

### Requirement: Calendar quick list and detail navigation
The system SHALL provide an accessible, decision-focused quick list for loaded calendar events and route users to the existing economic calendar detail page for full content.

#### Scenario: Show quick-list hierarchy
- **WHEN** a user opens a calendar marker or grouped calendar marker
- **THEN** each event displays its available time and canonical localized impact Badge on the first metadata row
- **AND** its title is displayed as the event identity
- **AND** its available currency code and localized publication-status Badge are displayed together on the following metadata row
- **AND** the quick list does not display event type
- **AND** missing optional fields do not produce placeholder copy

#### Scenario: Show release comparison
- **WHEN** a quick-list event includes any of actual, forecast, or previous values
- **THEN** the available values are displayed in a compact comparison with actual first, forecast second, and previous third
- **AND** actual has stronger visual emphasis than forecast and previous
- **AND** an available revision is displayed as secondary supporting data rather than as a peer of the three primary values

#### Scenario: Omit better-or-worse metadata
- **WHEN** a quick-list event includes `actualBetterWorse` or `revisionBetterWorse`
- **THEN** the quick list does not render either field

#### Scenario: Localize publication status
- **WHEN** a quick-list event has status `AVAILABLE`
- **THEN** its status Badge displays `Published` in English and `Đã công bố` in Vietnamese
- **AND** the Badge is positioned beside the currency code rather than beside the time

#### Scenario: Pending publication status
- **WHEN** a quick-list event has status `PENDING`
- **THEN** its status Badge displays the localized pending label beside the currency code

#### Scenario: Missing quick-list impact
- **WHEN** a calendar quick-list event has no impact value
- **THEN** the quick list does not render an impact placeholder or no-impact badge

#### Scenario: Show supporting description
- **WHEN** a quick-list event includes a description
- **THEN** the description is displayed as clamped secondary text after the release values

#### Scenario: Separate multiple events
- **WHEN** a quick list contains more than one calendar event
- **THEN** a decorative Separator is displayed between adjacent event articles
- **AND** no Separator is displayed after the final event

#### Scenario: Scroll overflowing events
- **WHEN** quick-list content exceeds the bounded popover height
- **THEN** the events scroll inside the shared ScrollArea
- **AND** the scrollbar does not cover event content or prevent keyboard access to detail actions

#### Scenario: Open full calendar detail
- **WHEN** a calendar event is displayed in the quick list
- **THEN** the event provides one detail action labeled `Details` in English and `Chi tiết` in Vietnamese
- **AND** activating the action navigates to the locale-preserving `/economic-calendar/{id}` detail route
- **AND** it relies on the existing `GET /economic-calendar/{id}` detail endpoint for content
- **AND** the quick list does not render a separate content-availability sentence

#### Scenario: Keyboard calendar review
- **WHEN** calendar events are loaded
- **THEN** users can focus calendar lane markers and each quick-list detail action by keyboard
- **AND** every detail action has visible focus and can be activated without pointer-only chart interaction
