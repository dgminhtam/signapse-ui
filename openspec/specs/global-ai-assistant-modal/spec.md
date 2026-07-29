# global-ai-assistant-modal Specification

## Purpose
TBD - created by archiving change add-global-ai-assistant-modal. Update Purpose after archive.
## Requirements
### Requirement: Protected global assistant availability
The system SHALL expose a floating AI assistant entry point from the protected locale app shell only to authenticated users who have the `query:execute` permission.

#### Scenario: Authorized user opens a protected screen
- **WHEN** an authenticated user with `query:execute` opens any route under the protected app shell
- **THEN** the system renders the assistant trigger at the lower-right edge of the viewport

#### Scenario: User lacks assistant permission
- **WHEN** an authenticated user without `query:execute` opens a protected screen
- **THEN** the system does not render the assistant trigger or initialize its runtime

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

### Requirement: Persisted conversation integration boundary
The active conversation boundary SHALL use the existing authenticated market conversation actions and SHALL treat backend-persisted conversations as the source of truth.

#### Scenario: First message is submitted
- **WHEN** the user submits the first non-blank message from a new conversation draft
- **THEN** the frontend creates a market conversation with a title derived from the message and submits that message through the existing authenticated market conversation actions

#### Scenario: Existing conversation is loaded
- **WHEN** the user opens a persisted conversation
- **THEN** the frontend maps backend conversation messages into the active transcript state without creating a second browser-only conversation history or compatibility runtime

#### Scenario: Backend request fails
- **WHEN** a conversation load or message submission request fails
- **THEN** the assistant preserves the user's recoverable input and renders a localized failure state without reporting the message as persisted

### Requirement: Supported assistant actions match backend capability
The assistant SHALL expose only actions supported by the current Signapse backend contract.

#### Scenario: Assistant controls render
- **WHEN** the promoted assistant renders
- **THEN** attachment upload, message edit, regeneration, branching, fullscreen, conversation rename, conversation delete, conversation archive, and Assistant Cloud controls are absent

#### Scenario: Synchronous response is progressively presented
- **WHEN** a message is submitted through the current synchronous market conversation contract
- **THEN** the assistant shows stable pending feedback until the complete response returns
- **AND** it MAY progressively reveal the validated complete response without claiming backend token streaming or calling a streaming endpoint
