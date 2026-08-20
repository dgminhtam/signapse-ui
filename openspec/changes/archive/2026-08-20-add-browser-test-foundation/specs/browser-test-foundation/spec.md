## ADDED Requirements

### Requirement: Agent-runnable P0 browser-test commands

The system SHALL provide a secret-free P0 browser-test command and a quality aggregate command that agents, developers, and pull-request CI can run without a real Clerk session, backend, Telegram credential, or manual browser interaction. The system SHALL also expose a reserved integration command that fails clearly when its P1 environment is unavailable rather than silently skipping integration coverage.

#### Scenario: Running the P0 browser suite

- **WHEN** an agent or developer runs the documented P0 browser-test command in a configured local checkout
- **THEN** the command starts the deterministic fixture runtime and application test server, executes the Chromium P0 suite, and returns a non-zero exit code for a failed browser test

#### Scenario: Running the quality aggregate

- **WHEN** pull-request CI runs the documented quality aggregate command
- **THEN** lint, typecheck, deterministic dashboard tests, build, and the P0 browser suite SHALL all complete successfully before the quality gate passes

#### Scenario: Requesting unavailable P1 integration coverage

- **WHEN** an agent or developer runs the reserved integration command without the required P1 environment configuration
- **THEN** the command SHALL fail with a clear configuration error and SHALL NOT report skipped integration coverage as a passing result

### Requirement: Browser tests use the existing backend HTTP boundary

The P0 browser suite SHALL run the real application with `API_BASE_URL` directed to a deterministic fixture HTTP backend. The fixture backend SHALL serve the public backend paths and response behavior required by the exercised application flows so that Server Component, server-action, and browser-side fetches use the same application seam.

#### Scenario: Loading a server-rendered protected workspace

- **WHEN** a P0 browser test opens a protected dashboard route in non-production functional mode
- **THEN** server-rendered data requests SHALL reach the fixture HTTP backend through `API_BASE_URL` and the rendered page SHALL reflect the fixture response

#### Scenario: Executing a browser mutation

- **WHEN** a P0 browser test performs a supported mutation through the UI
- **THEN** the application SHALL invoke its normal server-action/request path against the fixture backend and render the observable confirmed or recoverable result

#### Scenario: Handling locale-aware fixture requests

- **WHEN** a P0 browser test runs a Vietnamese critical journey
- **THEN** fixture assertions SHALL accept and verify the locale-aware request behavior expected at the backend boundary

### Requirement: Fixture data is synthetic, controllable, and isolated

The fixture backend SHALL use only synthetic records and SHALL provide deterministic controls for successful, empty, validation-error, timeout, outage, mutation-failure, and SSE response states. Mutable fixture state SHALL be isolated by `testRunId` and reset or seeded idempotently for each test run.

#### Scenario: Starting an isolated test run

- **WHEN** a browser test begins a fixture-backed workflow
- **THEN** it SHALL receive synthetic state scoped to its `testRunId` and SHALL NOT observe mutations from another test run

#### Scenario: Exercising a recoverable backend failure

- **WHEN** a browser test selects a fixture failure state for a mutation
- **THEN** the fixture SHALL return the configured deterministic failure and the application SHALL retain the user-visible recovery path required by that workflow

#### Scenario: Receiving deterministic market-stream data

- **WHEN** a market-chart browser test subscribes to fixture live data
- **THEN** the fixture SHALL emit the configured SSE sequence and reconnection outcome without contacting an external market service

### Requirement: Fixture behavior remains contract-aligned

The P0 fixture registry and its responses SHALL remain aligned with the backend OpenAPI contract and the frontend API mapping ledger for every endpoint exercised by the P0 suite. Contract changes affecting a fixture endpoint, method, status, required request data, or required response shape SHALL fail a deterministic guard until the fixture is updated.

#### Scenario: Updating a mapped endpoint contract

- **WHEN** a P0-covered backend contract changes in a way that affects an exercised fixture route
- **THEN** the deterministic contract guard SHALL fail until the fixture registry and response behavior are updated to the accepted contract

#### Scenario: Keeping unexercised backend APIs outside the fixture surface

- **WHEN** a backend endpoint is not exercised by a P0 journey
- **THEN** the fixture backend SHALL NOT be required to emulate that endpoint solely to create broad API coverage

### Requirement: P0 proves functional browser workflows without claiming real authorization

