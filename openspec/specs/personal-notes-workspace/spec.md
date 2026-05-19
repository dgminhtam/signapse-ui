# personal-notes-workspace Specification

## Purpose
TBD - created by archiving change add-personal-notes-workspace. Update Purpose after archive.
## Requirements
### Requirement: Frontend MUST integrate the personal note API contract
The system SHALL provide frontend DTOs and authenticated actions for the current-user personal note API, and it MUST use `contentHtml` as the only create/update payload field.

#### Scenario: Personal notes are listed through the authenticated API
- **WHEN** an authorized user opens a personal notes surface
- **THEN** the frontend MUST call `GET /me/notes` through `fetchAuthenticated()`
- **AND** it MUST parse the result as `Page<PersonalNoteResponse>`

#### Scenario: Personal note detail is loaded by id
- **WHEN** an authorized user selects an existing note
- **THEN** the frontend MUST call `GET /me/notes/{id}` through `fetchAuthenticated()`
- **AND** it MUST load the returned `contentHtml` into the note editor/viewer

#### Scenario: Personal note create sends HTML only
- **WHEN** an authorized user saves a new note with meaningful editor content
- **THEN** the frontend MUST call `POST /me/notes` with `{ contentHtml }`
- **AND** it MUST NOT send title, tags, workspace id, presentation state, or other unsupported metadata

#### Scenario: Personal note update sends HTML only
- **WHEN** an authorized user saves changes to an existing note
- **THEN** the frontend MUST call `PUT /me/notes/{id}` with `{ contentHtml }`
- **AND** it MUST NOT send title, tags, workspace id, presentation state, or other unsupported metadata

### Requirement: Personal notes MUST respect `personal-note` permissions
The system SHALL gate personal note visibility and actions with the backend permissions exposed for personal notes.

#### Scenario: Header entry is visible to users who can read personal notes
- **WHEN** a signed-in user has `personal-note:read`
- **THEN** the app header MUST show a `Ghi chú của tôi` entry beside the workspace selector

#### Scenario: Header entry is hidden without read permission
- **WHEN** a signed-in user does not have `personal-note:read`
- **THEN** the app header MUST NOT show the personal notes entry

#### Scenario: Create action requires create permission
- **WHEN** a user can read notes but does not have `personal-note:create`
- **THEN** the UI MUST NOT allow creating a new personal note

#### Scenario: Update action requires update permission
- **WHEN** a user can read a note but does not have `personal-note:update`
- **THEN** the UI MUST render the note without an enabled save action for edits

#### Scenario: Delete action requires delete permission
- **WHEN** a user can read a note but does not have `personal-note:delete`
- **THEN** the UI MUST NOT expose an enabled delete action for that note

### Requirement: Header quick entry MUST provide quick note capture
The system SHALL provide a quick personal-note Sheet from the app header so users can create or edit notes without leaving the current screen.

#### Scenario: Opening quick notes preserves current page context
- **WHEN** an authorized user activates `Ghi chú của tôi` from the app header
- **THEN** the current app page MUST remain mounted behind the quick note Sheet
- **AND** the Sheet MUST provide access to recent notes and a note editor area

#### Scenario: Quick Sheet can start a new note
- **WHEN** an authorized user with `personal-note:create` activates the new-note action inside the quick Sheet
- **THEN** the Sheet MUST show an empty editor draft ready for personal note content

#### Scenario: Quick Sheet links to the full notes workspace
- **WHEN** the quick Sheet is open
- **THEN** it MUST provide a clear action to open the full `/notes` workspace for larger editing or teaching use

#### Scenario: Dirty close requires confirmation
- **WHEN** the quick Sheet contains unsaved note changes and the user attempts to close it
- **THEN** the frontend MUST ask for confirmation before discarding the draft

### Requirement: Saving MUST be explicit and rehydrate from sanitized HTML
The system SHALL save notes only through an explicit save action, and it MUST treat backend-returned `contentHtml` as the saved source of truth.

#### Scenario: Save button is enabled only for meaningful dirty content
- **WHEN** the editor content is empty after visible-text normalization or has no changes from the last saved server value
- **THEN** the save button MUST be disabled

#### Scenario: Save shows pending feedback
- **WHEN** a create or update request is in flight
- **THEN** the save button MUST be disabled
- **AND** it MUST show repo-standard spinner feedback

#### Scenario: Save success rehydrates editor from backend response
- **WHEN** the backend returns `PersonalNoteResponse` after create or update
- **THEN** the frontend MUST replace the editor draft with the returned `contentHtml`
- **AND** it MUST mark the note as clean after rehydration

#### Scenario: Save failure preserves draft
- **WHEN** a create or update request fails
- **THEN** the frontend MUST keep the user's current draft available
- **AND** it MUST show an error toast or inline error message in Vietnamese

