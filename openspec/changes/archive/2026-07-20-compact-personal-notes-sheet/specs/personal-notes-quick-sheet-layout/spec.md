## ADDED Requirements

### Requirement: Personal notes quick Sheet MUST use a compact headerless composition
The system SHALL let the summary rail and editor occupy the Personal Notes Sheet without a visible title header or default close button, while retaining an accessible dialog title outside the visual layout.

#### Scenario: Quick Sheet opens without persistent header chrome
- **WHEN** an authorized user opens the Personal Notes Sheet
- **THEN** the summary rail and editor MUST begin at the top of the Sheet content
- **AND** the Sheet MUST NOT render a visible Notes title header or default close button
- **AND** the Sheet MUST retain a localized title for assistive technology

#### Scenario: User dismisses the headerless Sheet
- **WHEN** the user clicks outside the Sheet or presses Escape
- **THEN** the request MUST pass through the controlled Sheet close flow
- **AND** focus MUST return safely after the Sheet actually closes

## MODIFIED Requirements

### Requirement: Personal notes quick Sheet MUST provide a wider desktop editing surface
The system SHALL render the personal notes quick Sheet as a wider right-side overlay on desktop, targeting approximately 60% of the viewport while keeping the underlying app page visible.

#### Scenario: Desktop quick Sheet opens at a wider width
- **WHEN** an authorized user opens `Ghi chú` on a desktop viewport
- **THEN** the quick Sheet MUST use a width close to 60% of the viewport
- **AND** it MUST remain an overlay rather than navigating away from the current page

#### Scenario: Quick Sheet remains bounded
- **WHEN** the viewport is narrow or the browser is zoomed
- **THEN** the quick Sheet MUST avoid overflowing the viewport horizontally
- **AND** its summary rail, editor, and supported dismissal paths MUST remain usable
