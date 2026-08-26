## ADDED Requirements

### Requirement: Feedback UI uses the configured authenticated backend boundary
The system SHALL expose personal feedback to active users and moderation feedback according to canonical permissions after the live OpenAPI structural cross-check and repository verification pass. In P0 fixture submode, the same Server Components, Server Actions, response parsers, mappers, and screenshot route handlers SHALL target the deterministic HTTP fixture backend through the configured backend base URL. Synthetic feedback MUST NOT render outside the fixture backend and MUST NOT serve as a production fallback.

#### Scenario: Running integrated production feedback
- **WHEN** the application runs outside P0 after the structural activation gate
- **THEN** feedback routes and navigation use authenticated live backend data
- **AND** no synthetic feedback provider or local fallback is mounted

#### Scenario: Running in fixture submode
- **WHEN** the protected application starts with supported P0 fixture submode enabled
- **THEN** the same frontend integration boundary targets the deterministic fixture HTTP backend
- **AND** permission-gated navigation uses the configured fixture permission response

#### Scenario: Backend is unavailable outside P0
- **WHEN** live feedback transport fails
- **THEN** the affected surface renders localized recovery
- **AND** it does not fall back to fixture, local-storage, or in-memory records

### Requirement: Fixture action availability mirrors status and permission rules
The fixture backend SHALL return status and permissions without synthetic capability fields. UI action availability SHALL derive from personal scope plus pending status for withdrawal, `feedback:review` plus pending status for Promote and Dismiss, and `feedback:delete` for administrative Delete at every status. Fixture mutations SHALL remain authoritative for configured `404` and lifecycle `409` races.

#### Scenario: Pending personal feedback is withdrawable
- **WHEN** personal fixture detail has status `PENDING_REVIEW`
- **THEN** withdrawal is rendered without a capability response field

#### Scenario: Review requires permission and pending status
- **WHEN** moderation fixture detail is pending and fixture permissions include `feedback:review`
- **THEN** Promote and Dismiss are rendered

#### Scenario: Delete applies to every status
- **WHEN** fixture permissions include `feedback:delete`
- **THEN** administrative Delete is rendered for pending, promoted, and dismissed detail

#### Scenario: A rendered action loses a race
- **WHEN** a fixture scenario changes or removes the record before mutation
- **THEN** the endpoint returns the configured `404` or stable lifecycle `409`
- **AND** the visible workflow follows authoritative refreshed state

### Requirement: HTTP fixture state is deterministic and isolated
The feedback fixture backend SHALL own synthetic records, multipart submissions, screenshot binaries, permissions, mutations, failures, and concurrent-state scenarios. Mutable state SHALL be isolated by test-run identity and reset or seeded idempotently for each run. Scenario controls SHALL use the fixture-control seam and MUST NOT add test query parameters, headers, or payload fields to production request code.

#### Scenario: Mutating fixture state through the UI
- **WHEN** compose, withdraw, promote, dismiss, or administrative delete succeeds in P0
- **THEN** the normal frontend request reaches the matching fixture HTTP endpoint
- **AND** subsequent reads in the same test run observe confirmed fixture state

#### Scenario: Starting an isolated browser test
- **WHEN** a P0 feedback browser test begins with a new test-run identity
- **THEN** it receives the deterministic seed for that run
- **AND** it does not observe mutations from another run

#### Scenario: Configuring a fixture scenario
- **WHEN** a test selects success, validation, timeout, outage, mutation failure, or lifecycle conflict
- **THEN** the control is stored on the test-only fixture seam
- **AND** the application request retains its production shape

## MODIFIED Requirements

### Requirement: Fixture data covers contract-relevant optionality and edge states
The feedback fixture catalog SHALL include synthetic personal and moderation responses covering `BUG` and `IDEA`, all three persisted statuses, absent optional fields, conditional review outcomes, promoted moderation GitHub issue numbers, valid PNG/JPEG and rejected WebP/oversized/over-25-megapixel screenshots, BUG-only reproduction and observation time, technical-context opt-out, inactive sender metadata, long localized content, malformed core responses, and pagination edge states.

#### Scenario: Rendering optional fields safely
- **WHEN** a fixture response omits allowed reproduction steps, screenshot, technical context, promoted moderation GitHub issue number, or optional sender subfields
- **THEN** list and detail surfaces remain valid where the live contract permits omission
- **AND** the UI does not invent placeholder domain data

#### Scenario: Rejecting a malformed response
- **WHEN** a configured fixture response omits a core field or required conditional field
- **THEN** runtime validation fails closed
- **AND** the affected UI renders its localized recoverable error state

#### Scenario: Rendering long localized content
- **WHEN** a fixture contains long Vietnamese or English titles, descriptions, feedback review messages, or metadata
- **THEN** content wraps or truncates according to the shared design system
- **AND** full decision-relevant text remains available without page-level overflow

### Requirement: Fixture mutations expose deterministic observable states
Fixture HTTP mutations SHALL support deterministic success, pending, validation `400`, transport `413`, timeout, outage, temporary storage `502`, server failure, the two stable lifecycle `409` codes, and already-missing `404` behavior using the accepted runtime contract. Passing P0 SHALL prove fixture-backed frontend integration behavior but SHALL NOT claim real authorization, persistence, production lifecycle enforcement, or live backend behavior.

#### Scenario: Configuring a successful mutation
- **WHEN** a P0 scenario configures a feedback mutation as successful
- **THEN** the fixture endpoint returns the accepted response and updates test-run state predictably

