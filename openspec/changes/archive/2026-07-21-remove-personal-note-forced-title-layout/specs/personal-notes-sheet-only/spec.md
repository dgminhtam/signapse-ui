## ADDED Requirements

### Requirement: Personal notes editor MUST remain freeform
The system SHALL preserve freeform Plate block ordering for Personal Notes and SHALL keep the localized paragraph hint out of persisted content.

#### Scenario: New draft uses the normal freeform layout
- **WHEN** an authorized creator starts a new personal-note draft
- **THEN** the editor value MUST contain one empty paragraph at path `[0]`
- **AND** it MUST NOT reserve any root path for a title block

#### Scenario: Existing note opens without title normalization
- **WHEN** a supported personal-note document opens in the shared editor
- **THEN** the editor MUST preserve the document's existing root block types and ordering
- **AND** it MUST NOT convert path `[0]` to H1 or insert a required block at path `[1]`

#### Scenario: First block remains user-controlled
- **WHEN** the user changes the type of the first root block or inserts another block before it
- **THEN** the editor MUST preserve that freeform operation
- **AND** Save MUST persist the resulting version-1 Plate document without restoring a title layout

#### Scenario: Active empty paragraph shows a localized writing hint
- **WHEN** an empty root paragraph is the active block with a collapsed selection
- **THEN** the editor MUST show a localized hint to write content or type `/` for commands
- **AND** empty headings, quotes, and list blocks MUST NOT show that paragraph hint
- **AND** the hint MUST NOT be inserted into the Plate value or mutation payload

#### Scenario: Standalone editor remains freeform
- **WHEN** the standalone editor playground renders the shared Plate editor
- **THEN** it MUST retain its existing demo value, default placeholder behavior, and freeform block behavior
- **AND** it MUST NOT receive Personal Notes persistence behavior

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

## REMOVED Requirements

### Requirement: Personal notes editor MUST reserve the first root block for title
**Reason**: Personal Notes returns to the shared editor's freeform block model, while the backend owns a title snapshot derived at creation rather than requiring a structural H1 title.

**Migration**: Initialize new drafts with one paragraph, stop normalizing existing content, retain existing H1 blocks as ordinary valid content, and keep the localized hint only on active empty root paragraphs.
