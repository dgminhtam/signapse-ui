## ADDED Requirements

### Requirement: Selected drawing style toolbar
The system SHALL show a compact chart-local style toolbar when a Signapse drawing overlay is selected.

#### Scenario: Drawing overlay is selected
- **WHEN** the user selects a Signapse drawing overlay on the market chart
- **THEN** the chart surface shows a compact selected-drawing toolbar near the selected drawing
- **AND** the toolbar does not expand the top market chart toolbar or the left drawing rail

#### Scenario: No drawing overlay is selected
- **WHEN** no Signapse drawing overlay is selected
- **THEN** the selected-drawing toolbar is not visible

#### Scenario: New drawing is being placed
- **WHEN** a drawing tool is active and the user is placing a new drawing
- **THEN** the selected-drawing toolbar does not block drawing point interactions

### Requirement: Selected drawing color control
The system SHALL let users change the selected drawing color using a small preset palette.

#### Scenario: User selects a drawing color
- **WHEN** a drawing overlay is selected and the user chooses a preset drawing color
- **THEN** the selected drawing updates to that color without recreating the overlay
- **AND** the selected drawing remains selected after the color change

#### Scenario: Color options are displayed
- **WHEN** the selected-drawing toolbar is visible
- **THEN** it exposes only a limited preset color set
- **AND** it does not expose a free-form color picker in this change

### Requirement: Selected drawing stroke size control
The system SHALL let users change the selected drawing stroke size using limited size options.

#### Scenario: User selects drawing size
- **WHEN** a drawing overlay is selected and the user chooses `1px`, `2px`, or `3px`
- **THEN** the selected drawing updates to the chosen stroke size without recreating the overlay
- **AND** the selected drawing remains selected after the size change

#### Scenario: Size options are displayed
- **WHEN** the selected-drawing toolbar is visible
- **THEN** it exposes only `1px`, `2px`, and `3px` size choices

### Requirement: Selected drawing delete action remains available
The system SHALL provide a delete action for the selected drawing from the selected-drawing toolbar.

#### Scenario: User deletes selected drawing from floating toolbar
- **WHEN** a drawing overlay is selected and the user activates delete from the selected-drawing toolbar
- **THEN** only the selected drawing overlay is removed from the chart
- **AND** the selected drawing state and selected-drawing toolbar are cleared

#### Scenario: Clear-all remains separate
- **WHEN** the selected-drawing toolbar is visible
- **THEN** it does not provide a clear-all drawings action
- **AND** clear-all remains available only through the existing confirmed destructive action

### Requirement: Selected drawing toolbar remains accessible
The system SHALL keep selected-drawing style controls accessible through labels, pressed states, and keyboard interaction.

#### Scenario: Screen reader reads style controls
- **WHEN** assistive technology focuses selected-drawing color, size, or delete controls
- **THEN** each control exposes a clear localized accessible name

#### Scenario: Keyboard user updates style
- **WHEN** a keyboard user focuses the selected-drawing toolbar
- **THEN** the user can choose a color, choose a size, and delete the selected drawing without pointer input

#### Scenario: Active style is represented
- **WHEN** the selected-drawing toolbar is visible
- **THEN** the current color and current size are represented as active or pressed controls
