# market-conversation-ui Specification

## Purpose
TBD - created by archiving change add-market-conversation-ui. Update Purpose after archive.
## Requirements
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

### Requirement: Conversation list and pagination
The system SHALL list persisted market conversations for the backend-resolved current workspace using `GET /market-conversations` and SHALL keep pagination state in the URL.

#### Scenario: Conversation list loads
- **WHEN** an authorized user opens `/market-conversations`
- **THEN** the frontend calls `GET /market-conversations` with backend 0-indexed `page`, `size`, and a most-recently-updated sort
- **AND** renders the returned Spring page of conversation summaries

#### Scenario: URL pagination is used
- **WHEN** the user changes the conversation list page or page size
- **THEN** the URL `page` and `size` query parameters update using 1-indexed page semantics
- **AND** backend requests use the corresponding 0-indexed page

#### Scenario: Empty conversation list
- **WHEN** the conversation list response has no content
- **THEN** the page renders a repo-standard empty state with an affordance to start a conversation

### Requirement: Conversation starts from first question
The system SHALL let users start a new market conversation by entering the first question and SHALL derive the conversation title from that first question.

#### Scenario: First question creates conversation and message
- **WHEN** an authorized user submits a non-blank first question from the start-conversation UI
- **THEN** the frontend calls `POST /market-conversations` with a non-blank title derived from the trimmed question
- **AND** navigates or opens the created conversation detail
- **AND** submits the same trimmed question to `POST /market-conversations/{id}/messages`

#### Scenario: Blank first question is rejected before API calls
- **WHEN** the user submits an empty or whitespace-only first question
- **THEN** the frontend shows localized validation feedback
- **AND** does not call `POST /market-conversations` or `POST /market-conversations/{id}/messages`

#### Scenario: Long first question remains usable as title
- **WHEN** the first question is longer than the UI title limit
- **THEN** the frontend sends a trimmed, capped non-blank title for conversation creation
- **AND** preserves the full trimmed question as the submitted message

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

### Requirement: Synchronous message submission
The system SHALL submit conversation messages with `POST /market-conversations/{id}/messages` and SHALL render the returned user and assistant messages without using streaming.

#### Scenario: User submits a valid message
- **WHEN** an authorized user submits a non-blank message in a conversation
- **THEN** the frontend calls `POST /market-conversations/{id}/messages` with `{ message }`
- **AND** omits `asOfTime` unless a future UI explicitly exposes an analysis-time control
- **AND** renders the returned `userMessage` and `assistantMessage`

#### Scenario: Composer is pending
- **WHEN** a message submission is in flight
- **THEN** the composer and submit control are disabled for that conversation
- **AND** the submit control shows repo-standard spinner feedback
- **AND** the timeline shows assistant loading feedback

#### Scenario: Network submission failure preserves text
- **WHEN** the message submission request fails before a successful response is returned
- **THEN** the frontend keeps the user's typed message recoverable
- **AND** shows localized failure feedback with a retry affordance

#### Scenario: Streaming endpoint is not used
- **WHEN** the user submits a message in Phase 10
- **THEN** the frontend does not call `/market-conversations/{id}/messages/stream`

### Requirement: Legacy one-shot query is not the primary flow
The system SHALL NOT use `POST /query` as the primary market conversation experience.

#### Scenario: Market conversation UI submits messages
- **WHEN** the user starts or continues a market conversation
- **THEN** the frontend uses market conversation message endpoints
- **AND** does not call `POST /query`

#### Scenario: Old route compatibility does not retain legacy UI
- **WHEN** `/market-query` remains reachable for compatibility
- **THEN** it redirects or guides users to `/market-conversations`
- **AND** does not render the legacy one-shot workbench