The P0 browser suite SHALL run protected dashboard workflows only through the existing non-production functional dev-auth mode with the server-side fixture submode (`SIGNAPSE_E2E_MODE=fixture`). It SHALL treat that mode as functional access for fixture-backed journeys and SHALL NOT claim that its passing results prove real Clerk authentication, capability enforcement, or backend authorization.

#### Scenario: Running a protected P0 journey without Clerk credentials

- **WHEN** a P0 browser test starts the application with the supported non-production functional auth mode
- **THEN** the protected dashboard workflow SHALL be runnable against fixture data without a Clerk login flow or bearer token

#### Scenario: Keeping the browser server outside production mode

- **WHEN** the P0 quality aggregate runs its production build and browser suite
- **THEN** it SHALL run the production build as a separate check and SHALL start the browser application server in non-production mode so the supported functional auth seam remains available

### Requirement: P0 startup isolates live client integrations

When the supported non-production functional auth mode is enabled, the application SHALL start the P0 browser runtime without initializing a live Clerk client, Clerk middleware, or third-party analytics/insights client integrations. The functional-test composition SHALL preserve locale redirect and locale-header behavior, preserve the production and real-auth composition outside that mode, and provide dev-auth-safe behavior for any P0-covered client control that otherwise requires Clerk context.

#### Scenario: Booting the protected application shell without Clerk configuration

- **WHEN** the P0 runner starts the protected application shell with functional dev-auth and the fixture submode enabled and no Clerk credentials
- **THEN** the shell SHALL render its fixture-backed user and navigation state without a Clerk-provider initialization failure or a live Clerk network request

#### Scenario: Rendering the user menu in functional dev-auth mode

- **WHEN** a P0 browser test opens the application-shell user menu in the functional fixture submode
- **THEN** any sign-out affordance that requires Clerk context SHALL be absent or use a localized non-Clerk-safe behavior and SHALL NOT attempt a Clerk sign-out request

#### Scenario: Routing a P0 request without Clerk middleware

- **WHEN** a P0 request reaches the proxy with the functional fixture submode enabled
- **THEN** the proxy SHALL apply the existing locale redirect and locale-header behavior without constructing Clerk middleware or requiring Clerk configuration

#### Scenario: Preserving real auth outside functional dev-auth mode

- **WHEN** the application runs without the functional fixture submode
- **THEN** it SHALL retain its existing Clerk provider, Clerk middleware protection, Clerk-owned sign-out behavior, analytics/insights composition, and locale-routing behavior

#### Scenario: Reporting the scope of a passing P0 suite

- **WHEN** P0 browser tests pass in CI
- **THEN** the generated result and documentation SHALL identify the suite as fixture-backed functional coverage and SHALL NOT represent it as real authorization or external-delivery verification

### Requirement: Critical P0 browser journeys cover agreed risk areas

The P0 browser suite SHALL cover externally observable success and meaningful recoverable failure behavior for the agreed application shell/workspace, canonical list, Personal Notes, Telegram configuration and scheduled asset analysis, Test message UI states, market-chart controls/SSE, and destructive-action workflows.

#### Scenario: Navigating application shell and a canonical list

- **WHEN** a P0 browser test switches workspace and uses a canonical list's search, filter, pagination, and browser history controls
- **THEN** the visible records, URL/query state, and Back/Forward behavior SHALL match the fixture-backed workflow state

#### Scenario: Recovering Personal Notes state

- **WHEN** a P0 browser test creates or edits a Personal Note and the configured save attempt fails
- **THEN** the note content SHALL remain available for recovery and the user-visible failure state SHALL be rendered before a later successful save or delete flow

#### Scenario: Managing Telegram configuration and scheduled asset analysis

- **WHEN** a P0 browser test creates, updates, disables, deletes, or retries supported Telegram configuration or scheduled asset analysis behavior against fixture data
- **THEN** the UI SHALL show validation, pending, confirmed success, or recoverable failure states without invoking Telegram

#### Scenario: Exercising Test message UI states

- **WHEN** the synced Test message behavior is exercised for an active fixture Điểm nhận
- **THEN** the browser suite SHALL verify accessible pending, success, failure, timeout, inactive, and unavailable-permission states without sending an external Telegram message

#### Scenario: Handling market-chart interaction and live-data recovery

- **WHEN** a P0 browser test changes supported market-chart controls, opens fullscreen, and receives a configured live-data interruption
- **THEN** the application SHALL expose the expected control/fullscreen state and reconnect or report the configured recoverable stream state without asserting canvas pixels

