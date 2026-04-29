## 1. Scope Audit

- [x] 1.1 Audit active create routes under `app/(main)` that render forms and exclude redirect-only routes.
- [x] 1.2 Audit active update routes under `app/(main)` that render forms and exclude detail-only or workbench routes.
- [x] 1.3 Classify each form as simple, typical, or dense to choose `max-w-xl`, `max-w-2xl`, or `max-w-3xl`.
- [x] 1.4 Record existing submit, cancel/reset, redirect, refresh, permission, toast, and pending behavior for each migrated form before editing.

## 2. Shared Form Shell And Guidance

- [x] 2.1 Add or reuse a small shared form-shell helper outside `components/ui` if it reduces repeated markup without hiding form behavior.
- [x] 2.2 Ensure the shell supports header title, description, body content, footer actions, responsive width, and custom class names.
- [x] 2.3 Update `AGENTS.md` create/update page guidance to require the focused form shell pattern.
- [x] 2.4 Update `AGENTS.md` review expectations and feature checklist for create/update form shell, footer actions, skeleton parity, and Vietnamese copy.

## 3. Create Form Migration

- [x] 3.1 Migrate topic create form to the focused form shell if the route is active.
- [x] 3.2 Migrate system prompt create form to the focused form shell.
- [x] 3.3 Migrate news outlet create form to the focused form shell.
- [x] 3.4 Migrate blog create form to the focused form shell.
- [x] 3.5 Migrate cronjob create form to the focused form shell.
- [x] 3.6 Migrate AI provider config create form to the focused form shell.
- [x] 3.7 Migrate any additional active create forms discovered during audit.

## 4. Update Form Migration

- [x] 4.1 Migrate topic update form to the focused form shell if the route is active.
- [x] 4.2 Migrate system prompt update form to the focused form shell.
- [x] 4.3 Migrate news outlet update form to the focused form shell.
- [x] 4.4 Migrate blog update form to the focused form shell.
- [x] 4.5 Migrate cronjob update form to the focused form shell.
- [x] 4.6 Migrate AI provider config update form to the focused form shell.
- [x] 4.7 Migrate any additional active update forms discovered during audit.

## 5. Behavior And Copy Preservation

- [x] 5.1 Preserve pending submit `Spinner` and disabled submit behavior across all migrated forms.
- [x] 5.2 Preserve cancel/reset safety for update forms and safe navigation for create forms.
- [x] 5.3 Preserve successful submit `router.push()` and `router.refresh()` behavior where currently used.
- [x] 5.4 Ensure user-facing copy touched by the migration is professional Vietnamese and does not mix English labels unless technically necessary.
- [x] 5.5 Remove dead action-row wrappers, duplicate headings, and unused imports created by the migration.

## 6. Loading And Verification

- [x] 6.1 Update create/update skeletons or suspense fallbacks to mirror the focused form shell where those fallbacks exist.
- [x] 6.2 Run grep checks for active create/update form pages still missing the focused form shell.
- [x] 6.3 Run grep checks for old ad hoc form action rows that should have moved into shell footers.
- [x] 6.4 Run `pnpm typecheck`.
- [x] 6.5 Run `pnpm build` if the implementation touches most active form screens.
- [x] 6.6 Smoke inspect representative create and update forms if a local authenticated session is available.
