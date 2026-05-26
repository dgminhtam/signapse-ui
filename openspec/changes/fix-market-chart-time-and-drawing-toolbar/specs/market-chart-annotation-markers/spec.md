## MODIFIED Requirements

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

#### Scenario: Ignore malformed annotation items
- **WHEN** the annotation collection contains a null, undefined, or malformed annotation item
- **THEN** the system omits that item before reading annotation `time`
- **AND** valid annotations continue to group and render as chart markers
- **AND** the market chart does not crash with a runtime `.time` read error

#### Scenario: Avoid long chart labels
- **WHEN** the system renders annotation markers
- **THEN** markers use compact visual labels or icons
- **AND** the system does not render long annotation title, summary, evidence, or reaction text directly over the chart canvas
