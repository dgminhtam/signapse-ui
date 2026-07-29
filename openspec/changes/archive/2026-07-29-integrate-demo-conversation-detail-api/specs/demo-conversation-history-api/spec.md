## ADDED Requirements

### Requirement: Select persisted conversation transcript

The demo SHALL let an authorized user select a persisted History summary and SHALL replace the content area with that conversation's text transcript.

#### Scenario: Select a persisted conversation

- **WHEN** an authorized user activates a persisted History row with pointer or keyboard
- **THEN** the History Popover closes
- **AND** the demo title changes to the selected conversation title
- **AND** the system requests the latest message page for that conversation

#### Scenario: Load the selected transcript

- **WHEN** the selected conversation message request succeeds
- **THEN** the system renders the messages in chronological order
- **AND** each backend `USER` or `ASSISTANT` role is rendered as the corresponding user or assistant message
- **AND** the content area scrolls to the latest loaded message

#### Scenario: Selected conversation has no messages

- **WHEN** the selected conversation message request succeeds with no messages
- **THEN** the content area shows a localized persisted-transcript empty state

### Requirement: Localized persisted transcript request states

The demo SHALL communicate persisted transcript loading and failure states with localized visible and accessible feedback.

#### Scenario: Initial transcript request is active

- **WHEN** a persisted conversation has been selected and its first message request is active
- **THEN** stale scripted or previously selected messages are not displayed
- **AND** the content area exposes a localized loading status

#### Scenario: Initial transcript request fails

- **WHEN** the selected conversation message request fails
- **THEN** the content area exposes a localized failure state and Retry action
- **AND** the selected title remains visible

#### Scenario: Retry selected transcript

- **WHEN** the user activates Retry for the selected conversation
- **THEN** the system requests its latest message page again

#### Scenario: Older selection finishes last

- **WHEN** a request for an older selection completes after a newer conversation was selected or New chat was activated
- **THEN** the system ignores the older response
- **AND** it does not replace the current transcript state

### Requirement: Incremental persisted transcript pagination

The demo SHALL use the message cursor returned by the backend to load older persisted messages without changing their chronological order.

#### Scenario: Older messages are available

- **WHEN** the loaded message page reports `hasMore` with a `nextBeforeMessageId`
- **THEN** the content area exposes a localized Load older messages action

#### Scenario: Load an older message page

- **WHEN** the user activates Load older messages
- **THEN** the system requests the selected conversation with the current exclusive `beforeMessageId` cursor
- **AND** unique older messages are prepended in chronological order

#### Scenario: Older-message request is active

- **WHEN** an older-message request is already active
- **THEN** another older-message request is not started
- **AND** the loading action exposes localized pending feedback

#### Scenario: No older messages remain

- **WHEN** the backend reports that no older message page remains
- **THEN** the Load older messages action is not displayed

### Requirement: Persisted transcript is read-only

The demo SHALL keep persisted transcript viewing separate from conversation creation and message submission.

#### Scenario: View a persisted transcript

- **WHEN** a persisted conversation is selected
- **THEN** the composer does not send a scripted or persisted message
- **AND** the system does not call a create-conversation or submit-message API

#### Scenario: Start a new scripted conversation

- **WHEN** the user activates New chat while a persisted conversation is selected or loading
- **THEN** the system invalidates the persisted transcript request
- **AND** restores the initial scripted transcript, title, and composer behavior
- **AND** no persisted conversation is created or modified

#### Scenario: User lacks history permission

- **WHEN** a user without `query:execute` uses the standalone demo
- **THEN** no persisted transcript request is available
- **AND** the existing scripted demo behavior remains available

## REMOVED Requirements

### Requirement: Persisted history remains separate from transcript detail

**Reason**: This change expands persisted History from informational summaries into selectable, read-only transcript entries.

**Migration**: Replace non-interactive summary rows with accessible selection controls, load messages through the existing cursor endpoint, and retain New chat as the transition back to the scripted demo.
