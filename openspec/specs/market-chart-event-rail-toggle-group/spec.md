# market-chart-event-rail-toggle-group Specification

## Purpose
TBD - created by archiving change refine-market-chart-loading-and-event-toggle. Update Purpose after archive.
## Requirements
### Requirement: Event rail ToggleGroup selection is removed
The system SHALL NOT use a bottom event rail ToggleGroup for annotation milestone selection.

#### Scenario: Annotation milestones are available
- **WHEN** the market chart has loaded annotation groups
- **THEN** the single status rail renders compact annotation metadata
- **AND** no `ToggleGroup` or `ToggleGroupItem` is rendered for annotation milestones

#### Scenario: Milestone selection changes
- **WHEN** the user selects a different milestone
- **THEN** no bottom-rail selection value changes
- **AND** existing chart marker selection behavior remains available

#### Scenario: Milestone represents multiple annotations
- **WHEN** a milestone represents more than one annotation
- **THEN** the status rail or legend disclosure communicates the aggregate count without a ToggleGroup item

### Requirement: Event rail focus and active feedback
The system SHALL keep focus and active feedback on the chart markers and legend disclosure without introducing milestone controls in the status rail.

#### Scenario: Milestone is selected
- **WHEN** an event milestone is selected
- **THEN** the selected chart marker uses its existing selection semantics
- **AND** the status rail does not expose a duplicate selected item

-#### Scenario: Chart marker or legend disclosure receives focus
- **WHEN** a chart event marker or legend disclosure receives keyboard focus
- **THEN** the focus indicator remains visible
- **AND** the status rail does not show a vertical scrollbar because of the focus indicator

#### Scenario: Chart marker is activated by pointer
- **WHEN** a user clicks or presses a chart event marker
- **THEN** active feedback is visible
- **AND** the status rail does not show a vertical scrollbar because of active-state movement or focus ring bounds

#### Scenario: Status rail avoids milestone overflow
- **WHEN** annotation groups exceed the available width
- **THEN** the status rail keeps its compact layout and exposes the meanings through the legend disclosure
- **AND** the rail does not create horizontal page overflow