#### Scenario: Configuring a recoverable failure
- **WHEN** a P0 scenario configures validation, transport overflow, network-equivalent, timeout, storage, or server failure
- **THEN** the relevant Dialog or AlertDialog exposes accepted recovery behavior
- **AND** prior fixture data remains unchanged

#### Scenario: Configuring a lifecycle race
- **WHEN** a P0 scenario reviews or removes pending feedback before another submitted mutation
- **THEN** the fixture returns the applicable `404`, `FEEDBACK_ALREADY_REVIEWED`, or `FEEDBACK_NO_LONGER_WITHDRAWABLE` response
- **AND** the browser-visible workflow refreshes authoritative detail

#### Scenario: Reporting fixture coverage scope
- **WHEN** feedback browser coverage passes
- **THEN** the result is described as fixture-backed functional integration coverage
- **AND** it is not represented as proof of live authentication, backend authorization, persistence, or production data behavior

### Requirement: Feedback browser coverage uses one high-level seam
The feedback UI SHALL be verified primarily through the existing Playwright P0 browser seam running the real localized Next.js application in fixture submode against the HTTP fixture backend. Tests SHALL enter through visible navigation or canonical routes and SHALL assert only observable UI, URL, focus, accessibility, permission, responsive, request-boundary, and confirmed mutation behavior.

#### Scenario: Exercising the personal journey
- **WHEN** the P0 browser suite opens compose through the user menu and completes personal success and recovery scenarios
- **THEN** it verifies field validation, conditional reproduction steps, privacy-bounded technical context, screenshot upload and delivery, dirty dismissal, confirmed success, personal history, detail, withdrawal, and missing ownership treatment through visible behavior

#### Scenario: Exercising the moderation journey
- **WHEN** the P0 browser suite opens moderation with configured server permissions and scenarios
- **THEN** it verifies left-menu visibility, direct-route gating, explicit pending filter, URL-backed controls, canonical detail navigation, permission/status action combinations, required Promote Issue URL, Dismiss omission, deletion at every status, lifecycle races, and preserved queue context through visible behavior

#### Scenario: Avoiding implementation assertions
- **WHEN** a feedback browser test evaluates a workflow
- **THEN** it does not inspect React state, private component methods, fixture state internals, or feedback browser globals

### Requirement: Feedback P0 remains secret-free and externally isolated
Feedback P0 coverage SHALL run without Clerk credentials, live backend access, GitHub access, external screenshot storage, or other third-party network requests. Existing fixture network-violation detection and feedback contract guards SHALL remain clean for every feedback journey.

#### Scenario: Running feedback P0 from a pull request
- **WHEN** the feedback P0 suite runs in the secret-free quality gate
- **THEN** it uses synthetic HTTP fixture data and supported dev-auth behavior
- **AND** no external feedback, authentication, GitHub, or media request is made

#### Scenario: Detecting fixture contract drift
- **WHEN** the final activation gate compares exercised fixture behavior with the live OpenAPI structural contract and accepted BE clarification
- **THEN** the deterministic contract guard fails until endpoint, request, response, and success/error status behavior has no hard contradiction
- **AND** lifecycle, screenshot, and other semantic detail may be satisfied by the accepted BE clarification when the live document is sparse

#### Scenario: Preserving failure evidence
- **WHEN** a feedback P0 browser test fails
- **THEN** the existing runner preserves its trace, screenshot, video, and sanitized fixture/application diagnostics

### Requirement: Feedback fixture surfaces meet the P0 accessibility boundary
The feedback browser suite SHALL fail on serious or critical axe violations in the agreed compose, personal, queue, detail, review, deletion, screenshot-unavailable, empty, malformed-response, and error states. It SHALL also verify keyboard operation and focus restoration for covered Dialog and AlertDialog flows.

#### Scenario: Closing compose by keyboard
- **WHEN** a browser test opens and closes the compose Dialog using keyboard interaction
- **THEN** focus returns to the originating `Gửi phản hồi` control when it remains available

#### Scenario: Recovering from invalid review input
- **WHEN** a browser test submits an invalid feedback review message
- **THEN** the field error is visible and announced
- **AND** focus moves to the invalid field

#### Scenario: Detecting an accessibility regression
- **WHEN** axe reports a serious or critical violation on a covered feedback state
- **THEN** the P0 browser test fails with preserved diagnostic evidence

## REMOVED Requirements

### Requirement: Feedback UI is fixture-only until integration
**Reason**: This change completes authenticated API integration and activates feedback outside P0 after the live OpenAPI structural cross-check.

**Migration**: Replace fixture-submode route and navigation gating with active-user personal access and canonical permission-gated moderation access; keep synthetic data confined to the configured P0 backend.

### Requirement: One in-memory fixture owner supplies the feature
**Reason**: Client-owned fixture state bypasses the Server Action and HTTP transport used in production and would preserve a duplicate lifecycle implementation.

**Migration**: Move deterministic state, permissions, mutations, failures, and screenshot data to the isolated HTTP fixture backend, then remove the protected-layout provider, reducer, commands, seeds, and browser globals.

### Requirement: Fixture records provide explicit action capabilities
**Reason**: Backend detail responses do not expose capability fields; accepted runtime behavior derives UI affordances from status, scope, and canonical permissions.

**Migration**: Remove synthetic capability fields and capability-matrix scenarios, replace them with status/permission derivation and authoritative `404`/lifecycle-`409` race scenarios.
