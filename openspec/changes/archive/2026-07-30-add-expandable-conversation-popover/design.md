## Context

The conversation surface already uses one Radix Popover and limits both its outer container and conversation shell to `max-w-xl`, with a maximum height of `36rem`. This is safe on small viewports but unnecessarily constrains long Markdown content on larger screens. The existing `MessageScroller` observes size changes, so the layout can grow without replacing the scroller or adding custom resize logic.

The conversation assistant is keyed by workspace. Local component state therefore persists across Popover close/reopen and new-chat actions, while a workspace change remounts the component.

## Goals / Non-Goals

**Goals:**

- Add a keyboard-accessible Expand/Restore action to the existing conversation header.
- Provide compact and expanded layouts that remain inside the Popover's available viewport.
- Preserve conversation, draft, reveal, and scrolling behavior while the layout changes.
- Keep the chosen layout for the current workspace until the component remounts.

**Non-Goals:**

- Free-form drag resizing or a shadcn Resizable dependency.
- Fullscreen API, Dialog, or Sheet behavior.
- Persistence in `localStorage` or across page refreshes.
- Changes to APIs, DTOs, permissions, shared Popover/MessageScroller wrappers, global CSS, or package files.

## Decisions

### Keep one Popover and switch layout constraints

`MarketConversationAssistant` will own an `isExpanded` boolean and use the existing `cn()` helper to select compact or expanded width and height classes. Compact mode retains the current `max-w-xl` and `36rem` limits. Expanded mode targets at most approximately `64rem` by `48rem`, clamped with Radix's `--radix-popover-content-available-width` and `--radix-popover-content-available-height` variables plus the existing viewport spacing.

This keeps the conversation tree mounted and uses CSS layout rather than introducing a second overlay or a resize library. Width and height will change without transitions to avoid reflow animation and scroll jank. The Popover remains `side="top"` and `align="end"`.

### Keep layout state local to the workspace-mounted component

`isExpanded` will initialize to `false`. Closing the Popover and starting a new chat will not reset it. The existing `key={workspaceId ?? "no-workspace"}` boundary resets it to compact when the workspace changes; a page refresh also resets it naturally. No persistence layer is needed.

### Add one accessible header toggle

The header order will be History/title, New chat, Expand/Restore, then Close. The button will use the standardized Lucide `MaximizeIcon` and `MinimizeIcon` pair, a localized dynamic `aria-label`, and `aria-pressed={isExpanded}`. It remains enabled during loading, submission, and reveal because resizing does not mutate conversation data.

If the nested History Popover is open, toggling the layout will close it to avoid stale overlay positioning while retaining its already-loaded query and data. Focus stays on the toggle after activation.

### Delegate resize handling to MessageScroller

The conversation and scroller instances will not be keyed or remounted by `isExpanded`. The installed MessageScroller already observes viewport/content resize and preserves following-bottom, anchored-turn, and deliberate-reading modes, so no custom observer or scroll effect will be added.

## Risks / Trade-offs

- Expanded dimensions may be smaller than `64rem` by `48rem` on constrained screens or at high zoom; clamp both axes to Radix's available-space variables and retain viewport padding.
- Long Markdown tables and code blocks can create intrinsic width pressure; keep the existing message overflow behavior and verify the Popover never causes page-level horizontal overflow.
- A nested History Popover can be mispositioned after its parent changes size; close only the nested Popover during the toggle and preserve its loaded state.

## Migration Plan

This is a client-only additive UI change with no data migration. Rollback consists of removing the toggle, local state, conditional layout classes, and two localization entries.

## Open Questions

None.
