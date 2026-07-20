# personal-notes-sheet-only Specification

## Purpose
Define the permission-gated header Sheet that exposes the shared Plate editor UI without personal-note persistence.

## Requirements

### Requirement: Personal notes MUST be available only through the header Sheet
The system SHALL expose the temporary personal-notes UI only as a permission-gated header Sheet utility and SHALL NOT provide a separate notes workspace destination.

#### Scenario: Header opens personal notes
- **WHEN** a user with `personal-note:read` permission uses the app header
- **THEN** the header MUST show a compact personal-note trigger labeled `Ghi chú`
- **AND** activating it MUST open the personal-notes Sheet

#### Scenario: Users without read permission cannot open the Sheet
- **WHEN** a user lacks `personal-note:read` permission
- **THEN** the header MUST NOT render the personal-note trigger

#### Scenario: Standalone notes workspace remains unavailable
- **WHEN** the embedded-editor Sheet state is active
- **THEN** the app MUST NOT provide an in-app `/notes` workspace link, breadcrumb destination, or expansion action

### Requirement: Personal notes Sheet MUST render the shared Plate editor without persistence
The system SHALL render the same shared Plate editor used by the editor page while keeping personal-note data operations disconnected.

#### Scenario: Authorized user opens the editor Sheet
- **WHEN** an authorized user opens the personal-notes Sheet
- **THEN** the Sheet MUST render the shared Plate editor with its existing plugin and toolbar composition
- **AND** the Sheet MUST NOT duplicate or modify the shared editor implementation

#### Scenario: Sheet editing remains transient
- **WHEN** a user edits content in the personal-notes Sheet
- **THEN** the changes MUST remain client-side for the current Sheet session
- **AND** the Sheet MUST NOT load, create, update, or delete personal-note data
- **AND** the Sheet MUST NOT call a personal-note API or server action

#### Scenario: Editor Sheet remains accessible
- **WHEN** the personal-notes Sheet opens
- **THEN** it MUST provide an accessible dialog title
- **AND** it MUST retain the standard Sheet close behavior
