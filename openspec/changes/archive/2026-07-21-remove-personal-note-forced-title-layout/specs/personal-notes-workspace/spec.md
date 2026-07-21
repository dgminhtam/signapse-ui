## MODIFIED Requirements

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
