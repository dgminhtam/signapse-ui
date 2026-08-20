## ADDED Requirements

### Requirement: Production dashboard test runner and commands
The system SHALL provide a single Vitest-based production-dashboard test runner with deterministic non-watch, watch, and coverage commands. The dashboard runner SHALL remain separate from the coming-soon Node suite and internal-skill Python suites.

#### Scenario: Running the dashboard test gate
- **WHEN** a developer runs `pnpm test`
- **THEN** the production-dashboard Vitest suite SHALL run to completion without entering watch mode

#### Scenario: Requesting local feedback or coverage
- **WHEN** a developer runs the documented watch or coverage command
- **THEN** the system SHALL respectively start the dashboard runner in watch mode or emit V8 coverage for the dashboard suite

### Requirement: Deterministic and isolated test boundaries
The dashboard suite SHALL run without a real Clerk session, backend service, seeded database, live network request, chart canvas, or browser E2E runtime. Tests SHALL exercise public behavior seams and SHALL not depend on Base UI/shadcn implementation details or broad UI snapshots.

#### Scenario: Testing server-side behavior
- **WHEN** a test covers authenticated transport or a feature server action
- **THEN** it SHALL control Clerk, fetch, shared transport, locale, and revalidation dependencies at their public side-effect boundaries

#### Scenario: Testing a component behavior
- **WHEN** a test covers a client component
- **THEN** it SHALL assert accessible user-visible interactions and observable states in jsdom without inspecting wrapper internals

### Requirement: Shared deterministic domain coverage
The dashboard suite SHALL cover the agreed shared permission, locale, query, schema, and normalization contracts through their public exports.

#### Scenario: Permission and locale behavior
- **WHEN** tests exercise wildcard, absent, single, and multiple permissions or supported and unsupported locale inputs
- **THEN** they SHALL verify fail-closed permission behavior, locale fallback, locale-aware paths, negotiation, and deterministic formatting behavior

#### Scenario: Query and request normalization behavior
- **WHEN** tests exercise empty, valid, malformed, duplicate, and boundary request values
- **THEN** they SHALL verify query serialization and the documented Telegram schedule and market-query validation and normalization contracts

### Requirement: Deterministic market-chart helper coverage
The dashboard suite SHALL execute tests that fulfil the existing market-chart deterministic-helper requirements for annotation grouping, candle normalization and merge behavior, older-history requests, and drawing mappings without invoking chart registration or rendering.

#### Scenario: Running market-chart helper tests
- **WHEN** the dashboard test suite runs the market-chart helper tests
- **THEN** it SHALL verify the documented public helper behavior while excluding KLineCharts canvas lifecycle, registration, and visual rendering

### Requirement: Auth transport and representative action coverage
The dashboard suite SHALL cover the public authenticated and public transport behavior, Telegram scheduled asset analysis mutations, and Personal Notes CRUD action behavior with controlled dependencies.

#### Scenario: Handling authenticated transport responses
- **WHEN** tests simulate configuration, authentication, timeout, successful, empty, not-found, and failed HTTP responses
- **THEN** they SHALL verify the public transport contract, headers, localized errors, and status handling without a live backend

#### Scenario: Handling feature mutations
- **WHEN** tests invoke Telegram scheduled asset analysis mutations or Personal Notes CRUD actions with valid and invalid controlled dependencies
- **THEN** they SHALL verify request shape, success and localized failure results, and affected-route revalidation behavior

### Requirement: Representative component behavior coverage
After the Base UI wrapper migration has stabilized, the dashboard suite SHALL cover the schedule form, destructive schedule actions, and shared pagination controls through accessible behavior.

#### Scenario: Handling schedule form states
- **WHEN** a user enters invalid or valid scheduled asset analysis values and submits the form
- **THEN** tests SHALL verify validation, normalized request submission, pending state, recoverable backend failure, and retained input behavior

#### Scenario: Handling destructive schedule actions
- **WHEN** a user confirms a disable or delete schedule action
- **THEN** tests SHALL verify confirmation, pending state, failure recovery, retry, and completed mutation behavior

#### Scenario: Navigating pagination controls
- **WHEN** a user interacts with shared pagination controls
- **THEN** tests SHALL verify accessible controls and the resulting URL/query state behavior

### Requirement: Conversation history assertions use the dashboard runner
The system SHALL move production conversation-history behavioral assertions into the dashboard test runner. Static source-contract checks SHALL remain outside the runner only when they protect an independent structural invariant.

#### Scenario: Running conversation history behavior tests
- **WHEN** the dashboard test suite runs conversation-history tests
- **THEN** it SHALL verify message rendering, pagination/history merge, loading decisions, and response-reveal behavior through exported helpers

### Requirement: Behavior-based verification without a global coverage gate
The system SHALL report dashboard test coverage without enforcing a repository-wide percentage threshold in P0. P0 completion SHALL require the documented behavior matrix, dashboard tests, lint, typecheck, build, static checks, and OpenSpec validation.

#### Scenario: Evaluating P0 completion
- **WHEN** the P0 change is prepared for implementation completion
- **THEN** coverage SHALL be available for review and completion SHALL be determined by the required deterministic behavior and repository-runnable verification checks rather than a global coverage percentage
