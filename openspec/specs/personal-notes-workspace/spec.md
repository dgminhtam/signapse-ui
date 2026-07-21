# personal-notes-workspace Specification

## Purpose
Define frontend ownership, permissions, and Sheet-only interaction for the current personal-note API.

## Requirements

### Requirement: Frontend MUST integrate the personal note API contract
The system SHALL provide frontend DTOs and authenticated actions for the current-user personal-note API, response DTOs SHALL expose the backend-owned personal-note title snapshot, and create/update payloads MUST use only versioned JSON fields `content` and `contentSchemaVersion`.

#### Scenario: Personal notes are listed through the authenticated API
- **WHEN** an authorized user opens the Personal Notes Sheet
- **THEN** the frontend MUST call `GET /me/notes` through `fetchAuthenticated()`
- **AND** it MUST parse the result as `Page<PersonalNoteSummaryResponse>` without expecting content in summary rows
- **AND** each summary MUST expose the backend-owned `title` as display data that can be absent or null while the backend contract is being tightened

#### Scenario: Personal note detail is loaded by id
- **WHEN** an authorized user selects an existing note
- **THEN** the frontend MUST call `GET /me/notes/{id}` through `fetchAuthenticated()`
- **AND** it MUST load supported `content` into the Plate editor according to `contentSchemaVersion`
- **AND** it MUST expose the response `title` without treating it as independently editable data

#### Scenario: Personal note create sends freeform versioned JSON
- **WHEN** an explicit Save or safety boundary persists a new personal-note draft
- **THEN** the frontend MUST call `POST /me/notes` with `{ content, contentSchemaVersion: 1 }`
- **AND** it MUST NOT send title, tags, workspace id, presentation state, or unsupported metadata
- **AND** the backend MUST derive a nullable title from the first meaningful textual content without requiring a specific Plate block type or path
- **AND** the frontend MUST accept that title snapshot from the create response

#### Scenario: Personal note content update preserves the title snapshot
- **WHEN** an explicit Save or safety boundary persists changes to an existing note
- **THEN** the frontend MUST call `PUT /me/notes/{id}` with `{ content, contentSchemaVersion: 1 }`
- **AND** it MUST NOT send title, tags, workspace id, presentation state, or unsupported metadata
- **AND** the backend MUST preserve and return the stored title instead of deriving a new title from updated content
- **AND** the frontend MUST accept the returned title without parsing Plate content

### Requirement: Personal notes MUST respect `personal-note` permissions
The system SHALL gate Personal Notes Sheet visibility, creation, and editing with the backend permissions exposed for personal notes.

#### Scenario: Header entry is visible to users who can read personal notes
- **WHEN** a signed-in user has `personal-note:read`
- **THEN** the app header MUST show the compact Personal Notes Sheet trigger

#### Scenario: Header entry is hidden without read permission
- **WHEN** a signed-in user does not have `personal-note:read`
- **THEN** the app header MUST NOT show the personal-notes trigger

#### Scenario: New empty collection requires create permission
- **WHEN** a user can read notes but does not have `personal-note:create` and the collection is empty
- **THEN** the UI MUST NOT provide an editable new-note draft

#### Scenario: Existing note requires update permission
- **WHEN** a user can read a note but does not have `personal-note:update`
- **THEN** the UI MUST render the note read-only
- **AND** it MUST NOT schedule update autosave

### Requirement: Header quick entry MUST provide quick note capture
The system SHALL provide a Personal Notes Sheet from the app header so users can inspect and automatically persist supported personal notes without leaving the current screen.

#### Scenario: Opening quick notes preserves current page context
- **WHEN** an authorized user activates the Personal Notes trigger from the app header
- **THEN** the current app page MUST remain mounted behind the Sheet
- **AND** the Sheet MUST provide the summary rail and editor area

#### Scenario: Existing summary opens note detail
- **WHEN** an authorized user activates a personal-note summary
- **THEN** the Sheet MUST load the selected note detail in the editor area

#### Scenario: Empty collection can create its first note
- **WHEN** the collection is empty and an authorized creator changes the blank editor draft
- **THEN** the Sheet MUST automatically create the first note through the autosave flow

#### Scenario: Dirty transition preserves work
- **WHEN** the user attempts to switch notes or close the Sheet with dirty content
- **THEN** the Sheet MUST flush the content before completing the transition
- **AND** it MUST preserve the current editor when persistence fails

### Requirement: Personal notes MUST provide loading and error states consistent with the app
The system SHALL provide loading, empty, unsupported-version, read-only, and error feedback inside the Personal Notes Sheet using existing app conventions.

#### Scenario: Sheet loading is scoped to the Sheet
- **WHEN** summary or note detail data is loading
- **THEN** loading feedback MUST appear inside the Sheet
- **AND** it MUST NOT replace the underlying app page

#### Scenario: Backend read error is user-readable
- **WHEN** a personal-note list or detail request fails
- **THEN** the Sheet MUST show localized user-facing error feedback without using `alert()`

#### Scenario: Backend mutation error preserves content
- **WHEN** a personal-note create or update request fails
- **THEN** the Sheet MUST preserve the current editor value
- **AND** it MUST expose localized inline error feedback

#### Scenario: Unsupported content version is safe
- **WHEN** a personal note uses a schema version the frontend does not support
- **THEN** the Sheet MUST show localized unsupported-version feedback
- **AND** it MUST NOT autosave over that note
