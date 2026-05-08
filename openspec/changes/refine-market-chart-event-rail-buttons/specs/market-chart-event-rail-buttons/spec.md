## ADDED Requirements

### Requirement: Event rail milestone buttons
The system SHALL render market chart bottom event rail milestones as shadcn-aligned outline button controls.

#### Scenario: Annotation groups are available
- **WHEN** the market chart has loaded one or more annotation groups
- **THEN** each bottom rail milestone is rendered as a clickable outline button control
- **AND** the milestone displays the annotation group time
- **AND** the milestone retains the event dot indicator

#### Scenario: Milestone has multiple annotations
- **WHEN** a bottom rail milestone represents more than one annotation
- **THEN** the milestone displays a secondary count badge inside the outline button

#### Scenario: Milestone is selected
- **WHEN** a user selects a bottom rail milestone
- **THEN** the selected milestone exposes pressed state with `aria-pressed`
- **AND** the selected milestone remains visually identifiable without using a filled primary button treatment

#### Scenario: Milestone is activated
- **WHEN** a user clicks a bottom rail milestone
- **THEN** the system selects the corresponding annotation group
- **AND** the chart annotation popup behavior remains available for that group

### Requirement: Compact event rail surface
The system SHALL keep the bottom event rail compact and visually subordinate to the market chart.

#### Scenario: Event rail renders with milestones
- **WHEN** annotation groups are available
- **THEN** the rail displays a subdued leading event count
- **AND** the rail displays milestone buttons in a horizontally scrollable action row
- **AND** the rail does not introduce a custom timeline scrubber or mini chart

#### Scenario: Event rail is loading
- **WHEN** annotation groups are loading
- **THEN** the rail displays compact loading feedback aligned with the final rail layout

#### Scenario: Event rail is empty
- **WHEN** no annotation groups are available in the current range
- **THEN** the rail displays a single subdued Vietnamese empty message
- **AND** the rail does not render placeholder buttons
