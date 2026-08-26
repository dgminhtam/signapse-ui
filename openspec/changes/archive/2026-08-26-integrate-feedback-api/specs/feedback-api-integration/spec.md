## ADDED Requirements

### Requirement: Feedback integration uses separate implementation and activation gates
The system SHALL accept the checked-in backend clarification as the semantic runtime contract for transport, UI, and HTTP fixture implementation. It MUST keep fixture contract approval, production feedback activation, and OpenSpec archive behind a live dev OpenAPI/API mapping cross-check that rules out hard contradictions in paths, methods, authorization scopes, multipart fields, response shapes, and success/error statuses. Missing requiredness, nullability, constraints, examples, or lifecycle detail MAY remain undocumented in OpenAPI when BE explains the behavior in the accepted clarification.

#### Scenario: Implementation gate passes
- **WHEN** the accepted backend clarification is captured in the change while OpenAPI documentation still lags
- **THEN** frontend implementation and HTTP fixture work may proceed behind existing production gates

#### Scenario: Activation gate passes
- **WHEN** live dev OpenAPI and the API mapping ledger contain no hard contradiction with the accepted runtime clarification and fixture contract guards pass
- **THEN** the integrated frontend may expose personal feedback to active users and moderation feedback according to canonical permissions

#### Scenario: Activation gate remains incomplete
- **WHEN** a required path, method, authorization boundary, multipart field, response shape, or success/error status contradicts the accepted runtime clarification
- **THEN** production feedback gates remain enabled and the change is not archived
- **AND** the divergence returns to exploration rather than being waived

#### Scenario: OpenAPI omits semantic detail
- **WHEN** the live document omits requiredness, nullability, constraints, examples, or lifecycle prose
- **AND** the accepted BE clarification explains the runtime behavior
- **THEN** the omission is recorded as a documentation gap and does not block activation or archive

### Requirement: Feedback transport is authenticated and runtime-validated
The system SHALL perform feedback reads and mutations through the shared authenticated server transport and SHALL validate list pages, detail responses, mutation responses, errors, and screenshot metadata before exposing domain data to UI components. Unknown additive fields MAY be ignored, but missing or invalid core fields MUST fail closed without fabricated fallback data.

#### Scenario: Parsing a valid list item
- **WHEN** a list response contains a valid identifier, type, title, status, creation time, last-modified time, and nullable screenshot metadata
- **THEN** the item is mapped to the feedback list view model

#### Scenario: Parsing a valid detail
- **WHEN** a detail response contains all list invariants plus description and expected outcome
- **THEN** the detail is mapped to the feedback detail view model

#### Scenario: Rejecting malformed core data
- **WHEN** a feedback response omits or invalidates a core field or required conditional field
- **THEN** the system renders the localized recoverable error boundary for that surface
- **AND** it does not invent a title, status, date, sender, review message, or GitHub issue number

#### Scenario: Validating conditional detail fields
- **WHEN** screenshot metadata is present, moderation detail is returned, status is reviewed, or promoted moderation detail includes GitHub data
- **THEN** screenshot identifier, normalized MIME type, and size; moderation sender; feedback review message; or positive GitHub issue number respectively satisfy the confirmed conditional invariant

### Requirement: Feedback action affordances derive from status, scope, and permission
The system SHALL expose withdrawal only in personal scope for `PENDING_REVIEW`, Promote and Dismiss only for `PENDING_REVIEW` when the account has `feedback:review`, and administrative Delete for any existing moderation detail when the account has `feedback:delete`. These affordances SHALL control presentation only; the backend remains authoritative for authorization and concurrent lifecycle changes.

#### Scenario: Pending personal feedback is withdrawable
- **WHEN** personal detail has status `PENDING_REVIEW`
- **THEN** the withdrawal action is available without a capability field

#### Scenario: Review requires pending status and permission
- **WHEN** moderation detail is not pending or the account lacks `feedback:review`
- **THEN** Promote and Dismiss are unavailable

#### Scenario: Administrative deletion is permission-only
- **WHEN** moderation detail exists and the account has `feedback:delete`
- **THEN** Delete is available for pending, promoted, and dismissed feedback

#### Scenario: Rendered affordance becomes stale
- **WHEN** a concurrent operation changes or removes feedback before mutation
- **THEN** the frontend follows the backend `404` or lifecycle `409` result instead of treating the rendered affordance as a guarantee

### Requirement: Initial feedback lifecycle is explicit
The runtime contract SHALL treat `PENDING_REVIEW` feedback as eligible for sender withdrawal, promotion, dismissal, or administrative deletion and SHALL permit administrative deletion for `PROMOTED` and `DISMISSED`. Promote and Dismiss SHALL be mutually exclusive and irreversible. Successful withdrawal and deletion SHALL make the record inaccessible and return `204 No Content`; successful Promote and Dismiss SHALL return updated moderation detail.

