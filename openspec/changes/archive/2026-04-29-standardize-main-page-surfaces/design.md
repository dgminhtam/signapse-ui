## Context

The protected app shell already gives users page identity through `AppBreadcrumb` in `app/(main)/layout.tsx`. Many pages still repeat the same identity inside a full-width `Card` using `CardHeader`, `CardTitle`, `CardDescription`, `Separator`, and `CardContent`.

That pattern worked as a simple baseline, but it now competes with newer app-level surfaces:

- list pages already have shared toolbar, table, and pagination surfaces
- detail pages often have their own content panels and metadata groups
- tool pages such as market query and graph view benefit from an unframed workspace
- breadcrumb labels become more important as the stable page name once duplicated card titles are removed

The repository also has an active cleanup preference: avoid compatibility layers, remove unused imports, and encode final rules in `AGENTS.md` so new pages do not drift back to the old pattern.

## Goals / Non-Goals

**Goals:**
- Remove the top-level main `Card` shell from every active `app/(main)` page that only uses it to frame the whole page.
- Make breadcrumbs the primary page identity for pages where the removed card header only repeated the route name.
- Keep meaningful inner `Card` usage for contained UI: dashboard metric cards, forms, detail panels, access-denied/error blocks, and repeated content items.
- Replace `CardContent`-driven page padding with cardless workspace spacing that composes directly with existing page-level layout padding.
- Clean all unused imports and dead wrappers created by removing `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `Separator` from main shells.
- Update `AGENTS.md` and review expectations to enforce the final convention.
- Apply the change to all matching pages in one pass rather than staging by feature.

**Non-Goals:**
- Do not change backend APIs, auth, permissions, data fetching, routing, or query parameter behavior.
- Do not modify shadcn primitives in `components/ui`.
- Do not redesign individual form fields, table columns, row actions, or business flows.
- Do not remove `Card` globally; only remove the main page shell usage when it is decorative or duplicative.
- Do not preserve a compatibility wrapper for the old `Card > CardHeader > Separator > CardContent` page pattern.

## Decisions

### 1. Use a cardless workspace as the default page composition

Active `app/(main)` pages should render their primary content directly inside the layout-provided content area. List pages should typically become:

```text
<Suspense fallback={...}>
  <FeatureListContent />
</Suspense>
```

with the list component owning toolbar, table, and pagination surfaces.

Rationale: the parent layout already provides page padding and the app header provides route identity. Keeping one large card around the entire page adds a redundant layer around surfaces that already have visual boundaries.

Alternative considered: restyle the main `Card` into a lighter `AppPageSurface`. Rejected because the user's preferred direction is to remove the main card entirely, and the card still duplicates the page identity problem even if visually lighter.

### 2. Treat breadcrumbs as the canonical page title for simple pages

When a removed `CardTitle` only repeats the route name, the breadcrumb label becomes the visible page name. Breadcrumb mappings must be corrected during migration if they are stale, generic, or inconsistent with the actual product language.

Rationale: removing duplicated page headers is only safe if breadcrumbs are accurate. For example, a route like `news-articles` must not keep an outdated label such as `Tài liệu nguồn` if the active page language is `Bài viết tin tức`.

Alternative considered: keep an unframed heading on every page after removing the card. Rejected for list pages because it recreates the duplicated identity and leaves users with nearly the same vertical weight as before.

### 3. Keep inner surfaces where they create real grouping

`Card` remains valid below the page level when it groups a distinct unit of work or repeated item. Examples include:

- workspace overview statistic cards
- forms or form sections that need an editable boundary
- detail-page evidence/source panels
- access-denied or error panels when the entire workspace body is replaced
- tool workbench panels whose controls and outputs need containment

Rationale: the issue is the decorative main page frame, not the existence of cards. Removing all cards would flatten the interface too far and reduce scanability for dense detail and dashboard screens.

Alternative considered: ban all `Card` usage under `app/(main)`. Rejected because it would harm repeated dashboard items and structured detail surfaces.

### 4. Replace page-shell separators with spacing and component-owned boundaries

List and simple pages should no longer render a `Separator` just to divide a repeated page header from content. After main-card removal, content boundaries should come from the actual component surfaces: `AppListToolbar`, `AppListTable`, `AppPaginationControls`, form panels, or detail panels.

Rationale: separators were compensating for the old card header/content structure. Once that structure is removed, standalone separators often become visual debris.

Alternative considered: keep separators below a new page heading. Rejected for simple pages because the breadcrumb already provides identity and the content components already establish hierarchy.

### 5. Migrate all matching pages in one implementation pass

The apply phase should scan all `app/(main)/**/page.tsx` files for main-card shells and convert every matching page before marking the change complete. This includes list, create, edit, detail, dashboard, tool, and permission fallback variants where the card is the outer page wrapper.

Rationale: the user explicitly wants no gradual migration and no backward compatibility. A partial rollout would leave the product with two competing page languages.

Alternative considered: migrate only list pages first. Rejected because the old main-card rule is repo-wide and would continue to reappear in create/detail screens.

## Risks / Trade-offs

- [Risk] Removing headings may make some complex pages feel under-labeled -> Mitigation: keep page-local headings only where they add information that breadcrumb cannot express, such as dynamic detail titles or complex tool summaries.
- [Risk] Breadcrumb copy errors become more visible -> Mitigation: audit and correct breadcrumb mappings during the same change.
- [Risk] Some pages use the main card as an access-denied or empty permission panel -> Mitigation: replace those with a smaller meaningful panel or direct `AccessDenied` presentation, not a full-page card shell.
- [Risk] Broad migration can touch many files and expose stale imports or copy issues -> Mitigation: require grep-based cleanup plus `pnpm typecheck` and `pnpm build`.
- [Risk] Detail pages may need more visual containment than list pages -> Mitigation: remove only the outer decorative page card while keeping or introducing inner content panels where detail content needs grouping.

## Migration Plan

1. Add or reuse app-level layout helpers only if they remove meaningful duplication; do not create a compatibility wrapper for the old main-card shell.
2. Update `AGENTS.md` to replace the main-card page rule with the cardless workspace rule and review expectations.
3. Audit `app/(main)/**/page.tsx` for top-level `Card` shells.
4. Convert all matching pages in one pass, preserving data fetching, permission checks, `Suspense`, skeletons, and existing business behavior.
5. Correct breadcrumb labels that now provide the primary page identity.
6. Remove unused `Card*` and `Separator` imports and any dead page-wrapper components left by the migration.
7. Run `pnpm typecheck` and `pnpm build`.
8. Verify no active page still uses `Card > CardHeader > Separator > CardContent` as a main shell.

Rollback is UI-local: restore the previous page wrappers from version control if needed. There are no backend or data migrations.

## Open Questions

None blocking. During implementation, individual pages may keep a page-local heading only when the heading is dynamic or materially more informative than the breadcrumb.
