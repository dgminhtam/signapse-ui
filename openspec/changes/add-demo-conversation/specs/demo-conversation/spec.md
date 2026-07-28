## ADDED Requirements

### Requirement: Locale-aware protected demo route

The system SHALL expose the conversation demo at `/demo-conversation` within the existing locale-aware protected main application shell.

#### Scenario: Open the Vietnamese demo

- **WHEN** an authenticated user navigates to `/vi/demo-conversation`
- **THEN** the system renders the demo inside the protected main shell with Vietnamese route and control labels

#### Scenario: Open the English demo

- **WHEN** an authenticated user navigates to `/en/demo-conversation`
- **THEN** the system renders the demo inside the protected main shell with English route and control labels

### Requirement: Independent demo boundary

The demo SHALL operate as a standalone conversation surface and SHALL NOT read or mutate another assistant surface's route-local fixtures, state, permissions, or navigation.

#### Scenario: Load the demo directly

- **WHEN** a user opens the demo directly without first visiting another assistant route
- **THEN** the demo initializes and operates without data or state from the prototype

#### Scenario: Use the demo without market-query permission

- **WHEN** an authenticated user lacks market-query execution permission but can access the main application shell
- **THEN** the demo does not apply the prototype's market-query permission gate

### Requirement: Deterministic scripted conversation

The demo SHALL present predefined user and assistant turns in order through an in-memory simulated AI SDK chat lifecycle and SHALL NOT call a backend conversation API or persist the transcript.

#### Scenario: Send the next scripted turn

- **WHEN** the demo is ready and the user activates Send
- **THEN** the next predefined user message is appended and its paired assistant response progresses through submitted and streaming states

#### Scenario: Exhaust the script

- **WHEN** all predefined user turns have been sent
- **THEN** the system disables Send and communicates that no scripted message remains

#### Scenario: Reload the demo

- **WHEN** the user reloads the route after sending messages
- **THEN** the transcript returns to its initial fixture state because no conversation was persisted

### Requirement: Conversation scrolling behavior

The demo SHALL use the installed message-scroller behavior to follow streamed output at the live edge, anchor user turns, preserve a reader who scrolls away, and provide a jump-to-latest control.

#### Scenario: Follow a streamed response

- **WHEN** an assistant response streams while the reader remains at the live edge
- **THEN** the viewport follows the growing response without manual user scrolling

#### Scenario: Show simulated request loading

- **WHEN** a scripted turn is submitted and no assistant text has arrived
- **THEN** the transcript shows a localized Thinking status with a spinner until the first assistant text appears

#### Scenario: Preserve deliberate reading position

- **WHEN** the reader scrolls away from the live edge while a response streams
- **THEN** new output does not force the viewport back to the latest message

#### Scenario: Return to latest

- **WHEN** unread content exists below the current viewport and the reader activates jump-to-latest
- **THEN** the viewport moves to the newest content and resumes live-edge following

#### Scenario: Track anchored turns

- **WHEN** the transcript contains scripted user turns
- **THEN** a right-side tracking rail identifies the current anchored turn and lets the reader jump to another loaded user turn

#### Scenario: Preview an anchored turn

- **WHEN** the reader hovers or focuses a tracking-rail item
- **THEN** only that rail expands and a localized Hover Card previews a bold bounded user message followed by its muted bounded assistant reply without changing the active transcript

#### Scenario: Track a long transcript

- **WHEN** the full 50-message fixture history is selected
- **THEN** the rail remains inside the Card content, does not overlap the transcript, fades overflowing items at its edges, and keeps the current anchored turn available

### Requirement: Scripted composer and conversation actions

The demo SHALL show the next predefined user message in a read-only composer, prevent concurrent submissions, and provide New chat, History, and Close actions.

#### Scenario: Busy controls

- **WHEN** a turn is submitted or streaming
- **THEN** Send, New chat, and History are disabled until the turn is no longer busy

#### Scenario: Start a new chat

- **WHEN** the demo is idle and the user activates New chat
- **THEN** all displayed fixture messages are cleared and the first scripted user message becomes available again

#### Scenario: Open fixture history

- **WHEN** the user activates the current chat title
- **THEN** a localized searchable Popover lists route-local fixture conversations

#### Scenario: Search fixture history

- **WHEN** the user enters text in the history search
- **THEN** the system filters fixture conversations by localized title without calling a backend

#### Scenario: Load more fixture history

- **WHEN** the reader approaches the end of the visible history list
- **THEN** the system reveals the next local batch until all 25 fixture snapshots are available

#### Scenario: Select fixture history

- **WHEN** the user selects a history item while the demo is idle
- **THEN** the Popover closes and the selected scripted snapshot becomes the active transcript

#### Scenario: Close the demo

- **WHEN** the user activates Close
- **THEN** the system navigates to the localized dashboard

#### Scenario: Prevent arbitrary prompt submission

- **WHEN** the user interacts with the scripted composer
- **THEN** the displayed predefined message cannot be edited into an arbitrary prompt

### Requirement: Accessible localized conversation surface

The demo SHALL provide localized visible copy and accessible names, expose the transcript as an announceable scroll region, and report busy streaming state without introducing inactive focus stops.

#### Scenario: Stream announcement state

- **WHEN** an assistant response is streaming
- **THEN** the transcript exposes a busy state so assistive technology can defer completion announcements appropriately

#### Scenario: Keyboard-accessible transcript

- **WHEN** a keyboard user focuses the conversation viewport
- **THEN** the user can scroll the transcript and operate visible Send, New chat, chat-title History, Close, and jump-to-latest controls with localized accessible names

#### Scenario: Identify senders without visible role labels

- **WHEN** user and assistant messages are rendered
- **THEN** their localized roles are visually hidden but remain available to assistive technology

#### Scenario: Scroll without native scrollbar chrome

- **WHEN** the transcript contains overflowing messages
- **THEN** its native scrollbar remains hidden while wheel, touch, keyboard, rail, and jump-to-latest scrolling continue to work

#### Scenario: Inactive jump control

- **WHEN** the transcript is already at the latest content
- **THEN** the inactive jump-to-latest control is not an additional keyboard focus stop
