# demo-conversation Specification

## Purpose

Define the localized, permission-gated persisted conversation surface, expandable viewport, transcript scrolling, right-side turn tracking, progressive response reveal, and accessible interaction chrome.

## Requirements

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

The promoted conversation SHALL own one in-memory session for the active workspace.

#### Scenario: Close and reopen the conversation

- **WHEN** a user closes and reopens the conversation without changing workspace
- **THEN** the selected conversation, loaded messages, draft, pagination, and recoverable errors remain available

#### Scenario: Active workspace identity changes

- **WHEN** the protected shell resolves a different active workspace
- **THEN** the promoted conversation starts with a fresh workspace-scoped state tree
- **AND** responses owned by the previous instance cannot update the new workspace

### Requirement: Expandable conversation viewport

The protected conversation surface SHALL let the user switch the existing Popover between compact and expanded layouts without replacing the conversation session, and SHALL keep both layouts within the available viewport.

#### Scenario: Expand within viewport bounds

- **WHEN** the user activates the Expand action in compact mode
- **THEN** the existing conversation Popover switches to an expanded layout capped at approximately `64rem` by `48rem` and clamped to the available Popover width and height

#### Scenario: Restore the compact layout

- **WHEN** the user activates the Restore action in expanded mode
- **THEN** the existing conversation Popover returns to its default `max-w-xl` and `36rem` maximum-height layout

#### Scenario: Preserve active conversation state while resizing

- **WHEN** the user switches layouts while a conversation, draft, assistant reveal, or non-default scroll position is active
- **THEN** the system keeps the same conversation tree mounted and preserves the draft, reveal progress, and MessageScroller reading mode

#### Scenario: Preserve the layout within one workspace

- **WHEN** the user closes and reopens the conversation Popover or starts a new chat in the same workspace
- **THEN** the system retains the selected compact or expanded layout

#### Scenario: Reset the layout for a different workspace

- **WHEN** the active workspace changes or the page reloads
- **THEN** the conversation Popover starts in compact mode

#### Scenario: Expose an accessible localized toggle

- **WHEN** compact or expanded mode is active
- **THEN** the header exposes a keyboard-operable Expand/Restore button with the matching localized accessible label, visible focus treatment, icon, and `aria-pressed` value

#### Scenario: Avoid overflow on narrow or zoomed viewports

- **WHEN** the conversation is displayed on a mobile-width viewport or at increased browser zoom
- **THEN** its width remains viewport-safe and expanded mode uses only the available height without causing page-level overflow

#### Scenario: Resize while conversation history is open

- **WHEN** the user switches layouts while the nested History Popover is open
- **THEN** the system closes the nested History Popover and retains its loaded query and history data

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

### Requirement: Safe assistant Markdown presentation

The promoted conversation SHALL render completed assistant message content as safe, responsive GitHub Flavored Markdown while preserving the backend text string as transcript truth.

#### Scenario: Completed assistant response contains Markdown

- **WHEN** a completed assistant message contains supported emphasis, headings, lists, links, blockquotes, inline code, fenced code, strikethrough, task lists, or a GFM table
- **THEN** the conversation renders the corresponding semantic content instead of displaying the Markdown delimiters as plain text
- **AND** persisted and newly submitted messages use the same presentation

#### Scenario: User message contains Markdown delimiters

- **WHEN** a user message contains Markdown syntax
- **THEN** the conversation renders the user message as literal pre-wrapped text
- **AND** it does not interpret the message as formatted Markdown

#### Scenario: Assistant response is progressively revealed

- **WHEN** a completed assistant response is still undergoing the existing bounded visual reveal
- **THEN** the visible response remains pre-wrapped plain text until the reveal completes
- **AND** assistive technology retains access to the complete response without repeated partial announcements
- **AND** the completed response switches once to semantic Markdown after reveal state clears

#### Scenario: Assistant Markdown contains unsafe or unsupported content

- **WHEN** assistant content contains raw HTML, executable markup, MDX, or a Markdown image
- **THEN** the conversation does not render executable HTML or the remote image
- **AND** ordinary Markdown text remains readable

#### Scenario: Markdown content exceeds the message width

- **WHEN** a table, code block, long token, or other Markdown content is wider than the assistant message surface
- **THEN** overflow remains contained and horizontally scrollable within the relevant content block
- **AND** the conversation Popover and underlying page do not gain horizontal overflow

#### Scenario: Assistant Markdown contains headings and links

- **WHEN** rendered assistant content includes headings or links
- **THEN** headings remain below the surrounding application and overlay hierarchy
- **AND** links retain visible focus treatment and safe protocol handling
