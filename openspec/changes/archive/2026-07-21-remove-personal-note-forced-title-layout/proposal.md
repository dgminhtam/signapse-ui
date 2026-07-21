## Why

Personal Notes currently turns the first root block into a permanent H1 title, which prevents the freeform Plate editing model users expect. The editor should allow any block order while the persisted summary title remains backend-owned and independent from later content edits.

## What Changes

- **BREAKING** Remove the Personal Notes invariant that reserves path `[0]` for an H1 and path `[1]` for a paragraph.
- Start new drafts with the normal freeform paragraph document and stop rewriting existing first blocks or applying title-specific Enter behavior.
- Keep the localized writing/command hint for active empty root paragraphs without coupling it to a title placeholder or forced layout.
- Remove Personal Notes title-placeholder copy and the opt-in title-layout input from the shared Plate editor while leaving the standalone editor unchanged.
- Continue displaying the backend-returned summary title or localized untitled fallback and keep title out of create/update content payloads.
- Align the title lifecycle with a backend-owned snapshot: derive title from the first meaningful textual content when a note is created, then preserve it across ordinary content updates. A future explicit rename contract remains out of scope.
- Update Personal Notes behavior documentation, API-mapping notes, and active OpenSpec requirements to remove the first-H1 contract.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `personal-notes-sheet-only`: Replace the forced first-H1 editor layout with a freeform Plate document while retaining the scoped paragraph hint.
- `personal-notes-workspace`: Clarify the response-only backend title snapshot lifecycle and keep versioned content mutations title-free.
- `personal-notes-autosave`: Preserve the backend title returned at creation instead of expecting ordinary content updates to recompute it.

## Impact

- Personal Notes Sheet draft shape and editor inputs in `components/personal-notes-quick-sheet.tsx`.
- Shared opt-in placeholder configuration in `components/editor/plate-editor.tsx`; the default `EditorKit` and standalone editor remain persistence-neutral.
- Personal Notes dictionary entries, behavior reference, API mapping, and the three modified OpenSpec capabilities.
- No dependency, route, Plate schema-version, save-coordinator, permission, or mutation-payload change.
- Backend prerequisite: create must derive a nullable title from freeform content without relying on an H1 at path `[0]`, and content update must return the stored title without recomputing it.
