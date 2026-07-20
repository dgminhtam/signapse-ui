## MODIFIED Requirements

### Requirement: Personal notes Sheet MUST render the shared Plate editor without persistence
The system SHALL render the same persistence-neutral shared Plate editor used by the editor page, SHALL connect selected personal notes to versioned JSON detail and autosave inside the Sheet, and SHALL keep persistence behavior out of the standalone editor playground.

#### Scenario: Authorized user opens the editor Sheet
- **WHEN** an authorized user opens the personal-notes Sheet
- **THEN** the Sheet MUST render the shared Plate editor with its existing plugin and toolbar composition
- **AND** the Sheet MUST provide initial value, read-only state, and value-change persistence through the shared editor's public inputs

#### Scenario: Sheet lazily loads the first summary page
- **WHEN** an authorized user opens the personal-notes Sheet before summaries have been loaded
- **THEN** the frontend MUST call `GET /me/notes` through `fetchAuthenticated()` with page `0` and size `20`
- **AND** the request MUST NOT include a sort query parameter
- **AND** the Sheet MUST render loading feedback inside the summary rail while the request is pending

#### Scenario: Sheet displays selectable personal-note summaries
- **WHEN** the summary request succeeds with one or more notes
- **THEN** the Sheet MUST display each summary using its note id and last-modified timestamp with created timestamp as fallback
- **AND** the Sheet MUST NOT claim a backend-defined title, preview, or ordering that is absent from the summary contract
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
- **AND** the summary rail MUST reflect returned identity and timestamp updates

#### Scenario: Editor Sheet remains accessible
- **WHEN** the personal-notes Sheet opens
- **THEN** it MUST provide an accessible dialog title
- **AND** selectable summaries MUST support keyboard activation and visible selected state
- **AND** autosave status and errors MUST be exposed to assistive technology
