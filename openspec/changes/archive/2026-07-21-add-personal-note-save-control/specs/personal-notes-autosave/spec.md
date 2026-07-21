## MODIFIED Requirements

### Requirement: Personal notes MUST persist versioned Plate JSON
The system SHALL use `{ content, contentSchemaVersion }` for personal-note detail, create, and update integration, and SHALL write Plate JSON with schema version `1`.

#### Scenario: Existing note detail loads
- **WHEN** a user selects a personal-note summary
- **THEN** the frontend MUST call `GET /me/notes/{id}` through `fetchAuthenticated()`
- **AND** it MUST treat a version-1 `content` value as the editor document

#### Scenario: New draft is created
- **WHEN** an authorized user explicitly saves a changed blank draft or a safety boundary flushes it
- **THEN** the frontend MUST call `POST /me/notes` with the latest Plate `content` and `contentSchemaVersion: 1`
- **AND** the returned id MUST become the active note id

#### Scenario: Existing note is updated
- **WHEN** an authorized user explicitly saves a changed existing note or a safety boundary flushes it
- **THEN** the frontend MUST call `PUT /me/notes/{id}` with the latest Plate `content` and `contentSchemaVersion: 1`

#### Scenario: Unsupported schema is protected
- **WHEN** a note detail has a `contentSchemaVersion` other than `1`
- **THEN** the Sheet MUST show localized unsupported-version feedback
- **AND** it MUST NOT initialize an editable editor or save that content

## ADDED Requirements

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
The system SHALL update the active personal-note summary from the backend title returned by a serialized create or update mutation and SHALL NOT derive an optimistic summary title from the in-memory Plate value.

#### Scenario: First save creates a titled summary
- **WHEN** the backend successfully creates a provisional personal note
- **THEN** the returned id, title, and timestamps MUST replace the provisional summary state
- **AND** subsequent saves MUST use the returned id

#### Scenario: Existing note save updates its title
- **WHEN** the backend successfully updates the active personal note
- **THEN** the corresponding summary MUST adopt the returned title and timestamps
- **AND** inactive summaries MUST remain unchanged

#### Scenario: Title edit is pending persistence
- **WHEN** the user changes the first H1 before an explicit or boundary save succeeds
- **THEN** the summary rail MUST keep the last backend-returned title or its localized fallback
- **AND** it MUST NOT parse Plate content to publish an optimistic title

## REMOVED Requirements

### Requirement: Autosave MUST debounce and serialize mutations
**Reason**: Timer-driven persistence is replaced by explicit Save plus safety boundary flushes to avoid routine server calls after editing pauses.

**Migration**: Keep the existing serialized revision coordinator but remove the 1000 ms debounce trigger; call its flush path from Save and existing safety boundaries.

### Requirement: Autosave status MUST be visible without a Save button
**Reason**: Editable notes now require a visible Save control and action-row feedback.

**Migration**: Move active save feedback out of summary items and place it beside the new Save button above the Plate toolbar.

### Requirement: Autosave MUST respect personal-note permissions
**Reason**: Permission behavior remains, but it now gates explicit and boundary saves rather than timed autosave.

**Migration**: Preserve current permission checks and omit the Save action and shortcut behavior for read-only notes.

### Requirement: Autosave MUST refresh the persisted summary title
**Reason**: Title refresh remains response-owned but now occurs after explicit or boundary saves.

**Migration**: Continue copying title and timestamps from successful create and update responses without optimistic Plate parsing.
