## MODIFIED Requirements

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

## ADDED Requirements

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

