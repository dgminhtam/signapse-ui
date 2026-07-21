## ADDED Requirements

### Requirement: Autosave MUST refresh the persisted summary title
The system SHALL update the active personal-note summary from the backend title returned by the serialized create or update mutation and SHALL NOT derive an optimistic summary title from the in-memory Plate value.

#### Scenario: First autosave creates a titled summary
- **WHEN** the backend successfully creates a provisional personal note
- **THEN** the returned id, title, and timestamps MUST replace the provisional summary state
- **AND** subsequent saves MUST use the returned id

#### Scenario: Existing note autosave updates its title
- **WHEN** the backend successfully updates the active personal note
- **THEN** the corresponding summary MUST adopt the returned title and timestamps
- **AND** inactive summaries MUST remain unchanged

#### Scenario: Title edit is pending persistence
- **WHEN** the user changes the first H1 before autosave succeeds
- **THEN** the summary rail MUST keep the last backend-returned title or its localized fallback
- **AND** it MUST NOT parse Plate content to publish an optimistic title
