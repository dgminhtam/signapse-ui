## Context

After the main page-card cleanup, list toolbars are more visually exposed. Search inputs, primary actions, sort selects, and page-size selectors now sit directly in the workspace row, so small height differences are easier to notice.

The current codebase has a mix of shadcn defaults and local overrides:

- `Input` defaults to the shadcn height for normal form controls.
- `Button` default size matches normal control height, while `size="sm"` intentionally creates a compact control.
- `SelectTrigger` default size matches normal control height, while `size="sm"` intentionally creates a compact control.
- Several shared list controls previously used explicit `size="sm"` or `h-*` classes, which made them shorter or taller than search.

This change standardizes list toolbar controls by composition rather than by editing shadcn primitives.

## Goals / Non-Goals

**Goals:**
- Make primary list toolbar controls align to the default shadcn control height.
- Remove height-specific overrides from shared list toolbar controls and feature-level toolbar usage.
- Keep responsive width classes that define layout, such as `w-full sm:w-[200px]`.
- Preserve compact sizing for row actions, icon-only buttons, dialog-local controls, and pagination navigation buttons.
- Update `AGENTS.md` so future list toolbar work does not reintroduce height drift.
- Keep the implementation surgical and UI-only.

**Non-Goals:**
- Do not modify files in `components/ui`.
- Do not create a new custom height token or wrapper abstraction for every control.
- Do not redesign toolbar grouping, search behavior, sort semantics, pagination behavior, or API query parameters.
- Do not globally ban `size="sm"` or `h-*` classes outside the primary list toolbar row.
- Do not change mobile stacking behavior beyond preserving existing responsive layout.

## Decisions

### 1. Use default shadcn control height as the toolbar baseline

Primary list toolbar controls should use the default size of shadcn primitives:

```text
Input default
Button default
SelectTrigger default
```

Rationale: the defaults are already designed to align across form controls. Reusing them avoids local height math and keeps Signapse close to shadcn's expected composition model.

Alternative considered: force every toolbar control to `h-10`. Rejected because it moves away from the user's preference to use the shadcn input default and requires more overrides.

### 2. Keep wrappers responsible for layout only

`AppListToolbar`, `AppListToolbarLeading`, `AppListToolbarTrailing`, `SortSelect`, and page-size select wrappers should control arrangement, width, labels, and semantics. They should not add height classes or compact sizes to primary toolbar controls.

Rationale: shared wrappers are the easiest place for height drift to spread. Keeping them layout-only makes future feature pages less likely to accidentally diverge.

Alternative considered: introduce a shared `toolbarControlClassName` with a fixed height. Rejected because it recreates a local design token for something shadcn primitives already provide.

### 3. Treat width overrides as valid layout concerns

Classes such as `w-full`, `sm:w-[120px]`, `sm:w-[200px]`, and `lg:w-96` may remain when they define responsive toolbar width.

Rationale: height consistency should not erase the product's responsive layout conventions. Search and select width rules solve a different problem than control height.

Alternative considered: remove all trigger class overrides. Rejected because width consistency for sort and page-size controls is still useful and already encoded in current list layouts.

### 4. Scope compact sizing to contexts that need density

Compact sizes remain allowed for:

- row actions
- icon-only controls
- pagination navigation buttons
- dialog-local controls
- dense metadata or evidence controls where the surrounding UI is intentionally compact

Rationale: the issue is primary toolbar alignment. Applying the same rule globally would make dense controls feel oversized and create unnecessary churn.

Alternative considered: replace every `size="sm"` in the app. Rejected because it is broader than the UX problem and would violate the surgical-change guardrail.

## Risks / Trade-offs

- [Risk] Some toolbar controls may still receive height classes through feature-level `className` props -> Mitigation: audit shared wrappers and list-page usages for `h-*`, `min-h-*`, and `size="sm"` in primary toolbar contexts.
- [Risk] Default shadcn height may feel slightly denser than the previous `h-10` experiment -> Mitigation: align with the user's stated preference and keep spacing through toolbar gaps instead of control height.
- [Risk] Reviewers may over-apply the rule to row actions -> Mitigation: document allowed compact contexts in `AGENTS.md`.
- [Risk] Visual regressions could appear on mobile if width classes are removed accidentally -> Mitigation: preserve width-only classes during implementation.

## Migration Plan

1. Audit `components/ui/input.tsx`, `components/ui/button.tsx`, and `components/ui/select.tsx` only to confirm default sizing; do not edit them.
2. Update shared toolbar/select wrappers to remove primary-toolbar height overrides and compact select sizes.
3. Audit list pages for feature-level toolbar controls that pass height-specific classes or compact button/select sizes.
4. Preserve width-only overrides and existing toolbar layout classes.
5. Update `AGENTS.md` with toolbar control height guidance and review expectations.
6. Run grep checks for height overrides in primary toolbar contexts.
7. Run `pnpm typecheck`.

Rollback is UI-local: restore prior wrapper classes if the default shadcn height is rejected after visual review. No backend, data, or route changes are involved.

## Open Questions

None blocking.
