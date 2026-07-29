## 1. Authoritative UI Design Guidance

- [x] 1.1 Rewrite `docs/design/DESIGN.md` as the durable UI/UX source of truth while retaining the `Financial Command Surface` direction and reference images.
- [x] 1.2 Reconcile typography, `radix-nova` chrome, semantic tokens, shadcn wrapper policy, cardless page composition, inner surfaces, sidebar states, and other visual conventions with current repository policy.
- [x] 1.3 Consolidate list/search/pagination, forms, feedback states, navigation, quick-detail overlays, content hierarchy, long-text handling, accessibility outcomes, and UI drift review criteria into the design source.
- [x] 1.4 Remove pilot routes, rollout order, deferred rollout targets, first-pass restrictions, rollback history, and other stale rollout-only wording from the persistent design document.

## 2. Agent Guidance Routing And Ownership

- [x] 2.1 Update `AGENTS.md` to require both `components/AGENTS.override.md` and `docs/design/DESIGN.md` for implementation or review of any user-visible UI or interaction.
- [x] 2.2 Remove detailed UI conventions from `AGENTS.md` after mapping them to DESIGN, while retaining architecture, workflow, locale routing, safety, validation, skill triggers, verification, route-interception proposal policy, vendor attribution, and review-reporting requirements.
- [x] 2.3 Update `components/AGENTS.override.md` with the DESIGN read requirement and remove duplicated UI outcomes while retaining component placement, Server/Client boundaries, primitive imports, dependency policy, shadcn workflow, localization/navigation mechanisms, component API correctness, and accessibility skill triggers.
- [x] 2.4 Confirm `app/api/AGENTS.override.md` and `app/lib/AGENTS.override.md` have no changes.

## 3. Verification

- [x] 3.1 Run targeted static searches to confirm the DESIGN routing exists for both implementation and review and each removed product-critical UI rule remains in its designated source.
- [x] 3.2 Check that stale Inter, page-Card-default, absolute `components/ui` prohibition, aspirational token, pilot, rollout, deferred-target, and first-pass guidance no longer conflicts with current policy.
- [x] 3.3 Review the Markdown diff for duplicated rules, broken references, UTF-8 readability, and unintended changes outside the three guidance files and this OpenSpec change.
- [x] 3.4 Run OpenSpec validation for `centralize-ui-guidance-in-design` and report any check that cannot run.
