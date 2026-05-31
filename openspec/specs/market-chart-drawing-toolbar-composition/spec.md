# market-chart-drawing-toolbar-composition Specification

## Purpose
TBD - created by archiving change polish-market-chart-drawing-toolbar-groups. Update Purpose after archive.
## Requirements
### Requirement: Drawing tools use separated single-selection ToggleGroup
The system SHALL render market chart drawing tool controls as a vertical shadcn ToggleGroup with separated items and single-selection semantics.

#### Scenario: Drawing tools are displayed
- **WHEN** the market chart drawing toolbar is visible
- **THEN** drawing tools render inside `ToggleGroup`
- **AND** the ToggleGroup uses `type="single"`
- **AND** the ToggleGroup uses `orientation="vertical"`
- **AND** the ToggleGroup uses a non-zero `spacing` value so tool buttons appear separated

#### Scenario: User selects a drawing tool
- **WHEN** the user selects a drawing tool
- **THEN** the selected tool becomes the only active drawing tool
- **AND** selecting no valid tool clears the active drawing tool

### Requirement: Drawing state controls use separated multiple-selection ToggleGroup
The system SHALL render magnet, lock, and visibility controls as a vertical shadcn ToggleGroup with multiple-selection semantics.

#### Scenario: Drawing state controls are displayed
- **WHEN** the market chart drawing toolbar is visible
- **THEN** magnet, lock, and visibility controls render inside `ToggleGroup`
- **AND** the ToggleGroup uses `type="multiple"`
- **AND** the ToggleGroup uses `orientation="vertical"`
- **AND** the ToggleGroup uses a non-zero `spacing` value so state buttons appear separated

#### Scenario: User changes drawing state controls
- **WHEN** the user toggles magnet, lock, or visibility
- **THEN** the corresponding drawing state updates without changing the active drawing tool
- **AND** the other drawing state controls preserve their values unless explicitly changed by the same ToggleGroup update

#### Scenario: Drawing state controls remain accessible
- **WHEN** assistive technology reads the drawing state controls
- **THEN** magnet, lock, and visibility each expose a clear accessible label based on the current state

### Requirement: Drawing destructive actions stay outside ToggleGroups
The system SHALL render drawing delete actions as action buttons rather than ToggleGroup items.

#### Scenario: Delete actions are displayed
- **WHEN** the market chart drawing toolbar is visible
- **THEN** delete selected and clear all are not rendered as ToggleGroup items
- **AND** they remain separated from toggle sections by shadcn Separator

#### Scenario: Delete selected is distinguishable from clear all
- **WHEN** delete selected and clear all actions are both displayed
- **THEN** the two actions use distinguishable icon treatment
- **AND** clear all continues to require destructive confirmation

#### Scenario: Existing delete behavior is preserved
- **WHEN** the user activates delete selected or clear all
- **THEN** delete selected only targets the selected drawing
- **AND** clear all targets all drawings after confirmation

