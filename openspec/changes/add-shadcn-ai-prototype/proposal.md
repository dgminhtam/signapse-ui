## Why

The existing global assistant is a production surface backed by Assistant UI and authenticated market-conversation actions, so it is unsafe to use as the place to evaluate a new chat presentation. A separate, no-network prototype lets the team evaluate shadcn chat primitives against the current experience before committing to a migration.

## What Changes

- Add a protected, locale-prefixed AI assistant prototype route that runs alongside the existing global Assistant UI modal.
- Compose the prototype from shadcn chat primitives for scrolling, message rows, bubbles, and status markers.
- Supply deterministic local fixtures for the empty, history, older-message, pending, failure, and market-analysis states.
- Keep the prototype isolated from market-conversation server actions, persistence, and the existing Assistant UI implementation.
- Add only the shadcn component wrappers required by the prototype and localized route copy.

## Capabilities

### New Capabilities

- `shadcn-ai-assistant-prototype`: Provides an isolated, fixture-driven route for evaluating a shadcn-based assistant conversation surface.

### Modified Capabilities

- None.

## Impact

- Adds a protected route and route-specific prototype components, fixtures, dictionary copy, and breadcrumb mapping.
- Adds shadcn chat component wrappers and their required package dependency.
- Does not modify `components/assistant-ui/**`, `components/protected-ai-assistant.tsx`, market-conversation actions, backend contracts, or persisted conversation data.
