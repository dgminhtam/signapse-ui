## MODIFIED Requirements

### Requirement: Annotation layer control
The system SHALL enable market chart annotation markers by default and let users disable or re-enable them from the market chart workbench.

#### Scenario: Annotation layer defaults to enabled
- **WHEN** a user opens the market chart workbench for a selected watchlist asset and timeframe
- **THEN** the annotation layer is enabled by default
- **AND** the system requests annotations from `GET /market-charts/annotations` for the loaded candle window

#### Scenario: Enable annotation layer
- **WHEN** a user enables the annotation layer for a selected watchlist asset and timeframe
- **THEN** the system requests annotations from `GET /market-charts/annotations` for the loaded candle window if annotation data is not already available

#### Scenario: Disable annotation layer
- **WHEN** a user disables the annotation layer
- **THEN** the chart does not render annotation markers
- **AND** the system does not send `includeAnnotations=false` to the candle endpoint

#### Scenario: Preserve chart identity
- **WHEN** the annotation layer is toggled
- **THEN** the route state continues to identify the chart by `assetId` and `timeframe`
- **AND** the system does not add manual `from`, `to`, or `symbol` controls

### Requirement: Annotation marker rendering
The system SHALL render backend annotation endpoint results as visual markers on the candlestick chart when the annotation layer is enabled.

#### Scenario: Fetch annotation endpoint data
- **WHEN** the annotation layer is enabled for a loaded candle window
- **THEN** the system calls `GET /market-charts/annotations` through an authenticated market chart action
- **AND** it sends flat query parameters `assetId`, `from`, and `to`

#### Scenario: Render returned annotations
- **WHEN** the backend returns non-empty annotation endpoint data
- **THEN** the system renders markers at the annotation times on the candlestick chart

#### Scenario: Direction-specific marker treatment
- **WHEN** an annotation has direction `BULLISH`, `BEARISH`, `MIXED`, or `NEUTRAL`
- **THEN** the system maps the direction to a distinct marker treatment that helps users scan positive, negative, mixed, and neutral events

#### Scenario: Ignore invalid annotation time
- **WHEN** an annotation has an invalid time or cannot be placed in the loaded chart range
- **THEN** the system does not crash
- **AND** the system omits that annotation from chart markers

#### Scenario: Ignore malformed annotation items
- **WHEN** the annotation collection contains a null, undefined, or malformed annotation item
- **THEN** the system omits that item before reading annotation `time`
- **AND** valid annotations continue to group and render as chart markers
- **AND** the market chart does not crash with a runtime `.time` read error

#### Scenario: Avoid long chart labels
- **WHEN** the system renders annotation markers
- **THEN** markers use compact visual labels or icons
- **AND** the system does not render long annotation title, summary, evidence, or reaction text directly over the chart canvas

### Requirement: Annotation empty and loading states
The system SHALL handle annotation loading and empty states without adding redundant screen copy.

#### Scenario: Annotation layer loading
- **WHEN** the annotation layer is enabled and the annotation request is pending
- **THEN** the system shows pending feedback without changing the final chart layout unexpectedly

#### Scenario: No annotations returned
- **WHEN** the annotation layer is enabled and the backend returns an empty annotation collection
- **THEN** the system shows a concise empty annotation state
- **AND** the system does not render fake markers or future-feature placeholder panels

#### Scenario: Annotation layer disabled
- **WHEN** the annotation layer is disabled
- **THEN** the system does not show annotation empty-state copy as if data were missing