#### Scenario: Completing a review outcome
- **WHEN** pending feedback is successfully promoted or dismissed
- **THEN** the backend returns resulting moderation detail with the new status, required user-visible review message, and promoted GitHub issue number when applicable

#### Scenario: Requesting a stale transition
- **WHEN** Promote or Dismiss targets reviewed feedback, or withdrawal targets reviewed feedback
- **THEN** the backend returns `409` with `FEEDBACK_ALREADY_REVIEWED` or `FEEDBACK_NO_LONGER_WITHDRAWABLE` respectively
- **AND** the frontend refreshes authoritative detail instead of applying an optimistic result

#### Scenario: Review races withdrawal
- **WHEN** review and withdrawal race on the same pending feedback
- **THEN** the losing request may receive `404` or its lifecycle `409` according to commit order
- **AND** the frontend treats either response as stale authoritative state

#### Scenario: Accessing removed feedback
- **WHEN** withdrawal or administrative deletion succeeds
- **THEN** later detail and screenshot access resolves as missing within the requesting scope

### Requirement: Promote and Dismiss use distinct request contracts
Both review requests SHALL require a user-visible review message of 10 through 1000 characters. Promote SHALL additionally require a structurally valid GitHub Issue URL, while Dismiss MUST omit `githubIssueUrl`. Backend repository validation remains authoritative, backend SHALL store only the positive issue number, and personal responses MUST NOT expose GitHub data.

#### Scenario: Promoting with a valid Issue URL
- **WHEN** a reviewer submits a valid message and GitHub Issue URL to Promote
- **THEN** the request includes both fields
- **AND** successful moderation detail contains the parsed positive issue number

#### Scenario: Promoting without an Issue URL
- **WHEN** a reviewer omits or enters a structurally invalid GitHub Issue URL
- **THEN** frontend validation blocks Promote before transport

#### Scenario: Backend rejects the configured repository
- **WHEN** the URL is structurally valid but does not belong to the configured Signapse repository
- **THEN** the backend returns `400`
- **AND** the Promote Dialog preserves both inputs for correction

#### Scenario: Dismissing feedback
- **WHEN** a reviewer submits a valid Dismiss message
- **THEN** the request omits `githubIssueUrl`
- **AND** successful detail contains no GitHub issue number created by that dismissal

#### Scenario: Viewing personal feedback
- **WHEN** a sender views pending, promoted, or dismissed personal detail
- **THEN** no GitHub issue URL or issue number is exposed

### Requirement: Moderation query serialization is bounded and stable
The system SHALL serialize moderation queue controls through `$filter`, zero-based `page`, size no greater than `100`, and repeated `sort` parameters. `$filter` SHALL use `containsIgnoreCase` for title, `eq` for exact type and status, and `and` for combined controls. UI pages SHALL remain one-based, ordering SHALL include identifier as a same-direction stable tie-breaker, and the frontend MUST NOT send `specification` or `pageable`.

#### Scenario: Opening the default queue
- **WHEN** moderation opens without valid query state
- **THEN** the request explicitly sends `status eq PENDING_REVIEW`, creation time descending, identifier descending, and the accepted UI page size

#### Scenario: Combining queue controls
- **WHEN** title, type, and status controls are set
- **THEN** `$filter` combines their whitelisted expressions with `and`

#### Scenario: Canonicalizing malformed URL state
- **WHEN** page, size, sort, type, or status URL values are invalid
- **THEN** the system replaces them with safe canonical values
- **AND** it does not forward arbitrary fields or operators to the backend

#### Scenario: Backend page is out of range
- **WHEN** the backend returns `200` with empty content for an out-of-range page
- **THEN** the UI resolves the nearest valid page when total-page metadata permits
- **AND** unrelated queue controls remain intact

### Requirement: Submission transport preserves privacy and file constraints
Feedback creation SHALL send one structured submission part and at most one optional screenshot part as multipart data. Technical context SHALL be enabled by default but inspectable and optional; when included, page path MUST exclude query, fragment, and absolute URLs, unknown fields MUST NOT be sent, and the payload MUST exclude page content, form values, raw user-agent, IP address, and device identifiers. Reproduction steps and observation time SHALL be omitted for IDEA. Screenshot input SHALL be limited to a manually selected PNG or JPEG image of at most 5 MiB and 25 megapixels.

#### Scenario: Creating feedback with optional data
- **WHEN** valid feedback includes enabled technical context and an allowed screenshot
- **THEN** the authenticated request contains the structured submission part and one binary screenshot part
- **AND** the multipart envelope is not forced to use a JSON content type

#### Scenario: Creating without optional data
- **WHEN** technical context is disabled and no screenshot is selected
- **THEN** the request omits both optional values without changing required submission fields

