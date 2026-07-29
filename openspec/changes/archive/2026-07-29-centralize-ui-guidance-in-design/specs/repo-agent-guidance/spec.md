## ADDED Requirements

### Requirement: UI work loads authoritative design guidance

The system SHALL require agents implementing or reviewing any user-visible UI or interaction under `app/[lang]/**` or `components/**` to read both `components/AGENTS.override.md` and `docs/design/DESIGN.md`.

#### Scenario: Agent implements new or existing UI

- **WHEN** an agent creates, fixes, refactors, or modifies user-visible UI under the governed paths
- **THEN** the root guidance routes the task to both the scoped component instructions and the authoritative design document

#### Scenario: Agent reviews UI

- **WHEN** an agent reviews a user-visible UI or interaction change under the governed paths
- **THEN** the same two-source routing requirement applies before findings are produced

## MODIFIED Requirements

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

### Requirement: Product-critical constraints are preserved

The system SHALL preserve existing global Signapse constraints while reorganizing guidance, including Clerk authenticated fetches, localized user-facing UI copy, shadcn wrapper usage, URL-driven list state, simplified API hierarchy, destructive action safeguards, local quick-detail overlay boundaries, and vendor attribution.

#### Scenario: Detailed UI guidance moves

- **WHEN** duplicated or overly detailed UI sections are removed from an AGENTS file
- **THEN** each product-critical UI constraint remains represented in `docs/design/DESIGN.md` or in the applicable technical instruction source and remains reachable through explicit routing

#### Scenario: Technical safeguards remain outside DESIGN

- **WHEN** the instruction sources are consolidated
- **THEN** security, validation, dependency boundaries, localization mechanisms, accessibility skill triggers, vendor attribution preservation, and route-interception proposal requirements remain in active agent guidance
