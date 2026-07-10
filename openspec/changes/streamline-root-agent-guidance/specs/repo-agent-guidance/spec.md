## ADDED Requirements

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
