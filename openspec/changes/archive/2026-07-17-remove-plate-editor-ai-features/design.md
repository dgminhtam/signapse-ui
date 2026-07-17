## Context

The shared Plate editor currently composes two AI branches: `AIKit` provides command/chat editing through `/api/ai/command`, while `CopilotKit` provides inline completion through `/api/ai/copilot`. Their behavior also leaks into shared editor surfaces through toolbar buttons, slash and block menus, a selection shortcut, cursor/floating-toolbar state, AI-only editor variants, and a session-only settings dialog.

The feature is demo code rather than a current product requirement. The editor uses a static initial value and does not persist AI annotations, so no document or database migration is required. AI provider configuration, system prompts, assistant-ui, and the separate Lexical editor are independent product areas and must remain.

## Goals / Non-Goals

**Goals:**

- Remove every executable and visible Plate AI command and copilot path.
- Delete code and route handlers owned exclusively by the Plate AI integration.
- Remove direct dependencies that have no remaining repository consumer.
- Preserve all non-AI Plate editor behavior and the unrelated product AI surfaces.
- Leave a statically verifiable boundary with no dormant flag, stub endpoint, or AI-only variant.

**Non-Goals:**

- Changing AI provider configuration or system-prompt management.
- Changing assistant-ui or `components/editor-x/**`.
- Redesigning, localizing, or otherwise cleaning up the remaining Plate demo UI.
- Fixing `initialFocus`/`autoFocus` in `components/ui/date-node.tsx`.
- Preserving a compatibility endpoint or feature flag for future Plate AI work.

## Decisions

### Hard-delete the inactive feature

Remove the integration instead of hiding it behind a flag. A flag would retain more than four thousand lines of unused UI, mock streaming, prompt, route, and dependency code while providing no current product value. If AI editing is needed later, it can be reintroduced against the then-current Plate and AI SDK APIs.

### Remove client and server halves atomically

Delete `AIKit`, `CopilotKit`, their dedicated UI/hooks/settings, and the complete `app/api/ai/**` route tree in the same change. The two routes are internal to this editor integration, have no other in-repository callers, and import Plate editor-specific types or behavior. Disabled handlers, redirects, and `410` stubs are intentionally not retained.

### Preserve shared editor components and remove only their AI branches

Shared selection, context menu, slash menu, cursor overlay, floating toolbar, and editor primitives remain. Their AI imports, actions, state checks, and AI-only variants are removed surgically. `MarkdownKit` and `CursorOverlayKit` remain registered directly in `EditorKit`; they are non-AI capabilities even though the deleted AI kits also referenced them.

### Remove stale product claims and settings

Delete the AI section and AI comparison row from the editor's initial document so the demo does not advertise removed behavior. Delete `SettingsDialog` because its current model and API-key controls configure only the removed Plate command/copilot plugins.

### Remove only proven-unused direct dependencies

Remove `@platejs/ai`, `@ai-sdk/react`, `@faker-js/faker`, `ai`, and `dedent` after deleting their only consumers, then regenerate the pnpm lockfile. Keep shared Plate, Markdown, selection, comment, suggestion, and utility dependencies used elsewhere.

## Risks / Trade-offs

- **An external client may call the two AI routes despite no repository caller** → Treat route removal as an explicit breaking change and restore it only through a separate API proposal if a real consumer is identified.
- **AI hooks in shared editor files could be missed** → Verify zero references to the Plate AI packages, plugin symbols, route paths, keys, settings, and visible entry-point copy after implementation.
- **Surgical edits could affect non-AI selection or toolbar behavior** → Keep shared components in place and run targeted lint plus project typecheck after the removal.
- **Dependency removal could expose an unknown consumer** → Search the full source tree before removal and let typecheck/package resolution catch unresolved imports.
- **Project typecheck may still report the known date-node issue** → Record that existing out-of-scope diagnostic separately and require no new AI-removal diagnostics.

## Migration Plan

1. Remove editor/plugin wiring and AI actions from shared components.
2. Delete Plate AI-only client, server, prompt, and settings files.
3. Remove stale demo content and AI-only primitive variants.
4. Remove the five direct dependencies and update `pnpm-lock.yaml`.
5. Run static reference checks, targeted lint, diff validation, and project typecheck.

Rollback is a normal source-control revert; there is no persisted data or schema migration to reverse.

## Open Questions

None.
