## ADDED Requirements

### Requirement: Conversation messages MUST be pageable
The system SHALL provide frontend support for a paginated market conversation message contract so conversation detail pages do not need to load every persisted message in the initial detail payload.

#### Scenario: Initial latest message page loads
- **WHEN** an authorized user opens `/market-conversations/{id}`
- **THEN** the frontend MUST request conversation metadata for the route
- **AND** it MUST request the latest page of messages for that conversation
- **AND** it MUST render the returned messages as the initial timeline

#### Scenario: Message page request uses stable older-message cursor
- **WHEN** the frontend requests older messages for a conversation
- **THEN** the request MUST identify the current oldest loaded message using a stable cursor such as `beforeMessageId`
- **AND** it MUST include a bounded `size`
- **AND** it MUST NOT use conversation history list pagination parameters as message pagination state

#### Scenario: Message page response validation
- **WHEN** the backend returns a message page payload
- **THEN** the frontend MUST validate the messages with the existing market chat message schema
- **AND** it MUST validate pagination metadata that indicates whether older messages remain available
- **AND** it MUST show localized error feedback instead of crashing when the payload is malformed

### Requirement: Conversation detail MUST render as a chat viewport
The `/market-conversations/{id}` route SHALL render the timeline inside a bounded scrollable message viewport and SHALL keep the follow-up composer available at the bottom of the conversation workspace.

#### Scenario: Composer remains visible during timeline scrolling
- **WHEN** a conversation has more messages than fit in the visible workspace
- **THEN** only the message viewport MUST scroll
- **AND** the follow-up composer MUST remain visible at the bottom of the conversation workspace

#### Scenario: Latest messages are visible after initial load
- **WHEN** the initial message page finishes loading
- **THEN** the message viewport MUST position the user at the latest loaded messages
- **AND** the composer MUST be ready for follow-up input unless message submission is pending

#### Scenario: Empty timeline preserves chat layout
- **WHEN** the latest message page contains no messages
- **THEN** the message viewport MUST show a repo-standard empty state
- **AND** the composer MUST remain visible for submitting a follow-up message when allowed

### Requirement: Older messages MUST lazy-load upward
The conversation detail timeline SHALL load older messages when the user scrolls near the top of the message viewport and older messages are available.

#### Scenario: User scrolls near top with older messages available
- **WHEN** the user scrolls near the top of the message viewport
- **AND** the current message page state indicates older messages are available
- **THEN** the frontend MUST request the next older message page
- **AND** it MUST prepend the returned messages to the current timeline

#### Scenario: Prepending older messages preserves viewport position
- **WHEN** older messages are prepended above the currently visible messages
- **THEN** the frontend MUST preserve the user's apparent scroll position
- **AND** the message that was visible before the prepend MUST remain in approximately the same viewport location after render

#### Scenario: Repeated top-scroll does not duplicate messages
- **WHEN** the older-message loader is triggered repeatedly for the same cursor
- **THEN** the frontend MUST avoid duplicate in-flight requests for that cursor
- **AND** it MUST deduplicate messages by message id when merging pages

#### Scenario: No older messages remain
- **WHEN** the loaded message page state indicates no older messages remain
- **THEN** the frontend MUST stop requesting older pages on top-scroll
- **AND** it MUST render a quiet terminal state or no additional control at the top of the timeline

### Requirement: Message submission MUST integrate with paged timeline state
The existing synchronous conversation message submission flow SHALL append returned messages to the paged timeline without invalidating already loaded older message pages.

#### Scenario: User submits a follow-up message
- **WHEN** an authorized user submits a non-empty follow-up message
- **THEN** the frontend MUST call the existing message submission endpoint
- **AND** it MUST append the returned user and assistant messages to the loaded timeline
- **AND** it MUST clear the composer after successful submission

#### Scenario: Submission pending state remains local to composer
- **WHEN** a message submission is in flight
- **THEN** the composer and submit control MUST be disabled
- **AND** the timeline MUST show pending assistant feedback without clearing loaded older messages

#### Scenario: Submission failure preserves draft and timeline
- **WHEN** message submission fails
- **THEN** the frontend MUST preserve the user's draft message
- **AND** it MUST keep the currently loaded message pages intact
- **AND** it MUST show localized failure feedback

### Requirement: Conversation history sheet MUST remain independent
The conversation history sheet SHALL continue to paginate conversation summaries separately from detail-route message pagination.

#### Scenario: History sheet pagination changes
- **WHEN** the user changes page or size in the conversation history sheet
- **THEN** the history sheet MUST update conversation summary pagination state
- **AND** it MUST NOT reset or mutate the currently loaded message pages in the active conversation detail viewport

#### Scenario: Selecting another conversation
- **WHEN** the user selects another conversation from the history sheet
- **THEN** the frontend MUST navigate to that conversation's canonical detail route
- **AND** the destination detail route MUST initialize its own latest message page
