# demo-conversation-history-api Specification

## Purpose

Define the permission, loading, search, pagination, selection, and follow-up submission behavior for persisted conversations shown by the standalone conversation demo.

## Requirements

### Requirement: Global assistant adopts persisted conversation behavior

The promoted global assistant SHALL satisfy the persisted creation, status mapping, History search, pagination, transcript selection, operation-specific retry, and follow-up submission requirements defined by this capability.

#### Scenario: Promoted global assistant opens

- **WHEN** an authorized user opens the global assistant for an active workspace
- **THEN** all persisted requests and transcript state use the existing promoted conversation behavior

### Requirement: Active workspace lifecycle

The promoted global assistant SHALL scope all persisted conversation state and requests to the current active workspace.

#### Scenario: No active workspace

- **WHEN** an authorized user opens the assistant without an active workspace
- **THEN** the assistant shows a localized no-active-workspace state
- **AND** History and the composer are unavailable
- **AND** no History, detail, create, or submit request is made

#### Scenario: Active workspace changes

- **WHEN** the active workspace changes while the protected shell remains mounted
- **THEN** the assistant resets its selected conversation, messages, cursors, History results and query, draft, loading state, and errors
- **AND** the new workspace starts with an empty persisted draft

#### Scenario: Previous-workspace response finishes late

- **WHEN** a request started for a previous workspace completes after the active workspace changes
- **THEN** the response does not update the new workspace's conversation state

### Requirement: Persisted conversation creation on first message

The demo SHALL create a persisted market conversation when the user submits the first non-empty message of a new draft and SHALL submit that message to the created conversation.

#### Scenario: Submit the first message

- **WHEN** an authorized user with an active workspace submits a non-empty draft without a selected conversation
- **THEN** the system derives a bounded title from the trimmed message
- **AND** creates one persisted conversation
- **AND** selects the created conversation before submitting the message to it

#### Scenario: First message succeeds

- **WHEN** conversation creation and first-message submission both succeed
- **THEN** the returned user and assistant messages become the transcript truth in chronological order
- **AND** the draft is cleared
- **AND** the created conversation is placed at the beginning of the loaded History summaries

#### Scenario: Conversation creation fails

- **WHEN** the create-conversation action fails
- **THEN** no conversation is selected
- **AND** the exact available action error is exposed as localized accessible feedback
- **AND** the draft remains available for retry

#### Scenario: First submission fails after creation

- **WHEN** conversation creation succeeds but its first message submission fails
- **THEN** the created conversation remains selected and present in History
- **AND** the exact available submit error is exposed as localized accessible feedback
- **AND** the draft remains available for retry

#### Scenario: Retry after first submission failure

- **WHEN** the user retries after creation succeeded and first-message submission failed
- **THEN** the system submits the retained draft to the already selected conversation
- **AND** does not create another conversation

### Requirement: Backend message metadata and failure rendering

The demo SHALL preserve backend message role, status, content, failure reason, and creation date and SHALL render failed assistant messages as failures rather than omit or normalize them as completed messages.

#### Scenario: Render a completed message

- **WHEN** a backend message has status `COMPLETED`
- **THEN** the demo renders its available content with the corresponding `USER` or `ASSISTANT` presentation

#### Scenario: Render a failed assistant message with content

- **WHEN** an assistant message has status `FAILED` and non-empty content
- **THEN** the demo renders the content and an accessible failure indicator
- **AND** the indicator uses the backend failure reason when available

#### Scenario: Render a failed assistant message without content

- **WHEN** an assistant message has status `FAILED` and empty or null content
- **THEN** the message remains in the transcript
- **AND** the demo renders its failure reason or a localized generic failure message

#### Scenario: Preview a failed turn

- **WHEN** a tracking-rail preview includes a failed assistant response
- **THEN** the preview uses its available content or failure reason
- **AND** does not describe the persisted failure as Thinking

### Requirement: Permission-scoped on-demand history

The promoted global assistant SHALL be available only to users with market-query execution permission and SHALL request active-workspace conversation summaries only when an authorized user opens History.

#### Scenario: Authorized user opens History

- **WHEN** a user with `query:execute` and an active workspace opens the assistant History Popover
- **THEN** the system requests page zero with size 10 ordered by `lastModifiedDate` descending
- **AND** the system renders summaries from the active workspace

#### Scenario: User reopens History

- **WHEN** an authorized user closes and later reopens History
- **THEN** the system requests a fresh first page for the current active workspace

#### Scenario: User lacks permission

- **WHEN** a user without `query:execute` opens a protected application route
- **THEN** the system does not render or initialize the global assistant
- **AND** no persisted conversation request or composer is available

### Requirement: Backend-backed history search

The demo SHALL search persisted conversation titles through the backend after a 300 ms debounce and SHALL treat each normalized query as a separate result set.

#### Scenario: Search by conversation title

- **WHEN** an authorized user enters a non-empty History search term and stops typing for 300 ms
- **THEN** the system trims the term and requests page zero with a case-insensitive title filter
- **AND** the displayed rows are replaced by the matching backend summaries

#### Scenario: Clear history search

- **WHEN** the user clears the History search term
- **THEN** the system resets pagination and requests the unfiltered first page

