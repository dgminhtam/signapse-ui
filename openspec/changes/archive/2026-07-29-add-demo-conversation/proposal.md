## Why

The application needs a focused conversation workspace for exercising chat presentation, long-transcript navigation, and accessibility independently from the global assistant modal. The route also serves as the product surface for persisted market-conversation history, transcript viewing, and follow-up submission specified by the separate `demo-conversation-history-api` capability.

## What Changes

- Add a locale-aware protected route at `/demo-conversation`.
- Provide a localized conversation card with an empty state, composer, New chat, History, Close, jump-to-latest, and accessible sender semantics.
- Keep a deterministic scripted conversation as the default/new-chat experience and fallback for users without market-query permission.
- Add a right-side tracking rail for loaded user turns, including bounded scrolling, Hover Card previews, active-anchor tracking, and proximity expansion.
- Keep route-local presentation state independent from the global assistant while allowing the route to use shared market-conversation server actions.
- Add localized breadcrumb and dictionary entries.
- Do not add a sidebar entry, attachments, image generation, research, web search, or changes to shared conversation primitives.

## Capabilities

### New Capabilities

- `demo-conversation`: The localized demo conversation surface, scripted fallback, transcript scrolling, tracking rail, and accessible interaction chrome.

### Modified Capabilities

None. Persisted history, transcript loading, pagination, and follow-up submission are defined by `demo-conversation-history-api`.

## Impact

- Adds the feature under `app/[lang]/(main)/demo-conversation`.
- Adds Vietnamese and English dictionary entries and breadcrumb mapping.
- Uses route-local fixture support for the scripted mode and existing market-conversation actions for the authorized persisted mode.
- Reuses shared Card, Empty, InputGroup, MessageScroller, Message, and Bubble components without changing their public APIs.
- Does not alter the global assistant state, navigation, backend contracts, or shared UI primitives.
