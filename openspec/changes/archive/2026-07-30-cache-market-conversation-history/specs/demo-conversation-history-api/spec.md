## MODIFIED Requirements

### Requirement: Permission-scoped on-demand history

The promoted global assistant SHALL be available only to users with market-query execution permission, SHALL request active-workspace conversation summaries on demand, and SHALL reuse the successful result set for the current normalized query while that workspace-scoped assistant remains mounted.

#### Scenario: Authorized user opens uncached History

- **WHEN** a user with `query:execute` and an active workspace opens the assistant History Popover without a successful result for the current normalized query
- **THEN** the system requests page zero with size 10 ordered by `lastModifiedDate` descending
- **AND** the system renders summaries from the active workspace

#### Scenario: User reopens cached History

- **WHEN** an authorized user closes and later reopens History for the same active workspace and normalized query after a successful request
- **THEN** the system reuses the cached summaries, empty result, and pagination state
- **AND** it does not request page zero again

#### Scenario: User closes History while loading

- **WHEN** the user closes History while its request is active
- **THEN** the request may complete and populate the current workspace and normalized-query cache
- **AND** reopening History while that request remains active does not start a duplicate request

#### Scenario: Cached History request failed

- **WHEN** the current normalized-query request failed and the user closes and reopens History
- **THEN** the system preserves the localized failure and Retry action
- **AND** it does not automatically repeat the failed request

#### Scenario: User lacks permission

- **WHEN** a user without `query:execute` opens a protected application route
- **THEN** the system does not render or initialize the global assistant
- **AND** no persisted conversation request or composer is available
