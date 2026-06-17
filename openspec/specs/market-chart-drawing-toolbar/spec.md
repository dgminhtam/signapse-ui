# market-chart-drawing-toolbar Specification

## Purpose
TBD - created by archiving change add-market-chart-drawing-toolbar. Update Purpose after archive.
## Requirements
### Requirement: Market chart exposes a chart-local drawing toolbar
The system SHALL render a compact drawing toolbar inside the market chart surface when a chart is available.

#### Scenario: Chart renders successfully
- **WHEN** the user opens `/market-charts` and the selected asset/timeframe has chart data
- **THEN** the chart surface exposes a compact drawing toolbar aligned with the chart area
- **AND** the drawing toolbar is not rendered as part of the top asset/timeframe control toolbar
- **AND** the drawing toolbar does not introduce a persistent side rail that reduces the primary chart width

#### Scenario: Chart is not ready
- **WHEN** the chart is loading, empty, or in an error state
- **THEN** drawing commands are not available as active controls against a missing chart instance

### Requirement: Users can create basic drawing overlays
The system SHALL allow users to create common drawing overlays on the market chart through KLineCharts overlay behavior.

#### Scenario: User selects a drawing tool
- **WHEN** the user selects a drawing tool from the drawing toolbar
- **THEN** the selected tool enters an active drawing state
- **AND** the chart accepts the next required chart interaction points for that tool

#### Scenario: User completes a drawing
- **WHEN** the user finishes the required interaction points for the selected drawing tool
- **THEN** the chart renders the completed drawing as a KLineCharts overlay
- **AND** the drawing remains visible while the current chart context remains active

#### Scenario: Initial drawing tool set is available
- **WHEN** the chart drawing toolbar is available
- **THEN** the user can create a horizontal line, trend or segment line, channel or parallel line, fibonacci line, circle, and rectangle or area drawing

#### Scenario: User cancels drawing mode
- **WHEN** a drawing tool is active and the user cancels the interaction
- **THEN** the active drawing tool is cleared
- **AND** incomplete drawing state does not leave a broken or orphaned overlay on the chart

### Requirement: Drawing controls manage overlay state
The system SHALL provide drawing controls for magnet mode, lock state, visibility, selected deletion, and clear-all behavior.

#### Scenario: Magnet mode is enabled
- **WHEN** the user enables magnet mode before creating a drawing
- **THEN** new drawing overlays use a KLineCharts magnet mode so points can snap to price context where supported by the chart engine

#### Scenario: Drawings are locked
- **WHEN** the user enables drawing lock
- **THEN** existing Signapse drawing overlays in the current chart context are locked against drag edits
- **AND** the lock control communicates its active state

#### Scenario: Drawings are hidden
- **WHEN** the user disables drawing visibility
- **THEN** existing Signapse drawing overlays in the current chart context are hidden
- **AND** toggling visibility back on restores those drawings without recreating chart data

#### Scenario: Selected drawing is deleted
- **WHEN** a drawing overlay is selected and the user activates the delete drawing control
- **THEN** only the selected drawing overlay is removed from the chart
- **AND** the selected drawing state is cleared

#### Scenario: User clears all drawings
- **WHEN** the user activates a clear-all drawings action for the current chart context
- **THEN** the system asks for confirmation before removing multiple drawings
- **AND** confirming removes only Signapse drawing overlays for the current chart context

### Requirement: Drawing lifecycle is scoped to the current chart context
The system SHALL keep user drawings scoped to the current market chart asset and timeframe context.

#### Scenario: User changes asset
- **WHEN** the user switches to another watchlist asset
- **THEN** drawings from the previous asset are not shown on the new chart

#### Scenario: User changes timeframe
- **WHEN** the user changes the chart timeframe
- **THEN** drawings from the previous timeframe are not shown on the new chart

#### Scenario: Page reloads
- **WHEN** the user reloads the market chart page
- **THEN** session-local drawings are not restored unless a future persistence capability is implemented

### Requirement: Drawing interaction coexists with annotation markers
The system SHALL prevent drawing interactions from conflicting with market chart annotation marker interactions.

#### Scenario: Drawing mode is active with annotations visible
- **WHEN** annotation markers are visible and a drawing tool is active
- **THEN** chart interactions required for drawing are prioritized over annotation marker click handling
- **AND** visible annotation markers do not block required drawing points

#### Scenario: Drawing mode is inactive with annotations visible
- **WHEN** no drawing tool is active and annotation markers are visible
- **THEN** users can still select annotation markers and inspect annotation details as before

#### Scenario: Annotation layer is toggled
- **WHEN** the user enables or disables the annotation layer
- **THEN** existing drawing overlays remain independent from annotation marker visibility

### Requirement: Drawing toolbar is accessible and responsive
The system SHALL keep drawing toolbar controls accessible and usable across supported viewport sizes.

#### Scenario: Icon-only controls are announced
- **WHEN** a screen reader user navigates the drawing toolbar
- **THEN** each drawing tool and drawing state control exposes a clear accessible name in Vietnamese

#### Scenario: Keyboard user navigates drawing controls
- **WHEN** a keyboard user focuses the drawing toolbar
- **THEN** the user can move through drawing controls, activate a tool, toggle drawing state controls, and activate delete or clear actions without pointer input

#### Scenario: Narrow viewport is used
- **WHEN** the market chart is viewed on a narrow viewport
- **THEN** the drawing toolbar remains usable without causing page-level horizontal overflow

### Requirement: Selected drawing style controls use compact popovers
The system SHALL render selected drawing style controls as compact trigger actions that open popovers instead of expanding all color and size options inline.

#### Scenario: Selected drawing toolbar is visible
- **WHEN** a Signapse drawing overlay is selected on the market chart
- **THEN** the selected drawing style toolbar exposes a color trigger, a size trigger, and a delete selected action
- **AND** the toolbar does not render every color and size option inline

#### Scenario: User opens color choices
- **WHEN** the user activates the selected drawing color trigger
- **THEN** the system opens a compact shadcn popover containing preset color swatches
- **AND** the popover does not expose a free-form color picker, HEX input, HSL input, RGB input, opacity input, or alpha input

#### Scenario: User opens size choices
- **WHEN** the user activates the selected drawing size trigger
- **THEN** the system opens a compact shadcn popover containing preset stroke size choices
- **AND** each size choice uses a visual line preview as the primary visual representation

### Requirement: Selected drawing toolbar controls use quiet chrome
The system SHALL use quiet ghost-style control treatment for selected drawing style toolbar actions because the toolbar and popovers already provide the visual surface boundary.

#### Scenario: Selected drawing style toolbar controls are displayed
- **WHEN** the selected drawing style toolbar is visible
- **THEN** the color trigger, size trigger, and selected delete action use ghost button treatment
- **AND** the toolbar avoids outline button treatment for these controls

#### Scenario: Selected style is represented
- **WHEN** the selected drawing style toolbar is visible
- **THEN** the current drawing color is represented by the color trigger swatch
- **AND** the current drawing size is represented by the size trigger line preview

### Requirement: Selected drawing style popovers remain accessible
The system SHALL keep selected drawing color and size popovers keyboard and screen-reader accessible.

#### Scenario: Assistive technology reads style controls
- **WHEN** assistive technology focuses the color trigger, size trigger, color option, size option, or delete selected action
- **THEN** each control exposes a clear localized accessible name

#### Scenario: Keyboard user changes selected drawing style
- **WHEN** a keyboard user opens a selected drawing style popover
- **THEN** the user can choose a color or size without pointer input
- **AND** the selected drawing updates without recreating the overlay

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

