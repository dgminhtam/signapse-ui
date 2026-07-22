## MODIFIED Requirements

### Requirement: Frontend MUST integrate the personal note API contract

The system SHALL provide frontend DTOs and authenticated actions for the current-user personal-note API, response DTOs SHALL expose the nullable personal-note title, and create/update payloads MUST include `title: string | null` with the versioned JSON content fields.

#### Scenario: Personal notes are listed through the authenticated API

- **WHEN** an authorized user opens the Personal Notes Sheet
- **THEN** the frontend MUST call `GET /me/notes` through `fetchAuthenticated()`
- **AND** it MUST parse the result as `Page<PersonalNoteSummaryResponse>` without expecting content in summary rows
- **AND** each summary MUST expose `title` as required nullable display data

#### Scenario: Personal note detail is loaded by id

- **WHEN** an authorized user selects an existing note
- **THEN** the frontend MUST call `GET /me/notes/{id}` through `fetchAuthenticated()`
- **AND** it MUST load supported `content` into the Plate editor according to `contentSchemaVersion`
- **AND** it MUST retain the nullable response `title` as independently editable mutation state

#### Scenario: Personal note create sends nullable title and freeform versioned JSON

- **WHEN** an explicit Save or safety boundary persists a new personal-note draft
- **THEN** the frontend MUST call `POST /me/notes` with `{ title: null, content, contentSchemaVersion: 1 }`
- **AND** it MUST NOT send tags, workspace id, presentation state, or unsupported metadata
- **AND** the frontend MUST adopt the nullable title returned by the create response

#### Scenario: Personal note content update preserves the active title

- **WHEN** an explicit Save or safety boundary persists changes to an existing note
- **THEN** the frontend MUST call `PUT /me/notes/{id}` with `{ title, content, contentSchemaVersion: 1 }`
- **AND** `title` MUST be the latest backend-confirmed nullable title for the active note
- **AND** the frontend MUST adopt the returned title without parsing Plate content

### Requirement: Personal notes MUST respect `personal-note` permissions

The system SHALL gate Personal Notes Sheet visibility, creation, content editing, renaming, and deletion with the corresponding backend permissions exposed for personal notes.

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
- **AND** it MUST NOT schedule an update save or expose Rename

#### Scenario: Delete requires delete permission

- **WHEN** a user can read notes but lacks `personal-note:delete`
- **THEN** the UI MUST NOT expose Delete

#### Scenario: User has no record-action permission

- **WHEN** a user has neither `personal-note:update` nor `personal-note:delete`
- **THEN** persisted summary rows MUST NOT render an empty record-action trigger

## ADDED Requirements

### Requirement: Frontend MUST integrate personal note deletion

The system SHALL expose an authenticated `deletePersonalNote(id)` mutation for `DELETE /me/notes/{id}` and SHALL return a localized `ActionResult<void>` to the Personal Notes Sheet.

#### Scenario: Authorized deletion succeeds

- **WHEN** an authorized user confirms deletion of a persisted personal note
- **THEN** the frontend MUST call `DELETE /me/notes/{id}` through `fetchAuthenticated()`
- **AND** it MUST remove the deleted record from the Sheet only after the backend succeeds

#### Scenario: Deletion fails

- **WHEN** the backend rejects or fails a personal-note delete request
- **THEN** the Server Action MUST return localized non-sensitive error feedback
- **AND** the Sheet MUST preserve the record and current editor state
