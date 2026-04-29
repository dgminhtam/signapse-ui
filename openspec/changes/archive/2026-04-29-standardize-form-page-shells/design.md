## Context

The app has moved protected pages to cardless workspace composition, with breadcrumbs acting as the primary page identity. Create and update forms still need a meaningful task boundary, because users are entering or changing data and need a clear submit/cancel zone.

The reference layout is a focused card:

```text
Form surface
├─ Header: task title + short description
├─ Body: fields, sections, repeatable rows, helper text
└─ Footer: secondary action + primary submit
```

This should not be treated as the old main page card. The old main card duplicated the route title and wrapped every page. The new form shell is an inner surface that groups a single create/update task.

Current form implementation is mixed:

- some pages render form components directly in the workspace
- some forms own their own submit/cancel row without a shared footer treatment
- some forms have useful `FieldGroup` structure but inconsistent surface width and action placement
- some user-facing copy still needs Vietnamese cleanup during migration

## Goals / Non-Goals

**Goals:**
- Migrate all active create/update CRUD screens in `app/(main)` to a focused form shell.
- Keep the shell as an inner, meaningful form surface rather than a page-level title card.
- Use a consistent shell structure: header, body, footer.
- Make footer actions predictable: cancel/secondary action plus primary submit.
- Preserve all existing data, validation, pending, cancel, redirect, refresh, permission, and API behavior.
- Update `AGENTS.md` create/update form guidance, review expectations, and completion checklist.
- Keep UI copy touched by the migration professional Vietnamese.
- Apply in one pass rather than gradually.

**Non-Goals:**
- Do not redesign list pages, table surfaces, pagination, detail-only pages, dashboards, graph view, or market query workbench.
- Do not change backend APIs, DTO schemas, auth, permission checks, route params, or query params.
- Do not change the control primitive radius/height contract.
- Do not add a compatibility wrapper for the old main-card page shell.
- Do not force every form into the same width if the data density needs a larger shell.
- Do not add sticky footer behavior unless a specific form needs it.

## Decisions

### 1. Use a focused form shell as the default create/update pattern

Active create/update pages should render a centered or left-aligned constrained form surface inside the cardless workspace.

Suggested structure:

```tsx
<section className="w-full max-w-2xl overflow-hidden rounded-xl border bg-card">
  <header className="px-6 pt-6">
    <h1>...</h1>
    <p>...</p>
  </header>
  <form>
    <div className="px-6 py-5">...</div>
    <footer className="flex ... border-t bg-muted/20 px-6 py-4">...</footer>
  </form>
</section>
```

Rationale: the form surface creates a clear task boundary while respecting the cardless page convention. It mirrors the reference layout without reintroducing repeated page-level chrome.

Alternative considered: keep forms directly in the workspace. Rejected because action rows and form density remain inconsistent across create/update pages.

### 2. Keep title/description inside the form shell but do not duplicate breadcrumbs unnecessarily

The shell header should describe the task, such as `Tạo nguồn tin`, `Chỉnh sửa cronjob`, or `Cấu hình nhà cung cấp AI`. It should include a short description only when it helps the user understand the action.

Rationale: breadcrumbs identify the route; the form header clarifies the task and reduces ambiguity for create vs update screens.

Alternative considered: no local header. Rejected because create/update forms benefit from task framing and instructions near the fields.

### 3. Let form complexity choose width within a bounded scale

Use width intentionally:

- simple forms: `max-w-xl`
- typical CRUD forms: `max-w-2xl`
- denser forms or text-heavy editors: `max-w-3xl`

Rationale: the reference card is compact, but some Signapse forms include long prompts, API keys, code-like fields, or generated model pickers. One width would either crowd complex forms or make simple forms too wide.

Alternative considered: force every form to `max-w-xl`. Rejected because it would harm prompt/blog/AI-provider workflows.

### 4. Use one shell, internal sections, and one footer action zone

Long forms should use internal section headings, dividers, `FieldSet`, or grouped fields inside the same shell. Avoid nested `Card` components only to get border/radius. The primary submit and cancel/reset action should live in the footer.

Rationale: a single action zone gives users a predictable finish point. Internal sectioning preserves scanability without adding visual clutter.

Alternative considered: multiple cards per form section. Rejected as the default because it fragments one create/update task.

### 5. Preserve current form behavior first

Migration should avoid changing business logic. Existing `router.push()`, `router.refresh()`, form reset/cancel behavior, pending spinner, disabled submit, Zod resolver workarounds, permission checks, and toasts should remain equivalent except where copy must become Vietnamese.

Rationale: this is a layout standardization pass, not a form behavior rewrite.

Alternative considered: redesign form flows while migrating layout. Rejected because it increases regression risk and makes verification harder.

## Risks / Trade-offs

- [Risk] Some long forms may feel cramped inside a card -> Mitigation: allow `max-w-3xl` and internal sections for dense forms.
- [Risk] Footer actions may duplicate existing submit rows during migration -> Mitigation: remove old action rows as each form moves into the shell.
- [Risk] Page skeletons may still mirror old layouts -> Mitigation: update skeletons/fallbacks for migrated create/update pages to match the focused shell.
- [Risk] User-facing copy drift may remain in older forms -> Mitigation: clean touched title, description, button, toast, and field helper copy to professional Vietnamese.
- [Risk] Broad migration touches many files -> Mitigation: audit active create/update routes first, preserve behavior, then run `pnpm typecheck` and optional `pnpm build`.

## Migration Plan

1. Update `AGENTS.md` with create/update focused form shell guidance and review expectations.
2. Audit active create/update routes and form components under `app/(main)`.
3. Exclude redirects, list pages, detail-only pages, graph/market workbenches, dialogs, and permission management screens unless they directly render create/update CRUD forms.
4. Introduce or reuse a small shared form-shell helper outside `components/ui` if it reduces repeated markup without hiding form behavior.
5. Migrate active create forms.
6. Migrate active update forms.
7. Update skeletons and suspense fallbacks to mirror the focused shell where present.
8. Remove old action-row wrappers and dead imports created by the migration.
9. Run grep checks for active create/update pages still missing the focused form shell.
10. Run `pnpm typecheck`; run `pnpm build` if the touched set is broad enough to justify it.

Rollback is UI-local: restore previous form wrappers/action rows from version control. No backend or data migration is involved.

## Open Questions

None blocking. During implementation, each form may choose `max-w-xl`, `max-w-2xl`, or `max-w-3xl` based on field density.
