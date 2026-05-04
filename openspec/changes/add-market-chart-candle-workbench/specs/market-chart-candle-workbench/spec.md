## ADDED Requirements

### Requirement: Authorized market chart route
The system SHALL expose a protected market chart workbench route for users who can read market chart candles.

#### Scenario: Authorized user opens the workbench
- **WHEN** a user with `market-chart:read` navigates to `/market-charts`
- **THEN** the system displays the market chart workbench shell

#### Scenario: Unauthorized user opens the workbench
- **WHEN** a user without `market-chart:read` navigates to `/market-charts`
- **THEN** the system displays an access denied state that names the required permission

#### Scenario: Navigation and breadcrumb copy
- **WHEN** the market chart route is available to the user
- **THEN** navigation and breadcrumbs label the screen in professional Vietnamese as `Biểu đồ giá`

### Requirement: Candle request controls
The system SHALL let authorized users request candles by provider symbol, timeframe, and ISO time window.

#### Scenario: Submit valid candle request
- **WHEN** the user enters a non-empty symbol, selects a supported timeframe, chooses a valid `from` and `to` where `from` is before `to`, and submits the form
- **THEN** the system requests candles from `GET /market-charts/candles` using flat query parameters `symbol`, `timeframe`, `from`, and `to`

#### Scenario: Persist chart state in URL
- **WHEN** a candle request is submitted
- **THEN** the route URL includes the selected `symbol`, `timeframe`, `from`, and `to` query params

#### Scenario: Reject invalid request before fetch
- **WHEN** the user submits a blank symbol, unsupported timeframe, malformed date, or a `from` value that is not before `to`
- **THEN** the system prevents the fetch and shows field-level validation guidance in Vietnamese

### Requirement: Candle API integration
The system SHALL define market chart frontend types, validation, and authenticated action for the backend candle bridge.

#### Scenario: Fetch authenticated candle data
- **WHEN** the workbench needs candle data
- **THEN** the system calls the backend candle endpoint through `fetchAuthenticated()`

#### Scenario: Parse candle response
- **WHEN** the backend returns a candle response
- **THEN** the system validates and maps `provider`, `symbol`, `timeframe`, `from`, `to`, and `candles[]` before rendering

#### Scenario: Handle backend error
- **WHEN** the backend rejects the request or provider fetch fails
- **THEN** the system shows a non-crashing error state with retry guidance in Vietnamese

### Requirement: Candlestick chart rendering
The system SHALL render successful candle responses as a financial candlestick chart using Lightweight Charts.

#### Scenario: Render candles
- **WHEN** the backend returns one or more candles
- **THEN** the system renders candlesticks using candle `time`, `open`, `high`, `low`, and `close`

#### Scenario: Render volume when available
- **WHEN** candles include volume values
- **THEN** the system renders volume as a secondary visual layer or summary without competing with the price chart

#### Scenario: Resize chart surface
- **WHEN** the chart container size changes
- **THEN** the chart resizes without overflowing the app layout

### Requirement: Workbench states
The system SHALL provide clear visual states for the market chart workbench lifecycle.

#### Scenario: First run
- **WHEN** the user opens the workbench without query params
- **THEN** the system shows an empty state explaining how to request a chart

#### Scenario: Loading data
- **WHEN** a candle request is pending
- **THEN** the system shows a skeleton or spinner state that mirrors the final chart shell

#### Scenario: No candle data
- **WHEN** the backend returns a successful response with an empty `candles[]`
- **THEN** the system shows a no-data state that preserves the selected symbol, timeframe, provider, and time window

### Requirement: Future overlay boundaries
The system SHALL make room for future event overlays without exposing unsupported annotation behavior.

#### Scenario: Annotation data is unavailable
- **WHEN** the current candle response does not include annotations
- **THEN** the system does not render fake event markers or event popups

#### Scenario: Future event panel placeholder
- **WHEN** the workbench displays contextual side content for event overlays
- **THEN** the panel clearly states that event marker support depends on a future backend contract
