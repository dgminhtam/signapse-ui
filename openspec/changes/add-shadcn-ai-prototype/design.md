## Context

The protected app shell currently mounts one global Assistant UI modal backed by `useMarketConversationAssistant`. It is a live production surface: it reads and writes persisted market conversations and uses Assistant UI primitives and runtime mapping. The team needs to evaluate shadcn's newer conversation primitives without changing that surface, its backend contract, or its persisted data.

The prototype will be a protected, locale-prefixed, direct-access route. It will use deterministic local fixtures rather than the existing controller or server actions. The route remains unlinked from the sidebar so the current navigation and global assistant experience stay unchanged.

## Goals / Non-Goals

**Goals:**

- Provide an isolated page for comparing a shadcn conversation composition with the current assistant.
- Exercise the important visual and interaction states: empty conversation, history, prepended messages, pending and failed replies, and expanded market-analysis content.
- Use the project’s radix-nova shadcn wrappers and localized copy.
- Keep all prototype actions local to the browser with no network or persistence side effects.

**Non-Goals:**

- Replacing, modifying, or sharing code with `components/assistant-ui/**`.
- Integrating market-conversation server actions, real workspace data, uploads, tool calls, message editing, branches, or token streaming.
- Adding the route to sidebar navigation or changing existing canonical market-conversation routes.
- Removing `@assistant-ui/react` or migrating production UI.

## Decisions

### Separate full-page route instead of a second floating modal

The prototype will render at a new protected locale route, not beside the existing fixed lower-right trigger. A second global trigger would overlap the production trigger and make comparison ambiguous. A full page also gives the message scroller enough room to validate normal and narrow layouts.

Alternative considered: add a temporary switch to the production modal. Rejected because it changes the production feature under evaluation and couples rollback to a feature flag.

### Fixture-driven state instead of the existing conversation controller

The route will own a small, deterministic transcript fixture and local UI state for selecting a history entry, prepending older messages, expanding analysis, and appending a submitted draft. It will not import the Assistant UI runtime, `useMarketConversationAssistant`, or market-conversation actions.

Alternative considered: reuse the controller in parallel. Rejected because it would create or alter real persisted conversations while testing a presentation-only prototype.

### Add only shadcn conversation primitives

The implementation will add `message-scroller`, `message`, `bubble`, and `marker` through the shadcn workflow. Existing `InputGroupTextarea`, `Button`, `Popover`, `Empty`, and `Spinner` wrappers will compose the rest of the page. Attachments are excluded because the prototype has no upload capability.

Alternative considered: add AI SDK and shadcn helpers. Rejected because the prototype does not need a transport or streaming simulator; fixture state is enough and avoids new runtime dependencies.

### Preserve product conventions at the route boundary

The page will use the current protected locale layout, dictionary-backed copy, a breadcrumb mapping, permission gating, and shadcn/radix-nova component chrome. The direct route may be accessed manually by authorized users but is not advertised in product navigation.

## Risks / Trade-offs

- [Fixture behavior differs from the live backend] → Scope the prototype to UI evaluation and include explicit representative pending, failure, and analysis fixtures; defer functional integration until the visual direction is approved.
- [The newly added message scroller does not preserve prepend position as expected] → Verify the older-message control with the fixture before treating it as suitable for migration.
- [An unlinked route is harder for reviewers to discover] → Document the localized direct URL in the change handoff; do not change sidebar navigation for an evaluation-only artifact.
- [Prototype code could become a permanent parallel surface] → Keep it route-local and delete it rather than adapting it when a production migration is approved.

## Migration Plan

1. Add the isolated route, fixture, localized copy, breadcrumb entry, and shadcn wrappers.
2. Review the prototype at the direct locale route while the global assistant remains unchanged.
3. If rejected, remove the route-local files, prototype dictionary keys, breadcrumb mapping, and shadcn wrappers only if no other feature uses them.
4. If approved, create a separate migration change; do not repurpose this prototype as the production implementation without validating real data and accessibility behavior.

## Open Questions

- None for the isolated prototype. Production migration decisions remain explicitly out of scope.
