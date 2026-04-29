## Context

Signapse uses shadcn/ui primitives stored in `components/ui/` with Tailwind v4 radius tokens from `app/globals.css`. Current control primitives use `rounded-md` by default:

- `Button`
- `Input`
- `SelectTrigger`
- `Textarea`
- `InputGroup`

The desired control language is slightly softer, so these reusable control primitives should use `rounded-lg`. This is intentionally a primitive-level design-system adjustment. It is not a page-by-page override pass and not a global token change.

The repo normally avoids editing `components/ui/`, but this change is explicitly scoped as a design-system primitive update. The permission is narrow: only the listed control radius classes in `components/ui/` are in scope.

## Goals / Non-Goals

**Goals:**
- Set the default radius of core control primitives to `rounded-lg`.
- Keep controls consistent everywhere they are used without feature-level `className="rounded-lg"` patches.
- Preserve `InputGroupInput` and `InputGroupTextarea` as `rounded-none` because the wrapper owns the visible radius.
- Preserve compact item radius for menu/select/dropdown items.
- Keep the change limited to `components/ui/` control primitives.

**Non-Goals:**
- Do not update `AGENTS.md`.
- Do not edit `app/globals.css` or change `--radius`.
- Do not update feature pages or shared app surfaces outside `components/ui/`.
- Do not normalize table surfaces, list skeleton shells, pagination surfaces, graph view, or market query workbench radius.
- Do not change color, spacing, height, typography, variants, behavior, accessibility attributes, APIs, routes, validation, or query params.
- Do not globally replace every `rounded-md` in `components/ui/`.

## Decisions

### 1. Change control primitive classes instead of global radius tokens

Update the visible control primitives from `rounded-md` to `rounded-lg`.

Rationale: the desired outcome is specifically softer controls. Changing `--radius` would also alter `rounded-lg`, `rounded-xl`, Cards, Dialogs, Tables, and other surfaces that should be governed separately.

Alternative considered: update `--radius` in `app/globals.css`. Rejected because the blast radius is too broad for a control-only change.

### 2. Avoid page-level control overrides

Do not add `rounded-lg` to individual inputs, buttons, select triggers, search fields, or forms.

Rationale: per-usage overrides create drift, make future audits harder, and weaken the primitive contract.

Alternative considered: patch only visible list/search controls. Rejected because it would leave forms and less visible controls on a different radius.

### 3. Preserve nested InputGroup inner radius behavior

Keep `InputGroupInput` and `InputGroupTextarea` `rounded-none`.

Rationale: the inner input lives inside an outer `InputGroup` shell. If both wrapper and inner control have radius, corners can visually double up or clip inconsistently.

Alternative considered: set all input-related primitives to `rounded-lg`. Rejected because nested control composition needs the wrapper to own the visible radius.

### 4. Keep compact menu/list item radius unchanged

Do not change dropdown items, select items, tooltip arrows, sidebar internals, or other compact interactive items as part of this proposal.

Rationale: those items are not form/action controls. Their smaller radius is tied to dense menu/list affordances and should be evaluated separately if needed.

Alternative considered: replace all primitive `rounded-md` classes. Rejected because it would overreach beyond the user's requested button/input/select/textarea control cleanup.

## Risks / Trade-offs

- [Risk] Some controls may feel larger or softer even though their height is unchanged -> Mitigation: only radius changes; verify typecheck and smoke review visually before archiving.
- [Risk] Button variant-specific radius classes may still cap small/icon sizes with `min(var(--radius-md), ...)` -> Mitigation: include button size variants in the audit and only adjust visible control radius classes needed for consistency.
- [Risk] Future shadcn updates may reintroduce `rounded-md` defaults -> Mitigation: keep the OpenSpec artifacts as the rationale for the local primitive customization.
- [Risk] Surface radius drift remains after this change -> Mitigation: explicitly defer table/list/graph/market surface cleanup to separate changes.

## Migration Plan

1. Audit the listed `components/ui/` control primitives for visible radius classes.
2. Change visible `Button`, `Input`, `SelectTrigger`, `Textarea`, and `InputGroup` radius from `rounded-md` to `rounded-lg`.
3. Keep nested `InputGroupInput` and `InputGroupTextarea` `rounded-none`.
4. Avoid editing app pages, shared list surfaces, graph view, market query, `AGENTS.md`, or global CSS.
5. Run grep checks to confirm no page-level `rounded-lg` control patches were introduced.
6. Run `pnpm typecheck`.

Rollback is straightforward: restore the changed primitive classes from `rounded-lg` to `rounded-md`. No data migration or backend change is involved.

## Open Questions

None blocking.
