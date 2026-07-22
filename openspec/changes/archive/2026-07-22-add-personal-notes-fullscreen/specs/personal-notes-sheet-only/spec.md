## MODIFIED Requirements

### Requirement: Personal notes MUST be available only through the header Sheet
The system SHALL expose the temporary Personal Notes UI only as a permission-gated header Sheet utility, MAY expand that Sheet through native browser full-screen mode, and SHALL NOT provide a separate notes workspace destination.

#### Scenario: Header opens personal notes
- **WHEN** a user with `personal-note:read` permission uses the app header
- **THEN** the header MUST show a compact personal-note trigger labeled `Ghi chú`
- **AND** activating it MUST open the Personal Notes Sheet

#### Scenario: Users without read permission cannot open the Sheet
- **WHEN** a user lacks `personal-note:read` permission
- **THEN** the header MUST NOT render the personal-note trigger

#### Scenario: Standalone notes workspace remains unavailable
- **WHEN** the embedded-editor Sheet state is active in normal or full-screen mode
- **THEN** the app MUST NOT provide an in-app `/notes` workspace link, breadcrumb destination, or route expansion action

## ADDED Requirements

### Requirement: Personal notes Sheet MUST expose a Sheet-owned floating save control
The system SHALL render persistence state through the current icon-only floating Save control inside the editor for an editable supported personal note and SHALL keep that persistence control outside the shared Plate formatting toolbar.

#### Scenario: Editable note shows floating Save
- **WHEN** a supported personal note is editable
- **THEN** the detail pane MUST render the icon-only Save control over the lower trailing editor area
- **AND** it MUST NOT render a separate Save action row or routine saved/loading badge

#### Scenario: Save availability follows dirty state
- **WHEN** the current editor transitions among clean, dirty, saving, and error states
- **THEN** Save MUST be enabled only for dirty or error state
- **AND** Save MUST be disabled for idle, saved, or saving state
- **AND** a pending Save MUST replace the Save icon with a spinner and expose a localized accessible name

#### Scenario: Read-only note has no Save control
- **WHEN** the selected note is read-only or its schema version is unsupported
- **THEN** the Sheet MUST NOT render the floating Save control
- **AND** the shared editor MUST retain its existing read-only behavior

#### Scenario: Save shortcut is scoped to the Sheet
- **WHEN** an editable supported note has focus within the open Sheet and the user presses `Ctrl+S` or `Cmd+S`
- **THEN** the Sheet MUST prevent the browser Save Page action and request the same save operation as the floating button
- **AND** the shortcut MUST NOT add persistence behavior to the standalone editor playground

#### Scenario: Shared formatting toolbar remains persistence-neutral
- **WHEN** the Personal Notes floating Save control is rendered
- **THEN** `PlateEditor` and `FixedToolbarButtons` MUST NOT receive a Personal Notes-specific Save control
- **AND** any separate formatting-toolbar reorganization MUST remain independent from this change

## REMOVED Requirements

### Requirement: Personal notes Sheet MUST expose a Sheet-owned save action row
**Reason**: The action row was replaced by the compact icon-only floating Save control and its stale requirement conflicts with the current UI and autosave specification.

**Migration**: Use the new `Personal notes Sheet MUST expose a Sheet-owned floating save control` requirement and the `personal-notes-autosave` save-state contract.
