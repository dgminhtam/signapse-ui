## MODIFIED Requirements

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
