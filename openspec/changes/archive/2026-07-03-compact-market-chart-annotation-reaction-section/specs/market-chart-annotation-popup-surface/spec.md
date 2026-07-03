## MODIFIED Requirements

### Requirement: Annotation popup content is a concise preview
The system SHALL present annotation popup content as a concise event preview rather than a rich evidence/detail reader, with per-event date and compact predicted-versus-actual reaction context when available.

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

#### Scenario: Reaction comparison appears in one section
- **WHEN** an annotation has `topMarketReaction.direction` or `topMarketReaction.outcome`
- **THEN** the popup renders one compact reaction comparison section for that annotation
- **AND** the popup does not render separate predicted and actual reaction sections for that annotation

#### Scenario: Predicted direction uses a badge
- **WHEN** an annotation has `topMarketReaction.direction`
- **THEN** the reaction section shows the predicted direction as a localized direction badge

#### Scenario: Actual direction uses a badge
- **WHEN** an annotation outcome has `actualDirection`
- **THEN** the reaction section shows the actual direction as a localized direction badge
- **AND** the popup does not show the outcome `alignment` badge in this preview

#### Scenario: Price change shows movement tone
- **WHEN** an annotation outcome includes `anchorPrice` and `evaluationPrice`
- **THEN** the reaction section shows price change as `anchorPrice` to `evaluationPrice`
- **AND** the `anchorPrice` value uses the default text treatment
- **AND** only the `evaluationPrice` value uses a green upward movement treatment when `evaluationPrice` is greater than `anchorPrice`
- **AND** only the `evaluationPrice` value uses a red downward movement treatment when `evaluationPrice` is less than `anchorPrice`
- **AND** the movement icon appears after the evaluation value

#### Scenario: Realized return appears with evaluation price
- **WHEN** an annotation outcome includes `evaluationPrice` and `realizedReturn`
- **THEN** the reaction section shows the formatted realized return in parentheses after the evaluation price
- **AND** the reaction section does not render a separate realized return label or row

#### Scenario: Actual reaction shows time range
- **WHEN** an annotation outcome includes anchor or evaluation time fields
- **THEN** the reaction section shows the available `anchorTime` to `evaluationTime` range

#### Scenario: Reaction comparison is omitted when unavailable
- **WHEN** an annotation has no `topMarketReaction` or the primary reaction has no displayable direction or outcome fields
- **THEN** the popup does not render a reaction comparison section or placeholder copy for that annotation

#### Scenario: Rich detail content is omitted
- **WHEN** an annotation includes reaction reasoning, evidence items, event detail links, or non-primary `marketReactions[]`
- **THEN** the popup does not render those rich detail blocks in this quick preview surface
- **AND** compact reaction comparison remains allowed when its `topMarketReaction` data is present
