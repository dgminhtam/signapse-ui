# repo-agent-guidance Specification

## Purpose
TBD - created by archiving change optimize-agents-repo-guidance. Update Purpose after archive.
## Requirements
### Requirement: AGENTS remains a concise repo-wide policy index
The system SHALL maintain `AGENTS.md` as the active repo-wide guidance file for global Signapse architecture, workflow, safety, verification, and review-reporting policy while routing detailed UI and UX conventions to `docs/design/DESIGN.md` and task-specific recipes to skills.

#### Scenario: Agent reads repo guidance
- **WHEN** an agent opens `AGENTS.md`
- **THEN** the file identifies repo-wide constraints, stack conventions, verification expectations, review-reporting requirements, and scoped instruction sources without duplicating detailed UI recipes

#### Scenario: Task-specific workflow exists
- **WHEN** detailed reusable guidance is specific to a task domain such as shadcn composition, hydration mismatch debugging, frontend design, OpenSpec workflows, accessibility, or API mapping
- **THEN** `AGENTS.md` points to the relevant skill or summarizes the rule at policy level instead of duplicating the full recipe

#### Scenario: Detailed UI convention exists
- **WHEN** a visual, layout, interaction, content, state, or accessibility outcome is governed by the design source
- **THEN** `AGENTS.md` links to `docs/design/DESIGN.md` instead of repeating the convention

### Requirement: UI work loads authoritative design guidance
The system SHALL require agents implementing or reviewing any user-visible UI or interaction under `app/[lang]/**` or `components/**` to read both `components/AGENTS.override.md` and `docs/design/DESIGN.md`.

#### Scenario: Agent implements new or existing UI
- **WHEN** an agent creates, fixes, refactors, or modifies user-visible UI under the governed paths
- **THEN** the root guidance routes the task to both the scoped component instructions and the authoritative design document

#### Scenario: Agent reviews UI
- **WHEN** an agent reviews a user-visible UI or interaction change under the governed paths
- **THEN** the same two-source routing requirement applies before findings are produced

### Requirement: Duplicated guidance is consolidated
The system SHALL consolidate durable UI conventions in `docs/design/DESIGN.md`, retain component ownership and technical boundaries in `components/AGENTS.override.md`, and keep only compact routing references elsewhere.

#### Scenario: Shadcn chrome guidance is reviewed
- **WHEN** an agent reviews shadcn or `radix-nova` visual guidance
- **THEN** `docs/design/DESIGN.md` provides the primary chrome convention while the component override retains primitive import boundaries and the wrapper-maintenance workflow

#### Scenario: Shared UI patterns are reviewed
- **WHEN** an agent reviews page, toolbar, table, form, search, pagination, overlay, content, state, accessibility, or sidebar conventions
- **THEN** those conventions have one primary definition in `docs/design/DESIGN.md` rather than repeated definitions in root and scoped agent files

#### Scenario: Review expectations are reviewed
- **WHEN** an agent reviews UI drift categories
- **THEN** the design source owns the detailed UI checklist while `AGENTS.md` retains the required finding format and residual-risk reporting

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
The system SHALL preserve existing global Signapse constraints while reorganizing guidance, including Clerk authenticated fetches, localized user-facing UI copy, shadcn wrapper usage, URL-driven list state, simplified API hierarchy, destructive action safeguards, local quick-detail overlay boundaries, and vendor attribution.

#### Scenario: Detailed UI guidance moves
- **WHEN** duplicated or overly detailed AGENTS sections are removed or summarized
- **THEN** each product-critical UI constraint remains represented in `docs/design/DESIGN.md` or in the applicable technical instruction source and remains reachable through explicit routing

#### Scenario: Technical safeguards remain outside DESIGN
- **WHEN** the instruction sources are consolidated
- **THEN** security, validation, dependency boundaries, localization mechanisms, accessibility skill triggers, vendor attribution preservation, and route-interception proposal requirements remain in active agent guidance

### Requirement: Root guidance routes work to scoped instructions

The system SHALL keep a scoped-instruction router in the root guidance that maps API, library, and UI work to the existing override files and requires all applicable scoped files for cross-domain tasks.

#### Scenario: API task starts from repository root

- **WHEN** an agent implements or reviews files under `app/api/**`
- **THEN** the root guidance requires the agent to read `app/api/AGENTS.override.md`

#### Scenario: UI task changes route-local components

- **WHEN** an agent performs UI work under `app/[lang]/**` or `components/**`
- **THEN** the root guidance requires the agent to read `components/AGENTS.override.md`

#### Scenario: Task crosses domain boundaries

- **WHEN** a task changes files governed by more than one scoped override
- **THEN** the root guidance requires the agent to read every applicable override

### Requirement: Root guidance uses locale-aware route paths

The system SHALL describe protected, authentication, feature, and page-layout routes using their actual locale-aware paths below `app/[lang]`.

#### Scenario: Agent reads route architecture

- **WHEN** an agent reads the root architecture or feature structure guidance
- **THEN** protected and authentication route examples use `app/[lang]/(main)` and `app/[lang]/(auth)` rather than bare root-level route groups

### Requirement: Root de-duplication preserves unmatched policy

The system SHALL remove a domain-specific root rule only when an equivalent or stronger scoped rule exists and SHALL retain product-critical or cross-domain constraints that do not yet have a scoped owner.

#### Scenario: Duplicate rule is consolidated

- **WHEN** a root rule is fully represented in an applicable override
- **THEN** the duplicate root wording is removed in favor of the scoped source

#### Scenario: Scoped guidance is incomplete

- **WHEN** an existing root invariant is not fully represented by an override
- **THEN** the invariant remains in root guidance

### Requirement: Root guidance remains bilingual and synchronized

The system SHALL keep `AGENTS.md` and `AGENTS.vi.md` structurally and semantically synchronized whenever root guidance changes.

#### Scenario: Root instruction changes

- **WHEN** a section or rule is added, removed, renamed, or corrected in one root guidance file
- **THEN** the corresponding change is applied to the other root guidance file in the same change
