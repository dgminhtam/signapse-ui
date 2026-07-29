## ADDED Requirements

### Requirement: Global assistant adopts persisted conversation behavior
The promoted global assistant SHALL satisfy the persisted creation, status mapping, History search, pagination, transcript selection, operation-specific retry, and follow-up submission requirements defined by this capability.

#### Scenario: User opens the promoted assistant
- **WHEN** an authorized user opens the global assistant for an active workspace
- **THEN** all persisted requests and transcript state use the existing demo conversation behavior
- **AND** the inactive legacy assistant controller does not issue duplicate requests

## MODIFIED Requirements

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
