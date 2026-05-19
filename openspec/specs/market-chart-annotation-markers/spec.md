# market-chart-annotation-markers Specification

## Purpose
TBD - created by archiving change add-market-chart-annotation-markers. Update Purpose after archive.
## Requirements
### Requirement: Annotation layer control
The system SHALL let users enable or disable market chart annotation markers from the market chart workbench.

#### Scenario: Enable annotation layer
- **WHEN** a user enables the annotation layer for a selected watchlist asset and timeframe
- **THEN** the system requests candle data from `GET /market-charts/candles` with `includeAnnotations=true`

#### Scenario: Disable annotation layer
- **WHEN** a user disables the annotation layer
- **THEN** the system requests or refreshes candle data with `includeAnnotations=false`
- **AND** the chart does not render annotation markers

#### Scenario: Preserve chart identity
- **WHEN** the annotation layer is toggled
- **THEN** the route state continues to identify the chart by `assetId` and `timeframe`
- **AND** the system does not add manual `from`, `to`, or `symbol` controls

### Requirement: Annotation marker rendering
The system SHALL render backend `annotations[]` as visual markers on the candlestick chart when the annotation layer is enabled.

#### Scenario: Render returned annotations
- **WHEN** the backend returns candles and non-empty `annotations[]`
- **THEN** the system renders markers at the annotation times on the candlestick chart

#### Scenario: Direction-specific marker treatment
- **WHEN** an annotation has direction `BULLISH`, `BEARISH`, `MIXED`, or `NEUTRAL`
- **THEN** the system maps the direction to a distinct marker treatment that helps users scan positive, negative, mixed, and neutral events

#### Scenario: Ignore invalid annotation time
- **WHEN** an annotation has an invalid time or cannot be placed in the loaded chart range
- **THEN** the system does not crash
- **AND** the system omits that annotation from chart markers

#### Scenario: Avoid long chart labels
- **WHEN** the system renders annotation markers
- **THEN** markers use compact visual labels or icons
- **AND** the system does not render long annotation title, summary, evidence, or reaction text directly over the chart canvas

### Requirement: Group dense annotation markers
The system SHALL avoid visually stacking multiple annotation markers at the same chart time.

#### Scenario: Multiple annotations share one chart time
- **WHEN** multiple annotations map to the same chart time bucket
- **THEN** the chart renders a single grouped marker for that time
- **AND** the grouped detail surface allows the user to inspect the contained annotations

#### Scenario: Single annotation at a chart time
- **WHEN** only one annotation maps to a chart time
- **THEN** the chart renders it as a single annotation marker

### Requirement: Annotation detail inspection
The system SHALL let users inspect annotation details outside the chart canvas.

#### Scenario: Select annotation marker
- **WHEN** a user selects an annotation marker or grouped marker
- **THEN** the system shows the selected annotation or group details in the workbench

#### Scenario: Show useful annotation fields
- **WHEN** annotation details are shown
- **THEN** the system displays available title, time, direction, severity, confidence, summary, reaction context, evidence, and event detail link

#### Scenario: Omit unavailable optional fields
- **WHEN** optional annotation fields are missing or null
- **THEN** the system omits those fields without rendering placeholder technical copy

#### Scenario: Open event detail link
- **WHEN** an annotation includes `links.eventDetail`
- **THEN** the system provides a user-accessible action to open that event detail target

### Requirement: Accessible annotation navigation
The system SHALL provide a keyboard-accessible way to review annotations when the annotation layer is enabled.

#### Scenario: Keyboard annotation review
- **WHEN** the annotation layer is enabled and annotations are available
- **THEN** the system exposes annotation rows or controls outside the canvas that can receive keyboard focus

#### Scenario: Canvas interaction is unavailable
- **WHEN** a user cannot interact with chart markers directly
- **THEN** the user can still select and inspect annotations through the accessible annotation controls

### Requirement: Annotation empty and loading states
The system SHALL handle annotation loading and empty states without adding redundant screen copy.

#### Scenario: Annotation layer loading
- **WHEN** the annotation layer is enabled and the chart request is pending
- **THEN** the system shows pending feedback without changing the final chart layout unexpectedly

#### Scenario: No annotations returned
- **WHEN** the annotation layer is enabled and the backend returns an empty `annotations[]`
- **THEN** the system shows a concise empty annotation state
- **AND** the system does not render fake markers or future-feature placeholder panels

#### Scenario: Annotation layer disabled
- **WHEN** the annotation layer is disabled
- **THEN** the system does not show annotation empty-state copy as if data were missing

