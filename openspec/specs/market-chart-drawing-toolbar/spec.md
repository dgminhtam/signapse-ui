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

