## 1. Design Source Of Truth

- [x] 1.1 Create `docs/design/DESIGN.md` and reference `docs/design/design_light.png` plus `docs/design/design_dark.png`.
- [x] 1.2 Define the `Financial Command Surface` direction in `docs/design/DESIGN.md`, including goals, non-goals, design principles, and translation rules from landing reference to admin dashboard.
- [x] 1.3 Document token direction for background, foreground, card, border, muted, accent, sidebar, chart colors, radius, shadow, and grid atmosphere.
- [x] 1.4 Document component translation rules for app shell, sidebar/header, Card shell, list table surface, toolbar, form surface, empty/loading/error states, and workbench screens.
- [x] 1.5 Document rollout order, pilot screen choices, rollback notes, and visual QA checklist in `docs/design/DESIGN.md`.
- [x] 1.6 Document intentional deviations from the reference screenshots and deferred rollout targets in `docs/design/DESIGN.md`.

## 2. Documentation-Only Scope

- [x] 2.1 Confirm this change does not modify `app/globals.css`, app layout, shared UI surfaces, feature pages, or shadcn primitives.
- [x] 2.2 Keep future token pass, app shell polish, shared surface polish, pilot screens, `AGENTS.md` updates, and visual QA as future implementation work.
- [x] 2.3 Narrow OpenSpec proposal, design, specs, and tasks to describe only the `DESIGN.md` documentation baseline.

## 3. Verification

- [x] 3.1 Run `git diff --check` for `docs/design/DESIGN.md` and OpenSpec artifacts touched by this change.
- [x] 3.2 Audit `docs/design/DESIGN.md` for mojibake.
- [x] 3.3 Validate OpenSpec apply readiness for `apply-financial-command-surface-design`.
