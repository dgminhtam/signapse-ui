## MODIFIED Requirements

### Requirement: Protected market conversations route
The system SHALL provide a protected market conversation surface at `/market-conversations` and SHALL gate navigation, route access, conversation reads, conversation creation, and message submission with `query:execute`.

#### Scenario: Navigation is visible to authorized users
- **WHEN** a signed-in user can satisfy `query:execute`
- **THEN** the protected navigation shows the market conversation entry point pointing to `/market-conversations`

#### Scenario: Unauthorized route access is denied
- **WHEN** a signed-in user opens `/market-conversations` without `query:execute`
- **THEN** the frontend denies access using the repo's protected-route permission pattern

#### Scenario: Frontend does not send workspace ownership fields
- **WHEN** the frontend calls market conversation endpoints
- **THEN** the request does not include `workspaceId`, `userId`, or `ownerId`

### Requirement: Conversation detail timeline
The system SHALL render persisted conversation detail from `GET /market-conversations/{id}` as a text-message timeline.

#### Scenario: Persisted messages render in backend order
- **WHEN** an authorized user opens a conversation detail route
- **THEN** the frontend calls `GET /market-conversations/{id}`
- **AND** renders returned `messages[]` in response order

#### Scenario: User text message renders as user bubble
- **WHEN** a message has `role=USER`
- **THEN** the timeline renders it as a user message using its `content` and created timestamp

#### Scenario: Assistant text message renders as assistant bubble
- **WHEN** a message has `role=ASSISTANT`
- **THEN** the timeline renders its `content` as ordinary assistant text without analysis disclosure or analysis actions

#### Scenario: Failed assistant message
- **WHEN** an assistant message has `status=FAILED`
- **THEN** the timeline renders a failed assistant state with `failureReason` when present
- **AND** does not attempt to load analysis details

## REMOVED Requirements

### Requirement: Assistant analysis content
**Reason**: Conversation messages no longer expose an analysis kind or persisted analysis identifier.

**Migration**: Render `assistantMessage.content` as the complete assistant response.

### Requirement: Evidence drawer uses persisted snapshots
**Reason**: A conversation message can no longer identify an analysis whose evidence should be opened.

**Migration**: Remove conversation-owned evidence actions and retain the backend endpoint only as an unpublished frontend capability.

### Requirement: Manual Telegram delivery
**Reason**: The conversation surface can no longer identify a completed persisted analysis for delivery.

**Migration**: Remove conversation-owned delivery actions; scheduled Telegram market-analysis configuration remains unaffected.
