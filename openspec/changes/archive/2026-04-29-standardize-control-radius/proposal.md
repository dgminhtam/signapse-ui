## Why

Primary controls currently inherit the shadcn default `rounded-md`, but the intended Signapse control language is slightly softer: buttons, inputs, selects, textareas, and input groups should share a `rounded-lg` control radius. This should be handled once at the primitive layer instead of adding page-level `rounded-lg` overrides that will drift over time.

## What Changes

- Standardize core control primitives in `components/ui/` to use `rounded-lg`:
  - `Button`
  - `Input`
  - `SelectTrigger`
  - `Textarea`
  - `InputGroup`
- Keep internal `InputGroupInput` and `InputGroupTextarea` controls `rounded-none` so the outer input group wrapper owns the radius.
- Keep small menu/list interactive primitives such as dropdown items and select items on their current compact radius treatment.
- Do not update feature pages, shared app surfaces, table shells, skeleton shells, graph workbench surfaces, market workbench surfaces, or `AGENTS.md` in this change.
- Do not change `--radius` in `app/globals.css`; this change should not pull Card, Dialog, Table, or other surface radius through the global token scale.

Out-of-scope cleanup notes to preserve for later:

- `components/app-list-table.tsx` currently uses `rounded-md` for the shared table surface while pagination/footer surfaces use `rounded-xl`. That is a table/list surface alignment issue, not a control primitive issue.
- Some older page skeleton/table shells still self-build `rounded-md border`, for example `app/(main)/blogs/page.tsx`, `app/(main)/cronjobs/page.tsx`, and `app/(main)/ai-provider-configs/page.tsx`. Those should be handled by list/table skeleton surface cleanup, not by this control-radius change.
- Graph and market workbench screens contain large or arbitrary radius values such as `rounded-[24px]`, `rounded-[30px]`, and `rounded-[36px]`. Those belong to screen-specific visual direction and should not be mixed into this list/form control cleanup.

## Capabilities

### New Capabilities
- `shared-control-radius`: Defines the default radius contract for reusable form and action controls composed from shadcn primitives.

### Modified Capabilities
- None.

## Impact

- Affected code: `components/ui/button.tsx`, `components/ui/input.tsx`, `components/ui/select.tsx`, `components/ui/textarea.tsx`, and `components/ui/input-group.tsx`.
- Affected UX: form controls, toolbar controls, action buttons, select triggers, textareas, and input groups become visually softer and more consistent.
- Out of scope: `AGENTS.md`, `app/globals.css`, `components/app-list-table.tsx`, `components/app-pagination-controls.tsx`, feature page skeletons, graph view, market query workbench, backend APIs, routing, auth, DTOs, validation behavior, and query params.
