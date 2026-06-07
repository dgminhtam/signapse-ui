## Context

`/market-conversations` currently combines conversation creation and conversation history in a list-oriented layout. A recent two-column refinement still leaves the history table as the dominant surface, while the desired product behavior is closer to a chat entry point: the user should ask a market question first, open history only when needed, and view a full timeline only after selecting a saved conversation.

The change is UI-only and should reuse the existing protected routes, market conversation server actions, dictionary copy, shadcn wrappers, and synchronous backend workflow. It must stay compatible with locale-prefixed routing and the canonical detail route `/market-conversations/[conversationId]`.

## Goals / Non-Goals

**Goals:**
- Make `/market-conversations` a focused new-conversation entry screen with one large composer centered in the main workspace.
- Move conversation history into a right-side sheet opened by a history button.
- Render history as a compact list suitable for a sheet, not as a main-page table.
- Navigate history item selection to `/market-conversations/{id}` so full threads remain canonical, refreshable, and shareable.
- Expose the same history sheet trigger from the conversation detail page.
- Keep existing synchronous create/submit behavior, permission gates, and backend endpoints.

**Non-Goals:**
- Add new backend endpoints, streaming, polling, conversation rename/delete/archive, or local quick-detail route interception.
- Replace the canonical detail route with an in-place drawer conversation viewer.
- Introduce a global `@quickDetail` route, global history state provider, or non-local overlay pattern.
- Add search or advanced filters to history unless they already exist in the current contract.

## Decisions

### Chat-first main route

`/market-conversations` should render a focused empty/new-chat state: a short prompt and a large composer centered in the available workspace. The composer owns first-question submission and creates the conversation before submitting the initial message, preserving the current backend workflow.

Alternative considered: keep the history table visible with the composer in a side rail. Rejected because it still makes history the primary visual object and creates a CRUD/list mental model.

### History as local sheet

Conversation history should be opened by a button in the main route and detail route. The sheet is local to the route component and uses the repo's `Sheet` wrapper with a real title and accessible close behavior. It should render a compact list with title and secondary updated timestamp, plus empty/loading/error states as needed.

Alternative considered: use a permanent side rail. Rejected because history is secondary and consumes too much horizontal space on the core chat surface.

### Canonical thread navigation

Clicking a history item should navigate to `/market-conversations/{id}` through localized links. The sheet should not embed the full conversation timeline or mutate the URL solely to open/close itself. This keeps copied URLs, reloads, browser history, and direct navigation consistent.

Alternative considered: open selected conversations inside the sheet or via route interception. Rejected because this feature does not need an analytical quick-detail overlay; the full conversation is the primary artifact and already has a canonical page.

### Shared history component

The main route and detail route should share a small history sheet/list component. The component should accept the conversation page data and render controls without owning unrelated page identity. If pagination is retained inside the sheet, it should reuse existing page/size query behavior where practical and avoid duplicate page-size controls outside the sheet.

Alternative considered: duplicate history markup in both routes. Rejected because the state, empty treatment, and navigation behavior should stay consistent.

### Detail page remains conversation-first

`/market-conversations/{id}` should continue to show the full conversation timeline and follow-up composer. Its header should include a new-conversation affordance and the history sheet trigger, but it should not add a main-page history table.

Alternative considered: make `/market-conversations` show the selected conversation inline after a history click. Rejected because canonical detail routes better match saved conversation behavior.

## Risks / Trade-offs

- [History pagination inside a sheet can feel heavy] -> Keep the list compact and only show pagination controls when there are enough conversations.
- [Removing the table reduces scannability for many conversations] -> Preserve title and updated timestamp, and leave search/filter as a future enhancement if history volume requires it.
- [Sheet state can conflict with URL navigation] -> Treat sheet open/close as local UI state and use canonical links for conversation selection.
- [Centered composer may feel empty on large desktop screens] -> Use intentional max-width and vertical centering rather than adding explanatory copy or decorative panels.
- [Existing list-page skeleton no longer matches] -> Update skeletons to mirror the centered composer and sheet-trigger layout.

## Migration Plan

1. Extract or create a reusable market conversation history sheet/list component.
2. Redesign `/market-conversations` around the centered composer and history trigger.
3. Update `/market-conversations/[conversationId]` to include history trigger and optional new-conversation action.
4. Remove the main-page history table/two-column layout and duplicate empty pagination summary.
5. Update skeletons and dictionaries for the new layout.
6. Run lint, typecheck, OpenSpec validation, and deterministic route/state review.

Rollback is UI-local: restore the previous list/table composition on `/market-conversations` and remove the history sheet trigger while leaving backend actions untouched.
