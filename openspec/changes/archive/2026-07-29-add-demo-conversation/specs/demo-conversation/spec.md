## ADDED Requirements

### Requirement: Locale-aware protected demo route

The system SHALL expose the conversation demo at `/demo-conversation` within the existing locale-aware protected main application shell.

#### Scenario: Open a localized demo

- **WHEN** an authenticated user navigates to `/vi/demo-conversation` or `/en/demo-conversation`
- **THEN** the system renders the demo inside the protected main shell using the selected locale for visible and accessible labels

### Requirement: Independent conversation presentation

The demo SHALL own its route-local presentation and request state and SHALL NOT read or mutate the global assistant's runtime state or navigation.

#### Scenario: Load the demo directly

- **WHEN** a user opens the route without first opening the global assistant
- **THEN** the demo initializes independently

#### Scenario: Use persisted conversation actions

- **WHEN** an authorized user opens or submits a persisted conversation
- **THEN** the demo may call the existing market-conversation actions
- **AND** persisted request behavior conforms to the `demo-conversation-history-api` capability

### Requirement: Deterministic scripted fallback

The demo SHALL provide predefined user and assistant turns through a route-local simulated chat lifecycle when no persisted conversation is selected.

#### Scenario: Send the next scripted turn

- **WHEN** scripted mode is ready and the user activates Send
- **THEN** the next predefined user message and paired assistant response progress through submitted and streaming states

#### Scenario: Start a new chat

- **WHEN** the user activates New chat outside an active submission
- **THEN** the demo leaves any persisted transcript and restores its initial scripted title, transcript, and composer

#### Scenario: User lacks market-query permission

- **WHEN** an authenticated user lacks `query:execute`
- **THEN** the scripted transcript, composer, New chat, and Close remain available
- **AND** the unavailable persisted History control is not exposed

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

The demo SHALL provide localized New chat, History when authorized, Close, and Send controls while preventing concurrent submissions.

#### Scenario: Busy controls

- **WHEN** scripted streaming or persisted submission is active
- **THEN** controls that could replace or duplicate the active transcript operation are disabled

#### Scenario: Close the demo

- **WHEN** the user activates Close
- **THEN** the system navigates to the localized dashboard

#### Scenario: Persisted mode composer

- **WHEN** an authorized user selects a persisted conversation
- **THEN** the composer accepts a text follow-up according to `demo-conversation-history-api`

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
