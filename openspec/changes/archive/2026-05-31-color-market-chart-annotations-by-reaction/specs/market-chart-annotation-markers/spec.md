## MODIFIED Requirements

### Requirement: Annotation marker rendering
The system SHALL render backend `annotations[]` as visual markers on the candlestick chart when the annotation layer is enabled.

#### Scenario: Render returned annotations
- **WHEN** the backend returns candles and non-empty `annotations[]`
- **THEN** the system renders markers at the annotation times on the candlestick chart

#### Scenario: Direction-specific marker treatment
- **WHEN** an annotation or grouped annotation marker has direction `BULLISH`, `BEARISH`, `MIXED`, or `NEUTRAL`
- **THEN** the system maps the marker to a distinct reaction color treatment that helps users scan positive, negative, mixed, and neutral events
- **AND** `BULLISH` markers use a green positive treatment
- **AND** `BEARISH` markers use a red negative treatment
- **AND** `NEUTRAL` markers use an amber neutral treatment
- **AND** `MIXED` markers use a non-directional mixed treatment that is visually distinct from pure positive and pure negative markers

#### Scenario: Missing direction fallback
- **WHEN** an annotation marker has no usable direction
- **THEN** the system renders a muted fallback marker treatment
- **AND** the marker remains visible enough to identify that an event exists

#### Scenario: Ignore invalid annotation time
- **WHEN** an annotation has an invalid time or cannot be placed in the loaded chart range
- **THEN** the system does not crash
- **AND** the system omits that annotation from chart markers

#### Scenario: Avoid long chart labels
- **WHEN** the system renders annotation markers
- **THEN** markers use compact visual labels or icons
- **AND** the system does not render long annotation title, summary, evidence, or reaction text directly over the chart canvas
