## ADDED Requirements

### Requirement: Plate dropdown menus remain scrollable inside modal Sheets
The shared overlay composition SHALL portal Plate dropdown content opened within a modal Sheet into that Sheet's content boundary, while preserving the default portal behavior outside a Sheet.

#### Scenario: Scroll the Insert menu inside Personal Notes
- **WHEN** a user opens the tall Plate Insert dropdown inside the Personal Notes Quick Sheet and uses the mouse wheel over the menu
- **THEN** the menu scrolls through its existing vertically overflowing content
- **AND** the Sheet remains modal with background scrolling and interaction isolated

#### Scenario: Open a Plate dropdown on the editor page
- **WHEN** a user opens a Plate dropdown without an enclosing Sheet portal container
- **THEN** the dropdown uses the standard Radix body portal
- **AND** its existing positioning, sizing, keyboard interaction, and selection behavior remain available

#### Scenario: Open a dropdown in a nested Sheet composition
- **WHEN** a dropdown is rendered beneath more than one overlay-container provider
- **THEN** its content portals into the nearest provided Sheet content element
