## ADDED Requirements

### Requirement: Personal notes editor MUST reserve the first root block for title
The system SHALL represent a personal-note title as the first root H1 block and SHALL keep title and body placeholder text out of persisted content.

#### Scenario: New draft uses the canonical title layout
- **WHEN** an authorized creator starts a new personal-note draft
- **THEN** the editor value MUST contain an empty H1 at path `[0]`
- **AND** it MUST contain an empty paragraph at path `[1]`

#### Scenario: Existing note is normalized for title editing
- **WHEN** a supported personal-note document opens in the shared editor
- **THEN** the editor MUST keep the root block at path `[0]` as H1
- **AND** it MUST insert a paragraph at path `[1]` when that block is missing

#### Scenario: User presses Enter in the title
- **WHEN** the selection is in the first H1 and the user presses Enter
- **THEN** the title content before the break MUST remain in the first H1
- **AND** the new body block MUST be a paragraph

#### Scenario: Empty title shows localized presentation copy
- **WHEN** the first H1 contains no text
- **THEN** the editor MUST show a localized title placeholder only at path `[0]`
- **AND** the placeholder MUST NOT be inserted into the Plate value or mutation payload

#### Scenario: Active empty body paragraph shows a localized writing hint
- **WHEN** an empty root paragraph is the active block with a collapsed selection
- **THEN** the editor MUST show a localized hint to write content or type `/` for commands
- **AND** empty H2, quote, and list blocks MUST NOT show that paragraph hint
- **AND** the hint MUST NOT be inserted into the Plate value or mutation payload

#### Scenario: Standalone editor remains freeform
- **WHEN** the standalone editor playground renders the shared Plate editor
- **THEN** it MUST retain its existing demo value and freeform block behavior
- **AND** it MUST NOT enable the personal-note forced-title layout

## MODIFIED Requirements

### Requirement: Personal notes Sheet MUST render the shared Plate editor without persistence
The system SHALL render the same persistence-neutral shared Plate editor used by the editor page, SHALL connect selected personal notes to versioned JSON detail and autosave inside the Sheet, and SHALL keep persistence behavior out of the standalone editor playground.

#### Scenario: Authorized user opens the editor Sheet
- **WHEN** an authorized user opens the personal-notes Sheet
- **THEN** the Sheet MUST render the shared Plate editor with its existing plugin and toolbar composition
- **AND** the Sheet MUST provide initial value, read-only state, value-change persistence, and the opt-in personal-note title and body placeholder layout through the shared editor's public inputs

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
- **AND** its first persisted content change MUST create the note automatically

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
- **THEN** the Sheet MUST persist changes according to the personal-notes autosave capability
- **AND** the summary rail MUST reflect returned identity, title, and timestamp updates

#### Scenario: Editor Sheet remains accessible
- **WHEN** the personal-notes Sheet opens
- **THEN** it MUST provide an accessible dialog title
- **AND** selectable summaries MUST support keyboard activation and visible selected state
- **AND** autosave status and errors MUST be exposed to assistive technology
