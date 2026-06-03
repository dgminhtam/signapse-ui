## ADDED Requirements

### Requirement: Drawing style presets include expanded color and size choices
The system SHALL provide expanded preset drawing color and stroke size choices while keeping drawing style values constrained to Signapse-owned presets.

#### Scenario: Color presets are available
- **WHEN** the selected drawing color popover is opened
- **THEN** the system exposes a broader fixed preset palette that includes sky, blue, indigo, violet, fuchsia, rose, red, orange, amber, lime, emerald, and slate choices
- **AND** the system does not require arbitrary user-entered colors to style a drawing

#### Scenario: Stroke size presets are available
- **WHEN** the selected drawing size popover is opened
- **THEN** the system exposes `1px`, `2px`, `3px`, `4px`, and `5px` stroke size choices
- **AND** the system does not expose free-form numeric stroke size input

#### Scenario: Drawing style metadata remains preset-based
- **WHEN** the user changes the selected drawing color or size
- **THEN** the drawing style metadata continues to store the selected preset color and selected preset size
- **AND** existing overlay points, tool identity, lock state, visibility state, group identity, and extension metadata are preserved

#### Scenario: Expanded style presets apply across drawing categories
- **WHEN** the user applies any expanded color or size preset to a line, shape, fibonacci, or pattern drawing
- **THEN** the visible line or border style reflects the selected preset where the chart engine supports overlay styling
