## Context

`AGENTS.md` currently declares itself a repo-wide architecture, workflow, verification, and review policy, but it also contains detailed UI rules for shadcn chrome, layout, search, pagination, overlays, content, and sidebar states. `components/AGENTS.override.md` repeats part of that guidance, while `docs/design/DESIGN.md` remains a rollout-oriented visual baseline with stale assumptions that conflict with current policy.

Agents do not automatically infer that a design document must be read, so removing UI rules from active agent instructions without adding an explicit router would weaken enforcement. The migration must therefore change both ownership and discovery while preserving technical, security, localization, and accessibility guardrails.

## Goals / Non-Goals

**Goals:**

- Give durable Signapse UI and UX conventions one authoritative home in `docs/design/DESIGN.md`.
- Require that document for both implementation and review of new or existing user-visible UI.
- Keep `AGENTS.md` concise and keep `components/AGENTS.override.md` focused on component ownership and technical boundaries.
- Reconcile the design source with Geist, `radix-nova`, cardless app pages, current shadcn wrapper policy, and existing interaction invariants.
- Preserve every product-critical UI rule while removing duplicate wording.

**Non-Goals:**

- Changing application code, UI behavior, tokens, dependencies, APIs, permissions, or localization data.
- Reorganizing `app/api/AGENTS.override.md` or `app/lib/AGENTS.override.md`.
- Creating a second design document or a new skill for rules that fit in the existing design source.
- Replacing specialized shadcn, frontend-design, accessibility, or hydration-mismatch skills.

## Decisions

### Make DESIGN the UI/UX source of truth

`docs/design/DESIGN.md` will own visual direction, theme and token constraints, page and surface composition, list/search/pagination patterns, forms and action feedback, navigation and overlays, content hierarchy, UI states, accessibility outcomes, sidebar behavior, and UI drift review criteria.

The document will retain the `Financial Command Surface` direction and reference images, but will be rewritten as durable current guidance rather than a future rollout plan. It will remove pilot routes, rollout order, deferred targets, first-pass language, and rollback history.

Alternative considered: create a separate UI conventions document and leave DESIGN as visual history. Rejected because one authoritative document is easier to discover and avoids another routing layer.

### Route every UI implementation and review to both sources

The root scoped-instruction router will require agents implementing or reviewing any user-visible UI or interaction under `app/[lang]/**` or `components/**` to read both `components/AGENTS.override.md` and `docs/design/DESIGN.md`. The trigger covers modification and review, not only creation, because most UI drift occurs while changing existing screens.

`components/AGENTS.override.md` will repeat only the compact requirement to read DESIGN, not summaries of its detailed rules.

Alternative considered: rely on a “new UI only” trigger. Rejected because it would not govern fixes, refactors, migrations, or reviews of existing UI.

### Keep technical ownership outside DESIGN

The following remain in agent instructions:

- Repository architecture, feature file structure, commands, verification, OpenSpec workflow, and review reporting format.
- Component placement, Server Component default, `"use client"` boundary, primitive import boundary, dependency policy, shadcn wrapper workflow, and localization/navigation helpers.
- Validation, security, irreversible-action safeguards, vendor attribution preservation, and accessibility skill triggers.
- Component API correctness such as required `SelectGroup` and `DropdownMenuGroup` nesting.
- Route-interception changes requiring a separate proposal.

DESIGN will own the user-visible outcome of those mechanisms without becoming the source for backend, data, security, or dependency architecture.

Alternative considered: move every instruction mentioning UI into DESIGN. Rejected because import boundaries, security, validation, and workflow are engineering controls rather than design conventions.

### Move detailed conventions without retaining duplicate copies

The migration will move the root shadcn/theme, page/surface, search/pagination, quick-detail, content, sidebar, and UI review-detail rules into DESIGN. It will also move component-level layout, list/form surface, URL-state UX, feedback-state, long-text, and accessibility outcome rules from the component override.

Mixed rules will be split at their responsibility boundary. For example, DESIGN owns the controlled search behavior and presentation, while the component override may retain the required framework hook or component API when it prevents implementation errors.

### Reconcile conflicts in favor of current repository policy

The rewritten design source will:

- Use Geist and Geist Mono instead of the stale Inter direction.
- Treat `app/[lang]/(main)` pages as cardless workspaces and reserve Cards for meaningful inner surfaces.
- Allow shadcn wrapper maintenance through the documented shadcn workflow while prohibiting feature-specific chrome in `components/ui`.
- Preserve the `radix-nova` neutral default and prohibit local token changes as a shortcut.
- Replace aspirational token values with current semantic-token constraints.

The delta spec for `financial-command-surface-design` will stop requiring rollout guidance, deferred targets, and rollback notes so the persistent document can remain timeless.

## Risks / Trade-offs

- [Risk] Agents may miss UI rules after they leave automatically loaded instructions. → Keep an explicit root and component-level read requirement covering implementation and review.
- [Risk] A rule may be lost while splitting mixed technical and design guidance. → Map every removed section to its destination and verify representative constraints with static searches.
- [Risk] DESIGN could become another oversized instruction file. → Remove rollout history, avoid implementation recipes already owned by skills, and organize only durable rules by UI concern.
- [Risk] Duplicate summaries drift over time. → Keep links and ownership statements in AGENTS files instead of restating detailed conventions.
- [Risk] Existing OpenSpec requirements still mandate stale DESIGN sections. → Update the `financial-command-surface-design` delta spec in the same change.

## Migration Plan

1. Rewrite `docs/design/DESIGN.md` around current UI/UX ownership and reconcile known conflicts.
2. Replace detailed root UI sections with the explicit DESIGN router while retaining workflow, architecture, safety, validation, and review-reporting rules.
3. Trim `components/AGENTS.override.md` to ownership and technical boundaries, add the same DESIGN router, and retain skill triggers.
4. Confirm `app/api/AGENTS.override.md` and `app/lib/AGENTS.override.md` remain unchanged.
5. Run OpenSpec validation, targeted static searches, and Markdown diff/readability checks.

Rollback is documentation-only: revert the three guidance files and their spec deltas together so routing and rule ownership cannot become inconsistent.

## Open Questions

None. The ownership boundary and conflict resolutions are defined by the accepted exploration plan.
