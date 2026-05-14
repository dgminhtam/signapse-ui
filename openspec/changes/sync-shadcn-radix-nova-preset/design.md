## Context

The project is a Next.js admin dashboard that uses shadcn/ui wrappers from `@/components/ui/`. Recent dialog work exposed a style mismatch: the app had shadcn wrappers and feature compositions that looked close to shadcn, but not to the current shadcn site because the project was mixing prior Vega/New York/custom treatments with a newer Nova visual baseline.

The current shadcn project context now resolves to `style=radix-nova`, `base=radix`, neutral theme, and lucide icons. A full dry-run against the installed UI inventory reports that many wrappers are already identical, while these wrappers still differ from the `radix-nova` registry output: `breadcrumb`, `card`, `drawer`, `dropdown-menu`, `empty`, `select`, `switch`, `textarea`, `alert-dialog`, `dialog`, `pagination`, `sheet`, `field`, `input-group`, and `sidebar`.

`AGENTS.md` already requires shadcn wrappers and forbids direct primitive imports in app code, but some rules still encode local assumptions such as forcing toolbar/default control heights or allowing wrapper-level fixes. Those rules need to move from "match a chosen local density" to "use the preset default unless layout or semantic size requires otherwise."

## Goals / Non-Goals

**Goals:**

- Make `radix-nova` the single shadcn preset baseline for wrapper chrome.
- Sync installed `components/ui/*` wrappers that still differ from `radix-nova`.
- Update `AGENTS.md` so future work avoids height, radius, padding, color, border, and shadow overrides on shadcn primitives in feature code.
- Preserve business behavior, app-specific layouts, Vietnamese feature copy, authentication/data flows, and existing shadcn-only composition rules.
- Make verification practical with shadcn dry-run/diff, typecheck, lint, and browser smoke of representative surfaces.

**Non-Goals:**

- Do not redesign feature workflows or change backend API mapping.
- Do not migrate from Radix base to Base UI.
- Do not change global theme/sidebar/chart tokens beyond what the `radix-nova` preset already requires.
- Do not introduce external UI libraries outside the shadcn workflow.
- Do not refactor unrelated feature code unless it directly breaks after wrapper sync or contains visual override drift in touched surfaces.

## Decisions

### Use CLI-reviewed preset sync as the source of truth

Use `pnpm dlx shadcn@latest add <component> --dry-run` and `--diff` to identify wrapper differences, then sync the wrapper to the reviewed `radix-nova` output. This is preferable to manual class-by-class patching because the wrapper code is the design-system source, not feature code.

Alternative considered: continue hand-editing only the visibly wrong wrappers. That would keep the current UI moving, but it leaves the project in a half-synced state where future components can drift again.

### Keep app code layout-only where possible

Feature code should pass semantic shadcn variants/sizes and layout constraints, not visual chrome overrides. Width, max-width, flex/grid, overflow, max-height, truncation, and responsive placement remain valid because those are about the feature layout, not the primitive's visual identity.

Alternative considered: ban all `className` on shadcn primitives. That is too rigid for dense admin screens, dialogs, and tables where layout constraints are necessary.

### Treat `components/ui/*` as managed wrapper code

Wrapper internals can import Radix primitives because they are shadcn wrappers. App and feature code should not import Radix directly. Bugs such as hydration issues or feature layout issues should be fixed at usage sites. Wrapper edits should be reserved for shadcn preset sync or explicit wrapper changes.

Alternative considered: allow small wrapper tweaks for local product polish. That makes the preset less reproducible and undermines the user's goal of using the preset completely.

### Update guidance before broad feature cleanup

`AGENTS.md` should be updated in the same change as wrapper sync so future work reviews against the new baseline. Feature cleanup beyond touched surfaces can then happen incrementally, guided by the new review rules.

Alternative considered: clean every usage of `h-*` or `rounded-*` in one pass. That risks scope creep because some classes may be layout constraints or compact contexts, not style drift.

## Risks / Trade-offs

- Wrapper sync changes shared primitives across the app -> mitigate with a full `pnpm typecheck`, targeted lint, and browser smoke on representative overlays, form controls, sidebar, select/dropdown, sheet/drawer, and pagination.
- Nova defaults may be denser than prior local expectations -> mitigate by using shadcn variants/sizes for intentional compact contexts instead of hard-coded visual classes.
- Some wrapper diffs may include generated accessibility text or import ordering differences -> mitigate by reviewing diffs and documenting any intentional non-visual exception.
- Existing active OpenSpec changes may touch the same files -> mitigate by checking `git status`, avoiding unrelated reversions, and applying wrapper sync as a clearly scoped baseline change.

## Migration Plan

1. Confirm `components.json` reports `radix-nova` and shadcn info resolves the expected preset.
2. Run dry-run for the installed component inventory and capture the wrappers that still report `overwrite`.
3. Apply or smart-merge the reviewed `radix-nova` wrapper diffs for the affected `components/ui/*` files.
4. Update `AGENTS.md` to make `radix-nova` preset conformance and layout-only app overrides explicit.
5. Audit touched feature/shared usages for visual override drift caused or exposed by wrapper sync, and remove only directly related overrides.
6. Verify with typecheck, lint, and focused browser smoke.

Rollback is a normal git revert of this change's files. Because the change is frontend wrapper and guidance only, no data migration or backend rollback is required.

## Open Questions

- Whether upstream shadcn wrapper accessibility labels such as built-in close text should remain exactly as generated or be localized only at feature usage sites. The implementation should prefer preset fidelity unless a visible or assistive user-facing requirement requires a documented exception.
