## Why

The application needs a focused, deterministic conversation demo that exercises scripted streaming and message-scroller behavior without coupling to the existing market-oriented AI assistant prototype. Keeping it independent provides a safe reference surface for chat interaction and accessibility behavior without backend, persistence, or market-query concerns.

## What Changes

- Add a locale-aware protected route at `/demo-conversation` that renders a scripted assistant conversation.
- Simulate the normal AI SDK chat lifecycle with an in-memory fixture transport, including ordered turns, streaming status, new-chat reset, fixture history selection, turn anchoring, auto-scroll, and jump-to-latest behavior.
- Compose the demo from the installed shadcn conversation primitives and localized labels.
- Add a localized breadcrumb label for the new route.
- Keep the route standalone: no shared route-local fixtures, state, permissions, navigation, or imports with other assistant surfaces.
- Add localized New chat, History popover, and Close actions while keeping history route-local and non-persistent.
- Do not add a backend API, persistence, sidebar entry, attachment actions, research tools, image generation, or web search behavior.

## Capabilities

### New Capabilities

- `demo-conversation`: A standalone, localized scripted conversation demo with simulated streaming and accessible message-scroller behavior.

### Modified Capabilities

None.

## Impact

- Adds a new feature folder under `app/[lang]/(main)/demo-conversation`.
- Adds Vietnamese and English dictionary entries and a breadcrumb segment mapping.
- Adds the AI SDK React client and shadcn AI SDK fixture helper dependencies plus the package-manager lockfile updates.
- Reuses existing `Card`, `Field`, `InputGroup`, `Empty`, `MessageScroller`, `Message`, and `Bubble` wrappers without modifying their shared implementation.
- Does not affect backend APIs, persisted conversations, market-query permissions, the sidebar, or other assistant routes.
