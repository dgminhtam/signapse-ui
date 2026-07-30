## ADDED Requirements

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
