## ADDED Requirements

### Requirement: Line palette includes free draw
The system SHALL provide a free draw tool in the market chart line drawing palette for multi-segment line sketches.

#### Scenario: Free draw is listed in the line palette
- **WHEN** the user opens the market chart line drawing palette
- **THEN** the palette includes a localized free draw tool option
- **AND** the free draw option uses the same palette menu and accessible naming behavior as other drawing tools

#### Scenario: User creates a free draw overlay
- **WHEN** the user selects the free draw tool and places multiple chart points
- **THEN** the chart renders a connected multi-segment line overlay through those points
- **AND** the overlay uses the same Signapse drawing group, style metadata, lock state, visibility state, magnet mode, selection, delete, and clear-all behavior as other drawing overlays

#### Scenario: User finishes a free draw overlay
- **WHEN** the user double-clicks while placing a free draw overlay
- **THEN** the system completes the drawing
- **AND** the active drawing tool is cleared
- **AND** the completed overlay remains selectable and restylable like other line-like drawings

#### Scenario: User cancels a free draw draft
- **WHEN** the user cancels while a free draw overlay is still being placed
- **THEN** the draft overlay is removed
- **AND** no drawing tool remains active
