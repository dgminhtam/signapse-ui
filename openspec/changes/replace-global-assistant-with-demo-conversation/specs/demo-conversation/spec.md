## ADDED Requirements

### Requirement: Protected global conversation surface
The system SHALL expose the promoted conversation surface from the locale-aware protected application shell to authenticated users who can execute market queries.

#### Scenario: Authorized user opens a protected screen
- **WHEN** an authenticated user with `query:execute` opens a protected localized route
- **THEN** the system renders a localized floating conversation trigger
- **AND** activating the trigger opens the promoted conversation surface without changing the current route

#### Scenario: Unauthorized user opens a protected screen
- **WHEN** an authenticated user without `query:execute` opens a protected localized route
- **THEN** the system does not render the conversation trigger
- **AND** no conversation History, detail, create, or submit request is made

### Requirement: Global conversation session ownership
The promoted conversation SHALL own one in-memory session for the active workspace and SHALL NOT read or mutate the inactive legacy assistant runtime.

#### Scenario: Close and reopen the conversation
- **WHEN** a user closes and reopens the conversation without changing workspace
- **THEN** the selected conversation, loaded messages, draft, pagination, and recoverable errors remain available

#### Scenario: Active workspace identity changes
- **WHEN** the protected shell resolves a different active workspace
- **THEN** the promoted conversation starts with a fresh workspace-scoped state tree
- **AND** responses owned by the previous instance cannot update the new workspace

## MODIFIED Requirements

### Requirement: Localized conversation actions and composer
The promoted conversation SHALL provide localized New chat, History, Close, and Send controls with one controlled persisted-message draft while preventing invalid or concurrent submissions.

#### Scenario: Start a new draft
- **WHEN** the user activates New chat outside an active create or submit operation
- **THEN** the conversation clears the selected conversation, loaded messages, cursors, draft, and operation errors
- **AND** the empty persisted-conversation state is ready for a first message

#### Scenario: Busy controls
- **WHEN** an initial transcript request, conversation creation, message submission, or response reveal is active
- **THEN** the composer is disabled
- **AND** controls that could replace or duplicate the active operation are disabled
- **AND** localized pending feedback describes the current operation

#### Scenario: Show an assistant pending marker
- **WHEN** conversation creation or message submission is awaiting its synchronous response
- **THEN** the transcript shows a localized assistant Thinking marker with a spinner
- **AND** the marker is not stored as a conversation message or tracking-rail turn

#### Scenario: Progressively reveal a returned response
- **WHEN** a synchronous submit succeeds with a completed non-empty assistant response
- **THEN** the validated response becomes transcript truth immediately
- **AND** the conversation progressively reveals its assistant content over a bounded duration
- **AND** the tracking preview does not expose content beyond the portion already revealed

#### Scenario: Respect reduced motion
- **WHEN** the user prefers reduced motion and a synchronous submit succeeds
- **THEN** the pending marker stops animating
- **AND** the complete assistant response is displayed without progressive reveal

#### Scenario: Do not repeatedly announce partial content
- **WHEN** assistant content is progressively revealed visually
- **THEN** assistive technology can access the complete returned response
- **AND** partial reveal updates are not repeatedly announced as live status changes

#### Scenario: Submit with Enter
- **WHEN** the composer contains non-empty text and the user presses Enter without Shift while not composing text with an input method editor
- **THEN** the form submits the trimmed draft

#### Scenario: Insert a newline
- **WHEN** the user presses Shift+Enter in the composer
- **THEN** the composer inserts a newline without submitting

#### Scenario: Continue input-method composition
- **WHEN** Enter is pressed while an input method editor composition is active
- **THEN** the composer does not submit the draft

#### Scenario: Close the global conversation
- **WHEN** the user activates Close, presses Escape, or uses supported overlay dismissal
- **THEN** the conversation closes without changing the current URL or navigation history
- **AND** focus returns safely to the floating trigger

## REMOVED Requirements

### Requirement: Locale-aware protected demo route
**Reason**: The conversation is promoted from a standalone demo route to the protected global assistant.

**Migration**: Authorized users open the floating conversation trigger from any protected localized route.

### Requirement: Independent conversation presentation
**Reason**: The route-local independence contract is replaced by one global workspace-scoped session owned by the promoted component.

**Migration**: The promoted component remains independent from the inactive legacy runtime but is mounted by the protected shell.
