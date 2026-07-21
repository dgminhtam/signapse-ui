## MODIFIED Requirements

### Requirement: Personal notes Sheet MUST render the shared Plate editor without persistence
The system SHALL render the same persistence-neutral shared Plate editor used by the editor page, SHALL connect selected personal notes to versioned JSON detail and explicit or boundary saving inside the Sheet, and SHALL keep persistence behavior out of the standalone editor playground.

#### Scenario: Authorized user opens the editor Sheet
- **WHEN** an authorized user opens the personal-notes Sheet
- **THEN** the Sheet MUST render the shared Plate editor with its existing plugin and toolbar composition
- **AND** the Sheet MUST provide initial value, read-only state, value-change dirty tracking, and the opt-in personal-note title and body placeholder layout through the shared editor's public inputs
- **AND** the Sheet MUST own persistence controls outside the shared editor toolbar

#### Scenario: Sheet lazily loads the first summary page
- **WHEN** an authorized user opens the personal-notes Sheet before summaries have been loaded
- **THEN** the frontend MUST call `GET /me/notes` through `fetchAuthenticated()` with page `0` and size `20`
- **AND** the request MUST NOT include a sort query parameter
- **AND** the Sheet MUST render loading feedback inside the summary rail while the request is pending

#### Scenario: Sheet displays selectable personal-note summaries
- **WHEN** the summary request succeeds with one or more notes
- **THEN** the Sheet MUST display each summary using its trimmed backend `title` when it contains text
- **AND** a summary with null, missing, whitespace-only, or legacy empty-string title MUST display the localized untitled fallback as actual accessible text
- **AND** the visible title MUST remain on one line with truncation or line-clamp
- **AND** the Sheet MUST display the last-modified timestamp with created timestamp as fallback
- **AND** activating a summary MUST load its note detail into the editor area

#### Scenario: User loads another summary page
- **WHEN** a loaded summary page is not the last page and the user activates Load more
- **THEN** the frontend MUST request the next zero-based page with size `20` and no sort query parameter
- **AND** the Sheet MUST append the returned summaries to the existing rail
- **AND** the Load more action MUST be disabled while that request is pending

#### Scenario: Summary list is empty for a creator
- **WHEN** the first summary request succeeds without notes and the user has `personal-note:create`
- **THEN** the Sheet MUST render an editable blank Plate document
- **AND** changing the document alone MUST NOT create a backend record
- **AND** the first explicit Save or safety boundary with dirty content MUST create the note

#### Scenario: Summary list is empty for a read-only user
- **WHEN** the first summary request succeeds without notes and the user lacks `personal-note:create`
- **THEN** the Sheet MUST render the repo-standard localized `Empty` state
- **AND** it MUST NOT expose an editable draft

#### Scenario: Summary list fails to load
- **WHEN** the summary request fails
- **THEN** the Sheet MUST show localized error feedback and a retry action inside the summary rail
- **AND** it MUST NOT initialize a new persisted draft from an unknown collection state

#### Scenario: Sheet edits use personal-note persistence
- **WHEN** an authorized user edits supported content in the personal-notes Sheet
- **THEN** the Sheet MUST mark the latest Plate value dirty without scheduling a timer-driven mutation
- **AND** it MUST persist changes according to the personal-notes save capability when Save or a safety boundary requests a flush
- **AND** the summary rail MUST reflect returned identity, title, and timestamp updates

#### Scenario: Editor Sheet remains accessible
- **WHEN** the personal-notes Sheet opens
- **THEN** it MUST provide an accessible dialog title
- **AND** selectable summaries and the Save control MUST support keyboard activation and visible focus
- **AND** the Save control MUST expose its keyboard shortcut
- **AND** save status and errors MUST be exposed to assistive technology without duplicate live announcements

### Requirement: Personal notes Sheet MUST let creators start a new draft
The system SHALL expose a localized new-note action in the summary rail after summaries load successfully for users with `personal-note:create`, and activating it MUST start an editable blank provisional draft through the existing dirty-value and flush coordinator.

#### Scenario: Creator starts another note
- **WHEN** the summary request has succeeded and a user with `personal-note:create` activates the new-note action
- **THEN** the Sheet MUST initialize an editable blank Plate document with no persisted note id
- **AND** changing the draft alone MUST NOT create a backend record
- **AND** the first explicit Save or safety boundary with dirty content MUST use the create endpoint

#### Scenario: Dirty content is flushed before starting the draft
- **WHEN** the creator activates the new-note action while the current editor has unsaved content
- **THEN** the Sheet MUST flush the current content before changing editor identity
- **AND** a failed flush MUST preserve the current note, editor value, and selection

#### Scenario: Pending detail cannot replace the new draft
- **WHEN** an earlier note-detail request finishes after the creator starts a new draft
- **THEN** that response MUST NOT replace the provisional draft

#### Scenario: Provisional draft remains alongside existing summaries
- **WHEN** a creator starts a new draft while persisted summaries exist
- **THEN** the summary rail MUST show the provisional item without hiding the persisted summaries
- **AND** a successful first explicit or boundary save MUST replace the provisional state with the returned persisted summary and active note id

#### Scenario: User lacks create permission
- **WHEN** summaries load for a user without `personal-note:create`
- **THEN** the Sheet MUST NOT expose the new-note action

#### Scenario: Summary state is unknown
- **WHEN** the first summary request is pending or has failed
- **THEN** the Sheet MUST NOT allow a new draft to be initialized from the create action

## ADDED Requirements

### Requirement: Personal notes Sheet MUST expose a Sheet-owned save action row
The system SHALL render persistence state and a standard Save button in a non-scrolling action row above the shared Plate formatting toolbar for an editable supported personal note.

#### Scenario: Editable note shows Save above the formatting toolbar
- **WHEN** a supported personal note is editable
- **THEN** the detail pane MUST render save feedback on the leading side and the Save button on the trailing side of an action row
- **AND** the action row MUST remain outside the shared Plate editor and its horizontally scrollable formatting toolbar

#### Scenario: Save availability follows dirty state
- **WHEN** the current editor transitions among clean, dirty, saving, and error states
- **THEN** Save MUST be enabled only for dirty or error state
- **AND** Save MUST be disabled for idle, saved, or saving state
- **AND** a pending Save MUST include a spinner

#### Scenario: Read-only note has no Save action
- **WHEN** the selected note is read-only or its schema version is unsupported
- **THEN** the Sheet MUST NOT render the save action row
- **AND** the shared editor MUST retain its existing read-only behavior

#### Scenario: Save shortcut is scoped to the Sheet
- **WHEN** an editable supported note has focus within the open Sheet and the user presses `Ctrl+S` or `Cmd+S`
- **THEN** the Sheet MUST prevent the browser Save Page action and request the same save operation as the button
- **AND** the shortcut MUST NOT add persistence behavior to the standalone editor playground

#### Scenario: Shared formatting toolbar remains persistence-neutral
- **WHEN** the Personal Notes action row is rendered
- **THEN** `PlateEditor` and `FixedToolbarButtons` MUST NOT receive a Personal Notes-specific Save control
- **AND** any separate formatting-toolbar reorganization MUST remain independent from this change
