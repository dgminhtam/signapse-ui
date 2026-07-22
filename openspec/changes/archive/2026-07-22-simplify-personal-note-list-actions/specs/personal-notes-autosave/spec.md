## MODIFIED Requirements

### Requirement: Personal notes MUST persist versioned Plate JSON

The system SHALL use `{ title, content, contentSchemaVersion }` for personal-note create and update integration, SHALL represent title as `string | null`, and SHALL write Plate JSON with schema version `1`.

#### Scenario: Existing note detail loads

- **WHEN** a user selects a personal-note summary
- **THEN** the frontend MUST call `GET /me/notes/{id}` through `fetchAuthenticated()`
- **AND** it MUST treat a version-1 `content` value as the editor document
- **AND** it MUST retain the nullable response `title` for later mutations

#### Scenario: New draft is created

- **WHEN** an authorized user explicitly saves a changed blank draft or a safety boundary flushes it
- **THEN** the frontend MUST call `POST /me/notes` with `title: null`, the latest Plate `content`, and `contentSchemaVersion: 1`
- **AND** the returned id and nullable title MUST become active note state

#### Scenario: Existing note is updated

- **WHEN** an authorized user explicitly saves a changed existing note or a safety boundary flushes it
- **THEN** the frontend MUST call `PUT /me/notes/{id}` with the latest backend-confirmed nullable title, latest Plate `content`, and `contentSchemaVersion: 1`

#### Scenario: Unsupported schema is protected

- **WHEN** a note detail has a `contentSchemaVersion` other than `1`
- **THEN** the Sheet MUST show localized unsupported-version feedback
- **AND** it MUST NOT initialize an editable editor or save that content

### Requirement: Personal-note saves MUST refresh the persisted summary title

The system SHALL adopt the nullable title returned by serialized create, content-update, and rename mutations, SHALL include the current title in later mutations, and SHALL NOT derive an optimistic or replacement summary title from the in-memory Plate value.

#### Scenario: First save creates a titled or untitled summary

- **WHEN** the backend successfully creates a provisional personal note
- **THEN** the returned id, nullable title, and timestamps MUST replace the provisional summary state
- **AND** subsequent saves MUST use the returned id and title

#### Scenario: Existing content save preserves its title

- **WHEN** the backend successfully updates the active personal-note content
- **THEN** the corresponding summary and active mutation state MUST adopt the returned title and timestamps
- **AND** content changes MUST NOT cause the frontend to infer or publish a replacement title
- **AND** inactive summaries MUST remain unchanged

#### Scenario: Rename refreshes active title state

- **WHEN** a rename update succeeds for the active note
- **THEN** later content saves MUST include the returned nullable title
- **AND** they MUST NOT restore the title that existed before rename

#### Scenario: Rename refreshes an inactive summary

- **WHEN** a rename update succeeds for a note that was inactive before the rename flow began
- **THEN** only that note's persisted summary title MUST change
- **AND** unrelated summaries MUST remain unchanged

#### Scenario: Freeform content edit is pending persistence

- **WHEN** the user changes any Plate block before an explicit or boundary save succeeds
- **THEN** the summary rail MUST keep the last backend-returned title or its localized fallback
- **AND** it MUST NOT parse Plate content to publish an optimistic title
