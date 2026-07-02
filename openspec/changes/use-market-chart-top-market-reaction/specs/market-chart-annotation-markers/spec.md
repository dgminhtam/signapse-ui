## MODIFIED Requirements

### Requirement: Annotation detail inspection
The system SHALL let users inspect annotation details outside the chart canvas.

#### Scenario: Select annotation marker
- **WHEN** a user selects an annotation marker or grouped marker
- **THEN** the system shows the selected annotation or group details in the workbench

#### Scenario: Show useful annotation fields
- **WHEN** annotation details are shown
- **THEN** the system displays available title, time, direction, severity, confidence, summary, primary reaction context from `topMarketReaction`, evidence, and event detail link

#### Scenario: Omit unavailable optional fields
- **WHEN** optional annotation fields are missing or null
- **THEN** the system omits those fields without rendering placeholder technical copy

#### Scenario: Omit missing primary reaction
- **WHEN** an annotation has no `topMarketReaction`
- **THEN** the system does not display reaction-derived confidence or infer a primary reaction from `marketReactions[]`

#### Scenario: Open event detail link
- **WHEN** an annotation includes `links.eventDetail`
- **THEN** the system provides a user-accessible action to open that event detail target
