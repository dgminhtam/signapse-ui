## 1. Add the fixture-chat dependencies

- [x] 1.1 Add `@ai-sdk/react`, `ai`, and `@shadcn/helpers` with pnpm and commit the resulting `package.json` and lockfile changes without adding another chat abstraction.

## 2. Localize the independent route

- [x] 2.1 Add complete English and Vietnamese `demoConversation` copy for route identity, scripted turns, empty and exhausted states, composer controls, reset, sender roles, and accessible names.
- [x] 2.2 Add `navigation.demoConversation` and map the `demo-conversation` breadcrumb segment without adding a sidebar entry.

## 3. Build the scripted conversation demo

- [x] 3.1 Create the locale-aware server route at `app/[lang]/(main)/demo-conversation/page.tsx` without market-query permission checks or backend data loading.
- [x] 3.2 Create one route-local client component that memoizes the localized `createChat()` fixture and in-memory transport, initializes `useChat`, selects the next scripted message, and derives submitted or streaming busy state.
- [x] 3.3 Compose the bounded demo Card with localized header and Reset action, Empty state, the complete MessageScroller hierarchy, Message and Bubble rows, user-turn anchors, `autoScroll`, `aria-busy`, and jump-to-latest.
- [x] 3.4 Add a labelled read-only `InputGroupTextarea` composer that displays only the next scripted prompt, sends turns in order, disables Send and Reset while busy, communicates script exhaustion, and resets to the initial fixture state.

## 4. Verify scope and correctness

- [x] 4.1 Statically verify that the demo imports only its route-local modules and shared UI wrappers, calls no backend conversation API, adds no persistence or sidebar entry, and leaves shared shadcn wrappers unchanged.
- [x] 4.2 Run targeted lint for the new route, breadcrumb, and dictionary files, then run `pnpm.cmd typecheck`; resolve change-related failures.
- [x] 4.3 Run strict OpenSpec validation for `add-demo-conversation`.

## 5. Correct the copied-sample integration

- [x] 5.1 Replace unresolved sample-only imports with the existing route-local fixture and installed shadcn message primitives, and restore the route's expected component export.
- [x] 5.2 Move all copied visible and accessible English text into matching English and Vietnamese dictionary entries.
- [x] 5.3 Re-run the fixture check, targeted lint, typecheck, static isolation search, and strict OpenSpec validation.

## 6. Match the reference composer chrome

- [x] 6.1 Remove the composer border and render the Add and Send icon buttons as circles without changing their behavior or accessible names.

## 7. Refine the composer shape

- [x] 7.1 Increase the route-local composer radius to match the reference more closely without changing shared `InputGroup` defaults.

## 8. Add conversation actions

- [x] 8.1 Replace Reset with localized New chat, History Popover, and Close actions while keeping fixture state route-local.
- [x] 8.2 Add localized route-local history snapshots derived from the existing scripted chat and support selecting them without persistence.
- [x] 8.3 Run targeted lint, typecheck, static isolation search, and strict OpenSpec validation.

## 9. Show simulated request loading

- [x] 9.1 Render a localized Thinking Marker while the submitted or empty streaming response is waiting for its first text, then verify lint, typecheck, and OpenSpec.

## 10. Refine the transcript edge

- [x] 10.1 Make the jump-to-latest button circular and visually merge the footer with the content while preserving the existing message and viewport fade effects.

## 11. Refine demo proportions

- [x] 11.1 Use the compact Card density and widen the demo from `max-w-sm` to `max-w-md` without changing its height or shared Card defaults.

## 12. Track the reader's turn

- [x] 12.1 Add an accessible left-side anchored-turn rail using the existing MessageScroller visibility and jump hooks, hide it on narrow screens, and verify lint, typecheck, and OpenSpec.

## 13. Preview tracked turns

- [x] 13.1 Add a localized Hover Card preview to each tracking item, reduce the resting rail size, expand only the hovered or focused rail, and verify lint, typecheck, and OpenSpec.

## 14. Refine tracking preview chrome

- [x] 14.1 Use the muted surface and remove the tracking Hover Card ring without modifying the shared Hover Card wrapper.

## 15. Refine tracking preview content

- [x] 15.1 Remove the turn heading, preview the bounded user message in strong text and its paired assistant reply in muted text, remove unused copy, and verify lint, typecheck, and OpenSpec.

## 16. Bound long-turn tracking

- [x] 16.1 Move the rail inside Card content, widen the demo, reserve transcript space, add bounded rail overflow and edge fade, expand the localized fixture to 50 messages, and verify the fixture check, lint, typecheck, isolation, and OpenSpec.

## 17. Correct the tracking fade viewport

- [x] 17.1 Separate the rail navigation wrapper from its scroll viewport, apply the installed `scroll-fade` and `no-scrollbar` utilities to that viewport, preserve active-anchor focus behavior, and verify lint, typecheck, and OpenSpec.

## 18. Simplify transcript chrome

- [x] 18.1 Visually hide localized sender roles, hide the native transcript scrollbar without adding ScrollArea or changing shared wrappers, and verify lint, typecheck, production CSS, isolation, and OpenSpec.

## 19. Refine history navigation

- [x] 19.1 Move the tracking rail to the right, replace the History icon and header description with a chat-title Command Popover, add localized search and batched fixture history loading, and verify lint, typecheck, isolation, diff integrity, and strict OpenSpec.

## 20. Balance header density

- [x] 20.1 Use the installed small Button variants for the chat-title History trigger, New chat, and Close controls without overriding CardHeader spacing, then verify lint, typecheck, diff integrity, and strict OpenSpec.

## 21. Personalize the empty conversation

- [x] 21.1 Reuse the theme-aware Signapse logo, resolve the authenticated display name server-side with development-auth and localized fallbacks, shorten the empty prompt, and verify lint, typecheck, diff integrity, and strict OpenSpec.

## 22. Refine tracking rail proximity

- [x] 22.1 Replace the tracking rail's ghost Button chrome with compact route-local triggers, scale the hovered or focused rail and its three neighboring levels by proximity, preserve scrolling and preview behavior, then verify targeted lint, typecheck, and strict OpenSpec validation.

## 23. Refine single-rail hover emphasis

- [x] 23.1 Increase rail thickness, replace proximity scaling with a right-anchored hover-only expansion, suppress active emphasis while hovering another rail, preserve keyboard focus and preview behavior, then verify the demo check, targeted lint, typecheck, and strict OpenSpec validation.

## 24. Restore hover proximity scaling

- [x] 24.1 Restore the confirmed 6-10-14-20-26 hover proximity widths while keeping right-edge anchoring and single hovered foreground emphasis, then verify the demo check, targeted lint, typecheck, and strict OpenSpec validation.

## 25. Prevent tracking rail clipping

- [x] 25.1 Widen the route-local tracking viewport while preserving the trigger position so the 20px and 26px hover rails render at distinct widths, then verify targeted lint, typecheck, and strict OpenSpec validation.

## 26. Reconcile the archived UI baseline

- [x] 26.1 Update the proposal, design, and `demo-conversation` delta spec to describe the current hybrid scripted/persisted surface, delegate backend behavior to `demo-conversation-history-api`, and remove obsolete claims that the route never calls backend actions.
