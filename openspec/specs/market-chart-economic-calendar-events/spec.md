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
The system SHALL load asset-relevant economic calendar events through `GET /market-charts/economic-calendar-events` using authenticated market chart access.

#### Scenario: Fetch calendar endpoint data
- **WHEN** the Calendar layer is enabled for a loaded chart
- **THEN** the system calls `GET /market-charts/economic-calendar-events` through an authenticated action
- **AND** it sends flat query parameters `assetId`, `from`, and `to`
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
- **THEN** the chart keeps loaded candle data visible
- **AND** the system shows concise feedback for the calendar layer failure
- **AND** the failure does not reset the selected asset, timeframe, annotation data, live data, or chart instance

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
The system SHALL distinguish calendar markers from existing event annotation markers with compact styling and legend text.

#### Scenario: Calendar legend point
- **WHEN** the Calendar layer is enabled and calendar events are available
- **THEN** the workbench displays a legend point labeled `Economic calendar` in English and `Lịch kinh tế` in Vietnamese
- **AND** the legend point uses a calendar-specific color distinct from bullish, bearish, neutral, and mixed annotation colors

#### Scenario: Impact styling
- **WHEN** a calendar event includes an `impact` value
- **THEN** the marker and quick list use impact as supporting style context
- **AND** the system does not translate raw `actualBetterWorse` or `revisionBetterWorse` values

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
The system SHALL provide an accessible quick list for loaded calendar events and route users to the existing economic calendar detail page for full content.

#### Scenario: Show quick list fields
- **WHEN** a user opens a calendar marker or grouped calendar marker
- **THEN** the quick list displays available `time`, title, currency code, type, impact, forecast value, previous value, actual value, revision, better/worse fields, description, status, and content availability without placeholder copy for missing optional fields

#### Scenario: Open full calendar detail
- **WHEN** a user activates a calendar event detail action
- **THEN** the system navigates to the locale-preserving `/economic-calendar/{id}` detail route
- **AND** it relies on the existing `GET /economic-calendar/{id}` detail endpoint for content

#### Scenario: Keyboard calendar review
- **WHEN** calendar events are loaded
- **THEN** users can focus calendar lane markers or quick list entries by keyboard
- **AND** they can open the event detail action without requiring pointer-only chart interaction
