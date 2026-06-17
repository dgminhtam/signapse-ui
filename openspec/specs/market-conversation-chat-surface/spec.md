# market-conversation-chat-surface Specification

## Purpose
TBD - created by archiving change refine-market-conversation-chat-surface. Update Purpose after archive.
## Requirements
### Requirement: Market conversation entry MUST prioritize a centered composer
The `/market-conversations` route SHALL present new conversation creation as the primary surface with one large composer centered in the main workspace, and it MUST NOT render the conversation history table as the main page content.

#### Scenario: Authorized user opens the market conversation entry route
- **WHEN** a user with `query:execute` opens `/market-conversations`
- **THEN** the page MUST show a prominent first-question composer in the main workspace
- **AND** the page MUST provide a history trigger outside the composer
- **AND** the page MUST NOT show the conversation history table by default

#### Scenario: User starts a new market conversation
- **WHEN** the user submits a non-empty first question from the centered composer
- **THEN** the frontend MUST create a market conversation using the existing conversation creation flow
- **AND** it MUST submit the first question as the initial user message
- **AND** it MUST navigate to the canonical detail route for the created conversation after success

### Requirement: Conversation history MUST open in a right-side sheet
The market conversation surface SHALL expose saved conversation history through a local right-side sheet, and the sheet MUST render history as a compact selectable list rather than as a table.

#### Scenario: User opens conversation history
- **WHEN** the user activates the conversation history trigger on `/market-conversations`
- **THEN** the frontend MUST open a right-side sheet with a visible or screen-reader-accessible title for conversation history
- **AND** the sheet MUST list saved conversations using compact list items
- **AND** each list item MUST include the conversation title and secondary timestamp metadata when available

#### Scenario: No saved conversations exist
- **WHEN** the history sheet opens and the conversation page is empty
- **THEN** the sheet MUST render a repo-standard empty state
- **AND** it MUST NOT render a duplicate pagination summary such as a separate "no data" surface

### Requirement: Selecting history MUST open canonical conversation detail
The history sheet SHALL use canonical localized links for conversation selection, and it MUST NOT manage selected conversation detail solely through local sheet state.

#### Scenario: User selects a conversation from history
- **WHEN** the user activates a conversation item in the history sheet
- **THEN** the frontend MUST navigate to `/market-conversations/{id}` with the active locale preserved
- **AND** the destination page MUST show the full conversation timeline for that conversation

#### Scenario: User closes the history sheet without selecting
- **WHEN** the user closes the history sheet
- **THEN** the frontend MUST keep the current route unchanged
- **AND** it MUST preserve any typed composer value on the current page

### Requirement: Conversation detail MUST remain thread-first with history access
The `/market-conversations/{id}` route SHALL keep the full conversation timeline and follow-up composer as the primary content, while providing access to the same history sheet for switching conversations.

#### Scenario: Authorized user opens a conversation detail route
- **WHEN** a user with `query:execute` opens `/market-conversations/{id}`
- **THEN** the page MUST render the conversation timeline as the primary content
- **AND** it MUST render a follow-up message composer for that conversation
- **AND** it MUST provide a conversation history trigger

#### Scenario: User switches conversations from detail history
- **WHEN** the user selects another conversation from the detail page history sheet
- **THEN** the frontend MUST navigate to that selected conversation's canonical detail route
- **AND** it MUST NOT embed the selected conversation timeline inside the history sheet
