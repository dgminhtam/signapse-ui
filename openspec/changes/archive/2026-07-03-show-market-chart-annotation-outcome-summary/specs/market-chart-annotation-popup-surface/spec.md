## ADDED Requirements

### Requirement: Annotation outcome summary is shown in reaction preview
The system SHALL display a backend-provided annotation outcome summary inside the market chart annotation popup reaction preview.

#### Scenario: Outcome summary is available
- **WHEN** an annotation reaction outcome includes a non-empty `summary`
- **THEN** the popup shows that summary inside the existing reaction block after the reaction metrics
- **AND** the summary remains visually secondary to the event title and event summary

#### Scenario: Outcome summary is missing
- **WHEN** an annotation reaction outcome has no `summary` or only whitespace
- **THEN** the popup omits the outcome summary text without rendering an empty placeholder

#### Scenario: Summary is the only reaction display field
- **WHEN** an annotation reaction outcome has a non-empty `summary` but no displayable direction, price change, or evaluation time range
- **THEN** the popup still renders the reaction block with the summary
