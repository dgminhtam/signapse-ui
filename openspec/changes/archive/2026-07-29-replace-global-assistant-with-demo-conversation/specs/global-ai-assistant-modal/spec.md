## MODIFIED Requirements

### Requirement: Local modal interaction

The assistant SHALL use the promoted persisted conversation surface in a local accessible non-modal Popover and SHALL keep open and close state in the protected application shell without changing the current URL or navigation history.

#### Scenario: User opens the assistant

- **WHEN** an authorized user activates the assistant trigger
- **THEN** the system opens the promoted conversation surface while preserving the current route and workspace behind it
- **AND** focus moves into the conversation overlay predictably
- **AND** controls outside the assistant remain operable

#### Scenario: User closes the assistant

- **WHEN** the user activates the close control, presses Escape, or interacts outside the assistant
- **THEN** the system closes the assistant without navigating away from the current screen
- **AND** the current workspace conversation session remains available for reopening

#### Scenario: Mobile viewport

- **WHEN** the user opens the assistant on a narrow viewport
- **THEN** the assistant remains fully usable without overflowing the viewport or obscuring its own composer and close control

### Requirement: Accessible localized placeholder experience

The active assistant surface SHALL provide dictionary-backed English and Vietnamese copy for its trigger, accessible title, empty state, composer state, loading state, error state, History, transcript, and close behavior.

#### Scenario: New conversation opens

- **WHEN** an authorized user opens the assistant without a selected persisted conversation
- **THEN** the system presents the localized promoted conversation empty state
- **AND** it does not imply that unsent content has been persisted

#### Scenario: Keyboard-only operation

- **WHEN** a keyboard user opens and interacts with the assistant
- **THEN** focus moves through the trigger, History, transcript controls, composer, and close behavior in a predictable order with accessible names

### Requirement: Supported assistant actions match backend capability

The assistant SHALL expose only actions supported by the current Signapse backend contract.

#### Scenario: Assistant controls render

- **WHEN** the promoted assistant renders
- **THEN** attachment upload, message edit, regeneration, branching, fullscreen, conversation rename, conversation delete, conversation archive, and Assistant Cloud controls are absent

#### Scenario: Synchronous response is progressively presented

- **WHEN** a message is submitted through the current synchronous market conversation contract
- **THEN** the assistant shows stable pending feedback until the complete response returns
- **AND** it MAY progressively reveal the validated complete response without claiming backend token streaming or calling a streaming endpoint

## REMOVED Requirements

### Requirement: Canonical full conversation route

**Reason**: Persisted History and conversation selection are owned by the promoted global assistant, and the canonical market-conversation page routes are no longer part of the active product flow.

**Migration**: Users access new and persisted conversations through the global assistant History and transcript surface.
