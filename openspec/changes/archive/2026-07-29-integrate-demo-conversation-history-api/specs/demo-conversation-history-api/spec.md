## ADDED Requirements

### Requirement: Permission-scoped on-demand history

The demo SHALL request persisted conversation summaries only when an authorized user opens History, and SHALL preserve the scripted demo for users who cannot execute market queries.

#### Scenario: Authorized user opens History

- **WHEN** a user with `query:execute` opens the demo History Popover
- **THEN** the system requests page zero with size 10 ordered by `lastModifiedDate` descending
- **AND** the system renders summaries from the active workspace

#### Scenario: User reopens History

- **WHEN** an authorized user closes and later reopens History
- **THEN** the system requests a fresh first page for the current active workspace

#### Scenario: User lacks history permission

- **WHEN** a user without `query:execute` opens the standalone demo
- **THEN** the scripted transcript, composer, New chat, and Close behavior remain available
- **AND** the current title is not exposed as a nonfunctional History trigger
- **AND** no persisted history request is made

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

The demo SHALL communicate persisted History loading, empty, failure, and retry states with localized visible or accessible text.

#### Scenario: Load the first page

- **WHEN** History has no displayed summaries and its first request is active
- **THEN** the Popover exposes a localized loading status

#### Scenario: No persisted summaries match

- **WHEN** the current History request succeeds with no summaries
- **THEN** the Popover shows the localized empty state

#### Scenario: History request fails

- **WHEN** a History request fails
- **THEN** the Popover shows the localized failure state and a Retry action
- **AND** previously unrelated fixture history is not shown as a fallback

#### Scenario: Retry the current result set

- **WHEN** the user activates Retry
- **THEN** the system requests page zero for the current normalized query

### Requirement: Persisted history remains separate from transcript detail

The demo SHALL keep persisted summaries informational and SHALL NOT load or imply persisted transcript detail in this change.

#### Scenario: View a persisted summary

- **WHEN** a persisted conversation title is rendered in History
- **THEN** the row does not replace the demo title or scripted transcript
- **AND** the row does not invoke a conversation-detail or conversation-messages API

#### Scenario: Continue the scripted demo after viewing History

- **WHEN** the user closes History after viewing persisted summaries
- **THEN** the current scripted transcript and next scripted composer message remain unchanged

#### Scenario: Start a new scripted conversation

- **WHEN** the user activates New chat
- **THEN** the scripted demo resets as before
- **AND** no persisted conversation is created or modified
