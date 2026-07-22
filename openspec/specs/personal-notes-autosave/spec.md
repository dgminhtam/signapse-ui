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

### Requirement: Personal-note saves MUST be explicit and serialized
The system SHALL keep document mutations local until an explicit Save or safety boundary requests persistence, SHALL allow at most one personal-note mutation in flight, and SHALL preserve the newest value produced while a mutation is pending.

#### Scenario: Editing does not schedule a timed mutation
- **WHEN** one or more Plate document value changes occur without an explicit Save or safety boundary
- **THEN** the system MUST mark the latest value dirty
- **AND** it MUST NOT schedule a create or update request after a timer interval

#### Scenario: Selection change does not make content dirty
- **WHEN** the user changes only the Plate selection without changing the document value
- **THEN** the system MUST NOT mark a new document revision dirty
- **AND** it MUST NOT schedule a personal-note mutation

#### Scenario: Explicit Save persists the latest dirty value
- **WHEN** an authorized user activates Save while the current editor is dirty
- **THEN** the system MUST persist the latest Plate value through the appropriate create or update endpoint

#### Scenario: Explicit Save is a no-op when clean
- **WHEN** Save is requested while the current editor has no dirty revision
- **THEN** the system MUST NOT call a personal-note mutation endpoint

#### Scenario: User edits during an in-flight save
- **WHEN** a newer document value is produced while a create or update request is pending
- **THEN** the system MUST retain the newest value
- **AND** it MUST persist that value immediately after the pending request succeeds
- **AND** it MUST NOT run the two mutations concurrently

#### Scenario: Initial create cannot duplicate
- **WHEN** a new draft changes again while its create request is pending
- **THEN** the system MUST NOT send another create request
- **AND** subsequent persistence MUST use the id returned by the first create response

### Requirement: Personal-note save state MUST be visible with an explicit control
The Personal Notes Sheet SHALL present localized save state beside a visible Save button for an editable supported note and SHALL NOT use a routine save-success toast.

#### Scenario: Save control reflects a clean editor
- **WHEN** an editable note is idle or its latest revision is saved
- **THEN** the Save button MUST be disabled
- **AND** the Sheet MAY show the localized saved state without a success toast

#### Scenario: Save control reflects dirty or failed content
- **WHEN** the current note is dirty or its latest save failed
- **THEN** the Save button MUST be enabled
- **AND** activating it MUST attempt to persist the latest value

#### Scenario: Save is pending
- **WHEN** a create or update mutation is in flight
- **THEN** the Save button MUST be disabled and include a spinner
- **AND** the action row MUST expose the localized saving state

#### Scenario: Save fails
- **WHEN** a create or update mutation fails
- **THEN** the Sheet MUST preserve the current editor value
- **AND** the action row MUST show a localized inline error
- **AND** the value MUST remain dirty for a later retry

#### Scenario: Save feedback is announced once
- **WHEN** the active save state changes to saving, saved, or error
- **THEN** one action-row feedback region MUST expose the state to assistive technology with appropriate status or alert semantics
- **AND** the selected or provisional summary item MUST NOT duplicate that live save feedback

#### Scenario: Keyboard shortcut invokes the same save path
- **WHEN** an editable supported note has focus inside the Sheet and the user presses `Ctrl+S` or `Cmd+S`
- **THEN** the Sheet MUST prevent the browser Save Page action
- **AND** it MUST invoke the same save path as the visible Save button
- **AND** the Save button MUST expose the shortcut through `aria-keyshortcuts`

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

### Requirement: Personal-note saves MUST respect personal-note permissions
The system SHALL permit personal-note creation and editing only when the current user has the corresponding backend permission.

#### Scenario: Existing note is read-only without update permission
- **WHEN** a user has `personal-note:read` but lacks `personal-note:update`
- **THEN** the selected note MUST render read-only
- **AND** the Sheet MUST NOT render the Save action row or invoke an update through the save shortcut

#### Scenario: Empty collection is editable with create permission
- **WHEN** no notes exist and the user has `personal-note:create`
- **THEN** the Sheet MUST provide an editable blank Plate document
- **AND** its first explicit or boundary save MUST use the create endpoint

#### Scenario: Empty collection is not editable without create permission
- **WHEN** no notes exist and the user lacks `personal-note:create`
- **THEN** the Sheet MUST show its localized empty state without an editable draft or Save action

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
