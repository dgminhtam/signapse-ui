## Context

The Personal Notes Sheet keeps an `editorInitialValue` snapshot in React state while Plate owns the live document internally. A successful create or update returns the full personal note, including persisted `content`, but the current save callback only adopts its id and summary metadata. Closing the Sheet unmounts Plate; reopening the cached Sheet does not reload note detail, so Plate remounts from the stale snapshot.

## Goals / Non-Goals

**Goals:**

- Refresh the active note's remount snapshot from every successful mutation response.
- Preserve Plate's uncontrolled editing model and serialized Save/safety-flush behavior.
- Reopen without an additional detail request.

**Non-Goals:**

- Changing personal-note API contracts, title behavior, save controls, or placeholder behavior.
- Mirroring each Plate value change into React state.
- Changing the shared Plate editor lifecycle.

## Decisions

- On successful persistence, `updateLocalSummary` will also set `editorInitialValue` from `note.content`. The mutation response is the authoritative persisted document already available at this boundary.
- The live Plate editor remains untouched. `initialValue` is a remount snapshot, and the shared editor does not recreate its editor instance when that prop changes, so a save response cannot overwrite newer in-memory edits.
- Reopening will continue using cached Sheet state. Fetching detail on every open was rejected because it adds latency and a server call for data already returned by Save; mirroring `onValueChange` into React state was rejected because it violates the existing Plate ownership requirement.

## Risks / Trade-offs

- A save response can represent an older revision while a newer revision is dirty → serialized draining keeps the live Plate value intact, and the later successful response replaces the snapshot before a safety close completes.
- The fix depends on create and update responses containing `content` → this is already required by `PersonalNoteResponse`; no fallback request is added.

