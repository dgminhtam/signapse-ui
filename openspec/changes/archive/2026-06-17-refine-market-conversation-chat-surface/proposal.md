## Why

The current `/market-conversations` layout still behaves like a list-first CRUD page, so the primary job of asking the market is visually secondary. The market query experience should feel like a focused chat surface: start with one centered composer, keep history available on demand, and show full conversation timelines only after a thread is selected.

## What Changes

- Redesign `/market-conversations` into a chat-first entry screen with a centered large input composer as the primary interaction.
- Move conversation history out of the main page table into a right-side sheet opened by a clear history button.
- Render history as a compact selectable list in the sheet instead of a table.
- Navigate from a history item to the canonical `/market-conversations/{id}` detail route, where the full thread is shown.
- Add the same history sheet trigger to conversation detail pages so users can switch threads without returning to a table page.
- Keep creation and follow-up submission behavior synchronous and backed by the existing market conversation endpoints.
- Remove the list-first two-column layout from the primary market conversation surface.

## Capabilities

### New Capabilities
- `market-conversation-chat-surface`: Covers the chat-first market conversation entry page, history sheet interaction, and canonical thread opening behavior.

### Modified Capabilities
- `market-query-workbench`: Update the legacy one-shot/no-history workbench requirement so the protected market query surface is represented by persisted market conversations and a history-on-demand pattern.

## Impact

- Frontend routes: `/market-conversations` and `/market-conversations/[conversationId]`.
- UI components: market conversation list/start component, detail component, history sheet/list, composer layout, skeletons, and empty states.
- Data flow: reuse existing market conversation server actions and URL pagination for history; do not introduce new backend endpoints.
- Navigation and routing: keep canonical detail routes for selected conversations; preserve locale-aware navigation.
- Localization: add or adjust dictionary copy for history trigger, centered composer, new conversation action, and sheet empty/loading states.
- Verification: lint, typecheck, OpenSpec validation, and deterministic review of route/state behavior.
