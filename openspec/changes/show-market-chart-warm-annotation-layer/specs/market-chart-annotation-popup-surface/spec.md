## ADDED Requirements

### Requirement: Warm annotation outcome preview
The system SHALL display available top-level warm annotation outcome data in the market chart annotation popup when primary reaction outcome data is unavailable.

#### Scenario: Top-level outcome is available
- **WHEN** an annotation has no `topMarketReaction.outcome`
- **AND** the annotation includes a top-level `outcome`
- **THEN** the popup renders the compact outcome preview from the top-level outcome
- **AND** the popup does not require a `topMarketReaction` to show actual outcome fields

#### Scenario: Primary reaction outcome takes precedence
- **WHEN** an annotation has both `topMarketReaction.outcome` and top-level `outcome`
- **THEN** the popup renders the existing primary reaction outcome preview from `topMarketReaction.outcome`

#### Scenario: No outcome data
- **WHEN** an annotation has neither `topMarketReaction.outcome` nor top-level `outcome`
- **THEN** the popup omits the outcome preview without rendering placeholder outcome copy
