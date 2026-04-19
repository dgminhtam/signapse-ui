## 1. Event contract and permissions

- [x] 1.1 Add `app/lib/events/definitions.ts` with list/detail DTOs, relation summary DTOs, enrichment result DTOs, status enums, and UI label helpers from the current backend spec.
- [x] 1.2 Add `app/api/events/action.ts` with authenticated helpers for `getEvents`, `getEventById`, `enrichEventAssetsAndThemes`, and `enrichPendingEventAssetsAndThemes`, including route revalidation for list/detail pages after mutations.
- [x] 1.3 Introduce dedicated event permission helpers and refactor `app/lib/source-documents/permissions.ts` to rely only on `source-document:*` permissions, while documenting that event enrich operators use `source-document:analyze`.

## 2. Event routes and UX

- [x] 2.1 Add the protected `/events` route with Card shell, local error boundary, list component, sort/pagination controls, batch enrich action, and repo-standard empty state.
- [x] 2.2 Add the protected `/events/[id]` detail route with Card shell, back navigation, core metadata, enrichment block, assets block, themes block, evidence block, and a single-event enrich action.
- [x] 2.3 Update `config/site.ts` so the protected navigation exposes `Sự kiện` under the content group for users who have `event:read`.

## 3. Source-document traceability

- [x] 3.1 Extend `app/lib/source-documents/definitions.ts` to map `linkedEvents` and any supporting event summary types returned by `GET /source-documents/{id}`.
- [x] 3.2 Update `app/(main)/source-documents/[id]/page.tsx` to render a `Sự kiện liên kết` section with summary metadata, empty handling, and permission-aware links into `/events/{id}`.
- [x] 3.3 Keep source-document analyze, crawl, and derive controls aligned with `source-document:analyze` and verify that users with event-only permissions do not gain source-document access through stale compatibility fallbacks.

## 4. Documentation and verification

- [x] 4.1 Update `docs/APIMAPPING.md` to reflect FE ownership of the event module, linked-event traceability on source-document detail, and the current permission matrix for event read versus event enrich operators.
- [ ] 4.2 Verify list/detail rendering for events and linked events against the local backend, including empty states, badges, traceability links, and operator toasts.
- [x] 4.3 Run lint and typecheck for the changed scope, and note any unrelated pre-existing repo-wide issues that block a fully green verification pass.
