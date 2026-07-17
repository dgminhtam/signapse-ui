## Why

The Plate editor currently ships a large demo AI command and inline copilot stack that is not needed by the product yet. Removing it now reduces the editor surface, eliminates unused client/server code and dependencies, and avoids maintaining inactive AI routes and credential UI.

## What Changes

- Remove Plate AI command/chat and inline copilot plugins from the editor runtime.
- Remove every Plate AI entry point, including toolbar buttons, slash and context-menu actions, the `Mod+J` shortcut, inline ghost text, streaming UI, and editor AI settings.
- Delete the Plate-only AI command/copilot components, hooks, prompt builders, mock streaming code, and route handlers.
- Remove Plate AI claims and examples from the editor's initial demo document.
- Remove the now-unused `@platejs/ai`, `@ai-sdk/react`, `@faker-js/faker`, `ai`, and `dedent` dependencies.
- Preserve the editor's non-AI editing, Markdown, selection, comments, suggestions, table, cursor overlay, and toolbar behavior.
- **BREAKING**: Remove the internal `/api/ai/command` and `/api/ai/copilot` endpoints instead of retaining disabled stubs.

## Capabilities

### New Capabilities

- `plate-editor-ai-boundary`: Defines that the Plate editor runs without AI commands, copilot completion, AI-specific UI, routes, or direct AI runtime dependencies while retaining its non-AI editing capabilities.

### Modified Capabilities

None.

## Impact

- Affects the shared Plate editor composition under `components/editor/**` and AI integration points under `components/ui/**`.
- Deletes the Plate-only `app/api/ai/**` route tree; AI provider configuration and system-prompt features remain unchanged.
- Removes five direct dependencies and regenerates `pnpm-lock.yaml`.
- Affects both routes that render the shared editor: `/[lang]/editor` and the existing `/editor` route.
- Does not address the separate `initialFocus`/`autoFocus` issue in `components/ui/date-node.tsx`.
