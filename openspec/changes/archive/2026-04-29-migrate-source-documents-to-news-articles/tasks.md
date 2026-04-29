## 1. Canon news-article foundation

- [x] 1.1 Add `app/lib/news-articles/definitions.ts` with backend-aligned `NewsArticle*` types, article status labels, derivation result DTOs, batch DTOs, and feature-image request typing.
- [x] 1.2 Add `app/lib/news-articles/permissions.ts` with canon `NEWS_ARTICLE_*` helpers, isolating any temporary runtime compatibility mapping if backend permission literals are still legacy.
- [x] 1.3 Add `app/api/news-articles/action.ts` with authenticated list, detail, delete, analyze, crawl-full-content, derive-primary-event, derive-pending-news-events, and feature-image actions that call `/news-articles*`.

## 2. Canon route and UI migration

- [x] 2.1 Add the protected canon route tree under `app/(main)/news-articles/*` for list, search, detail/operator workbench, and supporting components needed by the feature.
- [x] 2.2 Migrate the list page to the news-article schema and remove legacy source-document-only filters, columns, and badge groups such as `documentType`, `lifecycleStatus`, `readinessStatus`, and `eventDerivationStatus`.
- [x] 2.3 Migrate the detail/operator workbench to `NewsArticleResponse`, removing economic-calendar branches and source-document-only crawl/derive metadata while keeping supported article actions and linked-event presentation.
- [x] 2.4 Rasoat page copy, empty states, buttons, breadcrumbs, and toast text so the feature presents itself entirely as `news-articles` / `news article` rather than `source-documents`.

## 3. Navigation and legacy compatibility

- [x] 3.1 Update `config/site.ts` so content navigation points to `/news-articles` and uses the new news-article permission helper surface for visibility.
- [x] 3.2 Convert `/source-documents` and `/source-documents/[id]` into redirects to the corresponding `/news-articles*` canon routes.
- [x] 3.3 Rasoat imports, internal links, and canon references inside the feature so new code no longer treats `SourceDocument*` as the primary implementation.

## 4. Artifact traceability alignment

- [x] 4.1 Update event evidence definitions and event-detail rendering to parse backend `artifact*` fields, use `newsOutletName`, and link readable `NEWS_ARTICLE` evidence to `/news-articles/{artifactId}`.
- [x] 4.2 Update market-query definitions and workbench evidence rendering to use artifact naming and canon article drilldowns instead of `sourceDocument*` fields and `/source-documents/{id}` links.
- [x] 4.3 Update graph-view definitions, labels, metadata fields, node/edge kinds, and drilldown behavior from `source-document` / `source-document-event` to `news-article` / `source-artifact-event`.

## 5. Documentation and verification

- [x] 5.1 Update `docs/APIMAPPING.md` so `news-articles` is documented as the canon frontend surface and `source-documents` is called out as legacy compatibility only.
- [x] 5.2 Verify list, detail, operator actions, navigation visibility, legacy redirects, and cross-feature article drilldowns against the migrated behavior.
- [x] 5.3 Run lint, typecheck, and build for the changed scope, and note any unrelated blockers if they prevent a fully green verification pass.
