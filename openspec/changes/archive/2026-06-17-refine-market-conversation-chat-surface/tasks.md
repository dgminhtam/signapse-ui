## 1. Shared History Sheet

- [x] 1.1 Create a reusable market conversation history sheet/list component using existing shadcn `Sheet`, `Empty`, buttons, localized links, and time metadata helpers.
- [x] 1.2 Render conversation history as compact list items with title, secondary updated timestamp, empty state, and canonical localized links to `/market-conversations/{id}`.
- [x] 1.3 Preserve existing conversation page data flow and pagination behavior without adding new backend endpoints.

## 2. Chat-First Entry Route

- [x] 2.1 Replace the `/market-conversations` list-first/two-column layout with a centered new-conversation composer and history trigger.
- [x] 2.2 Keep first-question creation behavior: derive title, create conversation, submit initial message, then navigate to the created conversation detail route.
- [x] 2.3 Remove the main-page history table and duplicate empty pagination summary from the default entry surface.
- [x] 2.4 Update the entry-route loading skeleton to mirror the centered composer and history trigger layout.

## 3. Conversation Detail Route

- [x] 3.1 Add a history sheet trigger to `/market-conversations/{conversationId}` without replacing the canonical detail page.
- [x] 3.2 Keep the full timeline and follow-up composer as the primary detail content.
- [x] 3.3 Add or preserve a clear new-conversation navigation affordance from detail back to `/market-conversations`.
- [x] 3.4 Ensure selecting an item from detail history navigates to the selected conversation detail route instead of embedding the thread in the sheet.

## 4. Localization And UI Policy

- [x] 4.1 Add or adjust English and Vietnamese dictionary keys for history trigger, sheet title, centered composer copy, and empty states.
- [x] 4.2 Check the implementation against Signapse UI invariants: cardless main workspace, `gap-*` spacing, shadcn wrappers, `<Spinner>` pending submit, and `<Empty>` empty states.
- [x] 4.3 Review responsive behavior so mobile keeps one-column composer-first flow and sheet remains usable.

## 5. Verification

- [x] 5.1 Run `openspec validate refine-market-conversation-chat-surface --strict`.
- [x] 5.2 Run `pnpm lint`.
- [x] 5.3 Run `pnpm typecheck`.
- [x] 5.4 Perform deterministic code review for route behavior, locale-preserving links, pending states, and duplicate history surfaces.

User-owned manual QA: Compare the finished screen against the intended chat-first reference, including visual centering, history sheet feel, and thread switching ergonomics.
