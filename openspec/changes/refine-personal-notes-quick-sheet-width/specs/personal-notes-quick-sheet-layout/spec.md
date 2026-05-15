## ADDED Requirements

### Requirement: Personal notes quick Sheet MUST provide a wider desktop editing surface
The system SHALL render the personal notes quick Sheet as a wider right-side overlay on desktop, targeting approximately 60% of the viewport while keeping the underlying app page visible.

#### Scenario: Desktop quick Sheet opens at a wider width
- **WHEN** an authorized user opens `Ghi chú của tôi` on a desktop viewport
- **THEN** the quick Sheet MUST use a width close to 60% of the viewport
- **AND** it MUST remain an overlay rather than navigating away from the current page

#### Scenario: Quick Sheet remains bounded
- **WHEN** the viewport is narrow or the browser is zoomed
- **THEN** the quick Sheet MUST avoid overflowing the viewport horizontally
- **AND** it MUST keep the close button and primary actions reachable

### Requirement: Personal notes quick Sheet layout MUST keep the editor usable
The system SHALL arrange the recent-note selection and editor so the editor toolbar and writing area remain usable inside the quick Sheet.

#### Scenario: Two-column layout has enough editor space
- **WHEN** the quick Sheet has enough horizontal room for a note rail and editor
- **THEN** the Sheet MAY render the recent notes rail beside the editor
- **AND** the editor toolbar MUST remain scannable instead of collapsing into a narrow vertical column

#### Scenario: Narrow quick Sheet falls back gracefully
- **WHEN** the quick Sheet does not have enough horizontal room for both the rail and editor
- **THEN** the recent notes area MUST move above the editor or become compact
- **AND** the editor MUST keep the primary writing area as the dominant surface

#### Scenario: Full workspace remains available
- **WHEN** a user needs larger editing, presentation, pagination, or deletion workflows
- **THEN** the quick Sheet MUST continue to expose the `Mở rộng` action to the full `/notes` workspace
