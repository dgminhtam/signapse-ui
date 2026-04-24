## Context

The previous `refine-list-control-hierarchy` change standardized the controls around list tables, but it intentionally did not redesign the table surface itself. As a result, Signapse still has multiple list-table patterns in active screens:

- some pages wrap the table in a plain bordered `div`
- some pages use a nested `Card` only to get clipping and radius behavior
- some pages render a muted header row while others render a transparent header row
- empty states all use `<Empty>`, but with different padding, centering, and visual weight
- several skeletons still suggest a different table shell than the screen actually renders

This drift is visible in active pages such as `blogs`, `cronjobs`, `roles`, and `ai-provider-configs`, while `events`, `news-outlets`, and `source-documents` already use the newer toolbar and footer composition. The underlying `Table` primitive in `components/ui/table.tsx` deliberately does not own table-shell styling, so consistency has to come from app-level composition rather than from the primitive itself.

Important constraints:

- shared UI must continue to be composed outside `components/ui`
- existing toolbar and pagination behavior from earlier changes must remain intact
- user-facing copy on adopted pages must remain professional Vietnamese
- `topics` and legacy `sources` routes are not good first-wave targets because one is hidden and the other redirects
- repo guidance needs to encode the final table rules in `AGENTS.md` so new pages do not drift again

## Goals / Non-Goals

**Goals:**

- Establish one reusable surface pattern for admin list tables.
- Make header radius, border ownership, and clipping behavior consistent across adopted pages.
- Standardize in-table empty states so empty-result screens feel like part of the table system rather than ad hoc page content.
- Align list-page skeletons with the final table shell and header treatment.
- Capture the final table rules and review expectations in `AGENTS.md`.

**Non-Goals:**

- Redesign toolbar hierarchy, pagination behavior, or list search semantics.
- Replace feature-owned column definitions or row content with a generic data-table abstraction.
- Change backend sorting, filtering, paging, or DTO contracts.
- Migrate hidden or redirected legacy list pages in the first wave.
- Modify shadcn primitive source files under `components/ui`.

## Decisions

### 1. Introduce an app-level shared table-surface composition layer

The change should add shared composition components for list-table surfaces outside `components/ui`. The shared layer owns the outer shell styling, clipping, and shared header/empty-state affordances, while each feature page continues to own its table columns, row content, and row-level actions.

This keeps the abstraction focused on the part that is currently drifting: the surface around the data, not the data mapping itself.

Alternatives considered:

- Push shell styling into `components/ui/table.tsx`.
  Rejected because the repo explicitly avoids modifying shadcn primitives for app-specific presentation concerns.
- Build one generic schema-driven table component.
  Rejected because list pages still vary too much in row density, cell composition, and actions, and the current problem is surface inconsistency rather than lack of a generic table engine.

### 2. Standardize header treatment through the shared surface, not per-page class choices

Adopted list pages should stop choosing between transparent, `bg-muted`, and nested-card header treatments independently. The shared surface should define one baseline header presentation and rely on shell clipping so the header visually belongs to the same rounded container on every page.

This addresses the specific perception that header radius and border behavior are currently inconsistent.

Alternatives considered:

- Keep header styling page-owned and only document preferred classes.
  Rejected because the repo already has guidance, and the drift still happened.
- Standardize only the shell and let header rows continue to vary.
  Rejected because header styling is one of the main inconsistencies users notice first.

### 3. Standardize the in-table empty state with a shared adapter

Adopted pages should render empty results through a shared in-table pattern that wraps `<Empty>` inside the correct `TableRow` and `TableCell` structure with consistent spacing and alignment. The helper should preserve feature-owned iconography and copy while standardizing the surface rhythm and placement.

This keeps the repo rule of using `<Empty>` while avoiding per-page `py-12` versus `py-24` drift.

Alternatives considered:

- Leave empty states page-owned and only standardize copy.
  Rejected because the visual inconsistency is about structure and spacing as much as wording.
- Render empty states outside the table surface.
  Rejected because it weakens column alignment and makes the list feel like it changes layout when empty.

### 4. Keep skeletons page-local, but bind them to the shared table-surface contract

The change should not introduce a single universal table skeleton component. Instead, each adopted page should update its local skeleton so it mirrors the shared shell, header treatment, and footer layout that the final screen uses.

This preserves flexibility for different column sets while still solving the current mismatch problem.

Alternatives considered:

- Create one shared list-table skeleton for every page.
  Rejected because the repo has too much variation in column count and cell content for that to age well.
- Ignore skeletons in this change.
  Rejected because inconsistent loading states are part of the table-surface problem already visible in production screens.

### 5. Treat `AGENTS.md` as part of the rollout, not as optional documentation

This change should explicitly update `AGENTS.md` with table rules and review expectations. The guidance needs to define the expected shared shell, header consistency, in-table empty state pattern, and skeleton parity so future features are reviewed against the same standard.

Alternatives considered:

- Rely on the shared component alone without changing repo guidance.
  Rejected because previous drift already showed that code-only conventions are not enough in this repository.

### 6. Roll out to active list pages first

The first wave should target active list pages that users can currently reach and that represent the major variations in the repo: simple list pages, dense operational pages, and pages already migrated to the new toolbar/footer hierarchy.

Recommended first-wave pages:

- `app/(main)/events/event-list.tsx`
- `app/(main)/news-articles/news-article-list.tsx`
- `app/(main)/news-outlets/news-outlet-list.tsx`
- `app/(main)/ai-provider-configs/ai-provider-config-list.tsx`
- `app/(main)/blogs/blog-list.tsx`
- `app/(main)/cronjobs/cronjob-list.tsx`
- `app/(main)/roles/role-list.tsx`

Deferred in first wave:

- `topics`, because the route is currently hidden
- legacy `sources` and `source-documents`, because those routes now redirect to canon surfaces

## Risks / Trade-offs

- [The shared table API becomes too heavy] -> Keep it surface-focused and slot-based, not data-schema-driven.
- [Some pages need minor exceptions for dense content] -> Allow page-owned cell content and column widths while keeping shell, header, and empty-state structure shared.
- [Skeletons still drift after rollout] -> Add explicit `AGENTS.md` review rules so skeleton parity is enforced in future review passes.
- [Legacy pages remain inconsistent] -> Limit the first wave to active pages and treat hidden or redirected pages as separate cleanup work if they return.
- [Header style choice becomes contentious] -> Centralize it in the shared component so changes happen once instead of through repeated per-page tweaks.

## Migration Plan

1. Introduce shared app-level composition for list-table shell, header, and in-table empty-state structure.
2. Migrate active list pages to the shared table surface without changing toolbar or pagination query semantics.
3. Update the local skeletons for adopted pages so loading states match the final table surface.
4. Update `AGENTS.md` with table rules and review expectations tied to the new shared pattern.
5. Verify active pages for consistent shell, header, empty-state, and skeleton presentation across desktop and mobile.

Rollback:

- Revert the shared table-surface components and page-level adoptions, then restore the previous wrappers per page. Because the change is presentation-only, rollback is UI-local and does not require backend coordination.

## Open Questions

None blocking the proposal. If a later feature needs a specialized table surface, that should be treated as a narrow override of the shared surface rather than a second default pattern.
