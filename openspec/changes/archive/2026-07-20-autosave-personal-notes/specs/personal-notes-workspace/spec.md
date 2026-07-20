## MODIFIED Requirements

### Requirement: Frontend MUST integrate the personal note API contract
The system SHALL provide frontend DTOs and authenticated actions for the current-user personal-note API, and create/update payloads MUST use versioned JSON fields `content` and `contentSchemaVersion`.

#### Scenario: Personal notes are listed through the authenticated API
- **WHEN** an authorized user opens the Personal Notes Sheet
- **THEN** the frontend MUST call `GET /me/notes` through `fetchAuthenticated()`
- **AND** it MUST parse the result as `Page<PersonalNoteSummaryResponse>` without expecting content in summary rows

#### Scenario: Personal note detail is loaded by id
- **WHEN** an authorized user selects an existing note
- **THEN** the frontend MUST call `GET /me/notes/{id}` through `fetchAuthenticated()`
- **AND** it MUST load supported `content` into the Plate editor according to `contentSchemaVersion`

#### Scenario: Personal note create sends versioned JSON
- **WHEN** autosave persists a new personal-note draft
- **THEN** the frontend MUST call `POST /me/notes` with `{ content, contentSchemaVersion: 1 }`
- **AND** it MUST NOT send title, tags, workspace id, presentation state, or unsupported metadata

#### Scenario: Personal note update sends versioned JSON
- **WHEN** autosave persists changes to an existing note
- **THEN** the frontend MUST call `PUT /me/notes/{id}` with `{ content, contentSchemaVersion: 1 }`
- **AND** it MUST NOT send title, tags, workspace id, presentation state, or unsupported metadata

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

## REMOVED Requirements

### Requirement: Saving MUST be explicit and rehydrate from sanitized HTML
**Reason**: The backend contract now stores versioned JSON, and the approved interaction uses Plate `onValueChange` autosave without a Save button.
**Migration**: Use the `personal-notes-autosave` capability and `{ content, contentSchemaVersion: 1 }` create/update payloads.

### Requirement: Full notes workspace MUST support large-screen editing and note selection
**Reason**: Personal Notes is intentionally a header Sheet-only utility in the current product scope.
**Migration**: Keep note selection and editing inside the existing Personal Notes Sheet; no `/notes` route is created.

### Requirement: Note identity MUST be derived from saved HTML in V1
**Reason**: List responses expose no content, and persisted note content is versioned JSON rather than HTML.
**Migration**: Continue labeling summaries from backend-supported id and timestamps until a title or preview contract exists.

### Requirement: Presentation mode MUST support screen-share teaching
**Reason**: Presentation mode depends on the removed full notes workspace and is outside the Sheet-only product scope.
**Migration**: No replacement is provided in this change.

### Requirement: Personal note deletion MUST be guarded
**Reason**: Delete integration is outside the autosave scope and the current Sheet exposes no delete workflow.
**Migration**: Keep `DELETE /me/notes/{id}` unintegrated until a separately approved deletion experience exists.
