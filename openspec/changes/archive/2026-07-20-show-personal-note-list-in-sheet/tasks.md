## 1. Restore the read-only list boundary

- [x] 1.1 Add `app/lib/personal-notes/definitions.ts` with the backend-aligned `PersonalNoteSummaryResponse` fields used by `PagePersonalNoteSummaryResponse`.
- [x] 1.2 Add `app/api/personal-notes/action.ts` with only `getPersonalNotes(searchParams)`, reusing `fetchAuthenticated()`, `Page`, `SearchParams`, and `queryParamsToString()` for `GET /me/notes`.

## 2. Render the Sheet summary rail

- [x] 2.1 Add localized Vietnamese and English copy for note identity, timestamps, loading, empty, error, retry, and Load more states.
- [x] 2.2 Update `PersonalNotesQuickSheet` to load page `0` with size `20` on first open, pass an empty sort array so no sort query parameter is serialized, cache loaded pages, retry the first page, and append subsequent pages locally.
- [x] 2.3 Render the responsive non-interactive summary rail with existing `Item`, `Skeleton`, `Empty`, `Button`, and timestamp primitives while keeping failure feedback scoped to the rail.
- [x] 2.4 Preserve the existing permission gate, shared `PlateEditor`, editor value, plugins, toolbar composition, and transient editing behavior without adding note selection or persistence calls.

## 3. Documentation and verification

- [x] 3.1 Update `docs/APIMAPPING.md` so only `GET /me/notes` is marked integrated and detail/create/update/delete remain unintegrated.
- [x] 3.2 Run scoped ESLint on the affected TS/TSX files, `pnpm typecheck`, and `git diff --check`.
- [x] 3.3 Run static searches confirming the Sheet integration has no sort query parameter and no personal-note detail or mutation calls.
- [x] 3.4 Run `openspec validate show-personal-note-list-in-sheet --strict`.
