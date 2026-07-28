## Context

Signapse UI already has a protected locale-aware main shell and installed shadcn conversation primitives. The new demo must exercise a deterministic `useChat` streaming lifecycle while remaining independent from other assistant surfaces and all backend conversation APIs.

The pasted sample relies on `@ai-sdk/react` and a scripted fixture transport. Those packages are not currently installed, while the required shadcn UI wrappers are already present.

## Goals / Non-Goals

**Goals:**

- Provide `/[lang]/demo-conversation` inside the existing protected main shell.
- Reproduce ordered scripted turns, delayed assistant streaming, new-chat reset, fixture history selection, turn anchoring, live-edge following, and jump-to-latest behavior.
- Use the existing radix-nova shadcn wrappers and localized Vietnamese and English copy.
- Keep the feature route-local except for dictionary, breadcrumb, and dependency updates.

**Non-Goals:**

- Connect to an AI model, backend route, persisted conversation, market query, or permission beyond the parent authenticated shell.
- Share route-local code, fixtures, state, or navigation with another assistant surface.
- Add a sidebar item, editable free-form assistant, attachments, image generation, research, web search, or custom message animation.
- Modify shared shadcn wrappers or theme tokens.

## Decisions

### Use the official in-memory AI SDK fixture lifecycle

Add `@ai-sdk/react`, `ai`, and `@shadcn/helpers`, then define a route-local scripted conversation with `createChat()`. Pass its fixture transport to `useChat` so the demo uses the same submitted and streaming states as a real AI SDK client without adding an API route.

Alternative considered: reproduce the sequence with `useState` and timers. Rejected because it duplicates transport behavior, does not exercise `useChat`, and would make the new route functionally similar to the existing prototype.

### Keep all demo behavior in one route-local client component

Use a server `page.tsx` as the route entry and one client `demo-conversation.tsx` for the transcript, transport, message rendering, and controls. Keep the small text-part reader and scripted fixture in that client file unless implementation size proves unreadable.

Alternative considered: add shared `lib/ai.ts`, fixture modules, and message-animation components. Rejected because no second consumer exists and the user explicitly requires separation from the prototype.

### Compose installed shadcn conversation primitives

Render the transcript with `MessageScrollerProvider`, `MessageScroller`, `MessageScrollerViewport`, `MessageScrollerContent`, and one `MessageScrollerItem` per message. Render rows with `Message` and `Bubble`; use `Empty` before the first turn and a real `Card` as the bounded demo surface.

Enable `autoScroll`, anchor user turns, expose `aria-busy` while streaming, and use the built-in jump-to-latest button. Do not write scroll hooks, observers, or custom animations.

### Use a read-only scripted composer

The composer displays the next predefined user message and sends only that message. Send, New chat, and History are disabled during submitted or streaming states. New chat restores the empty transcript.

Alternative considered: accept arbitrary input. Rejected because the fixture transport only guarantees predefined assistant responses and the requested surface is a deterministic demo.

### Localize route identity and all visible or accessible text

Add `demoConversation` labels to both dictionaries, add `navigation.demoConversation`, and map the `demo-conversation` breadcrumb segment. Override default English-only accessible labels where needed.

No sidebar item is added because direct route access is sufficient for a demo and the request does not expand navigation scope.

### Keep conversation actions route-local

Replace Reset with New chat and Close icon actions plus title-triggered History. History uses the existing shadcn Popover and localized snapshots derived from the same scripted chat via `chat.get(count)`, so selecting history can continue through `chat.next(messages)` without persistence or another fixture system. Close navigates to the localized dashboard.

Use the current chat title as the History Popover trigger and keep New chat and Close as the only icon actions. Compose the Popover with the installed Command wrapper for localized title search and keyboard selection. Derive 25 fixture snapshots from the existing turns and reveal them in batches of eight as the Command list approaches its scroll boundary; do not add an API, timer, observer, or persistence.

### Keep long-turn tracking inside the transcript surface

Render the tracking rail inside the bounded Card content, reserve a desktop-only right gutter for it, and use the existing scroll-fade utility on its own overflow viewport. Reuse the four localized scripted turn templates to generate 25 fixture turns so the full history snapshot exercises a 50-message transcript without adding duplicate dictionary copy.

Keep the semantic navigation wrapper separate from the scrolling element. The inner fixed-height viewport owns `scroll-fade`, `no-scrollbar`, and vertical overflow so native scrollbar chrome stays hidden while wheel, touch, focus, and active-anchor scrolling continue to work.

### Keep role semantics without visible labels

Visually hide each localized message role with `sr-only` instead of deleting it so color and alignment are not the only sender cues for assistive technology. Keep `MessageScrollerViewport` as the transcript scroll owner and hide its native scrollbar route-locally; do not introduce `ScrollArea` or modify the shared message-scroller wrapper.

## Risks / Trade-offs

- [Three new packages for one demo] → Use the official helper only because the accepted plan requires the real `useChat` streaming lifecycle; do not add any other chat abstraction.
- [Fixture recreated during renders can reset transport identity] → Memoize the localized fixture and transport for the active dictionary.
- [Switching conversations during streaming could leave an active update] → Disable New chat and History while submitted or streaming.
- [Long scripted prompts may overflow the composer] → Use the existing textarea input-group control with an explicit bounded row count and wrapping.
- [Package APIs can drift] → Typecheck against the installed versions and keep usage limited to documented `createChat`, `transport`, `next`, and `useChat` APIs.

## Migration Plan

1. Add dependencies and update the lockfile.
2. Add the route, localized copy, and breadcrumb mapping.
3. Run lint, typecheck, OpenSpec validation, and a static isolation search.

Rollback removes the new route, dictionary and breadcrumb entries, and dependencies if they have no other consumers. No data migration or backend rollback is required.

## Open Questions

None. Sidebar discovery and non-scripted capabilities remain explicitly out of scope.
