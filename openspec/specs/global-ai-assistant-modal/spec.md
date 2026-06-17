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
The assistant SHALL use the Assistant UI `AssistantModal` interaction pattern and SHALL keep open and close state local to the protected app shell without changing the current URL or navigation history.

#### Scenario: User opens the assistant
- **WHEN** an authorized user activates the assistant trigger
- **THEN** the system opens a conversation surface anchored to the trigger while preserving the current route and workspace behind it

#### Scenario: User closes the assistant
- **WHEN** the user activates the close control, presses Escape, or dismisses the modal through supported focus behavior
- **THEN** the system closes the assistant without navigating away from the current screen

#### Scenario: Mobile viewport
- **WHEN** the user opens the assistant on a narrow viewport
- **THEN** the assistant remains fully usable without overflowing the viewport or obscuring its own composer and close control

### Requirement: Accessible localized placeholder experience
The initial assistant surface SHALL provide dictionary-backed English and Vietnamese copy for its trigger, accessible title, welcome state, composer state, loading state, error state, and full-conversation action.

#### Scenario: Placeholder opens before backend conversation wiring
- **WHEN** an authorized user opens the initial placeholder assistant
- **THEN** the system presents a clear localized placeholder conversation state and does not imply that an unsent or unsupported action has been persisted

#### Scenario: Keyboard-only operation
- **WHEN** a keyboard user opens and interacts with the assistant
- **THEN** focus moves through the trigger, modal content, composer state, full-conversation action, and close behavior in a predictable order with accessible names

### Requirement: Persisted conversation integration boundary
The assistant runtime boundary SHALL be compatible with the existing authenticated market conversation actions and SHALL treat backend-persisted conversations as the source of truth when message submission is enabled.

#### Scenario: First message is submitted after backend wiring
- **WHEN** the user submits the first non-blank message from a backend-enabled assistant thread
- **THEN** the frontend creates a market conversation with a title derived from the message and submits that message through the existing authenticated market conversation actions

#### Scenario: Existing conversation is loaded after backend wiring
- **WHEN** the runtime opens a persisted conversation
- **THEN** the frontend maps backend conversation messages into Assistant UI message state without creating a second browser-only conversation history

#### Scenario: Backend request fails
- **WHEN** a conversation load or message submission request fails
- **THEN** the assistant preserves the user's recoverable input and renders a localized failure state without reporting the message as persisted

### Requirement: Canonical full conversation route
The floating assistant SHALL remain a secondary workspace surface and SHALL preserve `/market-conversations` and `/market-conversations/{id}` as the canonical routes for persisted history and full analysis detail.

#### Scenario: User requests the full conversation experience
- **WHEN** the user activates the full-conversation action from the modal
- **THEN** the system navigates through locale-aware routing to the relevant canonical market conversation route

#### Scenario: Modal is opened from a canonical conversation page
- **WHEN** the assistant is available while the user is already on `/market-conversations` or a conversation detail route
- **THEN** the modal does not replace, intercept, or duplicate canonical route navigation state

### Requirement: Supported assistant actions match backend capability
The assistant SHALL expose only actions supported by the current Signapse backend contract.

#### Scenario: Initial assistant controls render
- **WHEN** the placeholder or backend-enabled assistant thread renders
- **THEN** attachment upload, message edit, regeneration, branching, conversation rename, conversation delete, conversation archive, and Assistant Cloud controls are absent

#### Scenario: Streaming is unavailable
- **WHEN** a message is submitted through the current synchronous market conversation contract
- **THEN** the assistant renders a stable pending state and does not claim token-streaming behavior

