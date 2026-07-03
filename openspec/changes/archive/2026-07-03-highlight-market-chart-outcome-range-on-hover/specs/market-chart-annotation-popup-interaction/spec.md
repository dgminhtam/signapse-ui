## ADDED Requirements

### Requirement: Outcome range hover highlight
The system SHALL show a transient chart time-range highlight when users inspect an annotation outcome from the popup.

#### Scenario: Hover reaction section with complete outcome range
- **WHEN** a popup reaction section has both `outcome.anchorTime` and `outcome.evaluationTime`
- **AND** the user hovers or focuses that reaction section
- **THEN** the chart shows a non-interactive highlight band covering the corresponding time range on the candle pane

#### Scenario: Missing outcome range
- **WHEN** a popup reaction section is missing `outcome.anchorTime` or `outcome.evaluationTime`
- **THEN** hovering or focusing that reaction section does not show a chart range highlight

#### Scenario: Hover leaves reaction section
- **WHEN** the user stops hovering or focusing the reaction section
- **THEN** the chart range highlight is cleared

#### Scenario: Popup closes
- **WHEN** the annotation popup closes while a range highlight is visible
- **THEN** the chart range highlight is cleared

#### Scenario: Chart viewport changes
- **WHEN** the chart scrolls, zooms, resizes, or its visible range changes while a range highlight is active
- **THEN** the range highlight remains aligned to the current candle pane coordinates

#### Scenario: Range is outside the visible pane
- **WHEN** the hovered outcome range is partially visible in the current chart viewport
- **THEN** the visible portion of the highlight is clamped to the candle pane bounds
- **AND** the highlight is omitted when no part of the range can be mapped to visible finite chart coordinates

#### Scenario: Highlight remains visual-only
- **WHEN** an outcome range highlight is shown
- **THEN** it does not intercept chart pointer interactions
- **AND** it is not created as a persisted drawing or selectable klinecharts overlay
