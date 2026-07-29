## ADDED Requirements

### Requirement: Legacy Assistant UI application graph is absent
The application SHALL contain no source file, runtime adapter, modal, controller, conversion helper, dedicated check, direct dependency, or current application documentation owned exclusively by the unreachable Assistant UI conversation implementation.

#### Scenario: Application sources and dependency manifest are inspected
- **WHEN** current application source, scripts, package manifest, lockfile, and frontend ownership documentation are searched after cleanup
- **THEN** `components/assistant-ui`, `AssistantRuntime`, `AssistantModal`, `useMarketConversationAssistant`, and the direct `@assistant-ui/react` dependency are absent

### Requirement: Active market conversation remains the sole protected implementation
The cleanup SHALL preserve `MarketConversationAssistant` as the only protected global conversation implementation and SHALL preserve its existing permission, workspace, persistence, history, transcript, submission, localization, and overlay contracts.

#### Scenario: Authorized protected application shell is resolved
- **WHEN** an authenticated user with market-query execution permission opens a protected localized route
- **THEN** `ProtectedAiAssistant` resolves the promoted market conversation implementation with the active workspace identity and does not initialize a replacement or compatibility runtime

#### Scenario: Market conversation infrastructure is inspected
- **WHEN** the cleanup diff is reviewed
- **THEN** authenticated market-conversation actions, DTOs, schemas, permissions, endpoints, and active shared UI primitives remain available without an Assistant UI adapter

### Requirement: Cleanup removes Assistant UI repository skills while preserving unrelated tooling and history
The cleanup SHALL remove every repository-installed skill sourced from `assistant-ui/skills` and its corresponding lock entry while preserving unrelated repository skills and historical OpenSpec archives.

#### Scenario: Installed skills and lock entries are reviewed
- **WHEN** `.agents/skills` and `skills-lock.json` are inspected after cleanup
- **THEN** no skill directory or lock entry sourced from `assistant-ui/skills` remains
- **AND** unrelated repo-local, shadcn, and UI/UX skills remain installed and locked where applicable

#### Scenario: Repository-wide references are reviewed
- **WHEN** remaining `assistant-ui` references are classified after cleanup
- **THEN** any retained references belong only to historical OpenSpec archives and no retained current source, documentation, guidance, skill, or lock entry depends on Assistant UI