#### Scenario: Older request finishes last

- **WHEN** a previous History request completes after a request for a newer normalized query
- **THEN** the system ignores the older response
- **AND** the displayed rows continue to represent the newer query

### Requirement: Incremental persisted history pagination

The demo SHALL incrementally append persisted summary pages while preventing concurrent or duplicate additions.

#### Scenario: Approach the end of a partial list

- **WHEN** the user scrolls near the end of History and the backend reports another page
- **THEN** the system requests the next page for the active normalized query
- **AND** unique summaries are appended in backend order

#### Scenario: Pagination request is already active

- **WHEN** the user remains near the end while a History request is active
- **THEN** the system does not start another pagination request

#### Scenario: Backend reports the final page

- **WHEN** the loaded response is the final page
- **THEN** further near-end scrolling does not request another page

### Requirement: Localized history request states

The demo SHALL communicate persisted History loading, empty, failure, and retry states with localized visible or accessible text and preserve the current normalized query for retry.

#### Scenario: Load the first page

- **WHEN** History has no displayed summaries and its first request is active
- **THEN** the Popover exposes a localized loading status

#### Scenario: No persisted summaries match

- **WHEN** the current History request succeeds with no summaries
- **THEN** the Popover shows the localized empty state

#### Scenario: History request fails

- **WHEN** a History request fails
- **THEN** the Popover exposes the available request error and a localized Retry action
- **AND** no unrelated fallback history is shown

#### Scenario: Retry the current result set

- **WHEN** the user activates Retry
- **THEN** the system requests page zero for the current normalized query

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

The demo SHALL communicate initial persisted transcript loading and failure independently from older-message loading and failure.

#### Scenario: Initial transcript request is active

- **WHEN** a persisted conversation has been selected and its first message request is active
- **THEN** stale or previously selected messages are not displayed
- **AND** the content area exposes a localized loading status
- **AND** the composer is disabled

#### Scenario: Initial transcript request fails

- **WHEN** the selected conversation message request fails
- **THEN** the content area exposes the available request error and a localized Retry action
- **AND** the selected title remains visible

#### Scenario: Retry initial transcript

- **WHEN** the user activates Retry for the initial transcript failure
- **THEN** the system requests the selected conversation's latest message page again

#### Scenario: Older selection finishes last

- **WHEN** a request for an older selection completes after a newer conversation, new draft, or workspace becomes active
- **THEN** the system ignores the older response
- **AND** it does not replace the current transcript state

### Requirement: Incremental persisted transcript pagination

The demo SHALL use the message cursor returned by the backend to load older persisted messages without changing their chronological order or discarding the already loaded timeline when an older-page request fails.

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

#### Scenario: Older-message request fails

- **WHEN** an older-message request fails
- **THEN** the already loaded timeline and exclusive cursor remain unchanged
- **AND** the content area exposes the available request error and a localized Retry action for that cursor

#### Scenario: Retry older messages

- **WHEN** the user activates Retry after an older-message failure
- **THEN** the system requests the same selected conversation with the same failed `beforeMessageId` cursor
- **AND** does not reload or replace the latest message page

#### Scenario: No older messages remain

- **WHEN** the backend reports that no older message page remains
- **THEN** the Load older messages action is not displayed

### Requirement: Persisted transcript supports follow-up submission

The demo SHALL let an authorized user submit a non-empty text message to the selected persisted conversation and SHALL use the validated backend response as transcript truth.

#### Scenario: Submit a persisted follow-up

- **WHEN** an authorized user submits a non-empty message while a persisted conversation is selected
- **THEN** the system posts the trimmed message to that selected conversation
- **AND** the returned user and assistant messages are reconciled once in chronological order
- **AND** the transcript follows the newly appended response at the live edge

#### Scenario: Submit empty content

- **WHEN** the composer contains only empty or whitespace content
- **THEN** the system does not call create or submit-message
- **AND** no transcript message is added

#### Scenario: Submission is active

- **WHEN** a conversation create or message submit operation is in progress
- **THEN** the composer exposes localized operation-specific pending feedback
- **AND** duplicate submission, History selection, and New chat are disabled until the operation settles

#### Scenario: Follow-up submission fails

- **WHEN** the submit-message action fails for an existing selected conversation
- **THEN** the transcript remains unchanged
- **AND** the exact available action error is exposed as localized accessible feedback
- **AND** the entered draft remains available for retry

#### Scenario: Follow-up submission succeeds

- **WHEN** the submit-message action succeeds
- **THEN** the returned messages are reconciled into the transcript
- **AND** a completed non-empty assistant response may be progressively revealed without changing the stored backend message
- **AND** the draft is cleared
- **AND** the selected conversation moves to the beginning of the loaded History summaries

#### Scenario: Submission returns a failed or empty assistant response

- **WHEN** the submit-message action succeeds but its assistant message is failed or has empty content
- **THEN** the demo renders the returned message through its normal persisted status handling
- **AND** does not start progressive response reveal

#### Scenario: Stale submission completes

- **WHEN** a submission response completes after its conversation or workspace state has been invalidated
- **THEN** the response does not replace or append to the current transcript
