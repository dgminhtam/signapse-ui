## 1. Contract And Copy

- [x] 1.1 Add the tolerant backend-derived `title` field to the personal-note summary response type while keeping create and update mutation schemas unchanged.
- [x] 1.2 Add localized personal-note title placeholder and untitled fallback copy in both dictionaries, then remove the unused id-based `noteLabel` copy.

## 2. Personal-Note Editor Layout

- [x] 2.1 Add an opt-in title-placeholder input to the shared Plate editor that enables first-H1 normalization, a missing body paragraph, H1 Enter-to-paragraph behavior, and a path-`[0]` title placeholder without changing the standalone playground.
- [x] 2.2 Initialize provisional personal-note drafts with an empty H1 followed by an empty paragraph and pass the localized title placeholder to the shared editor.
- [x] 2.3 Add a localized Personal Notes body hint and show it only for the active empty root paragraph while keeping title H1, other headings, quotes, lists, and the standalone playground behavior scoped correctly.

## 3. Summary Title Integration

- [x] 3.1 Copy the backend-returned title into local summary state after successful create and update autosaves without parsing the in-memory Plate value.
- [x] 3.2 Replace the id-based persisted summary label with the trimmed backend title or localized fallback while preserving one-line truncation, timestamp metadata, selected state, and autosave feedback.
- [x] 3.3 Update `docs/APIMAPPING.md` and `docs/personal-notes-title.md` to record completed frontend integration and any remaining OpenAPI nullability drift.
- [x] 3.4 Update `docs/personal-notes-title.md` with the active body-paragraph placeholder behavior.

## 4. Verification

- [x] 4.1 Run `openspec validate add-personal-note-titles --strict` and resolve all artifact/spec errors.
- [x] 4.2 Run `pnpm typecheck` and resolve errors introduced by the change.
- [x] 4.3 Run `pnpm lint` and resolve errors introduced by the change.
- [x] 4.4 Use static search to confirm personal-note mutations still omit `title`, the id-based `noteLabel` has no callers, and the standalone editor does not enable the title layout.
- [x] 4.5 Re-run strict OpenSpec validation, typecheck, and focused lint after adding the body placeholder.

User-owned manual QA: in an authenticated browser, verify new and legacy notes keep H1 at path `[0]`, Enter creates a paragraph, null/blank titles show localized fallback text, and the rail adopts the backend title after autosave.
