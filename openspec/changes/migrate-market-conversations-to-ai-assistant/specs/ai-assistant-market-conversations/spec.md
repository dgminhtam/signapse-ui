## ADDED Requirements

### Requirement: Workspace-scoped assistant conversation session
The system SHALL scope assistant conversation state and requests to the active workspace.

#### Scenario: Assistant first opens in a workspace
- **WHEN** an authorized user opens the assistant before selecting a persisted conversation in the active workspace
- **THEN** the system presents a new-conversation draft without silently resuming a previous thread

#### Scenario: User closes and reopens the assistant
- **WHEN** the user closes and reopens the assistant without changing workspace or leaving the protected shell
- **THEN** the system preserves the current draft or selected conversation session

#### Scenario: Active workspace changes
- **WHEN** the protected app switches to a different workspace
- **THEN** the system clears the selected conversation, messages, pagination, draft, and failure state before loading history for the new workspace

#### Scenario: Stale workspace request completes
- **WHEN** a request started for a previous workspace completes after the active workspace has changed
- **THEN** the system ignores that result and does not expose its conversations or messages in the active workspace

### Requirement: Persisted conversation creation
The assistant SHALL create and use a backend market conversation when the user submits the first non-blank message from a new-conversation draft.

#### Scenario: First message succeeds
- **WHEN** the user submits the first non-blank draft message
- **THEN** the system derives a bounded conversation title, creates the conversation, submits the message to its identifier, selects the persisted conversation, and renders the backend-returned messages

#### Scenario: Blank first message
- **WHEN** the user attempts to submit a blank or whitespace-only draft message
- **THEN** the system does not create a conversation or send a message

#### Scenario: Conversation creation fails
- **WHEN** the backend rejects or fails the conversation creation request
- **THEN** the system keeps the user's draft recoverable and renders a localized failure state without reporting persistence

#### Scenario: First message fails after creation
- **WHEN** conversation creation succeeds but first-message submission fails
- **THEN** the system keeps the created conversation selected, preserves recoverable message input, and permits retry without creating a duplicate conversation

### Requirement: Conversation history and explicit thread selection
The assistant SHALL provide compact access to persisted market conversation history for the active workspace.

#### Scenario: Recent history loads
- **WHEN** the assistant history is opened
- **THEN** the system loads a bounded page of conversation summaries and presents localized loading, empty, and failure states

#### Scenario: User selects a conversation
- **WHEN** the user selects a persisted conversation from history
- **THEN** the system makes that conversation active and loads its latest messages

#### Scenario: User starts another conversation
- **WHEN** the user activates the new-conversation control
- **THEN** the system clears the active persisted thread from the modal and presents a fresh draft without deleting or modifying the previous conversation

#### Scenario: Stale thread request completes
- **WHEN** a message request for a previously selected conversation completes after another thread is selected
- **THEN** the system ignores the stale result and preserves the currently selected thread

### Requirement: Paginated persisted message timeline
The assistant SHALL load persisted conversation messages from the backend message-page contract and SHALL keep them in chronological display order.

#### Scenario: Persisted conversation is selected
- **WHEN** the user selects a persisted conversation
- **THEN** the system loads the latest message page with a bounded size of 30, normalizes messages into chronological order, and maps them into Assistant UI message state

#### Scenario: Older messages are available
- **WHEN** the user requests older messages and the current page reports more history
- **THEN** the system requests the next `beforeMessageId` page, prepends unseen messages, and preserves chronological order

#### Scenario: Duplicate message is returned
- **WHEN** message pages or a submission response contain a message identifier already present in the timeline
- **THEN** the system reconciles the stored message with the latest payload instead of rendering the identifier twice

#### Scenario: Final page omits a next cursor
- **WHEN** a message page reports `hasMore` as false and its next cursor is null or absent
- **THEN** the system treats the timeline as exhausted and does not request another page

#### Scenario: Older-message request fails
- **WHEN** an older-message request fails
- **THEN** the system preserves the already loaded timeline and offers a localized retry state

### Requirement: Synchronous follow-up submission
The assistant SHALL submit follow-up messages through the existing authenticated market conversation action and SHALL represent the request as synchronous rather than token-streaming.

#### Scenario: Follow-up submission is pending
- **WHEN** the user submits a non-blank message to an existing conversation
- **THEN** the system prevents duplicate submission, shows a stable localized pending state, and does not claim that tokens are streaming

#### Scenario: Follow-up submission succeeds
- **WHEN** the backend returns a successful follow-up response
- **THEN** the system reconciles the timeline with backend-returned user and assistant messages and clears the submitted input

#### Scenario: Follow-up submission fails
- **WHEN** the backend rejects or fails the follow-up request
- **THEN** the system preserves recoverable input, removes any false persisted state, and renders a localized failure state

### Requirement: Compact modal conversation surface
The assistant SHALL provide the primary market conversation experience inside the global modal without linking users to removed full-page market conversation routes.

#### Scenario: Assistant conversation renders
- **WHEN** a draft or persisted conversation is active
- **THEN** the modal presents compact messages, history access, a new-conversation action, composer state, and fullscreen control without embedding or linking to a removed canonical page shell

#### Scenario: Removed route actions stay absent
- **WHEN** the assistant modal renders for a draft or persisted conversation
- **THEN** it does not render an action to `/market-conversations`, `/market-conversations/{id}`, or `/market-query`

#### Scenario: Full workbench controls are evaluated
- **WHEN** the compact modal conversation surface renders
- **THEN** evidence sheets, Telegram delivery, full structured analysis workbench controls, attachments, edit, regenerate, branch, rename, delete, archive, and Assistant Cloud controls are absent

### Requirement: Localized accessible runtime states
The assistant market conversation workflow SHALL expose dictionary-backed English and Vietnamese labels and accessible interaction states.

#### Scenario: Runtime state changes
- **WHEN** history, messages, submission, pagination, empty state, or an error state is rendered
- **THEN** all user-facing copy and accessible names come from the active locale dictionary

#### Scenario: Keyboard user changes threads
- **WHEN** a keyboard user opens history, selects a conversation, starts a new conversation, submits a message, or opens the canonical route
- **THEN** each action has a predictable focus order, an accessible name, and visible focus treatment
