## ADDED Requirements

### Requirement: Personal notes Sheet MUST let creators start a new draft
The system SHALL expose a localized new-note action in the summary rail after summaries load successfully for users with `personal-note:create`, and activating it MUST start an editable blank provisional draft through the existing autosave capability.

#### Scenario: Creator starts another note
- **WHEN** the summary request has succeeded and a user with `personal-note:create` activates the new-note action
- **THEN** the Sheet MUST initialize an editable blank Plate document with no persisted note id
- **AND** it MUST NOT create a backend record until the draft content changes

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
- **AND** the successful first autosave MUST replace the provisional state with the returned persisted summary and active note id

#### Scenario: User lacks create permission
- **WHEN** summaries load for a user without `personal-note:create`
- **THEN** the Sheet MUST NOT expose the new-note action

#### Scenario: Summary state is unknown
- **WHEN** the first summary request is pending or has failed
- **THEN** the Sheet MUST NOT allow a new draft to be initialized from the create action
