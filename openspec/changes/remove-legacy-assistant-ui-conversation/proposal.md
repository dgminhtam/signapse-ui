## Why

The protected application now runs the promoted `MarketConversationAssistant`, while the previous Assistant UI runtime, controller, modal, mapping helpers, check script, and dependency remain unreachable. Removing that dead graph now reduces dependency and maintenance surface without changing the active workspace-scoped conversation experience.

## What Changes

- Remove the unreachable `components/assistant-ui/**` implementation and its legacy runtime check.
- Remove the direct `@assistant-ui/react` dependency and prune its unused lockfile graph.
- Remove legacy-only localization keys and repository guidance while retaining copy still used by the active conversation boundary.
- Update frontend API ownership documentation from the removed component graph to `components/market-conversation-assistant/**`.
- Remove current-spec wording that still requires, references, or protects the inactive Assistant UI runtime and controller.
- Remove all 13 repository-installed skills sourced from `assistant-ui/skills` and their corresponding lock entries.
- Preserve the active `MarketConversationAssistant`, protected permission and error boundary, workspace lifecycle, market-conversation actions, DTOs, permissions, and backend contract.

## Capabilities

### New Capabilities

- `legacy-assistant-ui-removal`: Defines the source, dependency, documentation, localization, repository-skill, and active-conversation preservation boundary for removing Assistant UI.

### Modified Capabilities

- `ai-assistant-market-conversations`: Describe persisted messages as active conversation timeline state instead of Assistant UI message state.
- `global-ai-assistant-modal`: Remove the obsolete Assistant UI runtime mapping contract while preserving backend-persisted conversation truth and the active overlay behavior.
- `demo-conversation`: Remove the requirement to coexist with an inactive legacy assistant runtime after that runtime is deleted.
- `demo-conversation-history-api`: Remove the obsolete duplicate-request condition tied to the inactive legacy controller.
- `plate-editor-ai-boundary`: Preserve the active market-conversation product area rather than the removed Assistant UI implementation when evaluating Plate editor AI cleanup.

## Impact

- Removed source: `components/assistant-ui/**` and `scripts/check-assistant-market-conversation-runtime.ts`.
- Dependency manifest: `package.json` and `pnpm-lock.yaml` no longer contain the direct Assistant UI runtime dependency or its unused transitive graph.
- Localization and guidance: English and Vietnamese legacy-only assistant labels and the obsolete `components/assistant-ui/**` scoped instruction are removed.
- Documentation and specifications: `docs/APIMAPPING.md` and the listed OpenSpec capabilities are aligned with the active conversation implementation.
- Repository tooling: 13 skill directories and 13 `skills-lock.json` entries sourced from `assistant-ui/skills` are removed while unrelated skills remain installed.
- Unchanged runtime boundary: `components/protected-ai-assistant.tsx`, `components/market-conversation-assistant/**`, `app/api/market-conversations/action.ts`, market-query definitions and permissions, and backend APIs.
- Historical OpenSpec archives remain unchanged.
