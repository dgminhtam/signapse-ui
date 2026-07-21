## Context

The Personal Notes Sheet lists `PersonalNoteSummaryResponse` records and loads versioned Plate JSON into the shared `PlateEditor`. Existing summaries have no title in the frontend DTO and render a localized `Note #id` label. New drafts start with a single empty paragraph, while the backend now derives a response-only `title` from the first H1 block and returns it on summary, detail, create, and update responses.

The shared editor also powers the standalone editor playground, so title structure and localized placeholder behavior must be enabled only for personal notes. Autosave already serializes changes, adopts the id returned by create, and calls one `onSaved` callback for both create and update responses.

The OpenAPI snapshot includes `title` as a string property but currently omits required and nullable metadata. The frontend behavior reference defines the effective value as `string | null` and requires blank or legacy empty strings to use presentation fallback copy.

## Goals / Non-Goals

**Goals:**

- Display meaningful backend-derived titles in the summary rail with localized fallback text.
- Keep title ownership in the first H1 of versioned Plate content and keep mutation payloads unchanged.
- Guarantee a personal-note document starts with H1 and has a paragraph available for body content.
- Give the active empty body paragraph a localized writing and slash-command hint without adding hints to other block types.
- Preserve the shared editor playground, permission gates, autosave serialization, timestamps, and accessibility semantics.
- Handle the current OpenAPI nullability gap without adding a response adapter or parsing Plate content twice.

**Non-Goals:**

- Title search or sort, inline rail editing, title length limits, body-derived titles, or optimistic title extraction.
- A standalone notes route, deletion, new permissions, backend data migration, or a new editor abstraction.
- Localizing or redesigning placeholders and toolbar copy outside the Personal Notes mode.

## Decisions

### Model title on the shared response shape only

Add `title?: string | null` to `PersonalNoteSummaryResponse`; `PersonalNoteResponse` inherits it with `content`. The optional nullable shape safely represents the intended null value and the temporarily incomplete OpenAPI requiredness. Create and update continue to validate and send only `{ content, contentSchemaVersion }`.

Adding a separate mutation title field or compatibility mapper was rejected because the backend derives title from persisted Plate content and the existing actions already return the response DTO directly. When the OpenAPI snapshot encodes required nullable semantics, the optional marker can be removed without changing UI behavior.

### Treat the mutation response as the summary title source

`updateLocalSummary` copies `title` from each successful create or update response together with id and timestamps. The rail displays `note.title?.trim() || personalNotes.untitled`, so null, missing, whitespace-only, and legacy empty-string values share one presentation fallback.

Parsing the editor value during typing was rejected because it duplicates backend normalization, complicates in-flight autosave ordering, and can disagree with the persisted response. The active summary may therefore keep its previous title until autosave succeeds.

### Make title layout an opt-in shared-editor configuration

Add one optional title-placeholder input to `PlateEditor`. When provided, the editor derives its normal `EditorKit` plus three keyed overrides:

- `NormalizeTypesPlugin` keeps path `[0]` at `KEYS.h1` with `strictType` and inserts a paragraph at `[1]` when that slot is missing.
- The H1 plugin uses `break.empty = "exit"` and `break.splitReset = true`, preserving the title block while Enter creates or resets the following block to a paragraph.
- `BlockPlaceholderPlugin` exposes the localized title placeholder only for the H1 at path `[0]` and a localized writing/slash-command hint for active empty root paragraphs. Other headings, quotes, and lists remain without placeholders.

The Personal Notes Sheet supplies this input; the standalone playground does not. Changing `EditorKit` globally or creating a second full editor component was rejected because both would duplicate or leak feature-specific behavior.

### Initialize drafts in the canonical two-block shape

Replace the provisional document value with one empty H1 followed by one empty paragraph. The placeholder remains presentation state and is never inserted into the Plate value or mutation payload.

Existing version-1 notes that begin with a paragraph are normalized by converting that first block to H1 while preserving its text. This gives current notes a migration path on their next persisted change without a separate data migration.

### Keep copy and cleanup local to personal notes

Add `titlePlaceholder`, `bodyPlaceholder`, and `untitled` to both typed dictionaries. Remove `noteLabel` once the id-based label has no caller. The fallback is rendered as actual text inside the existing one-line summary title element; timestamp and autosave metadata keep their current secondary treatments.

## Risks / Trade-offs

- [OpenAPI does not yet encode `title` nullability or requiredness] → Use `title?: string | null`, record the drift in `docs/APIMAPPING.md`, and tighten the type when the snapshot is corrected.
- [Legacy first paragraphs become titles after normalization] → Preserve their text and rely on the existing version-1 autosave flow; notes remain readable before persistence through the localized fallback.
- [A legacy document starts with a complex non-text block] → Keep the scoped forced-layout behavior specified by the product reference and avoid a speculative migration layer; malformed version-1 content remains a backend/data-quality follow-up.
- [The rail title lags while a save is pending] → Keep the last persisted title and update only from the serialized mutation response, avoiding optimistic state races.
- [Feature-specific H1 behavior leaks into the editor playground] → Enable all title rules only when the Personal Notes Sheet supplies the title-placeholder input.

## Migration Plan

1. Add the tolerant response title type and localized copy.
2. Add opt-in title layout to the shared editor and initialize new drafts with H1 plus paragraph.
3. Render summary titles and copy returned titles into local summaries after autosave.
4. Validate OpenSpec, TypeScript, lint, and focused browser interactions for normalization, Enter, fallback, and autosave refresh.

No backend or stored-data migration is required. Rollback removes the opt-in editor rules and title rendering; H1 content already saved by the feature remains valid Plate JSON and continues to render in the existing editor.

## Open Questions

None blocking frontend implementation. Backend should still update the OpenAPI snapshot so `title` is explicitly required and nullable when that contract is finalized.
