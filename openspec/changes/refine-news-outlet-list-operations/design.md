## Context

The `/news-outlets` list already follows the shared Signapse list structure: cardless workspace, `AppListToolbar`, `AppListTable`, toolbar page-size control, and permission-gated row actions. A recent cleanup removed `description` from the list because it belongs in the detail/edit surface.

The remaining approved refinements are list-specific. The list currently hides the effective default sort behind a placeholder, gives full homepage/RSS URLs too much weight in the primary cell, uses a switch as the only visible active-state signal, shows implementation-oriented empty copy, keeps slug as a table column, and uses icon-only actions without tooltip affordances.

## Goals / Non-Goals

**Goals:**
- Make the default sort visible in the toolbar without changing backend query semantics.
- Reduce the visual weight of raw homepage/RSS URLs while preserving access to the full values.
- Make active state readable and accessible per row.
- Keep row actions icon-only but add tooltip affordances and shadcn-compatible icon markup.
- Remove slug from the list table while preserving slug in create/edit and detail/edit flows.
- Replace backend-oriented empty-state copy with concise Vietnamese product copy.
- Keep skeleton column structure aligned with the final table layout.

**Non-Goals:**
- Do not remove homepage or RSS data from the list entirely.
- Do not change backend API fields, permissions, route names, or mutation behavior.
- Do not introduce a read-only detail route separate from the existing detail/edit route.
- Do not change global theme tokens or shadcn primitives in `components/ui`.

## Decisions

### 1. Default sort is a visible list state

The page already defaults to `sort = "id_desc"` before fetching data. The UI should expose the same default by making `SortSelect` display `Moi tao` when no `sort` query param is present.

Preferred implementation: extend `SortSelect` with a narrow optional default value prop, such as `defaultValue`, and compute `currentSort` from `searchParams.get("sort") || defaultValue || ""`. This keeps the fix reusable for other standardized list pages and avoids writing the default sort into the URL on initial render.

Alternative considered: force the page to redirect with `?sort=id_desc`. Rejected because it adds URL churn for a default state and can create extra navigation work without changing the backend result.

### 2. Primary source cell favors concise identity signals

The primary cell should help users identify the outlet quickly. Showing full raw homepage and RSS URLs consumes too much attention and width for a routine operations list.

Preferred implementation: derive concise display labels from the configured URLs. Homepage should display a readable host or host plus short path where useful, while RSS should display a compact signal such as `RSS da cau hinh` plus a secondary cue or tooltip containing the full URL. The existing external link behavior can remain available through the concise label or an icon-only/open affordance.

Full URLs should remain accessible through a tooltip, browser link target, detail/edit form, or a copy/open action. The implementation should not change the request/response contract or stop rendering RSS presence as a list-level signal.

Alternative considered: remove URLs entirely from the list. Rejected because homepage/RSS presence is still a useful operational scan signal for source setup.

### 3. Active state combines switch control and readable status

The switch remains the interaction control because it is already the mutation affordance and matches shadcn primitives. The row should also show a compact Vietnamese label such as `Dang bat` or `Tam dung`, and the switch should receive an `aria-label` that names the outlet and the action/state.

The status label should not rely on raw status colors. It can use existing semantic text treatment or a `Badge` variant if that reads better in the row density. Pending feedback stays local to the control with the existing spinner and disabled state.

### 4. Slug moves out of the list table

Slug is useful for detail/edit, troubleshooting, and payload identity, but it is not a primary list scanning signal for source operations. Removing the slug column gives more room to the source identity and state/action columns while keeping the list aligned with the "detail-only metadata stays out of list" rule.

The create/edit form and hydrated detail/edit route keep slug unchanged.

### 5. Icon-only actions remain compact but gain tooltips

Edit and delete remain icon-only row actions because the table is dense and the action column is narrow. Each action should be wrapped with the existing shadcn Tooltip composition and keep an `sr-only` label for screen readers.

Icons inside action buttons should use `data-icon` per local shadcn rules. The delete confirmation remains an `AlertDialog`.

### 6. Empty copy speaks to the user task

The empty state should explain the product task in Vietnamese, not the backend contract. It should invite adding the first source so the system can collect and process news content. No backend, API, or migration language should appear in the main workspace empty copy.

## Risks / Trade-offs

- [Risk] Adding a default value prop to `SortSelect` could affect other lists if misused. -> Mitigation: make it optional and only pass it from `/news-outlets` for this change.
- [Risk] Compact URL labels can hide important setup mistakes. -> Mitigation: keep the full URL accessible through tooltip/link target/detail-edit and preserve RSS presence as a visible signal.
- [Risk] Adding status text beside the switch can widen the active column. -> Mitigation: keep the label compact and update both table and skeleton widths together.
- [Risk] Removing the slug column reduces immediate access to technical metadata. -> Mitigation: keep slug in detail/edit where metadata belongs, and do not remove it from types or forms.
- [Risk] Tooltip composition can add markup around `AlertDialogTrigger`. -> Mitigation: use the standard shadcn composition so Tooltip wraps the trigger without breaking AlertDialog behavior.