#### Scenario: Creating an idea with technical context
- **WHEN** valid IDEA feedback includes technical context
- **THEN** the request omits reproduction steps and observation time
- **AND** other allowed context values remain optional

#### Scenario: Rejecting an invalid screenshot before transport
- **WHEN** the selected file is not PNG/JPEG, exceeds 5 MiB, or decodes above 25 megapixels
- **THEN** submission is blocked with a localized field-associated error

### Requirement: Screenshot delivery is scope-specific and hardened
The system SHALL deliver feedback screenshots inline through separate authenticated personal and moderation route scopes. Each route SHALL call only its matching backend endpoint and return normalized PNG/JPEG binary content with `Content-Disposition: inline`, private no-store caching, and `X-Content-Type-Options: nosniff`. It MUST NOT expose a backend storage URL, invent `ETag` or `Last-Modified`, or fall back to the other authorization scope.

#### Scenario: Serving an allowed screenshot
- **WHEN** the matching backend screenshot endpoint returns normalized PNG/JPEG bytes
- **THEN** the internal route returns the image inline with normalized MIME, private no-store caching, and `nosniff`

#### Scenario: Isolating screenshot failure
- **WHEN** screenshot loading returns network failure, timeout, server failure, or temporary storage `502` while detail remains valid
- **THEN** detail remains usable
- **AND** the screenshot region renders a localized unavailable state with a bounded retry

#### Scenario: Screenshot is missing or outside personal ownership
- **WHEN** screenshot access returns `404`
- **THEN** the screenshot region renders unavailable without exposing whether content was absent or belonged to another sender

#### Scenario: Backend rejects screenshot upload
- **WHEN** image validation fails or content exceeds 5 MiB, or the Spring transport limit is exceeded
- **THEN** the frontend handles backend `400` or `413` without assuming `415`
- **AND** no unsupported download or backend URL is exposed

### Requirement: Feedback errors are normalized, localized, and non-disclosing
The shared authenticated transport SHALL preserve HTTP status and an optional backend error code. The frontend SHALL recognize the two stable lifecycle codes, map action and status to dictionary-owned recovery copy, and MUST NOT assume feedback-specific field errors, `422`, `415`, or `429`. Raw backend messages, response bodies, stack traces, and storage identifiers MUST NOT become direct UI copy.

#### Scenario: Handling validation failure
- **WHEN** the backend returns `400` without a stable lifecycle code
- **THEN** the active form displays an action-specific localized form-level error
- **AND** valid input remains available for correction

#### Scenario: Handling lifecycle conflict
- **WHEN** a mutation returns `FEEDBACK_ALREADY_REVIEWED` or `FEEDBACK_NO_LONGER_WITHDRAWABLE`
- **THEN** the action surface closes, authoritative detail refreshes, and localized copy explains that another operation changed the feedback

#### Scenario: Handling recoverable transport failure
- **WHEN** a request fails because of network, timeout, `413`, `502`, or another server error
- **THEN** valid user input is preserved for retry
- **AND** no optimistic domain change is displayed

#### Scenario: Avoiding ownership enumeration
- **WHEN** personal detail or screenshot access returns `404`
- **THEN** the UI renders the localized missing or unavailable state without ownership disclosure

### Requirement: Confirmed mutations revalidate authoritative feedback state
The system SHALL update feedback UI only after backend confirmation and SHALL revalidate affected personal or moderation list and detail data. It MUST NOT use optimistic feedback state or share user-specific feedback cache entries across users.

#### Scenario: Creating from personal history
- **WHEN** create succeeds while the sender is on personal history
- **THEN** the route canonicalizes to page `1`
- **AND** refreshed backend data shows the new feedback first

#### Scenario: Withdrawing feedback
- **WHEN** withdrawal succeeds
- **THEN** the sender returns to personal history page `1` with a localized success message

#### Scenario: Deleting moderation feedback
- **WHEN** administrative deletion succeeds
- **THEN** the reviewer returns to the preserved queue context
- **AND** an out-of-range page is adjusted to the nearest valid page

#### Scenario: Reviewing feedback
- **WHEN** promote or dismiss succeeds
- **THEN** the reviewer remains on canonical detail with refreshed status, review message, and moderation-only issue number where applicable

### Requirement: Feedback observability excludes sensitive content
Feedback diagnostics SHALL limit logs to operation, status, duration, correlation identifier, and an already-existing feedback identifier. Logs and client telemetry MUST NOT include title, description, expected outcome, reproduction steps, feedback review message, screenshot bytes or metadata, technical-context payload, or form values.

#### Scenario: Logging a failed operation
- **WHEN** an authenticated feedback request fails
- **THEN** diagnostic output contains only the permitted operational metadata
- **AND** it contains no feedback content or attachment data