### Requirement: Full notes workspace MUST support large-screen editing and note selection
The system SHALL provide a protected `/notes` workspace for larger personal-note editing, viewing, and screen-share preparation.

#### Scenario: Notes workspace uses a cardless app workspace
- **WHEN** an authorized user opens `/notes`
- **THEN** the page MUST render inside the protected app layout without a top-level Card shell duplicating the breadcrumb identity

#### Scenario: Notes workspace lists current-user notes
- **WHEN** `/notes` loads successfully
- **THEN** the page MUST render a note list rail using the paged `/me/notes` response
- **AND** it MUST allow selecting a note for the editor/viewer area

#### Scenario: Notes workspace tracks pagination in URL
- **WHEN** the user changes the note list page or page size
- **THEN** the frontend MUST keep `page` and `size` in the URL using 1-indexed page numbers for the URL and 0-indexed page numbers for backend requests

#### Scenario: Selected note is addressable in URL
- **WHEN** the user selects an existing note in the full notes workspace
- **THEN** the frontend MUST reflect the selected note id in the URL

#### Scenario: Workspace empty state uses repo component
- **WHEN** the authorized user has no personal notes
- **THEN** the page MUST render an `<Empty>` state with a clear create-note action when creation is allowed

### Requirement: Note identity MUST be derived from saved HTML in V1
The system SHALL derive note list labels from the saved sanitized HTML because the backend response does not expose a title field.

#### Scenario: Saved HTML has meaningful leading text
- **WHEN** a note's `contentHtml` contains meaningful text near the start of the document
- **THEN** the note list MUST use that text as the display label

#### Scenario: Saved HTML has no extractable label
- **WHEN** a note's `contentHtml` has no meaningful extractable text
- **THEN** the note list MUST show `Ghi chú chưa có tiêu đề` as the display label

#### Scenario: Note list does not render full editor instances
- **WHEN** the note list rail renders multiple notes
- **THEN** it MUST derive compact labels or excerpts without mounting a rich editor instance for each note row

### Requirement: Presentation mode MUST support screen-share teaching
The system SHALL provide a presentation mode for a selected personal note that makes content easier to read during instructor screen sharing.

#### Scenario: Presentation mode opens for selected note
- **WHEN** an authorized user activates presentation mode for a selected note
- **THEN** the frontend MUST render that note in a full-viewport presentation surface inside the authenticated app
- **AND** it MUST reduce app chrome so the note content is the dominant visual surface

#### Scenario: Presentation mode uses saved sanitized content
- **WHEN** presentation mode renders an existing note
- **THEN** it MUST use the backend-returned `contentHtml` for that note
- **AND** it MUST render through the note editor/viewer pipeline in read-only mode unless the user switches back to editing

#### Scenario: Presentation mode can be exited
- **WHEN** a user is in presentation mode
- **THEN** the surface MUST provide a visible `Thoát trình bày` action that returns to the normal notes workspace

#### Scenario: Dirty note warns before entering presentation
- **WHEN** the current note has unsaved changes and the user activates presentation mode
- **THEN** the frontend MUST either require saving first or ask for confirmation before presenting the last saved version

### Requirement: Personal note deletion MUST be guarded
The system SHALL allow authorized users to delete personal notes, and it MUST protect the destructive action with an `AlertDialog`.

#### Scenario: Authorized user confirms deletion
- **WHEN** a user with `personal-note:delete` confirms deletion for a note
- **THEN** the frontend MUST call `DELETE /me/notes/{id}` through `fetchAuthenticated()`
- **AND** it MUST refresh the note list after success

#### Scenario: User cancels deletion
- **WHEN** a user opens the delete confirmation and cancels it
- **THEN** the frontend MUST keep the note unchanged and MUST NOT call the delete endpoint

#### Scenario: Deleted selected note is cleared
- **WHEN** the currently selected note is deleted successfully
- **THEN** the frontend MUST clear or replace the selected note state so the editor does not continue showing the deleted note as active

### Requirement: Personal notes MUST provide loading and error states consistent with the app
The system SHALL provide loading, empty, access-denied, and error feedback for personal note surfaces using existing app conventions.

#### Scenario: Full workspace loading mirrors final layout
- **WHEN** `/notes` is loading
- **THEN** the page MUST render a skeleton that mirrors the note list rail and editor workspace shape

#### Scenario: Quick Sheet loading is scoped to the Sheet
- **WHEN** note data is loading inside the quick Sheet
- **THEN** loading feedback MUST appear inside the Sheet and MUST NOT replace the underlying app page

#### Scenario: Backend error is user-readable
- **WHEN** a personal note list, detail, create, update, or delete request fails
- **THEN** the frontend MUST show user-facing Vietnamese error feedback without using `alert()`

#### Scenario: Local route errors stay scoped
- **WHEN** `/notes` hits a route-level error
- **THEN** the feature MUST render a local error boundary for the notes workspace