#### Scenario: Recovering a destructive action

- **WHEN** a P0 browser test confirms a destructive action and the configured mutation fails
- **THEN** the confirmation surface SHALL remain recoverable, prevent duplicate submission while pending, and allow the observable retry or cancel path

### Requirement: P0 accessibility checks cover critical states

The P0 quality gate SHALL fail on serious or critical axe accessibility violations in the agreed critical browser states. Browser tests SHALL also assert keyboard and focus behavior for dialogs and sheets involved in those journeys.

#### Scenario: Detecting a serious accessibility regression

- **WHEN** axe reports a serious or critical violation on a P0-covered state
- **THEN** the P0 browser suite SHALL fail and preserve failure evidence for diagnosis

#### Scenario: Closing an interactive overlay by keyboard

- **WHEN** a P0 browser test opens and closes a covered dialog or sheet with keyboard interaction
- **THEN** focus SHALL remain usable and return to the originating control when that control remains available

### Requirement: P0 visual assertions are stable and reviewable

The P0 suite SHALL maintain native Playwright screenshot baselines only for deterministic application chrome, forms, sheets, empty/error states, and selected responsive layouts. It SHALL exclude broad full-page snapshots and dynamic canvas pixel assertions. Intentional baseline changes SHALL be committed and subject to required reviewer approval.

#### Scenario: Comparing a stable application state

- **WHEN** a P0 browser test captures a selected stable visual state
- **THEN** the screenshot comparison SHALL use synthetic fixture data and deterministic rendering conditions

#### Scenario: Encountering a visual regression

- **WHEN** a selected visual assertion differs from its committed baseline
- **THEN** the P0 quality gate SHALL fail and provide the visual diff or screenshot artifact for reviewer assessment

### Requirement: P0 failures are diagnosable and bounded

The P0 browser runner SHALL retain trace, screenshot, video, and relevant application/fixture logs on failure. It SHALL use observable readiness conditions instead of fixed sleep-based synchronization, limit diagnostic retries, and target a pull-request quality-gate duration of ten minutes with browser execution below five minutes.

#### Scenario: Preserving evidence for a browser failure

- **WHEN** a P0 browser test fails or exhausts its bounded retry policy
- **THEN** CI SHALL publish trace, screenshot, video, and relevant application/fixture logs as failure artifacts

#### Scenario: Waiting for application readiness

- **WHEN** the P0 runner starts the fixture backend or application test server
- **THEN** it SHALL wait for an explicit readiness condition before executing browser tests and SHALL NOT rely on an arbitrary fixed delay as the readiness signal

### Requirement: P0 is a required, maintainable quality gate

The pull-request workflow SHALL treat the P0 quality aggregate as a required gate. Existing deterministic Vitest coverage SHALL remain independently runnable. New interactive features and regression fixes SHALL add the narrowest test layer that proves their risk-relevant behavior, while existing routes are backfilled when changed or after a regression.

#### Scenario: Evaluating a pull request

- **WHEN** pull-request CI evaluates a change that affects the dashboard
- **THEN** merge readiness SHALL require the P0 quality aggregate to pass and SHALL preserve the existing deterministic test runner as a separate runnable command

#### Scenario: Adding a future interactive change

- **WHEN** a future feature or regression fix adds risk-relevant interactive behavior
- **THEN** its change tasks SHALL include deterministic, P0 browser, or later P1 coverage appropriate to the behavior rather than relying on a manual QA checkbox alone

### Requirement: P0 excludes real external and credentialed behavior

P0 SHALL not call Clerk, a live backend, Telegram, development systems, production systems, or a direct database. It SHALL not create or expose external credentials. Real capability personas, browser matrix expansion, test-only backend seed/reset operations, and the `testRunId`-keyed Test message delivery-audit query SHALL remain P1 responsibilities.

#### Scenario: Running P0 from an untrusted pull request

- **WHEN** P0 runs for a pull request without access to protected integration secrets
- **THEN** it SHALL execute only the secret-free fixture-backed quality gate and SHALL not require or expose P1 credentials

#### Scenario: Requesting external delivery verification

- **WHEN** a release process requires proof that a Telegram Test message was accepted by Telegram
- **THEN** that proof SHALL be supplied by the P1 authenticated-quality-canary change and SHALL NOT be inferred from a passing P0 fixture test
