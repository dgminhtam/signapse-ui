## 1. News-outlet contract and permissions

- [x] 1.1 Add `app/lib/news-outlets/definitions.ts` with backend-aligned request/response types for `name`, `slug`, `description`, `homepageUrl`, `rssUrl`, `active`, and timestamp fields used by the UI.
- [x] 1.2 Add `app/lib/news-outlets/permissions.ts` and switch the feature to backend-aligned permission keys `news-outlet:read`, `news-outlet:create`, `news-outlet:update`, and `news-outlet:delete`.
- [x] 1.3 Add `app/api/news-outlets/action.ts` with authenticated list, active-list, detail, create, update, toggle-active, and delete actions that call `/news-outlets*`.

## 2. Canon route and UI migration

- [x] 2.1 Add the protected canon route tree under `app/(main)/news-outlets/*` for list, create, detail-edit, search, and any supporting components needed by the feature.
- [x] 2.2 Migrate list rendering to the news-outlet schema and remove legacy source-only UI such as `type`, ingest metadata, and `systemManaged`.
- [x] 2.3 Migrate create/edit form fields and validation to `name`, `slug`, `description`, `homepageUrl`, `rssUrl`, and `active`, using user-facing copy for `Nguon tin`.
- [x] 2.4 Gate list, create, edit, toggle, and delete affordances with the new `news-outlet:*` permissions.

## 3. Navigation and legacy compatibility

- [x] 3.1 Update `config/site.ts` so navigation points to `/news-outlets` and uses the new `news-outlet:read` permission for visibility.
- [x] 3.2 Convert `/sources`, `/sources/create`, and `/sources/[id]` into redirects to the corresponding `/news-outlets*` canon routes.
- [x] 3.3 Keep `/news-sources`, `/news-sources/create`, and `/news-sources/[id]` as redirects to the same canon `/news-outlets*` routes.
- [x] 3.4 Rasoat imports, links, button targets, breadcrumbs, and toast copy so the feature no longer presents itself as the canon `sources` implementation.

## 4. Documentation and verification

- [x] 4.1 Update `docs/APIMAPPING.md` so `news-outlets` is marked as the implemented frontend surface and `sources` is documented as legacy compatibility only.
- [x] 4.2 Verify list, create, update, toggle-active, delete, search, sort, route gating, navigation visibility, and legacy redirects against the migrated feature behavior.
- [x] 4.3 Run lint and typecheck for the changed scope, and note any unrelated pre-existing issues if they prevent a fully green verification pass.
