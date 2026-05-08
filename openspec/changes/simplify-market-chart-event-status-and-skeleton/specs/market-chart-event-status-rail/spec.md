## ADDED Requirements

### Requirement: Status-only annotation rail
The system SHALL render the market chart annotation rail as status-only context without milestone action buttons.

#### Scenario: Annotation groups are loading
- **WHEN** the annotation layer is enabled and annotation groups are loading
- **THEN** the rail displays `Đang tải sự kiện`
- **AND** the rail does not render milestone action buttons

#### Scenario: Annotation groups are available
- **WHEN** the annotation layer is enabled and one or more annotation groups are available
- **THEN** the rail displays the number of available event milestones as `N mốc sự kiện`
- **AND** the rail does not render milestone action buttons
- **AND** users open annotation details through the red chart markers

#### Scenario: No annotation groups are available
- **WHEN** the annotation layer is enabled and no annotation groups are available
- **THEN** the rail displays `Chưa có sự kiện trong khoảng hiện tại.`
- **AND** the rail does not display `0 mốc sự kiện`
- **AND** the rail does not render placeholder milestone actions

### Requirement: Event rail interaction cleanup
The system SHALL remove obsolete bottom rail selection controls when the rail becomes status-only.

#### Scenario: Milestone buttons are removed
- **WHEN** the bottom annotation rail is rendered
- **THEN** it does not render `Button`, `ToggleGroup`, or `ToggleGroupItem` controls for annotation milestones

#### Scenario: ToggleGroup primitives are unused
- **WHEN** no active code imports or uses the shadcn `toggle` or `toggle-group` primitives after this change
- **THEN** those unused primitive files are removed from the repository
