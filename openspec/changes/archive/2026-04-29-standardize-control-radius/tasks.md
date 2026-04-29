## 1. Primitive Audit

- [x] 1.1 Audit `components/ui/button.tsx` for visible `Button` radius classes and variant-specific radius classes.
- [x] 1.2 Audit `components/ui/input.tsx`, `components/ui/select.tsx`, and `components/ui/textarea.tsx` for visible control radius classes.
- [x] 1.3 Audit `components/ui/input-group.tsx` to distinguish the wrapper radius from inner `rounded-none` controls.
- [x] 1.4 Confirm no `app/globals.css`, `AGENTS.md`, app page, graph, market, table, pagination, or skeleton surface changes are needed for this scope.

## 2. Control Radius Update

- [x] 2.1 Change the default visible `Button` radius from `rounded-md` to `rounded-lg` in `components/ui/button.tsx`.
- [x] 2.2 Change `Input`, `SelectTrigger`, and `Textarea` visible radius from `rounded-md` to `rounded-lg`.
- [x] 2.3 Change the `InputGroup` wrapper visible radius from `rounded-md` to `rounded-lg`.
- [x] 2.4 Preserve `InputGroupInput` and `InputGroupTextarea` as `rounded-none`.
- [x] 2.5 Preserve compact menu/list item radius and avoid broad primitive-wide `rounded-md` replacement outside the listed controls.

## 3. Scope Guard

- [x] 3.1 Verify `AGENTS.md` was not changed by this implementation.
- [x] 3.2 Verify `app/globals.css` was not changed.
- [x] 3.3 Verify app pages and shared app surfaces outside `components/ui/` were not changed by this implementation.

## 4. Verification

- [x] 4.1 Run grep checks for the expected `rounded-lg` control primitive classes and preserved `rounded-none` input-group internals.
- [x] 4.2 Run `pnpm typecheck`.
- [x] 4.3 Smoke inspect representative controls if a local authenticated session is available. Local authenticated session was not available in this run, so verification is limited to grep checks and typecheck.
