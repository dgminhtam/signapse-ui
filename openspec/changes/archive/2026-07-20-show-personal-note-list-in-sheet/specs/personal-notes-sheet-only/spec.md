## MODIFIED Requirements

### Requirement: Personal notes Sheet MUST render the shared Plate editor without persistence
The system SHALL render the same shared Plate editor used by the editor page and SHALL expose the current user's personal-note summary list while keeping editor content and personal-note persistence disconnected.

#### Scenario: Authorized user opens the editor Sheet
- **WHEN** an authorized user opens the personal-notes Sheet
- **THEN** the Sheet MUST render the shared Plate editor with its existing plugin and toolbar composition
- **AND** the Sheet MUST NOT duplicate or modify the shared editor implementation

#### Scenario: Sheet lazily loads the first summary page
- **WHEN** an authorized user opens the personal-notes Sheet before summaries have been loaded
- **THEN** the frontend MUST call `GET /me/notes` through `fetchAuthenticated()` with page `0` and size `20`
- **AND** the request MUST NOT include a sort query parameter
- **AND** the Sheet MUST render loading feedback inside the summary rail while the request is pending

#### Scenario: Sheet displays personal-note summaries
- **WHEN** the summary request succeeds with one or more notes
- **THEN** the Sheet MUST display each summary using its note id and last-modified timestamp with created timestamp as fallback
- **AND** the Sheet MUST NOT claim a backend-defined title, preview, or ordering that is absent from the summary contract
- **AND** summary rows MUST remain non-interactive until note detail selection is implemented

#### Scenario: User loads another summary page
- **WHEN** a loaded summary page is not the last page and the user activates Load more
- **THEN** the frontend MUST request the next zero-based page with size `20` and no sort query parameter
- **AND** the Sheet MUST append the returned summaries to the existing rail
- **AND** the Load more action MUST be disabled while that request is pending

#### Scenario: Summary list is empty
- **WHEN** the first summary request succeeds without notes
- **THEN** the Sheet MUST render the repo-standard `Empty` state inside the summary rail
- **AND** it MUST NOT expose a create action in this change

#### Scenario: Summary list fails to load
- **WHEN** a summary request fails
- **THEN** the Sheet MUST keep the shared editor available
- **AND** it MUST show localized error feedback and a retry action inside the summary rail

#### Scenario: Sheet editing remains transient
- **WHEN** a user edits content in the personal-notes Sheet
- **THEN** the changes MUST remain client-side for the current Sheet session
- **AND** the Sheet MUST NOT load personal-note detail or call create, update, or delete personal-note APIs or server actions
- **AND** the summary list MUST NOT replace or rehydrate the editor value

#### Scenario: Editor Sheet remains accessible
- **WHEN** the personal-notes Sheet opens
- **THEN** it MUST provide an accessible dialog title
- **AND** it MUST retain the standard Sheet close behavior
