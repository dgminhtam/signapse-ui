## ADDED Requirements

### Requirement: Drawing overlays carry stable style metadata
The system SHALL attach stable Signapse drawing style metadata to drawing overlays created from any drawing palette.

#### Scenario: Drawing is created from any palette
- **WHEN** the user creates a drawing from the line, channel, shape, fibonacci, or pattern palette
- **THEN** the created overlay stores its tool metadata and drawing style metadata
- **AND** existing metadata keys are preserved rather than overwritten

#### Scenario: Drawing style changes
- **WHEN** the user changes color or size for a selected drawing
- **THEN** the overlay style metadata updates to the new color and size
- **AND** the overlay points, tool identity, lock state, visibility state, and group identity are preserved

#### Scenario: Drawing style is restored from metadata
- **WHEN** a drawing overlay is cached, restored, or re-applied after chart style changes
- **THEN** the drawing uses the user-selected style metadata rather than reverting to only the chart default drawing style

### Requirement: Drawing style applies consistently across tool categories
The system SHALL apply selected drawing color and size to line, shape, fibonacci, and pattern drawing overlays where the chart engine supports overlay styling.

#### Scenario: Line-like drawing is restyled
- **WHEN** the user changes color or size on a line-like drawing
- **THEN** the drawing line color and line size reflect the selected style

#### Scenario: Shape drawing is restyled
- **WHEN** the user changes color or size on a shape drawing
- **THEN** the shape border color and border size reflect the selected style
- **AND** any fill remains subtle and derived from the selected color when fill is present

#### Scenario: Multi-segment drawing is restyled
- **WHEN** the user changes color or size on a fibonacci or pattern drawing
- **THEN** the visible line or border figures for that drawing reflect the selected style consistently
