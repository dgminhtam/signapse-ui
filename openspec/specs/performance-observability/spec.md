# performance-observability Specification

## Purpose

Provide privacy-safe, low-cardinality performance evidence that explains where Signapse UI user journeys spend time without changing the behavior of those journeys.

## Requirements

### Requirement: Performance signals explain priority user journeys

The system SHALL expose stable performance operations for Dashboard loading, Market Chart initial data readiness and live-stream behavior, and AI Assistant submission so maintainers can distinguish browser, Next.js, authentication, backend, and response-processing latency.

#### Scenario: Dashboard load is observable

- **WHEN** the protected Dashboard resolves its workspace-scoped data
- **THEN** the system records one stable Dashboard load operation covering the server work required to assemble the page state
- **AND** downstream authentication and backend operations remain distinguishable within the same request trace

#### Scenario: Market Chart initial data becomes ready

- **WHEN** a valid Market Chart selection begins loading and valid initial series data reaches the workbench success state
- **THEN** the system records an initial-data-ready measurement with a stable outcome
- **AND** it does not claim to measure browser paint unless an actual render-completion signal is available

#### Scenario: AI Assistant submission completes

- **WHEN** a valid AI Assistant submission produces an assistant message
- **THEN** the system measures from accepted submission through message availability
- **AND** response reveal animation time is excluded

#### Scenario: First submission creates a conversation

- **WHEN** an AI Assistant submission must create a conversation before sending the message
- **THEN** the measured submission duration includes conversation creation
- **AND** the operation distinguishes new versus existing conversation without recording a conversation identifier

### Requirement: Browser Web Vitals retain one authoritative source

The system SHALL retain the existing browser performance service as the authoritative source for TTFB, LCP, INP, and CLS and SHALL NOT duplicate successful Web Vital measurements into structured performance logs.

#### Scenario: Browser performance is reported

- **WHEN** an eligible non-fixture page is used in an enabled deployment
- **THEN** browser Web Vitals continue to be reported through the existing integration
- **AND** server tracing supplements rather than replaces those measurements

### Requirement: Shared backend transport is observable

The system SHALL measure authenticated and public backend requests through their shared transport boundary using stable operation names, normalized routes, methods, outcomes, status codes, and durations.

#### Scenario: Successful backend request

- **WHEN** a shared transport request completes successfully
- **THEN** its trace records a stable backend operation, normalized route, method, status, outcome, and duration
- **AND** no successful-request duration log is emitted solely to duplicate the trace

#### Scenario: Authentication precedes a backend request

- **WHEN** an authenticated backend request resolves Clerk authentication and a backend token
- **THEN** authentication resolution is distinguishable from the backend request duration

#### Scenario: Response processing is material

- **WHEN** a selected large or contract-sensitive response is read, parsed, and validated
- **THEN** the relevant processing stages are distinguishable from backend network latency

### Requirement: Telemetry uses a strict privacy and cardinality allowlist

The system MUST export only approved low-cardinality telemetry attributes and MUST exclude user identifiers, workspace identifiers, asset identifiers, conversation identifiers, credentials, authorization headers, request or response bodies, prompts, messages, raw URLs, query strings, and other unapproved values.

#### Scenario: Dynamic backend URL is observed

- **WHEN** a backend request contains an entity identifier or query parameters
- **THEN** exported telemetry contains only a stable normalized route template
- **AND** neither the identifier nor query values appear in the operation name, attributes, or diagnostic log

#### Scenario: Automatic instrumentation emits unsafe attributes

- **WHEN** an automatic framework or fetch span would export an attribute outside the approved allowlist
- **THEN** the unsafe attribute or affected automatic span is sanitized or suppressed before Production rollout

#### Scenario: Validation fails on sensitive payload

- **WHEN** response schema validation fails
- **THEN** diagnostics may contain a bounded issue count, issue code, and normalized issue path
- **AND** the response payload and field values are not recorded

#### Scenario: Authorization is attached to backend request

