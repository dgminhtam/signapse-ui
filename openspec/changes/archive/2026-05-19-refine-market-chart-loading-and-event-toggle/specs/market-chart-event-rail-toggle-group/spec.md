## ADDED Requirements

### Requirement: Event rail ToggleGroup selection
The system SHALL use shadcn ToggleGroup semantics for bottom event rail milestone selection.

#### Scenario: Annotation milestones are available
- **WHEN** the market chart has loaded annotation groups
- **THEN** the bottom event rail renders the milestones in a single-selection `ToggleGroup`
- **AND** each milestone is rendered as a `ToggleGroupItem`
- **AND** each milestone uses the annotation group id as its selection value

#### Scenario: Milestone selection changes
- **WHEN** the user selects a different milestone
- **THEN** the selected ToggleGroup value updates to the corresponding annotation group id
- **AND** the existing annotation popup selection behavior is preserved

#### Scenario: Milestone represents multiple annotations
- **WHEN** a milestone represents more than one annotation
- **THEN** the milestone displays a secondary count badge without breaking ToggleGroup item layout

### Requirement: Event rail focus and active feedback
The system SHALL provide clear event milestone active and focus feedback without unwanted rail scroll artifacts.

#### Scenario: Milestone is selected
- **WHEN** an event milestone is selected
- **THEN** the selected item uses ToggleGroup selected state semantics
- **AND** the selected item is visually distinct from unselected milestones
- **AND** the selected item does not use an unrelated filled primary action treatment

#### Scenario: Milestone receives focus
- **WHEN** an event milestone receives keyboard focus
- **THEN** the focus indicator remains visible
- **AND** the event rail does not show a vertical scrollbar because of the focus indicator

#### Scenario: Milestone is activated by pointer
- **WHEN** a user clicks or presses an event milestone
- **THEN** active feedback is visible
- **AND** the event rail does not show a vertical scrollbar because of active-state movement or focus ring bounds

#### Scenario: Milestones overflow horizontally
- **WHEN** there are more milestones than the rail width can display
- **THEN** the rail allows horizontal scrolling
- **AND** the rail avoids accidental vertical scrolling for milestone focus or active states
