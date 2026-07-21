## Why

Personal-note summaries currently show only a generated note id even though the backend now returns a title derived from the first H1 block. The frontend needs to adopt that contract so notes are recognizable in the Sheet while keeping title persistence owned by the versioned Plate document.

## What Changes

- Model the backend `title` field on personal-note summary and detail responses without adding `title` to create or update requests.
- Render the returned title in the summary rail, with a localized fallback for null, blank, or legacy empty-string values.
- Initialize new personal notes with an empty H1 followed by an empty paragraph and keep the first root block normalized as H1.
- Make Enter leave the title in an H1 and create a paragraph for body content.
- Add localized title placeholder, active body-paragraph writing/command hint, and untitled fallback copy while preserving the existing draft label before first persistence.
- Update the active summary title from the backend create or update response after autosave succeeds; do not parse Plate content for optimistic title updates.
- Keep placeholders for headings other than the title, quotes, lists, title search, title sort, inline rail editing, title length limits, body-derived titles, and delete behavior out of scope.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `personal-notes-workspace`: Personal-note response contracts expose backend-derived titles while mutation payloads continue to contain only versioned Plate content.
- `personal-notes-sheet-only`: The Sheet summary rail displays backend titles or localized fallbacks, and its shared editor supports the personal-note title layout without changing the standalone playground.
- `personal-notes-autosave`: Successful create and update responses refresh the active summary title together with identity and timestamp metadata.

## Impact

- Frontend DTOs: `app/lib/personal-notes/definitions.ts`.
- Personal Notes Sheet state and rendering: `components/personal-notes-quick-sheet.tsx`.
- Shared Plate editor configuration boundary: `components/editor/plate-editor.tsx`; the personal-note rules remain opt-in so the editor playground keeps its current behavior.
- Localized copy: `app/lib/i18n/dictionaries/en.ts` and `app/lib/i18n/dictionaries/vi.ts`.
- Backend endpoints and mutation payloads do not change; no new dependency or route is required.
- The current OpenAPI snapshot exposes `title` as a string property but does not encode the intended nullable/required semantics, so the implementation must remain safe for null, blank, and temporarily missing values until the snapshot is tightened.
