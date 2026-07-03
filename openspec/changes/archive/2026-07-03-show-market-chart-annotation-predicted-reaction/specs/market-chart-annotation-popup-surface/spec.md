## MODIFIED Requirements

### Requirement: Annotation popup content is a concise preview
The system SHALL present annotation popup content as a concise event preview rather than a rich evidence/detail reader, with per-event date, predicted reaction, and compact evaluated outcome context when available.

#### Scenario: Popup group header
- **WHEN** an annotation popup opens
- **THEN** the popup shared header shows the grouped event count using the annotation group color treatment
- **AND** the shared header does not render per-event direction, confidence, or timestamp badges

#### Scenario: Event date appears above title
- **WHEN** an annotation popup displays event content
- **THEN** each event shows the annotation `time` as localized date metadata above that event title

#### Scenario: Severity is hidden
- **WHEN** an annotation has severity such as `MEDIUM`
- **THEN** the popup does not render that severity badge

#### Scenario: Event body is simplified
- **WHEN** an annotation popup displays event content
- **THEN** each event shows title and summary when available

#### Scenario: Predicted reaction appears before actual reaction
- **WHEN** an annotation has `topMarketReaction.direction`
- **THEN** the popup renders a compact predicted reaction section before the actual reaction section
- **AND** the predicted reaction direction is shown as a localized direction badge

#### Scenario: Predicted reaction is omitted when unavailable
- **WHEN** an annotation has no `topMarketReaction` or its `direction` is null
- **THEN** the popup does not render a predicted reaction section or placeholder copy for that annotation

#### Scenario: Actual reaction section appears below prediction
- **WHEN** an annotation has `topMarketReaction.outcome`
- **THEN** the popup renders a compact actual reaction section below the predicted reaction section when the prediction is present
- **AND** the section preserves realized return, actual direction, alignment, and evaluated-at details when those fields are available

#### Scenario: Actual reaction shows price and time ranges
- **WHEN** an annotation outcome includes anchor or evaluation price or time fields
- **THEN** the actual reaction section shows price change as `anchorPrice` to `evaluationPrice` when either price is available
- **AND** the actual reaction section shows evaluation time as `anchorTime` to `evaluationTime` when either time is available

#### Scenario: Actual reaction section is omitted when unavailable
- **WHEN** an annotation has no `topMarketReaction` or its `outcome` is null
- **THEN** the popup does not render an actual reaction section or placeholder outcome copy for that annotation

#### Scenario: Rich detail content is omitted
- **WHEN** an annotation includes reaction reasoning, evidence items, event detail links, or non-primary `marketReactions[]`
- **THEN** the popup does not render those rich detail blocks in this quick preview surface
- **AND** compact predicted and actual reaction sections remain allowed when their `topMarketReaction` data is present
