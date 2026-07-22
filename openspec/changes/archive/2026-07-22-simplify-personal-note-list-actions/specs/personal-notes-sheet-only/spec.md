## MODIFIED Requirements

### Requirement: Personal notes Sheet MUST render the shared Plate editor without persistence

The system SHALL render the same persistence-neutral shared Plate editor used by the editor page, SHALL connect selected personal notes to versioned JSON detail and explicit or boundary saving inside the Sheet, and SHALL keep persistence behavior out of the standalone editor playground.

#### Scenario: Authorized user opens the editor Sheet

- **WHEN** an authorized user opens the personal-notes Sheet
- **THEN** the Sheet MUST render the shared Plate editor with its existing plugin and toolbar composition
- **AND** the Sheet MUST provide initial value, read-only state, value-change dirty tracking, and the opt-in localized paragraph hint through the shared editor's public inputs
- **AND** the Sheet MUST NOT enable title-specific normalization, placeholder, or Enter behavior
- **AND** the Sheet MUST own persistence controls outside the shared editor toolbar

#### Scenario: Sheet lazily loads the first summary page

- **WHEN** an authorized user opens the Personal Notes Sheet before summaries have been loaded
- **THEN** the frontend MUST call `GET /me/notes` through `fetchAuthenticated()` with page `0` and size `20`
- **AND** the request MUST NOT include a sort query parameter
- **AND** the Sheet MUST render loading feedback inside the summary rail while the request is pending

#### Scenario: Sheet displays selectable personal-note summaries

- **WHEN** the summary request succeeds with one or more notes
- **THEN** the Sheet MUST display each summary using its trimmed backend `title` when it contains text
- **AND** a summary with a null, whitespace-only, or legacy empty-string title MUST display the localized untitled fallback as actual accessible text
- **AND** the visible title MUST remain on one line with truncation or line-clamp
- **AND** the summary rail MUST NOT display created or last-modified date metadata
- **AND** activating the summary title control MUST load its note detail into the editor area

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

- **WHEN** an authorized user edits supported content in the Personal Notes Sheet
- **THEN** the Sheet MUST mark the latest Plate value dirty without scheduling a timer-driven mutation
- **AND** it MUST persist changes according to the personal-notes save capability when Save or a safety boundary requests a flush
- **AND** the summary rail MUST reflect returned identity and title updates

#### Scenario: Editor Sheet remains accessible

- **WHEN** the Personal Notes Sheet opens
- **THEN** it MUST provide an accessible dialog title
- **AND** selectable summaries, record-action triggers, menu items, dialog controls, and the Save control MUST support keyboard activation and visible focus
- **AND** the Save control MUST expose its keyboard shortcut
- **AND** save and record-action status or errors MUST be exposed to assistive technology without duplicate live announcements

## ADDED Requirements

### Requirement: Persisted personal-note summaries MUST expose one permission-gated action menu

The system SHALL render each persisted summary as a compact title selection control with one sibling overflow action trigger and SHALL keep the provisional draft actionless.

#### Scenario: User can rename and delete

- **WHEN** a persisted summary is rendered for a user with both `personal-note:update` and `personal-note:delete`
- **THEN** its overflow menu MUST contain localized Rename and Delete items
- **AND** Delete MUST receive destructive treatment

#### Scenario: User has one record permission

- **WHEN** a persisted summary is rendered for a user with exactly one supported record-action permission
- **THEN** the overflow menu MUST contain only the permitted action

#### Scenario: User has no record permission

- **WHEN** a persisted summary is rendered for a user with neither supported record-action permission
- **THEN** the row MUST NOT render the overflow trigger

#### Scenario: Provisional draft has no record actions

- **WHEN** a new draft has not received a backend id
- **THEN** its summary item MUST NOT expose Rename or Delete

#### Scenario: Title selection and actions remain independent

- **WHEN** a user activates the overflow trigger or a menu item
- **THEN** that activation MUST NOT also invoke the nested title-selection behavior
- **AND** the rendered markup MUST NOT nest an interactive trigger inside another button

### Requirement: Personal notes Sheet MUST support nullable title rename

The system SHALL let users with update permission rename a persisted personal note through a localized modal form while preserving the note's latest Plate content.

#### Scenario: Rename dialog opens

- **WHEN** an authorized user activates Rename for a persisted summary
- **THEN** the Sheet MUST flush dirty active content before changing note identity
- **AND** it MUST ensure the target note's current detail is available
- **AND** it MUST open a titled dialog with an input initialized from the persisted nullable title

#### Scenario: Rename saves a non-empty title

- **WHEN** the user submits a title containing non-whitespace text
- **THEN** the frontend MUST trim the title and call `PUT /me/notes/{id}` with that title and the unchanged current content fields
- **AND** a successful response MUST update the summary and active title without marking Plate content dirty

#### Scenario: Rename clears the title

- **WHEN** the user submits an empty or whitespace-only title
- **THEN** the frontend MUST submit `title: null`
- **AND** a successful response MUST show the localized untitled fallback in the summary rail

#### Scenario: Rename is pending

- **WHEN** the rename mutation is in flight
- **THEN** the dialog actions MUST be disabled
- **AND** the submit action MUST include a spinner

#### Scenario: Rename fails

- **WHEN** the detail precondition or update request fails
- **THEN** the Sheet MUST preserve the existing summary title and editor content
- **AND** it MUST show localized error feedback without closing a submitted dialog on mutation failure

#### Scenario: Rename dialog closes

- **WHEN** the user cancels or a rename succeeds
- **THEN** focus MUST return safely to the initiating row action control when it still exists

### Requirement: Personal notes Sheet MUST guard deletion and recover list state

The system SHALL require explicit destructive confirmation before deleting a persisted personal note and SHALL leave the Sheet in a valid state after the mutation.

#### Scenario: Delete requires confirmation

- **WHEN** an authorized user activates Delete
- **THEN** the Sheet MUST open a titled confirmation dialog describing permanent deletion
- **AND** deleting the selected note with dirty content MUST also warn that unsaved changes will be discarded

#### Scenario: Confirmed delete succeeds for an inactive note

- **WHEN** deletion succeeds for a note that is not selected
- **THEN** the summary MUST be removed and page counts reconciled
- **AND** the current editor MUST remain unchanged

#### Scenario: Confirmed delete succeeds for the selected note

- **WHEN** deletion succeeds for the selected note
- **THEN** the Sheet MUST invalidate its active detail and persistence ownership
- **AND** it MUST load an adjacent remaining summary when one is available

#### Scenario: Deleted note was the final record

- **WHEN** deletion succeeds and no persisted notes remain
- **THEN** a user with create permission MUST receive a blank provisional draft
- **AND** a user without create permission MUST receive the existing empty state

#### Scenario: Delete is pending

- **WHEN** the delete mutation is in flight
- **THEN** confirmation controls and conflicting record actions MUST be disabled
- **AND** the destructive action MUST include a spinner

#### Scenario: Delete fails

- **WHEN** the delete request fails
- **THEN** the confirmation flow MUST expose localized error feedback
- **AND** the summary, selection, and editor content MUST remain unchanged
