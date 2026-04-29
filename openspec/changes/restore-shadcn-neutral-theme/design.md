## Context

The project uses shadcn/ui with Tailwind CSS v4, CSS variables, `style: "radix-vega"`, and `tailwind.baseColor` currently set to `stone` in `components.json`. In practice, `app/globals.css` is already close to the shadcn default neutral scaffold, but it has drifted in small ways: light `--sidebar-accent` was darkened, dark `--sidebar-primary` still carries the default blue/purple high-emphasis sidebar token, and the config still says `stone`.

That mismatch became visible when the app-level sidebar selected state started using `sidebar-primary`. The result looked inconsistent because the app visual direction is mostly monochrome while a leftover default sidebar token became prominent. The goal is to stop piecemeal token edits and return to one known baseline: the shadcn neutral default theme scaffold.

## Goals / Non-Goals

**Goals:**
- Make `components.json` and `app/globals.css` agree on shadcn neutral default.
- Restore shadcn neutral default token values for global, chart, and sidebar tokens.
- Restore default shadcn sidebar color semantics: `sidebar-accent` owns hover/open/selected row treatment unless a future proposal intentionally changes that behavior.
- Keep custom density/spacing improvements in `components/app-sidebar.tsx` if they do not conflict with the default color model.
- Add a durable `AGENTS.md` rule that prevents future silent theme drift.

**Non-Goals:**
- Do not redesign the visual identity beyond returning to the shadcn neutral baseline.
- Do not edit shadcn primitives in `components/ui/`.
- Do not change graph/workbench arbitrary-radius visual direction, chart usage, or page-level layout work.
- Do not introduce a custom brand palette or new theme token family.
- Do not change routing, API behavior, permissions, form logic, or table behavior.

## Decisions

1. Use shadcn neutral default as the theme baseline.

The current `globals.css` most closely matches shadcn neutral, not stone. Changing `components.json` to `neutral` makes the declared base color match the actual CSS baseline and reduces ambiguity for future shadcn CLI use.

2. Restore default tokens rather than only patching `--sidebar-primary`.

Only changing the dark `--sidebar-primary` would hide the immediate blue/purple symptom, but it would leave the project in a mixed custom/default state. Restoring the whole neutral scaffold gives a clean, auditable baseline and makes future deviations intentional.

3. Keep chart colors as shadcn default.

The shadcn default chart palette intentionally contains colors, including the same hue used by dark `--sidebar-primary`. Chart tokens are data-visualization tokens, not UI chrome tokens. They should remain default unless there is a separate chart/theme proposal.

4. Prefer default sidebar color behavior over active-primary overrides.

The shadcn sidebar primitive already uses `sidebar-accent` for hover, press, open, and selected menu rows. If the goal is "standard shadcn", the app-level `data-active:bg-sidebar-primary` override should be removed. Stronger active affordance can still come from typography, row height, and spacing.

5. Put the rule in `AGENTS.md`.

Future work should not silently darken or recolor global tokens to solve a local component issue. `AGENTS.md` should require theme baseline changes to be explicit and proposal-backed.

## Risks / Trade-offs

- [Active sidebar becomes subtler again] -> Keep the row height/radius/font improvements already handled in `AppSidebar`; if color still feels too weak, create a separate proposal rather than mutating neutral defaults.
- [Neutral default reintroduces blue/purple sidebar-primary in dark mode] -> This is expected shadcn default behavior, but selected rows should not use `sidebar-primary` after reverting the app-level override.
- [Visual design document mentions monochrome primary] -> Treat that as higher-level direction, but this change intentionally chooses shadcn neutral default as the immediate baseline before future brand decisions.
- [CLI command unavailable in sandbox] -> Use the documented shadcn neutral scaffold and current repo history as source of truth; verify with typecheck and targeted grep.

## Migration Plan

1. Update `components.json` so `tailwind.baseColor` is `neutral`.
2. Restore `app/globals.css` tokens to shadcn neutral default values, including light `--sidebar-accent`.
3. Remove app-level sidebar active color overrides that force selected rows to `sidebar-primary`; keep height/radius/spacing overrides.
4. Update `AGENTS.md` with the shadcn neutral baseline rule.
5. Run `pnpm typecheck` and `git diff --check`.
6. Smoke-check light/dark sidebar states when a browser session is available.
