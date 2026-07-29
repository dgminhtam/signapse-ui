## MODIFIED Requirements

### Requirement: Locale-aware protected demo route

The system SHALL expose the conversation demo at `/demo-conversation` within the locale-aware protected main application shell only to users who can execute market queries.

#### Scenario: Open an authorized localized demo

- **WHEN** an authenticated user with `query:execute` navigates to `/vi/demo-conversation` or `/en/demo-conversation`
- **THEN** the system renders the demo inside the protected main shell using the selected locale for visible and accessible labels

#### Scenario: Open the demo without permission

- **WHEN** an authenticated user without `query:execute` navigates to the demo route
- **THEN** the system renders the localized access-denied state
- **AND** no conversation History, detail, create, or submit request is made

### Requirement: Localized conversation actions and composer

The demo SHALL provide localized New chat, History, Close, and Send controls with one controlled persisted-message draft while preventing invalid or concurrent submissions.

#### Scenario: Start a new draft

- **WHEN** the user activates New chat outside an active create or submit operation
- **THEN** the demo clears the selected conversation, loaded messages, cursors, draft, and operation errors
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
- **AND** the demo progressively reveals its assistant content over a bounded duration
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

#### Scenario: Close the demo

- **WHEN** the user activates Close
- **THEN** the system navigates to the localized dashboard

## REMOVED Requirements

### Requirement: Deterministic scripted fallback

**Reason**: The demo is becoming a complete backend-backed conversation surface; retaining a separate fixture mode duplicates state and produces behavior that cannot be persisted.

**Migration**: Users with `query:execute` start a persisted draft and create the conversation on first submission. Users without permission receive the standard localized access-denied state.
