# feedback-ui-fixtures Specification

## Purpose
Define the deterministic, secret-free in-memory fixture boundary that enables feedback UI development and browser verification before live API integration.

## Requirements

### Requirement: Feedback UI is fixture-only until integration
The system SHALL expose feedback navigation, routes, data, and mutations only when the supported P0 fixture submode is enabled. Outside that submode, feedback navigation SHALL be absent and direct access to personal or moderation feedback routes SHALL resolve as not found.

#### Scenario: Running in fixture submode
- **WHEN** the protected application starts with the supported P0 fixture submode enabled
- **THEN** fixture-appropriate personal feedback entry points are available
- **AND** permission-gated moderation navigation can be rendered for configured fixture permissions

#### Scenario: Running outside fixture submode
- **WHEN** the application runs without the P0 fixture submode
- **THEN** feedback navigation is absent
- **AND** direct access to `/feedback`, `/feedback/{id}`, `/feedback-submissions`, or `/feedback-submissions/{id}` resolves as not found
- **AND** no synthetic feedback data is rendered

### Requirement: One in-memory fixture owner supplies the feature
The fixture-only feedback feature SHALL use one feature-scoped in-memory state owner seeded with synthetic feedback records. State SHALL survive client-side navigation within the protected app, SHALL update after supported fixture mutations, and SHALL reset to its deterministic seed after a full reload or new isolated test run. The system MUST NOT persist feedback fixtures to localStorage, IndexedDB, cookies, or an external store.

#### Scenario: Mutating fixture state
- **WHEN** a supported compose, withdraw, promote, dismiss, or erase fixture mutation succeeds
- **THEN** all mounted feedback consumers observe the updated state
- **AND** the updated state remains available through later client-side navigation in the same app session

#### Scenario: Reloading the application
- **WHEN** the browser performs a full reload after fixture mutations
- **THEN** feedback state returns to its configured deterministic seed

#### Scenario: Starting an isolated browser test
- **WHEN** a P0 feedback browser test begins
- **THEN** it does not observe feedback mutations from another test run

### Requirement: Fixture records provide explicit action capabilities
Every feedback detail fixture SHALL declare the available withdraw, promote, dismiss, and erase capabilities separately from its status. UI action availability SHALL require both the relevant user permission and the explicit fixture capability where a permission applies.

#### Scenario: Same status has different fixture capabilities
- **WHEN** two fixture records share the same status but declare different action capabilities
- **THEN** their rendered actions differ according to the explicit capabilities
- **AND** the UI does not infer a lifecycle rule from the shared status

#### Scenario: Permission and capability are both required
- **WHEN** a moderation action capability is true but the configured permission is absent
- **THEN** the action is not rendered

### Requirement: Fixture data covers contract-relevant optionality and edge states
The feedback fixture catalog SHALL include synthetic personal and moderation records that cover `BUG` and `IDEA`, all three statuses, absent optional fields, review outcomes, GitHub issue references, previewable and unsupported screenshots, technical-context opt-out, inactive sender metadata, long localized content, and each supported action-capability combination.

#### Scenario: Rendering optional fields safely
- **WHEN** a fixture omits reproduction steps, screenshot, technical context, review message, GitHub issue reference, or optional sender fields
- **THEN** list and detail surfaces remain valid
- **AND** the UI does not invent placeholder domain data

#### Scenario: Rendering long localized content
- **WHEN** a fixture contains long Vietnamese or English titles, descriptions, review messages, or metadata
- **THEN** content wraps or truncates according to the shared design system
- **AND** full decision-relevant text remains available without page-level overflow

### Requirement: Fixture mutations expose deterministic observable states
Fixture mutations SHALL support deterministic success, pending, validation-error, and mutation-failure behavior. The feature SHALL use these states only to exercise UI behavior and SHALL NOT claim that they prove the live feedback transport, backend authorization, persistence, or lifecycle contract.

#### Scenario: Configuring a successful mutation
- **WHEN** a P0 scenario configures a feedback mutation as successful
- **THEN** the corresponding user-visible fixture state updates predictably

#### Scenario: Configuring a mutation failure
- **WHEN** a P0 scenario configures a feedback mutation failure
- **THEN** the relevant Dialog or AlertDialog exposes the accepted recovery behavior
- **AND** prior fixture data remains unchanged

#### Scenario: Reporting fixture coverage scope
- **WHEN** feedback browser coverage passes
- **THEN** the result is described as UI-only fixture-backed coverage
- **AND** it is not represented as proof of live API integration or real authorization

### Requirement: Feedback browser coverage uses one high-level seam
The feedback UI SHALL be verified primarily through the existing Playwright P0 browser seam running the real localized Next.js application in fixture submode. Tests SHALL enter through visible navigation or canonical routes and SHALL assert only observable UI, URL, focus, accessibility, permission, responsive, and fixture-mutation behavior.

#### Scenario: Exercising the personal journey
- **WHEN** the P0 browser suite opens compose through the user menu and completes configured personal success and recovery scenarios
- **THEN** it verifies field validation, conditional reproduction steps, technical-context choice, screenshot presentation, dirty dismissal, success behavior, personal history, detail, and withdrawal through visible behavior

#### Scenario: Exercising the moderation journey
- **WHEN** the P0 browser suite opens the moderation queue with configured permissions and scenarios
- **THEN** it verifies default pending state, URL-backed controls, canonical detail navigation, permission/capability combinations, review outcomes, deletion recovery, and preserved queue context through visible behavior

#### Scenario: Avoiding implementation assertions
- **WHEN** a feedback browser test evaluates a workflow
- **THEN** it does not inspect React state, private component methods, or fixture-store internals

### Requirement: Feedback P0 remains secret-free and externally isolated
Feedback P0 coverage SHALL run without Clerk credentials, live backend access, GitHub access, external screenshot storage, or other third-party network requests. Existing fixture network-violation detection SHALL remain clean for every feedback journey.

#### Scenario: Running feedback P0 from a pull request
- **WHEN** the feedback P0 suite runs in the secret-free quality gate
- **THEN** it uses synthetic local data and supported dev-auth fixture behavior
- **AND** no external feedback, authentication, GitHub, or media request is made

#### Scenario: Preserving failure evidence
- **WHEN** a feedback P0 browser test fails
- **THEN** the existing runner preserves its trace, screenshot, video, and fixture/application diagnostics

### Requirement: Feedback fixture surfaces meet the P0 accessibility boundary
The feedback browser suite SHALL fail on serious or critical axe violations in the agreed compose, personal, queue, detail, review, deletion, empty, and error states. It SHALL also verify keyboard operation and focus restoration for covered Dialog and AlertDialog flows.

#### Scenario: Closing compose by keyboard
- **WHEN** a browser test opens and closes the compose Dialog using keyboard interaction
- **THEN** focus returns to the originating `Gửi phản hồi` control when it remains available

#### Scenario: Recovering from invalid review input
- **WHEN** a browser test submits an invalid review message
- **THEN** the field error is visible and announced
- **AND** focus moves to the invalid field

#### Scenario: Detecting an accessibility regression
- **WHEN** axe reports a serious or critical violation on a covered feedback state
- **THEN** the P0 browser test fails with preserved diagnostic evidence
