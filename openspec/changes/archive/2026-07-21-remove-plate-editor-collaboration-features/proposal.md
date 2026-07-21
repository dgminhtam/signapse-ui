## Why

The shared Plate editor is used for single-user personal notes, but it still ships demo-grade comments, discussions, and tracked suggestions with hard-coded users and no backend collaboration model. Removing that unused surface reduces toolbar crowding, editor complexity, and direct dependencies without changing normal note editing.

## What Changes

- **BREAKING** Remove Comment, Suggestion, Discussion, and editor Mode controls from the fixed and floating toolbars.
- Remove the interactive and static Plate plugin kits, renderers, review popovers, demo discussion data, and helper code that support those collaboration features.
- Keep editability and read-only behavior controlled by the existing Personal Notes permissions instead of an editor-local mode selector.
- Remove collaboration-specific hooks from block insertion, Markdown serialization, link positioning, editor variants, node styling, demo content, types, and localization.
- Remove the direct `@platejs/comment`, `@platejs/suggestion`, and now-unused `date-fns` dependencies.
- Do not add a compatibility shim or schema bump; any persisted pending annotations must be resolved separately before deployment if they exist.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plate-editor-toolbar-composition`: The shared toolbar no longer exposes Comment, Suggestion, or Mode controls and retains only the remaining single-user editing actions.
- `plate-editor-ai-boundary`: The non-AI preservation contract no longer requires comment or suggestion plugins to remain composed.
- `product-localization`: Comment-specific editor feedback scenarios and dictionary copy are removed with the comment feature.

## Impact

- Affects the shared Plate editor kits, fixed and floating toolbar composition, editor transforms, static export composition, collaboration-only UI files, annotation styling hooks, demo content, and English/Vietnamese dictionaries.
- Deletes collaboration-only source files and updates `package.json` plus `pnpm-lock.yaml`.
- Does not change Personal Notes APIs, save coordination, content schema version, or permission checks.
- Existing content containing unresolved `suggestion_*` or `comment_*` metadata is outside the automatic migration scope and requires a pre-deployment data check.
