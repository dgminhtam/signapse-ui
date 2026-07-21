## Context

Personal Notes currently opts the shared `PlateEditor` into a bundled title mode by passing `titlePlaceholder`. That single input adds first-H1 normalization, a required paragraph at path `[1]`, title-specific Enter behavior, and the localized title/body placeholder override. New drafts also begin as `[h1, paragraph]`, so both initialization and editor normalization enforce the title-first model.

The mutation schema already accepts general non-empty Plate documents and persists only `{ content, contentSchemaVersion }`. Summary rendering, explicit Save, safety flushes, permissions, and the serialized revision coordinator do not require an H1. The backend response remains the source of the nullable summary title.

## Goals / Non-Goals

**Goals:**

- Restore freeform block ordering for new and existing Personal Notes.
- Retain the localized hint for an active empty root paragraph.
- Remove title-layout behavior and copy without changing the shared editor playground.
- Keep title rendering response-owned and keep content mutations title-free.
- Avoid a Plate schema-version bump or stored-content migration.

**Non-Goals:**

- Add inline title editing, a title mutation field, or a rename endpoint.
- Derive an optimistic title in the frontend.
- Change Save, safety flush, permissions, Sheet layout, or toolbar composition.
- Convert existing first H1 blocks back to paragraphs.
- Change placeholder behavior outside the Personal Notes opt-in mode.

## Decisions

### Initialize freeform drafts with one paragraph

`EMPTY_PERSONAL_NOTE` becomes a single empty paragraph. Existing documents are passed to Plate unchanged, including documents that already begin with H1.

This is preferred over converting old H1 blocks because freeform editing permits H1 and a migration would rewrite valid user content. Content schema version `1` already models an array of Plate nodes and does not require a title block.

### Make the body hint the only Personal Notes editor override

Remove `titlePlaceholder` from `PlateEditor`, along with `H1Plugin`, `NormalizeTypesPlugin`, the `[0]`/`[1]` rules, and the H1 break override. Keep `bodyPlaceholder` as the opt-in condition for a keyed `BlockPlaceholderPlugin` override whose placeholder map and query target only root paragraphs.

Removing the entire custom plugin branch was rejected because it would fall back to the shared English `Type something...` copy and lose the localized Personal Notes hint. Creating a second editor component was rejected because the existing optional placeholder input is sufficient.

### Keep persisted title ownership on the backend

The Sheet continues to render `note.title?.trim()` with the localized untitled fallback and continues copying id, title, and timestamps from successful mutation responses. It does not inspect Plate content to update summary titles.

The backend contract for this freeform model is:

- create derives a nullable title from the first meaningful textual content without depending on block type or path;
- ordinary content update preserves and returns the stored title;
- blank content may create a note with a null title;
- explicit rename is a future separate contract.

This keeps the frontend payload and serialized save coordinator unchanged. Deriving title in the browser was rejected because it would duplicate backend normalization and create ordering disagreements.

### Remove only Personal Notes title-layout copy and contracts

Delete the Personal Notes `titlePlaceholder` entries from both dictionaries but retain `bodyPlaceholder` and `untitled`. Update the behavior reference, API mapping, and active specifications so no current contract claims path `[0]` is a title.

Archived changes remain historical and are not rewritten.

## Risks / Trade-offs

- [Backend still derives title only from an H1 at path `[0]`] → Confirm the backend prerequisite before release; otherwise freeform creates can return null titles.
- [Backend recomputes title on every content update] → Require update responses to return the stored title snapshot so formatting/content edits cannot rename a note implicitly.
- [A user explicitly saves a completely blank new draft] → Accept a null backend title and continue showing the localized untitled fallback until an explicit rename capability exists.
- [Existing notes retain their leading H1] → Preserve them as valid user content; freeform means the user may keep or change that block normally.
- [Removing the bundled title mode accidentally removes the body hint] → Key the custom placeholder override from `bodyPlaceholder` and statically verify the H1-specific imports, prop, and localization keys are gone.

## Migration Plan

1. Confirm the backend title lifecycle supports freeform create and stable content update responses.
2. Remove the forced draft shape and title-layout editor configuration while retaining the paragraph hint.
3. Remove unused Personal Notes title-placeholder copy and update documentation/spec contracts.
4. Run focused lint, typecheck, strict OpenSpec validation, and static searches for removed H1/title-layout wiring.

Rollback restores the opt-in H1 configuration and two-block draft. No data rollback is required because existing H1 and freeform documents both remain valid version-1 Plate JSON.

## Open Questions

None for the frontend implementation. Explicit user-driven rename remains a separate future change.
