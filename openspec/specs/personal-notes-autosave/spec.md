# personal-notes-autosave Specification

## Purpose
Define versioned Plate JSON persistence and safe autosave behavior for personal notes.

## Requirements

### Requirement: Personal-note editing MUST follow Plate value ownership
The system SHALL initialize the Personal Notes editor from a selected note's Plate JSON value and SHALL persist document mutations through `Plate.onValueChange` without controlling every keystroke through React state.

#### Scenario: Selected note initializes the editor
- **WHEN** a supported personal-note detail finishes loading
- **THEN** the shared Plate editor MUST initialize from the returned `content`
- **AND** the frontend MUST NOT mirror `editor.children` into a React-controlled value loop

#### Scenario: Playground remains non-persistent
- **WHEN** the standalone `/editor` playground renders the shared Plate editor
- **THEN** it MUST retain its demo initial value
- **AND** it MUST NOT call a personal-note API

### Requirement: Personal notes MUST persist versioned Plate JSON
The system SHALL use `{ content, contentSchemaVersion }` for personal-note detail, create, and update integration, and SHALL write Plate JSON with schema version `1`.

#### Scenario: Existing note detail loads
- **WHEN** a user selects a personal-note summary
- **THEN** the frontend MUST call `GET /me/notes/{id}` through `fetchAuthenticated()`
- **AND** it MUST treat a version-1 `content` value as the editor document

#### Scenario: New draft is created
- **WHEN** an authorized user changes the blank draft and the first autosave begins
- **THEN** the frontend MUST call `POST /me/notes` with the latest Plate `content` and `contentSchemaVersion: 1`
- **AND** the returned id MUST become the active note id

#### Scenario: Existing note is updated
- **WHEN** an authorized user changes an existing note and autosave begins
- **THEN** the frontend MUST call `PUT /me/notes/{id}` with the latest Plate `content` and `contentSchemaVersion: 1`

#### Scenario: Unsupported schema is protected
- **WHEN** a note detail has a `contentSchemaVersion` other than `1`
- **THEN** the Sheet MUST show localized unsupported-version feedback
- **AND** it MUST NOT initialize an editable editor or autosave that content

### Requirement: Autosave MUST debounce and serialize mutations
The system SHALL debounce document persistence for 1000 ms, allow at most one personal-note mutation in flight, and preserve the newest value produced while a mutation is pending.

#### Scenario: Edit burst produces one scheduled save
- **WHEN** multiple document value changes occur within the debounce interval
- **THEN** the system MUST schedule persistence for only the latest value after 1000 ms

#### Scenario: Selection change does not save
- **WHEN** the user changes only the Plate selection without changing the document value
- **THEN** the system MUST NOT schedule a personal-note mutation

#### Scenario: User edits during an in-flight save
- **WHEN** a newer document value is produced while a create or update request is pending
- **THEN** the system MUST retain the newest value
- **AND** it MUST persist that value immediately after the pending request succeeds
- **AND** it MUST NOT run the two mutations concurrently

#### Scenario: Initial create cannot duplicate
- **WHEN** a new draft changes again while its create request is pending
- **THEN** the system MUST NOT send another create request
- **AND** subsequent persistence MUST use the id returned by the first create response

### Requirement: Autosave status MUST be visible without a Save button
The Personal Notes Sheet SHALL present localized inline autosave state and SHALL NOT expose a Save button or routine save-success toast.

#### Scenario: Save is pending
- **WHEN** a create or update mutation is in flight
- **THEN** the Sheet MUST expose a localized saving state in its persistent header area

#### Scenario: Latest value is saved
- **WHEN** the backend acknowledges the latest document sequence
- **THEN** the Sheet MUST expose a localized saved state
- **AND** it MUST update the corresponding summary timestamp from the response

#### Scenario: Save fails
- **WHEN** a create or update mutation fails
- **THEN** the Sheet MUST preserve the current editor value
- **AND** it MUST show a localized inline error
- **AND** the value MUST remain dirty for a later retry

#### Scenario: No explicit save control exists
- **WHEN** an editable personal note is rendered
- **THEN** neither the editor toolbar nor the Sheet header MUST render a Save button

### Requirement: Dirty transitions MUST flush before editor teardown
The system SHALL flush dirty content before switching note identity or closing the Personal Notes Sheet and SHALL preserve the current editor when that flush fails.

#### Scenario: User selects another note while dirty
- **WHEN** the user selects another summary while the current note has unsaved content
- **THEN** the current content MUST be flushed before the next detail replaces the editor
- **AND** a failed flush MUST keep the current note selected

#### Scenario: User closes the Sheet while dirty
- **WHEN** the user attempts to close the Sheet while content is dirty
- **THEN** the system MUST flush the pending content before closing
- **AND** a failed flush MUST keep the Sheet open with the draft intact

#### Scenario: Out-of-order detail response arrives
- **WHEN** an earlier note-detail request finishes after a later note selection
- **THEN** the earlier response MUST NOT replace the currently selected note

### Requirement: Autosave MUST respect personal-note permissions
The system SHALL permit personal-note creation and editing only when the current user has the corresponding backend permission.

#### Scenario: Existing note is read-only without update permission
- **WHEN** a user has `personal-note:read` but lacks `personal-note:update`
- **THEN** the selected note MUST render read-only
- **AND** no update autosave MUST be scheduled

#### Scenario: Empty collection is editable with create permission
- **WHEN** no notes exist and the user has `personal-note:create`
- **THEN** the Sheet MUST provide an editable blank Plate document
- **AND** its first persisted change MUST use the create endpoint

#### Scenario: Empty collection is not editable without create permission
- **WHEN** no notes exist and the user lacks `personal-note:create`
- **THEN** the Sheet MUST show its localized empty state without an editable draft
