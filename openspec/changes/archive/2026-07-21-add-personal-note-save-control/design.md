## Context

The Personal Notes Sheet currently calls `change()` for each Plate document mutation and schedules `flush()` through a 1000 ms debounce. The existing coordinator already tracks revisions, adopts the id returned by the initial create, serializes mutations, retains edits made while a request is pending, exposes save state, and lets note-switch, new-draft, and Sheet-close flows wait for a successful flush.

Save feedback currently appears inside the active or provisional summary item. The shared `PlateEditor` owns formatting behavior and renders a sticky fixed toolbar used by both Personal Notes and the standalone editor playground. Persistence remains a Sheet concern and must not be added to that shared toolbar. A separate active change named `reorganize-plate-editor-toolbar` has no artifacts yet, so this design avoids coupling the Save control to its eventual toolbar composition.

## Goals / Non-Goals

**Goals:**

- Stop timer-driven personal-note create and update requests while keeping local dirty tracking.
- Let users save through a visible button or `Ctrl+S` / `Cmd+S`.
- Flush dirty content once before selecting another note, starting a new draft, or closing the Sheet.
- Preserve the current editor and Sheet state when a save or safety flush fails.
- Keep at most one mutation in flight and persist the latest value when edits occur during a pending request.
- Keep save feedback keyboard- and screen-reader-accessible.

**Non-Goals:**

- Changing title derivation, title mutation APIs, forced H1 layout, placeholders, Plate JSON schema, or backend DTOs.
- Changing Personal Notes permissions, adding a route, adding deletion, or redesigning the summary rail.
- Modifying the shared Plate formatting toolbar or the standalone editor playground.
- Adding a new persistence abstraction, dependency, toast, or confirmation dialog.

## Decisions

### Reuse the existing revision coordinator and remove only the timer

`handleEditorChange` will continue to pass the latest Plate value to the existing coordinator's `change()` method but will no longer schedule a debounced `flush()`. A single Sheet-owned save handler will call the existing `flushCurrentEditor()` path for the button, keyboard shortcut, and safety boundaries.

The coordinator already provides the required dirty revision tracking, serialized drain loop, create-id adoption, latest-value preservation, and retry behavior. Replacing or renaming it in this change would add churn without changing behavior.

Increasing the debounce interval was rejected because it would reduce but not eliminate pause-driven requests and would leave the first create tied to an arbitrary typing pause. Pure manual save was rejected because closing or changing note identity could discard unsaved content.

### Place Save in a Sheet-owned action row above the Plate toolbar

The editable detail pane will render a non-scrolling action row above the existing Plate editor. Save state appears on the leading side and a standard Save button on the trailing side. The editor and its sticky formatting toolbar remain in the pane's inner scroll region.

This placement keeps persistence close to the selected document, visible while content scrolls, and usable on mobile without putting a note-specific action in the summary rail. It also keeps the shared `FixedToolbarButtons`, `PlateEditor` public API, and standalone playground unchanged.

Save feedback will move from the selected/provisional rail item to this action row so one state change produces one live-region announcement instead of duplicate status output.

### Derive Save availability from the existing save state

The Save button is enabled for `dirty` and `error`, disabled for `idle`, `saved`, and `saving`, and not rendered for a read-only editor. While saving, the disabled button includes the repo-standard spinner. An error remains visible with alert semantics and leaves Save enabled as an explicit retry.

The implementation will reuse the common localized Save label and the existing Personal Notes saving, saved, and error copy. No success toast or additional dirty-state copy is required.

### Scope the native keyboard shortcut to the open Sheet

`SheetContent` will handle `Ctrl+S` and `Cmd+S` in the capture phase while an editable supported note is active. It will prevent the browser Save Page action and call the same save handler as the visible button. The button will expose `aria-keyshortcuts="Control+S Meta+S"`.

A Sheet-scoped native keyboard handler was chosen over a global listener or a new hotkey abstraction because focus is already contained by the Sheet and the behavior has one owner. The shortcut is a no-op while saving or clean and never bypasses permission or schema-version guards.

### Preserve safety flushes as transition gates

Selecting another summary, starting a new draft, and closing the Sheet continue to await `flushCurrentEditor()`. Clean editors return without a mutation. Dirty editors persist once before the transition. A failed flush returns `false`, so the current note, editor value, selection, and open Sheet remain intact.

If the user edits while a save request is in flight, the existing drain loop may issue one additional serialized mutation for the newer revision. This is intentional data-loss protection and does not restore timer-driven persistence.

## Risks / Trade-offs

- [Users may assume all editing is automatically persisted] -> Keep Save continuously visible for editable notes, expose clear saved/saving/error feedback, support the conventional keyboard shortcut, and retain boundary flushes.
- [A user edits during an in-flight save] -> Reuse the serialized drain loop so the latest revision is persisted after the pending request without concurrent mutations or duplicate creates.
- [A boundary flush fails] -> Abort close, selection, or new-draft transition and leave the retryable editor state visible.
- [Save feedback is duplicated for assistive technology] -> Move active feedback from the rail into one action-row status/alert region.
- [The Plate toolbar is reorganized separately] -> Keep the action row outside `PlateEditor` and `FixedToolbarButtons` so the changes remain independent.

## Migration Plan

1. Remove the debounce scheduling from the Personal Notes Sheet while retaining dirty revision tracking and flush gates.
2. Add the action row, state-driven Save button, and Sheet-scoped keyboard shortcut.
3. Move active save feedback from the rail to the action row and update persistence wording in specs/docs.
4. Validate OpenSpec, TypeScript, and focused lint checks.

No backend or stored-data migration is required. Rollback removes the action row and shortcut and restores the 1000 ms debounce call; the coordinator and API contract remain compatible in either direction.

## Open Questions

None. Title and freeform-editor decisions remain intentionally deferred to a later change.