- **WHEN** an authenticated transport sends a Clerk-derived authorization header
- **THEN** the header value does not appear in traces, logs, client events, or telemetry initialization diagnostics

### Requirement: Trace context propagation is restricted to the backend

The system SHALL propagate W3C trace context only to the configured Signapse backend origin and SHALL NOT propagate application-owned tracing context to unrelated third-party origins.

#### Scenario: Request targets configured backend

- **WHEN** an observed request targets the origin resolved from the backend base URL
- **THEN** the request carries W3C trace context when telemetry is enabled

#### Scenario: Request targets unrelated origin

- **WHEN** a request targets an image, analytics, or other third-party origin
- **THEN** the application does not add its backend tracing context to that request

#### Scenario: Backend lacks tracing support

- **WHEN** the backend does not continue the propagated trace
- **THEN** the Signapse UI trace still ends truthfully at the outbound backend operation
- **AND** UI observability remains usable

### Requirement: Structured diagnostics classify failures without duplicating traces

The system SHALL emit structured, low-cardinality diagnostics for HTTP failure, timeout, network failure, JSON parse failure, schema validation failure, and rate-limited telemetry initialization or export failure.

#### Scenario: HTTP request fails

- **WHEN** the backend returns a non-success status
- **THEN** the diagnostic identifies the stable feature or operation, normalized route, method, status, outcome, duration, and trace identifier when available
- **AND** it excludes arbitrary remote error-body content

#### Scenario: Transport times out

- **WHEN** the application-owned backend timeout aborts a request
- **THEN** telemetry classifies the outcome as a timeout rather than a generic network failure

#### Scenario: User lifecycle closes an operation

- **WHEN** an operation is cancelled or closed through an expected user or component lifecycle
- **THEN** telemetry records a non-error closed or cancelled outcome where a terminal measurement is required
- **AND** it does not inflate application error diagnostics

#### Scenario: Trace context is unavailable

- **WHEN** telemetry is disabled or no active trace exists during a diagnostic event
- **THEN** the structured record remains valid without a fabricated trace identifier

### Requirement: Telemetry failures do not affect application behavior

Telemetry collection MUST fail open and MUST NOT change page output, Server Action results, backend transport behavior, SSE delivery, or user-facing errors.

#### Scenario: Server exporter fails

- **WHEN** tracing or diagnostic export throws or is unavailable
- **THEN** the underlying application operation preserves its original result
- **AND** telemetry does not synchronously retry on the request path

#### Scenario: Client performance reporting fails

- **WHEN** a client performance event cannot be delivered
- **THEN** the user interaction and UI state continue normally

#### Scenario: Observed operation throws

- **WHEN** an observed operation throws, times out, or aborts
- **THEN** its span or measurement reaches a terminal state
- **AND** the original error semantics are preserved

### Requirement: Market Chart live-stream timing has explicit semantics

The system SHALL distinguish initial connection, reconnect, first usable live data, invalid payload, transport error, and expected closure without buffering or transforming the SSE stream.

#### Scenario: Initial stream opens

- **WHEN** a Market Chart creates an EventSource and receives its first open event
- **THEN** the system records initial connection latency with connection kind `initial`

#### Scenario: First usable live event arrives

- **WHEN** the opened stream receives its first valid snapshot, price, or candle event
- **THEN** the system records time to first live data once for that connection attempt

#### Scenario: Status arrives before market data

- **WHEN** a status event, retry directive, heartbeat, or error event arrives before a valid snapshot, price, or candle
- **THEN** that event does not complete the first-live-data measurement

#### Scenario: Browser reconnects the stream

- **WHEN** EventSource reconnects after a transport interruption
- **THEN** the system creates new connect and first-live-data measurements with connection kind `reconnect`

#### Scenario: Stream payload is invalid

- **WHEN** a named live event fails schema validation
- **THEN** telemetry records the `invalid_payload` outcome without recording the payload
- **AND** the existing UI error behavior remains unchanged

#### Scenario: Component closes the stream

