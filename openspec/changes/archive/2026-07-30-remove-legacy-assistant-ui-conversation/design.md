## Context

`ProtectedAiAssistant` now dynamically loads `MarketConversationAssistant`, which owns the active persisted-conversation state and directly uses the authenticated market-conversation actions. The former `AssistantRuntime` graph under `components/assistant-ui/**` has no active caller, but it still duplicates controller behavior, keeps `@assistant-ui/react` and its transitive graph installed, owns a legacy check script and localization copy, and appears in current documentation and specifications.

The cleanup crosses source, dependencies, localization, repository guidance, repository-installed skills, API ownership documentation, and current OpenSpec contracts. The active conversation must remain behaviorally unchanged: permission gating, active-workspace remounting, request identity guards, create-before-submit flow, history pagination, transcript reconciliation, progressive response reveal, and overlay interaction stay owned by the promoted implementation.

## Goals / Non-Goals

**Goals:**

- Delete the complete unreachable Assistant UI source graph and its dedicated runtime check.
- Remove the direct `@assistant-ui/react` dependency and prune unused lockfile entries through the package manager.
- Remove legacy-only labels and stale current documentation/spec wording.
- Remove all repository-installed skills sourced from `assistant-ui/skills` and their lock entries.
- Preserve the active conversation entry point, backend contract, permissions, state lifecycle, and user-visible behavior.
- Leave one deterministic, statically verifiable application conversation graph.

**Non-Goals:**

- Refactor, rename, restyle, or consolidate state inside `MarketConversationAssistant`.
- Change market-conversation actions, DTOs, schemas, permissions, endpoints, or synchronous response semantics.
- Rename the remaining `aiAssistant` dictionary namespace or move its active `open`, `loading`, and `error` labels.
- Remove unrelated repository skills or delete `skills-lock.json`; only Assistant UI-owned entries are in scope.
- Rewrite historical OpenSpec archives.

## Decisions

### Delete the unreachable graph as one ownership unit

Remove all files under `components/assistant-ui/**` together with `scripts/check-assistant-market-conversation-runtime.ts`. The runtime, modal, controller, conversion helpers, tooltip wrapper, and check form a closed graph with no active application caller, so retaining any compatibility file would preserve dead ownership without serving the current product.

Alternative considered: keep the controller or conversion helper for possible reuse. Rejected because the promoted conversation already owns equivalent validated state and message reconciliation, and speculative reuse would keep duplicate behavior and the external runtime dependency.

### Preserve shared market-conversation infrastructure

Do not modify `components/protected-ai-assistant.tsx`, `components/market-conversation-assistant/**`, `app/api/market-conversations/action.ts`, market-query definitions or permissions, or shared message primitives except if a deterministic path reference requires documentation-only adjustment. The legacy and active UI graphs share backend actions, but those actions are active infrastructure rather than Assistant UI ownership.

Alternative considered: consolidate the active component with the legacy hook before deletion. Rejected because it would expand blast radius and replace proven active state with an unreachable duplicate controller.

### Let pnpm own dependency and lockfile removal

Run `pnpm remove @assistant-ui/react` instead of hand-editing the lockfile. The package manager will remove the direct manifest entry and prune only transitive packages no longer required elsewhere.

Alternative considered: manually delete known `@assistant-ui/*` lockfile blocks. Rejected because shared transitive dependencies could be removed incorrectly and lockfile integrity is package-manager responsibility.

### Keep the three active `aiAssistant` labels

Remove only dictionary keys referenced exclusively by the deleted modal. Retain `aiAssistant.open`, `aiAssistant.loading`, and `aiAssistant.error`, which are still used by the active trigger, dynamic-loading fallback, and error boundary. This avoids touching active rendering for a namespace-only cleanup.

Alternative considered: move the three labels into `demoConversation` and delete the namespace. Rejected because it changes active source without removing additional runtime code or dependency risk.

### Remove Assistant UI tooling without rewriting history

Replace current API ownership references with `components/market-conversation-assistant/**`, remove obsolete Assistant UI/controller wording from main specs, and remove the scoped repository instruction for the deleted component path. Delete the 13 tracked skill directories whose lock source is exactly `assistant-ui/skills`, then remove only their 13 objects from `skills-lock.json`. Preserve archived changes and every unrelated repo-local, shadcn, and UI/UX skill.

Alternative considered: delete `skills-lock.json` or purge every textual `assistant-ui` occurrence. Rejected because the lock still owns unrelated installed skills and archives retain intentional historical context.

## Risks / Trade-offs

- [A shared backend file is mistaken for legacy ownership] -> Keep the explicit active-infrastructure boundary and verify active imports before and after deletion.
- [Lockfile pruning removes a package still needed elsewhere] -> Use `pnpm remove`, then run install integrity, typecheck, and production build checks.
- [Localization cleanup removes active accessible copy] -> Retain the three statically referenced `aiAssistant` keys and run targeted lint/typecheck.
- [Current specs still imply the deleted runtime exists] -> Update every main-spec reference found by static search while leaving archives explicitly excluded.
- [A generic or unrelated skill is deleted by name] -> Select removals only from lock entries whose source equals `assistant-ui/skills`, and verify all remaining skill directories and lock entries.
- [The active conversation regresses despite no intended source change] -> Run its deterministic assertion, targeted lint, typecheck, build, and static entry-point checks.

## Migration Plan

1. Delete the closed legacy component graph and dedicated legacy check.
2. Remove `@assistant-ui/react` through pnpm and inspect the resulting manifest and lockfile.
3. Remove dead labels and scoped guidance without changing active label references.
4. Update API ownership documentation and current OpenSpec wording.
5. Delete Assistant UI-owned skill directories and prune only their lock entries.
6. Run deterministic, static, lint, typecheck, build, and strict OpenSpec validation checks.

Rollback restores the deleted application and skill files, dependency and skill lock entries, labels, guidance, documentation, and specs from the change diff. No backend or persisted-data migration is involved.

## Open Questions

None.
