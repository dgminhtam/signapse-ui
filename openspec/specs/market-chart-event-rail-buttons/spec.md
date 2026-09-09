# market-chart-event-rail-buttons Specification

## Purpose
TBD - created by archiving change refine-market-chart-event-rail-buttons. Update Purpose after archive.
## Requirements
### Requirement: Event rail milestone buttons are removed
The system SHALL NOT render annotation milestone buttons in the market chart bottom rail; annotation groups are represented by status metadata and the accessible legend action.

#### Scenario: Annotation groups are available
- **WHEN** the market chart has loaded one or more annotation groups
- **THEN** the bottom rail displays compact annotation status metadata
- **AND** the rail does not render clickable milestone buttons

#### Scenario: Milestone has multiple annotations
- **WHEN** a bottom rail milestone represents more than one annotation
- **THEN** the aggregate annotation count is available through the status metadata or legend disclosure

#### Scenario: Milestone is selected
- **WHEN** a user selects a bottom rail milestone
- **THEN** the existing marker interaction remains available on the chart
- **AND** the bottom rail does not introduce a second selection control

#### Scenario: Milestone is activated
- **WHEN** a user clicks a bottom rail milestone
- **THEN** no milestone activation is available
- **AND** users continue to open annotation details from the chart marker

### Requirement: Compact event rail surface
The system SHALL keep the single bottom status rail compact and visually subordinate to the market chart.

#### Scenario: Event rail renders with milestones
- **WHEN** annotation groups are available
- **THEN** the rail displays a subdued leading event count
- **AND** the rail does not display a horizontally scrollable milestone action row
- **AND** the rail does not introduce a custom timeline scrubber or mini chart

#### Scenario: Event rail is loading
- **WHEN** annotation groups are loading
- **THEN** the rail displays compact loading feedback aligned with the final rail layout

#### Scenario: Event rail is empty
- **WHEN** no annotation groups are available in the current range
- **THEN** the rail displays concise empty metadata when applicable
- **AND** the rail does not render placeholder milestone buttons
