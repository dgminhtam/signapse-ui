## Context

The shared Plate editor currently owns a fixed demo value and is rendered both by the `/editor` playground and the header Personal Notes Sheet. The Sheet already loads `Page<PersonalNoteSummaryResponse>` from `GET /me/notes`, but summary rows are non-interactive and detail/create/update APIs are not integrated.

Plate explicitly owns its live document, selection, history, plugin state, and normalization. Its supported persistence boundary is `Plate.onValueChange`; React state must not mirror `editor.children` and feed it back on each keystroke. The backend personal-note contract stores JSON in `content` with an integer `contentSchemaVersion`; list responses omit content, so selecting a note requires a detail request.

## Goals / Non-Goals

**Goals:**

- Load version-1 Plate JSON for a selected personal note and autosave content mutations without a Save button.
- Integrate authenticated personal-note detail, create, and update actions with localized errors and permission gating.
- Preserve Plate's uncontrolled live-state model and keep persistence owned by the Personal Notes feature.
- Prevent same-tab save reordering and data loss when switching notes or closing the Sheet.
- Keep the summary rail locally synchronized with created/updated note identity and timestamps.

**Non-Goals:**

- Persist the `/editor` playground.
- Add a full `/notes` route, presentation mode, deletion, or creation of additional notes when notes already exist.
- Provide offline editing, crash recovery, multi-tab conflict resolution, collaboration, or backend schema migrations.
- Change the Plate toolbar or add any save control.

## Decisions

### 1. Keep Plate state editor-owned

`PlateEditor` will accept an initial Plate `Value`, an `onValueChange` callback, and a read-only flag. It will pass the initial value to `usePlateEditor` and persistence events to `<Plate onValueChange>`, but it will not store the current editor value in React state.

Each selected personal note is a distinct editor identity. The Sheet will finish any pending save, fetch the selected detail, and mount the editor with that note's initial value. This uses Plate initialization for document changes instead of calling `setValue` during ordinary typing. The playground keeps its current demo initial value and provides no persistence callback.

Alternative considered: mirror the value into controlled React state. Rejected because Plate documents this as unsafe for selection, history, normalization, and typing performance.

### 2. Store versioned Plate JSON directly

Frontend request and response types will model `content` as Plate `Value`. Create and update requests will always send `contentSchemaVersion: 1`; the Server Action boundary will validate that the content is a JSON array and the schema version is the supported literal.

When a detail response has version `1`, its content is used as the editor initial value. A response with any other version remains visible as an unsupported-version state and MUST NOT be passed to an editable editor or written back automatically.

Alternative considered: serialize to HTML. Rejected because the current backend contract is versioned JSON and HTML would discard Plate-specific structure and marks.

### 3. Keep autosave coordination local to Personal Notes

The Sheet will use the installed `use-debounce` package with a 1000 ms delay. `onValueChange` records the newest value and edit sequence; selection-only changes do not enter the persistence flow.

The coordinator permits one mutation at a time:

1. A new content sequence becomes dirty and schedules a save.
2. A new draft uses `POST /me/notes`; the returned id becomes the active note id.
3. An existing note uses `PUT /me/notes/{id}`.
4. If a newer sequence arrives while the request is in flight, the latest value is saved immediately after the current request succeeds.
5. The note becomes clean only when the acknowledged sequence is still the latest sequence.

This queue prevents same-tab responses from overwriting newer content and prevents duplicate POST requests during initial creation. It intentionally does not attempt cross-tab concurrency control because the backend exposes no revision or ETag.

### 4. Treat note switches and Sheet close as save boundaries

Selecting another note or closing the Sheet will flush and await dirty content before changing editor identity or unmounting the editor. If the flush fails, the current editor remains open and selected with an inline error so the user does not silently lose the draft. A clean editor can switch or close immediately.

Async detail loads will carry a local request sequence so a slower earlier selection cannot replace a newer selection. The editor remains unavailable while the selected detail is loading.

Hard browser termination can still lose at most the unsent debounce window. Adding local-storage recovery is deferred until offline or crash recovery is a product requirement.

### 5. Keep status inline and permission-aware

The Sheet header will expose localized `saving`, `saved`, and `save failed` text. Routine autosaves will not emit toasts. Status changes use a polite live region; save errors use alert semantics.

Users with `personal-note:read` but without `personal-note:update` receive a read-only editor for existing notes. When no notes exist, only users with `personal-note:create` receive an editable blank Plate document; its first content change creates the note. Permission constants remain centralized in the personal-notes library boundary.

### 6. Update local summary state and the API ledger

Successful create/update responses update the active id, schema version, and timestamps in the summary rail without refetching the full list after every autosave. After integration, the personal-note detail/create/update rows in `docs/APIMAPPING.md` will identify the implemented frontend owners while preserving the backend snapshot fields.

## Risks / Trade-offs

- [Backend accepts an integer but does not define schema-version policy] → Write only version `1`, reject unsupported versions read-only, and document the decision in the frontend contract.
- [Multiple tabs can overwrite each other] → Serialize requests within one tab and document last-write-wins as a backend limitation; add optimistic concurrency only if the backend exposes a revision token.
- [Closing during a failed save can lose work] → Keep the Sheet open when a dirty flush fails and preserve the editor value in memory.
- [A hard browser close can interrupt the debounce window] → Flush on controlled Sheet transitions; defer local draft recovery until explicitly required.
- [Large documents make full JSON requests expensive] → Debounce to one request after an edit burst; add incremental persistence only if measurements show a real limit.
- [Shared editor changes could accidentally persist the playground] → Keep autosave callback ownership in Personal Notes and verify the playground supplies no persistence callback.

## Migration Plan

1. Add version-1 DTOs, validation, permission constants, and authenticated detail/create/update actions.
2. Make the shared editor accept initial value, persistence callback, and read-only inputs while preserving its demo defaults.
3. Connect selection, detail loading, autosave coordination, inline status, and permission behavior in the Sheet.
4. Update localized copy and the personal-note API mapping integration status.
5. Validate delta specs, lint affected files, and run TypeScript type checking.

Rollback removes the frontend autosave wiring and returns the Sheet to transient editing. Notes already written as version-1 JSON remain valid backend data and are not deleted or transformed by rollback.

## Open Questions

None for implementation. Version `1` is the frontend write format for this change; a future incompatible Plate document shape requires a separately specified migration.
