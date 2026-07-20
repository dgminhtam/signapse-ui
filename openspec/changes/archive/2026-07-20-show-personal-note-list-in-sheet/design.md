## Context

The header personal-notes Sheet is permission-gated and currently mounts the shared `PlateEditor` with its existing demo value. The previous personal-note action and DTO modules were removed, while the current backend contract now exposes `GET /me/notes` as `PagePersonalNoteSummaryResponse`. Each summary contains only `id`, `contentSchemaVersion`, `createdDate`, and `lastModifiedDate`; it does not contain title or content.

This change is deliberately read-only. It restores only the minimum API boundary needed to show summaries and leaves the editor, detail contract, schema-version handling, and mutations for later changes.

## Goals / Non-Goals

**Goals:**

- Show a responsive personal-note summary rail inside the existing Sheet.
- Load summaries only after the Sheet is opened and retain the loaded pages for the mounted app session.
- Support the first page, incremental load-more pagination, loading, empty, error, and retry states locally inside the Sheet.
- Use the existing authenticated transport, `Page`, `SearchParams`, and query serialization helpers.
- Keep the existing shared Plate editor and permission gate unchanged.

**Non-Goals:**

- Loading a selected note or binding backend content to Plate.
- Creating, updating, deleting, or saving personal notes.
- Interpreting `contentSchemaVersion` or validating Plate JSON content.
- Adding note search, explicit sorting, URL state, a standalone `/notes` route, or new dependencies.

## Decisions

### 1. Restore only the summary read boundary

Add a small personal-note definitions module containing `PersonalNoteSummaryResponse` and a single `getPersonalNotes(searchParams)` server action returning `Page<PersonalNoteSummaryResponse>`. The action will delegate to `fetchAuthenticated()` and `queryParamsToString()` like other paged resources.

The caller will pass an empty filter, zero-based page, page size `20`, and an empty sort array. This produces page and size query parameters without a sort query parameter. Adding detail and mutation contracts now would recreate unused scaffolding.

### 2. Load lazily and keep pagination local to the Sheet

`PersonalNotesQuickSheet` will control its open state. The first open starts page `0`; reopening reuses the loaded summaries. Retry replaces the first page, while Load more requests `currentPage.number + 1` and appends the returned summaries. Pending state disables retry/load-more actions so duplicate requests are not started by repeated activation.

Sheet pagination remains component-local because it is a transient header utility rather than a canonical list route. It will not change the current page URL.

### 3. Render a non-interactive summary rail beside the unchanged editor

On desktop, the Sheet body will place a bounded summary rail beside the existing editor; on smaller screens the list and editor will stack. The rail will reuse `ItemGroup`, `Item`, `ItemContent`, `ItemTitle`, `ItemDescription`, `Skeleton`, `Empty`, `Button`, and the existing timestamp presentation helper. Native overflow is sufficient, so no additional scroll abstraction is needed.

Rows remain non-interactive in this phase. Their visible identity is a localized `Ghi chú #<id>` label plus last-modified time with created time as fallback. `contentSchemaVersion` is retained in the DTO but not shown because it is implementation metadata.

### 4. Preserve failure isolation and existing editor behavior

List loading, empty, and failure feedback will render only in the rail. A list failure must not close the Sheet or replace the editor. The shared `PlateEditor`, its demo value, plugins, and toolbar composition remain untouched and unbound to the summary list.

## Risks / Trade-offs

- [The backend controls ordering because no sort parameter is sent] → Do not label the list as newest/recent or promise a stable order.
- [Summary payloads have no title or content] → Use the note id and timestamp; defer meaningful previews until the backend exposes summary text or detail selection is intentionally added.
- [Cached pages can become stale while the app layout remains mounted] → Accept session-local staleness for this read-only phase; add explicit refresh only when mutations or freshness requirements exist.
- [The old Sheet spec forbids every personal-note API call] → Modify it narrowly to allow only `GET /me/notes` and continue prohibiting detail and mutation calls.

## Migration Plan

1. Add the read-only DTO and action.
2. Add localized list states and the Sheet summary rail.
3. Update the API mapping ledger so only `GET /me/notes` is integrated.
4. Roll back by removing the rail, read action, DTO, and new copy; the unchanged editor-only Sheet remains functional and no backend data migration is required.

## Open Questions

None. Backend-default ordering without a sort parameter is an explicit product decision for this change.
