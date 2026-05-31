# market-chart-drawing-toolbar-rail Specification

## Purpose
TBD - created by archiving change fix-market-chart-time-and-drawing-toolbar. Update Purpose after archive.
## Requirements
### Requirement: Drawing controls render in a dedicated chart side rail
The system SHALL render market chart drawing controls in a dedicated chart-local side rail when a chart is available.

#### Scenario: Chart renders successfully
- **WHEN** the user opens `/market-charts` and the selected asset/timeframe has chart data
- **THEN** the chart surface exposes drawing controls in a side rail adjacent to the chart viewport
- **AND** the side rail is not rendered as an absolute overlay on top of the chart canvas
- **AND** the chart viewport is laid out beside the rail using the remaining available width

#### Scenario: Chart is not ready
- **WHEN** the chart is loading, empty, errored, or missing an initialized chart instance
- **THEN** drawing commands are not available as active controls against the missing chart

#### Scenario: Fullscreen mode is active
- **WHEN** the market chart surface enters fullscreen mode
- **THEN** the drawing rail remains part of the chart surface layout
- **AND** the chart viewport resizes to the remaining fullscreen width and height

### Requirement: Drawing side rail preserves chart interactions
The system SHALL keep drawing rail controls clickable without blocking required chart canvas interactions.

#### Scenario: User selects a drawing tool
- **WHEN** the user selects a drawing tool from the side rail
- **THEN** the selected tool enters an active drawing state
- **AND** the chart accepts the required interaction points for that tool

#### Scenario: Drawing controls are activated while an annotation popup is open
- **WHEN** an annotation popup is open and the user activates a drawing rail control
- **THEN** the control action is handled by the drawing rail
- **AND** the chart canvas click handling does not swallow the drawing control action

#### Scenario: Drawing mode is active with annotation markers visible
- **WHEN** annotation markers are visible and a drawing tool is active
- **THEN** visible annotation markers do not block required drawing points on the chart canvas

### Requirement: Drawing side rail is compact and accessible
The system SHALL keep the drawing side rail compact, keyboard usable, and compatible with the Signapse shadcn UI composition rules.

#### Scenario: Icon-only controls are announced
- **WHEN** a screen reader user navigates the drawing rail
- **THEN** each drawing tool and drawing state control exposes a clear accessible name in Vietnamese

#### Scenario: Keyboard user navigates drawing controls
- **WHEN** a keyboard user focuses the drawing rail
- **THEN** the user can move through drawing controls, activate a tool, toggle drawing state controls, and activate delete or clear actions without pointer input

#### Scenario: Narrow viewport is used
- **WHEN** the market chart is viewed on a narrow viewport
- **THEN** the drawing rail remains usable without causing page-level horizontal overflow

