## 1. Canonical Source-Document Foundation

- [x] 1.1 Create frontend `source-document` definitions that map the backend list and detail schemas, including document type, lifecycle status, content crawl status, feature image, and economic-calendar-specific fields.
- [x] 1.2 Add source-document server actions for list, detail, analyze, delete, and other supported content-management calls using `fetchAuthenticated()`.
- [x] 1.3 Introduce a permission-compatibility approach for source-document screens so the new domain can ship before backend permission naming is finalized.

## 2. Content Route Migration

- [x] 2.1 Build a canonical `/source-documents` management route that follows the repo's protected list-page structure and URL-driven filter/sort/pagination rules.
- [x] 2.2 Build a canonical `/source-documents/[id]` detail route with type-aware rendering for article-style and economic-calendar-style source documents.
- [x] 2.3 Migrate article management UI behavior into the new source-document list and detail surfaces, including analyze, delete, and external-link actions.
- [x] 2.4 Retire legacy `/articles` entry points so they no longer behave as a primary frontend domain.
- [x] 2.5 Retire legacy `/economic-calendar` entry points so economic-calendar intent is handled through source-document flows instead of removed backend APIs.
- [x] 2.6 Update sidebar navigation and related content entry points to expose the canonical source-document route and remove stale primary navigation to legacy content domains.

## 3. Source Configuration Alignment

- [x] 3.1 Align `SourceRequest`, `SourceResponse`, and source list DTOs with the backend source type and ingest metadata fields required by the current schema.
- [x] 3.2 Update source create and edit forms so authorized users can submit the supported source configuration fields with professional Vietnamese copy and proper pending feedback.
- [x] 3.3 Update source list and detail/edit surfaces to display high-signal source metadata such as source type and the latest ingest status information.
- [x] 3.4 Keep source-management behavior aligned to the current backend schema without depending on a provider-specific configuration editor.

## 4. Verification

- [ ] 4.1 Verify canonical source-document flows for list, filter, detail, analyze, delete, and legacy-route retirement.
- [ ] 4.2 Verify economic-calendar-style source documents render the expected type-specific metadata inside the source-document domain.
- [ ] 4.3 Verify source create/edit screens can load, save, and display the current backend source schema.
- [ ] 4.4 Run project validation and smoke tests for the affected routes, actions, and retired legacy entry points before closing the change.
