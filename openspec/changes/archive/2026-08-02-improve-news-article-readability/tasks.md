## 1. Reader-First Article Composition

- [x] 1.1 Constrain the news article detail content to a centered editorial shell and a prose measure of approximately 65–75 characters with base body text and relaxed line height.
- [x] 1.2 Replace the description/image grid with a single-column flow that renders an unlabeled standfirst, wide feature image, and article body without equal-height cards or empty companion regions.
- [x] 1.3 Remove redundant section headings and dashboard-style borders from the summary, image, and body while preserving missing-content fallbacks and accessible image alt text.

## 2. Reader and Administrative Actions

- [x] 2.1 Move the localized original-article link into the provenance row beside outlet and publication time.
- [x] 2.2 Simplify the detail overflow action component to permitted destructive administration only, preserve the existing delete confirmation, and render no empty menu for users without delete permission.
- [x] 2.3 Confirm the detail route contains no linked-event, derivation, reload, processing-status, or technical-information UI or dead route-specific imports/components.

## 3. Loading and Verification

- [x] 3.1 Update the detail Suspense skeleton to mirror the headline/provenance, single-column summary/media, body, and optional compact administration regions.
- [x] 3.2 Run static searches for removed operational labels/components and validate the OpenSpec change with strict validation.
- [x] 3.3 Run `pnpm typecheck` and `pnpm lint`, resolving any errors introduced by this change.