- **WHEN** the owning component deliberately closes EventSource
- **THEN** any required terminal measurement uses a non-error `closed` outcome

### Requirement: Client milestones degrade without a custom-events service

The system SHALL report approved client milestones through the existing analytics capability only when explicitly enabled and supported, and SHALL retain local Web Performance measurements without adding a custom ingestion endpoint when remote custom events are unavailable.

#### Scenario: Custom client events are enabled and supported

- **WHEN** an approved client operation completes in an eligible deployment
- **THEN** the system sends a stable event name with duration and approved low-cardinality outcome fields

#### Scenario: Custom client events are disabled or unavailable

- **WHEN** the deployment does not enable or support custom analytics events
- **THEN** the application sends no custom performance event externally
- **AND** local diagnostic performance entries remain available without changing the user interaction

### Requirement: Environment controls isolate telemetry and sampling

The system SHALL support explicit server enablement, separate client-event enablement, and configurable trace sampling while keeping local development and deterministic fixture execution externally silent by default.

#### Scenario: Preview telemetry is enabled

- **WHEN** Preview is configured for the observability rollout
- **THEN** eligible traces are sampled fully for privacy, semantics, and waterfall inspection

#### Scenario: Production baseline is enabled

- **WHEN** Production begins the initial baseline and traffic or cost does not require a lower rate
- **THEN** eligible traces are sampled fully for the defined baseline window

#### Scenario: Sampling is reduced

- **WHEN** maintainers configure a lower supported sampling ratio after reviewing volume and cost
- **THEN** child operations follow a consistent parent trace sampling decision

#### Scenario: Local or fixture mode uses defaults

- **WHEN** the app runs in ordinary local development or deterministic fixture mode without explicit telemetry enablement
- **THEN** no application-owned telemetry is exported externally

#### Scenario: Telemetry is rolled back

- **WHEN** maintainers disable server telemetry or select an always-off sampler
- **THEN** application functionality remains available without requiring code removal

### Requirement: Production rollout is gated by privacy verification

The system MUST NOT roll the new telemetry into Production until Preview inspection demonstrates that exported operations and attributes conform to the approved allowlist.

#### Scenario: Preview contains unsafe or high-cardinality data

- **WHEN** an exported Preview signal contains an unapproved attribute, raw query, identifier, credential, payload, or unstable operation name
- **THEN** Production rollout is blocked until the signal is sanitized or suppressed

#### Scenario: Preview passes inspection

- **WHEN** representative Dashboard, Market Chart, AI Assistant, failure, and reconnect traces contain only approved signals
- **THEN** the telemetry configuration is eligible for Production baseline rollout

### Requirement: Baseline handoff precedes optimization targets

The system SHALL document a seven-day Production baseline procedure that evaluates Web Vitals and p50, p75, p95, and p99 latency by stable route or operation before introducing operation-specific slow thresholds, SLOs, alerts, or performance optimizations.

#### Scenario: Implementation verification completes

- **WHEN** deterministic repository checks and the Preview privacy gate have completed
- **THEN** the observability implementation may be finalized without waiting seven calendar days for Production traffic

#### Scenario: Baseline period completes

- **WHEN** representative Production telemetry has been collected for seven days
- **THEN** maintainers rank candidate optimizations using traffic volume, tail latency, and user-journey importance
- **AND** caching, concurrency, or data-flow changes are proposed separately

### Requirement: Operational behavior is documented

The system SHALL document the signal catalog, attribute allowlist, configuration, sampling, trace inspection, baseline, failure isolation, rollout, and rollback procedures needed to operate performance observability safely.

#### Scenario: Maintainer investigates a slow operation

- **WHEN** a maintainer consults the observability guide
- **THEN** the guide identifies the relevant stable signals and explains how to inspect their waterfall without relying on payload data

#### Scenario: Maintainer changes sampling or disables telemetry

- **WHEN** a maintainer needs to control volume or roll back telemetry
- **THEN** the guide provides the supported environment configuration and verification steps
