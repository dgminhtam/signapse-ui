## MODIFIED Requirements

### Requirement: Compact modal conversation surface
The assistant SHALL provide the primary market conversation experience inside the promoted global overlay without linking users to removed full-page market conversation routes.

#### Scenario: Assistant conversation renders
- **WHEN** a draft or persisted conversation is active
- **THEN** the overlay presents messages, searchable History access, a new-conversation action, composer state, tracking rail, and close control
- **AND** it does not expose a fullscreen control

#### Scenario: Removed route actions stay absent
- **WHEN** the global assistant renders for a draft or persisted conversation
- **THEN** it does not render an action to `/market-conversations`, `/market-conversations/{id}`, `/market-query`, or `/demo-conversation`

#### Scenario: Full workbench controls are evaluated
- **WHEN** the compact conversation surface renders
- **THEN** evidence sheets, Telegram delivery, full structured analysis workbench controls, attachments, edit, regenerate, branch, rename, delete, archive, and Assistant Cloud controls are absent

### Requirement: Localized accessible runtime states
The assistant market conversation workflow SHALL expose dictionary-backed English and Vietnamese labels and accessible interaction states.

#### Scenario: Runtime state changes
- **WHEN** History, messages, submission, pagination, empty state, or an error state is rendered
- **THEN** all user-facing copy and accessible names come from the active locale dictionary

#### Scenario: Keyboard user operates conversations
- **WHEN** a keyboard user opens History, selects a conversation, starts a new conversation, submits a message, jumps through the transcript, or closes the assistant
- **THEN** each action has a predictable focus order, an accessible name, and visible focus treatment
