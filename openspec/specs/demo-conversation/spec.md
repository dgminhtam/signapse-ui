# demo-conversation Specification

## Purpose

Define the localized, permission-gated persisted conversation surface, transcript scrolling, right-side turn tracking, progressive response reveal, and accessible interaction chrome.

## Requirements

### Requirement: Locale-aware protected demo route

The system SHALL expose the conversation demo at `/demo-conversation` within the locale-aware protected main application shell only to users who can execute market queries.

#### Scenario: Open an authorized localized demo

- **WHEN** an authenticated user with `query:execute` navigates to `/vi/demo-conversation` or `/en/demo-conversation`
- **THEN** the system renders the demo inside the protected main shell using the selected locale for visible and accessible labels

#### Scenario: Open the demo without permission

- **WHEN** an authenticated user without `query:execute` navigates to the demo route
- **THEN** the system renders the localized access-denied state
- **AND** no conversation History, detail, create, or submit request is made

### Requirement: Independent conversation presentation

The demo SHALL own its route-local presentation and request state and SHALL NOT read or mutate the global assistant's runtime state or navigation.

#### Scenario: Load the demo directly

- **WHEN** a user opens the route without first opening the global assistant
- **THEN** the demo initializes independently

#### Scenario: Use persisted conversation actions

- **WHEN** an authorized user opens or submits a persisted conversation
- **THEN** the demo may call the existing market-conversation actions
- **AND** persisted request behavior conforms to the `demo-conversation-history-api` capability

### Requirement: Conversation scrolling behavior

The demo SHALL follow new output at the live edge, anchor user turns, preserve a reader who scrolls away, and provide a jump-to-latest control.

#### Scenario: Follow new output

- **WHEN** assistant output is added while the reader remains at the live edge
- **THEN** the viewport follows the growing response

#### Scenario: Preserve deliberate reading position

- **WHEN** the reader scrolls away from the live edge while output is added
- **THEN** the viewport does not force the reader back to the latest message

#### Scenario: Return to latest

- **WHEN** content exists below the current viewport and the reader activates jump-to-latest
- **THEN** the viewport moves to the newest content and resumes live-edge following

#### Scenario: Inactive jump control

- **WHEN** the transcript is already at the latest content
- **THEN** the inactive jump-to-latest control is not an additional keyboard focus stop

### Requirement: Right-side turn tracking

The demo SHALL provide a bounded right-side rail for loaded user turns without changing the shared message-scroller primitive.

#### Scenario: Track anchored turns

- **WHEN** the transcript contains user turns
- **THEN** the rail identifies the current anchored turn and lets the reader jump to another loaded user turn

#### Scenario: Preview a hovered turn

- **WHEN** the reader hovers a rail item
- **THEN** that rail expands leftward to 26px and neighbors at distances one, two, and three expand to 20px, 14px, and 10px while farther rails remain 6px
- **AND** active color emphasis is suppressed and only the hovered rail uses foreground color
- **AND** a localized Hover Card previews bounded user and assistant text without changing the transcript

#### Scenario: Focus a tracked turn

- **WHEN** a keyboard user focuses a rail item
- **THEN** it retains a visible focus indicator, keyboard jump behavior, and the same localized preview

#### Scenario: Track a long transcript

- **WHEN** loaded turns exceed the rail viewport
- **THEN** the rail remains inside the Card, fades overflowing items at its edges, and keeps the current anchor available

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

### Requirement: Accessible localized conversation surface

The demo SHALL localize visible and accessible copy, expose an announceable scroll region, and preserve sender and busy-state semantics.

#### Scenario: Report busy state

- **WHEN** a response is pending
- **THEN** the transcript exposes localized pending feedback and an appropriate busy state

#### Scenario: Identify senders

- **WHEN** user and assistant messages render
- **THEN** localized sender roles remain available to assistive technology even when visually hidden

#### Scenario: Scroll without native scrollbar chrome

- **WHEN** the transcript overflows
- **THEN** native scrollbar chrome remains hidden while wheel, touch, keyboard, rail, and jump scrolling continue to work

#### Scenario: Personalize an empty conversation

- **WHEN** an authenticated user opens a new conversation with no displayed messages
- **THEN** the empty state shows the theme-appropriate Signapse logo, the resolved display name or localized fallback, and a concise localized prompt
