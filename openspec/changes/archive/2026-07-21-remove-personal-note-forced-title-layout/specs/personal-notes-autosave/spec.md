## MODIFIED Requirements

### Requirement: Personal-note saves MUST refresh the persisted summary title
The system SHALL adopt the backend-owned title returned by serialized create and update mutations and SHALL NOT derive an optimistic or replacement summary title from the in-memory Plate value.

#### Scenario: First save creates a titled or untitled summary
- **WHEN** the backend successfully creates a provisional personal note
- **THEN** the returned id, nullable title snapshot, and timestamps MUST replace the provisional summary state
- **AND** subsequent saves MUST use the returned id

#### Scenario: Existing content save preserves its title
- **WHEN** the backend successfully updates the active personal-note content
- **THEN** the corresponding summary MUST adopt the returned stored title and timestamps
- **AND** content changes MUST NOT cause the frontend to infer or publish a replacement title
- **AND** inactive summaries MUST remain unchanged

#### Scenario: Freeform content edit is pending persistence
- **WHEN** the user changes any Plate block before an explicit or boundary save succeeds
- **THEN** the summary rail MUST keep the last backend-returned title or its localized fallback
- **AND** it MUST NOT parse Plate content to publish an optimistic title
