## 1. Simplify News Article Quick Detail

- [x] 1.1 Recompose the news article quick-detail body as description, provenance with original-source access, optional image, and bounded article content without status, linked-event review, redundant headings, borders, or duplicate actions.
- [x] 1.2 Remove the obsolete `canReadEvents` article-content prop, linked-event helpers and imports, and localized keys that repository search confirms are unused while preserving the shared drawer and event quick detail.

## 2. Verification

- [x] 2.1 Run static searches to confirm removed news article quick-detail status, linked-event, and duplicate original-source UI has no active render path.
- [x] 2.2 Run strict OpenSpec validation, `pnpm typecheck`, and `pnpm lint`.

## 3. Extended Drawer Reading

- [x] 3.1 Increase the shared local quick-detail drawer to `min(90svh, 960px)` with a local height/max-height override while preserving the existing fixed header, scrolling body, and footer.
- [x] 3.2 Move the existing `NewsArticleMarkdown` renderer to the news article feature root, update the canonical detail import, lazy-load it from quick detail, render complete Markdown content, and remove the superseded quick-content fallback copy.

## 4. Extended Reading Verification

- [x] 4.1 Run static searches for the removed line clamp, old renderer path, and quick-only fallback while confirming both article surfaces reuse the renderer.
- [x] 4.2 Run strict OpenSpec validation, `pnpm typecheck`, scoped ESLint, full `pnpm lint`, and `git diff --check`.

## 5. Drawer Content Width

- [x] 5.1 Add an optional merged layout class to `NewsArticleMarkdown` and pass `max-w-none` from quick detail while preserving the detail page's default `72ch` measure.
- [x] 5.2 Run strict OpenSpec validation, `pnpm typecheck`, scoped ESLint, and `git diff --check`.
