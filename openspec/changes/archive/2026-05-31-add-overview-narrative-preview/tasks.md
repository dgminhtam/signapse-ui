## 1. Narrative Data Contract

- [x] 1.1 Add frontend narrative DTO/schema definitions for the `GET /narratives` paged summary response.
- [x] 1.2 Add a localized authenticated API action for `GET /narratives` that reads `response.text()` before parsing JSON and supports preview-sized query parameters.
- [x] 1.3 Ensure the overview integration does not client-filter narratives by workspace, watchlist assets, primary asset, theme, or graph relationships.

## 2. Overview UI

- [x] 2.1 Load the narrative preview only when the user has `narrative:read`.
- [x] 2.2 Render a separate `Luận điểm nổi bật` section below the existing workspace/tracked-asset overview panel.
- [x] 2.3 Show up to three returned narratives with title, thesis or summary, status, confidence, primary asset, and updated time when available.
- [x] 2.4 Hide narrative actions and links that would imply unsupported narrative create/update/archive/refresh/detail workflows.

## 3. States, Copy, And Skeleton

- [x] 3.1 Add localized Vietnamese and English dictionary copy for the narrative preview title, empty state, and non-blocking error state.
- [x] 3.2 Add compact empty and error rendering that does not block workspace identity or tracked assets.
- [x] 3.3 Update the overview skeleton so it mirrors the added narrative preview region without causing layout shift.

## 4. Verification

- [x] 4.1 Run `openspec validate add-overview-narrative-preview --strict`.
- [x] 4.2 Run the repo lint check.
- [x] 4.3 Run the repo typecheck.
- [x] 4.4 Perform a deterministic review for client-side narrative filtering, unsupported narrative actions/routes, duplicated overview copy, and skeleton mismatch.

User-owned manual QA note: after implementation, a logged-in user can optionally open `/vi` with narrative read permission and confirm the overview shows backend-returned narratives without client-side filtering.
