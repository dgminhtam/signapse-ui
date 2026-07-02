## MODIFIED Requirements

### Requirement: Annotation popup content is a concise preview
The system SHALL present annotation popup content as a concise event preview rather than a rich evidence/detail reader, with a compact evaluated outcome summary when the primary reaction outcome is available.

#### Scenario: Popup metadata row
- **WHEN** an annotation popup opens
- **THEN** direction, confidence when present, event time, and grouped count when applicable appear together in the top metadata area

#### Scenario: Severity is hidden
- **WHEN** an annotation has severity such as `MEDIUM`
- **THEN** the popup does not render that severity badge

#### Scenario: Event body is simplified
- **WHEN** an annotation popup displays event content
- **THEN** each event shows title and summary when available

#### Scenario: Outcome section appears below summary
- **WHEN** an annotation has `topMarketReaction.outcome`
- **THEN** the popup renders a compact outcome section below that annotation summary
- **AND** the section prioritizes realized return, alignment, actual direction, and evaluation price or time when those fields are available

#### Scenario: Outcome section is omitted when unavailable
- **WHEN** an annotation has no `topMarketReaction` or its `outcome` is null
- **THEN** the popup does not render an outcome section or placeholder outcome copy for that annotation

#### Scenario: Rich detail content is omitted
- **WHEN** an annotation includes reaction reasoning, evidence items, event detail links, or non-primary `marketReactions[]`
- **THEN** the popup does not render those rich detail blocks in this quick preview surface
- **AND** the compact primary outcome section remains allowed when `topMarketReaction.outcome` is present
