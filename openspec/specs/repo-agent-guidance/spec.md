# repo-agent-guidance Specification

## Purpose
TBD - created by archiving change optimize-agents-repo-guidance. Update Purpose after archive.
## Requirements
### Requirement: AGENTS remains a concise repo-wide policy index
The system SHALL maintain `AGENTS.md` as the active repo-wide guidance file for global Signapse policies while avoiding long task-specific implementation recipes that belong in `.codex/skills`.

#### Scenario: Agent reads repo guidance
- **WHEN** an agent opens `AGENTS.md`
- **THEN** the file identifies repo-wide constraints, stack conventions, verification expectations, and review categories without requiring the agent to scan repeated copies of the same implementation recipe

#### Scenario: Task-specific workflow exists
- **WHEN** detailed reusable guidance is specific to a task domain such as shadcn composition, hydration mismatch debugging, frontend design, OpenSpec workflows, accessibility, or API mapping
- **THEN** `AGENTS.md` SHALL point to the relevant skill or summarize the rule at policy level instead of duplicating the full recipe

### Requirement: Duplicated guidance is consolidated
The system SHALL consolidate repeated AGENTS guidance so that shadcn chrome policy, skeleton mirroring, toolbar/list/table/form layout rules, and review expectations are each expressed in one primary location with compact references elsewhere.

#### Scenario: Shadcn chrome guidance is reviewed
- **WHEN** an agent reviews shadcn/radix-nova guidance in `AGENTS.md`
- **THEN** the file presents a single clear baseline policy for wrapper usage and default chrome instead of repeating equivalent prohibitions across multiple unrelated sections

#### Scenario: Review expectations are reviewed
- **WHEN** an agent reviews the review checklist in `AGENTS.md`
- **THEN** the checklist SHALL use concise finding categories or references to earlier policy instead of restating every detailed layout rule

### Requirement: Encoding-safe editing is explicit
The system SHALL instruct agents to preserve UTF-8 content and avoid broad file rewrites that can change encoding, newline style, or Vietnamese text when editing Markdown, TypeScript, and TSX files.

#### Scenario: Manual file edit is needed
- **WHEN** an agent manually edits `AGENTS.md`, Markdown docs, TS, or TSX files
- **THEN** the guidance SHALL prefer `apply_patch` or another narrow edit path that preserves existing encoding and surrounding content

#### Scenario: Scripted edit is needed
- **WHEN** an agent uses a scripted or shell-based edit for a bulk cleanup
- **THEN** the guidance SHALL require the edit to be narrow, encoding-aware, and followed by a quick readability or diff check for affected text

### Requirement: Feature completion checklist matches agent-owned verification
The system SHALL keep AGENTS feature completion guidance aligned with agent-owned verification and SHALL NOT make smoke, browser, visual, authenticated-session, backend-data, fixture-dependent, or manual QA a default archive-gating checkbox.

#### Scenario: Feature checklist is updated
- **WHEN** `AGENTS.md` lists feature completion checks
- **THEN** the checklist SHALL include Codex-runnable verification such as lint, typecheck, OpenSpec validation, static search, deterministic review, or an explicit skipped-check explanation

#### Scenario: Manual QA remains useful but user-owned
- **WHEN** smoke, browser, authenticated-session, backend-data, visual, or manual QA expectations are relevant
- **THEN** the guidance SHALL capture them as non-gating user-owned notes unless the user explicitly asks Codex to include them as tasks

### Requirement: Product-critical constraints are preserved
The system SHALL preserve existing global Signapse constraints when optimizing AGENTS, including Clerk authenticated fetches, Vietnamese user-facing UI copy, shadcn wrapper usage, URL-driven list state, simplified API hierarchy, destructive action safeguards, and local quick detail overlay boundaries.

#### Scenario: AGENTS is trimmed
- **WHEN** duplicated or overly detailed AGENTS sections are removed or summarized
- **THEN** the remaining guidance SHALL still preserve the product-critical constraints needed to implement and review Signapse features safely

