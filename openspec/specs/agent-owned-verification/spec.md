# agent-owned-verification Specification

## Purpose
TBD - created by archiving change standardize-agent-owned-verification. Update Purpose after archive.
## Requirements
### Requirement: Agent-owned verification checklist
The system SHALL define OpenSpec archive-gating verification tasks as checks that Codex can reasonably execute from the repository context.

#### Scenario: Creating a new OpenSpec task checklist
- **WHEN** an agent creates or updates an OpenSpec `tasks.md`
- **THEN** default verification checklist items SHALL be limited to Codex-runnable checks such as lint, typecheck, OpenSpec validation, static search, deterministic code review, or targeted non-auth tests

#### Scenario: Explicit user request for smoke testing
- **WHEN** the user explicitly asks Codex to add smoke, browser, visual, authenticated-session, backend-data, fixture-dependent, or manual QA tasks
- **THEN** those tasks MAY be added with wording that identifies the required external runtime or user-owned condition

### Requirement: User-owned manual QA notes
The system SHALL preserve smoke, browser, visual, authenticated-session, backend-data, fixture-dependent, and manual QA expectations outside the archive-gating task checklist unless explicitly requested otherwise.

#### Scenario: Capturing manual QA expectations
- **WHEN** a change needs smoke or manual verification that Codex cannot reliably run
- **THEN** the expectation SHALL be recorded as a non-checkbox `User-owned manual QA` note or equivalent non-gating documentation

#### Scenario: Converting existing smoke tasks
- **WHEN** an existing active change contains an unchecked smoke-like task that is not implementation work
- **THEN** the task SHALL be converted into a checked transfer note or a non-checkbox user-owned manual QA note so it no longer blocks archive readiness

### Requirement: Honest verification reporting
The system SHALL keep final implementation and archive summaries honest about which checks Codex ran and which manual QA remains user-owned.

#### Scenario: Reporting completed verification
- **WHEN** Codex finishes implementing or cleaning up an OpenSpec change
- **THEN** the final summary SHALL list completed Codex-owned checks and SHALL NOT imply that user-owned smoke, browser, visual, authenticated-session, backend-data, fixture-dependent, or manual QA was executed by Codex

#### Scenario: Archiving after user-owned QA transfer
- **WHEN** all implementation and Codex-owned verification tasks are complete and remaining manual QA has been moved outside the archive gate
- **THEN** the change MAY be treated as ready for archive from the agent-owned verification perspective

