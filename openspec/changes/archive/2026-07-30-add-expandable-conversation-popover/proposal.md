## Why

The conversation Popover is limited to a compact viewport, making long Markdown responses difficult to read. Users need an accessible way to enlarge the existing conversation surface without changing its interaction model or adding free-form resizing.

## What Changes

- Add an Expand/Restore control to the conversation header.
- Let the existing Popover switch between compact and viewport-clamped expanded layouts while preserving the active conversation, draft, reveal, and scroll state.
- Keep the selected layout while the Popover is closed and reopened in the same workspace, and reset it when the workspace changes or the page reloads.
- Add localized accessible labels and pressed-state semantics for the new control.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `demo-conversation`: Add requirements for an expandable, viewport-safe conversation surface and its state, lifecycle, and accessibility behavior.

## Impact

- Conversation UI: `components/market-conversation-assistant/market-conversation-assistant.tsx`
- Localization: `app/lib/i18n/dictionaries/en.ts` and `app/lib/i18n/dictionaries/vi.ts`
- No API, DTO, permission, dependency, shared Popover, MessageScroller, or global CSS changes.
