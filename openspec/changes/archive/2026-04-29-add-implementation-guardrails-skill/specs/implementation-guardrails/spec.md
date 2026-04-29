## ADDED Requirements

### Requirement: Repo-wide guardrail summary
The repository SHALL document a short implementation guardrail summary in `AGENTS.md` that reminds agents to lock scope, prefer simple solutions, make surgical edits, and verify outcomes.

#### Scenario: Agent reads repo instructions
- **WHEN** an agent reads `AGENTS.md` before working in the repository
- **THEN** the agent sees a concise implementation guardrail section without needing to read the dedicated skill

### Requirement: Callable implementation guardrail skill
The repository SHALL provide a Codex skill named `implementation-guardrails` under `.codex/skills` for non-trivial implementation, refactor, bugfix, and review tasks.

#### Scenario: User invokes implementation guardrails
- **WHEN** the user requests the `implementation-guardrails` skill
- **THEN** Codex can load a local `SKILL.md` that guides scope control, simplicity checks, surgical edits, and verification

### Requirement: Skill preserves project authority
The implementation guardrail skill SHALL state that `AGENTS.md`, active OpenSpec instructions, and explicit user requests remain higher-priority project guidance.

#### Scenario: Guardrail conflicts with active task guidance
- **WHEN** the guardrail skill guidance conflicts with `AGENTS.md`, an active OpenSpec change, or an explicit user instruction
- **THEN** Codex follows the higher-priority project or user instruction

### Requirement: External guideline is adapted, not imported wholesale
The implementation SHALL adapt only the useful ideas from `andrej-karpathy-skills-main` and MUST NOT copy Claude plugin, Cursor rule, marketplace metadata, or long example material into the active Codex skill set.

#### Scenario: Implementation creates active workflow assets
- **WHEN** the change is implemented
- **THEN** the active repository workflow contains only the concise `AGENTS.md` addition and the dedicated Codex skill
