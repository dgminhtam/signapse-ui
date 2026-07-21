## 1. Remove Forced Title Layout

- [x] 1.1 Change the Personal Notes provisional document to one empty paragraph and stop passing the Personal Notes title placeholder into `PlateEditor`.
- [x] 1.2 Remove `titlePlaceholder`, `H1Plugin`, `NormalizeTypesPlugin`, path `[0]`/`[1]` rules, and title-specific Enter behavior from `PlateEditor`, while keeping the localized `bodyPlaceholder` override scoped to active empty root paragraphs.
- [x] 1.3 Remove only the unused Personal Notes `titlePlaceholder` entries from the English and Vietnamese dictionaries; retain the body hint, untitled fallback, and unrelated feature title placeholders.

## 2. Preserve Title Ownership And Documentation

- [x] 2.1 Verify Personal Notes still copies backend-returned id, nullable title, and timestamps into the active summary after create/update and does not parse Plate content or add title to mutation payloads.
- [x] 2.2 Update `docs/personal-notes-title.md` and the Personal Notes section of `docs/APIMAPPING.md` to describe freeform content, create-time backend title snapshots, stable content-update titles, and the blank-title fallback without changing the OpenAPI snapshot.

## 3. Verification

- [x] 3.1 Run focused lint for the touched Personal Notes, shared editor, and dictionary files and resolve in-scope findings.
- [x] 3.2 Run `pnpm typecheck` and resolve in-scope type errors.
- [x] 3.3 Run `openspec validate --all --strict` and confirm the change remains valid and apply-ready.
- [x] 3.4 Use static searches to confirm the Personal Notes title-placeholder wiring and forced H1 normalization are gone, the paragraph hint remains scoped, and the standalone editor receives no Personal Notes inputs.
- [x] 3.5 Run `git diff --check` and review the final diff for unintended save, permission, API payload, schema-version, or archived-spec changes.

Backend prerequisite for release: create derives a nullable title from the first meaningful textual content without relying on block type/path, and ordinary content update preserves and returns that stored title.

User-owned manual QA: confirm a new draft starts as a paragraph; the first block can become a heading, quote, or list and survives Save/reopen; existing leading H1 content is not rewritten; only an active empty paragraph shows the localized hint; summary title remains response-owned; standalone `/editor` behavior is unchanged.
