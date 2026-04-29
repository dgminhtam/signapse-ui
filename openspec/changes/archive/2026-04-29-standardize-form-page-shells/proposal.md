## Why

Create and update screens currently use mixed form layouts after the main-card page cleanup: some forms render directly in the workspace, some keep their own ad hoc action rows, and long forms do not share a consistent action zone. A focused form card gives these screens a clear task boundary without reintroducing the old decorative main page card.

## What Changes

- Standardize active create/update CRUD screens on a focused form shell:
  - card-like inner form surface with `rounded-xl` border
  - compact header with title and short description inside the form surface
  - form body with consistent `FieldGroup`, section spacing, and responsive two-column grids where useful
  - footer action zone with top border, subtle background, cancel/secondary action and primary submit
- Apply the pattern to all active create/update pages that render a form, not as a gradual migration.
- Keep breadcrumb as page identity, while the form shell header describes the concrete task.
- Preserve existing form behavior: validation, pending state, spinner, disabled submit, cancel/reset safety, redirect, router refresh, permissions, and API calls.
- Update `AGENTS.md` with create/update form layout rules and review expectations.
- Keep meaningful inner sections inside a single form shell instead of nesting extra cards just for border/radius.
- Keep non-form detail pages, list pages, dashboards, graph view, market query workbench, dialogs, and role permission management out of scope unless they directly render a create/update CRUD form.

## Capabilities

### New Capabilities
- `focused-form-page-shell`: Defines the standard layout contract for create/update form pages in the protected app workspace.

### Modified Capabilities
- None.

## Impact

- Affected code: active create/update page files and form components under `app/(main)`, likely including topics, system prompts, news outlets, blogs, cronjobs, AI provider configs, and any non-redirect create/update routes discovered during implementation.
- Affected docs: `AGENTS.md` create/update layout guidance, review expectations, and feature checklist.
- Affected UX: create/update forms become visually consistent, easier to scan, and more stable across loading, validation, and pending states.
- Out of scope: backend APIs, DTO contracts, auth/permissions behavior, list/table layout, detail-page content hierarchy, graph view, market query workbench, and global theme tokens.
