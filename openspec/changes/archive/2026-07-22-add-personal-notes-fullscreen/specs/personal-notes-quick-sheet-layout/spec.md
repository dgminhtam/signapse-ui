## MODIFIED Requirements

### Requirement: Personal notes quick Sheet MUST provide a wider desktop editing surface

The system SHALL render the Personal Notes quick Sheet as a wider right-side overlay in normal desktop mode, targeting approximately 60% of the viewport while keeping the underlying app page visible, and SHALL allow the Sheet content to occupy the full viewport when full-screen mode is active.

#### Scenario: Desktop quick Sheet opens at a wider width

- **WHEN** an authorized user opens `Ghi chú` on a desktop viewport outside full-screen mode
- **THEN** the quick Sheet MUST use a width close to 60% of the viewport
- **AND** it MUST remain an overlay rather than navigating away from the current page

#### Scenario: Quick Sheet remains bounded

- **WHEN** the viewport is narrow or the browser is zoomed outside full-screen mode
- **THEN** the quick Sheet MUST avoid overflowing the viewport horizontally
- **AND** its summary rail, editor, and supported dismissal paths MUST remain usable

#### Scenario: Full-screen Sheet uses the viewport

- **WHEN** the Personal Notes Sheet successfully enters browser full-screen mode
- **THEN** the complete Sheet content MUST fill the available full-screen viewport
- **AND** the normal desktop max-width, side border, and Sheet shadow MUST NOT constrain the full-screen surface

### Requirement: Personal notes quick Sheet layout MUST keep the editor usable

The system SHALL arrange the recent-note selection, compact rail actions, and editor so the editor toolbar and writing area remain usable in both normal and full-screen modes without exposing a standalone notes workspace.

#### Scenario: Two-column layout has enough editor space

- **WHEN** the quick Sheet has enough horizontal room for a note rail and editor
- **THEN** the Sheet MAY render the recent notes rail beside the editor
- **AND** the editor toolbar MUST remain scannable instead of collapsing into a narrow vertical column

#### Scenario: Narrow quick Sheet falls back gracefully

- **WHEN** the quick Sheet does not have enough horizontal room for both the rail and editor
- **THEN** the recent notes area MUST move above the editor or become compact
- **AND** the editor MUST keep the primary writing area as the dominant surface

#### Scenario: Rail actions remain compact

- **WHEN** the summary rail renders its actions for a creator after summaries load successfully
- **THEN** New note MUST use the existing standard icon-button size with a localized accessible name instead of filling the rail width
- **AND** an icon-only full-screen toggle MUST appear beside it at the matching compact height

#### Scenario: Read-only user can use full-screen

- **WHEN** a user can read Personal Notes but cannot create a note
- **THEN** the Sheet MUST NOT show New note
- **AND** the full-screen toggle MUST remain available independently of create permission

#### Scenario: User enters full-screen

- **WHEN** the user activates the full-screen toggle and the browser accepts the request
- **THEN** the complete Sheet content MUST enter native browser full-screen mode
- **AND** the note rail, editor, floating Save control when permitted, record menus, and nested dialogs MUST remain available
- **AND** the interaction MUST NOT navigate to or expose a standalone `/notes` workspace

#### Scenario: Full-screen state changes outside the toggle

- **WHEN** the browser exits full-screen through Escape or another browser-controlled transition
- **THEN** the toggle icon, localized accessible name, and pressed state MUST synchronize with the current browser full-screen element
- **AND** the Personal Notes Sheet MUST remain open

#### Scenario: Full-screen is unavailable or fails

- **WHEN** the browser reports full-screen unavailable or rejects the transition request
- **THEN** the Sheet MUST remain in its current display mode
- **AND** the system MUST show localized error feedback
