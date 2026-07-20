## MODIFIED Requirements

### Requirement: Autosave status MUST be visible without a Save button
The Personal Notes Sheet SHALL present localized inline autosave state inside the active or provisional note item and SHALL NOT expose a Save button or routine save-success toast.

#### Scenario: Save is pending for an existing note
- **WHEN** an update mutation is in flight for the selected note
- **THEN** the selected summary item MUST expose a localized saving state
- **AND** inactive summary items MUST NOT present that active editor state

#### Scenario: First draft save is pending
- **WHEN** a create mutation is in flight before the backend has assigned a note id
- **THEN** the summary rail MUST expose a localized provisional note item
- **AND** that item MUST present the localized saving state

#### Scenario: Latest value is saved
- **WHEN** the backend acknowledges the latest document sequence
- **THEN** the active persisted summary item MUST expose a localized saved state
- **AND** it MUST update the corresponding summary timestamp from the response
- **AND** a provisional item MUST be replaced by the returned persisted summary after the first create succeeds

#### Scenario: Save fails
- **WHEN** a create or update mutation fails
- **THEN** the Sheet MUST preserve the current editor value
- **AND** the active persisted or provisional note item MUST show a localized inline error
- **AND** the value MUST remain dirty for a later retry

#### Scenario: Autosave feedback is announced
- **WHEN** the active autosave state changes to saving, saved, or error
- **THEN** the active note feedback MUST be exposed to assistive technology with appropriate status or alert semantics

#### Scenario: No explicit save control exists
- **WHEN** an editable personal note is rendered
- **THEN** neither the editor toolbar nor the summary rail MUST render a Save button
