## Context

See `proposal.md` for motivation. Signapse UI is a Next.js 16 App Router application whose protected backend JSON requests are centralized in one authenticated/public transport. Market Chart live data is the intentional exception: an HTTP route proxies an SSE response and a client adapter owns EventSource parsing and reconnect behavior. Browser Web Vitals and page analytics are already mounted outside fixture mode, while runtime logging is limited to scattered error calls and response-validation diagnostics.

The design must span Node server startup, Server Components and actions, the browser runtime, an SSE proxy, and existing Vercel services without allowing observability to become a second failure path. The agreed telemetry policy excludes raw URLs and query strings in addition to the more obvious credentials, identity, and payload data, so automatic instrumentation cannot be trusted without exported-span verification.

The five agreed test seams are the shared server transport, root instrumentation registration, the existing EventSource adapter, one new shared client performance-event adapter, and the existing Dashboard/Market Chart/AI Assistant feature-operation boundaries.

## Goals / Non-Goals

**Goals:**

- Produce a coherent waterfall from a Next.js request through application operations, authentication, and sanitized backend operations.
- Preserve one semantic catalog across tracing, diagnostics, and client milestones without importing server-only dependencies into client code.
- Make privacy, low cardinality, and fail-open behavior structural properties that can be verified deterministically.
- Measure the three priority journeys at honest boundaries: Dashboard state assembly, Market Chart initial data readiness and SSE behavior, and AI Assistant message availability.
- Keep enablement, sampling, Preview validation, Production baseline, and rollback operationally explicit.

**Non-Goals:**

- Instrument backend internals, change data-fetch behavior, or optimize any measured path.
- Add browser OTel, a custom telemetry ingestion endpoint, a metrics collector, an in-app dashboard, pre-baseline SLOs, or latency alerts.
- Replace all application logging or expose telemetry configuration through user-visible UI.
- Make live Vercel or backend verification a deterministic OpenSpec archive gate.

## Decisions

### Use one semantic catalog with runtime-specific adapters

Define one small semantic catalog for feature names, operation names, outcomes, error types, connection kinds, and approved attribute keys. A server-only adapter owns spans, trace-context access, diagnostic output, and backend propagation. A client-safe adapter owns monotonic measurements and optional Analytics custom events. Feature code refers to semantic operations rather than importing vendor APIs directly.

This creates one conceptual observability boundary while respecting the unavoidable server/client bundle split. It also gives tests a stable output seam without creating feature-specific telemetry frameworks.

Alternative considered: call OpenTelemetry and Analytics directly at every usage site. Rejected because it would duplicate privacy filtering, error isolation, naming, and test setup across features.

### Initialize OpenTelemetry once and keep application spans on the Node path

Add the root Next.js instrumentation convention and register `@vercel/otel` with stable service name `signapse-ui` when `SIGNAPSE_TELEMETRY_ENABLED` is true. Application custom spans live on the Node server path used by Server Components, Server Actions, and route handlers; proxy or Edge-specific custom spans are not required.

When disabled, registration returns without initializing an external exporter and OpenTelemetry API calls remain harmless no-ops. Fixture mode overrides external enablement so deterministic P0 execution cannot emit telemetry even if a surrounding environment is misconfigured.

Sampling configuration uses the standard `OTEL_TRACES_SAMPLER` and `OTEL_TRACES_SAMPLER_ARG` inputs, mapped to a parent-based sampler so child operations follow the root decision. Preview and the initial Production baseline use full sampling where volume permits; `always_off` is the operational kill switch in addition to the explicit enablement flag.

Alternative considered: make Vercel deployment detection implicitly enable telemetry. Rejected because explicit configuration is safer for Preview, local, fixture, and future non-Vercel deployments.

### Treat the telemetry allowlist as an export contract

Application-owned spans and diagnostics are constructed from approved fields rather than sanitized after arbitrary objects have been attached. The catalog exposes only stable feature/operation, normalized method/route, numeric status, low-cardinality outcome/error type, locale, environment, connection kind, duration for diagnostics or client events, and trace ID when available.

Route normalization parses the backend path, discards scheme, authority, query, and fragment, and converts dynamic numeric and UUID-like path segments to stable placeholders. Operation names never include the resulting route or any entity value.

Automatic framework and fetch spans receive a separate export-safety guard. Backend fetch calls are represented canonically by application-owned transport spans. Automatic fetch spans for those calls are suppressed when they cannot be proven to exclude full URLs, while W3C context is injected explicitly for the allowlisted backend origin. Framework request/render spans remain enabled only if exporter-capture tests and Preview inspection prove their exported attributes meet the same policy; unsafe URL/target attributes are overwritten, filtered, or the affected span type is suppressed.

Alternative considered: accept Vercel/Next.js automatic attributes as safe defaults. Rejected because automatic fetch instrumentation can derive resource names and attributes from full URLs, which conflicts with the agreed raw-query prohibition.

Alternative considered: disable all framework tracing. Rejected because route/render spans are needed to separate infrastructure and rendering latency from application operations; selective suppression preserves more useful context.

### Instrument the shared transport instead of every action

Wrap the shared transport at two levels:

1. `signapse.auth.resolve` covers fixture/header resolution or Clerk user/token resolution for authenticated calls.
2. `signapse.backend.request` covers the outbound request through response-body read and JSON parsing, with child stages only where separate processing is material.

The transport records a terminal outcome in `finally` and rethrows the original error. It distinguishes backend status failure, application timeout, other abort/cancellation, network failure, parse failure, empty success, and normal success. It does not serialize request options, headers, body, response body, raw URL, or caught error objects.

Feature actions that perform meaningful schema validation may add a bounded validation stage and diagnostic using the server observability adapter. The existing Graph View validation-summary approach is reused conceptually: issue count, code, and normalized path are allowed; payloads and values are not.

Alternative considered: add timing to every one of the roughly one hundred transport callers. Rejected because the centralized boundary already provides broad, consistent coverage and caller-by-caller instrumentation would drift.

### Keep normal durations in spans and emit only failure diagnostics

Successful duration distributions come from spans. Structured JSON diagnostics are reserved for HTTP failure, timeout, network failure, parse failure, validation failure, and rate-limited telemetry initialization/export failure. Each record has a stable schema and includes active trace ID only when one exists.

Diagnostics are emitted through the platform-captured server console rather than a new general logger or synchronous log service. Remote error-body messages and arbitrary `Error` serialization are excluded. Telemetry-adapter failures are caught, rate-limited where repeated initialization/export failures are possible, and never recursively logged through the same failing adapter.

Alternative considered: log every completed request with `duration_ms`. Rejected because it duplicates span data, increases volume, and makes tail analysis harder than querying trace distributions.

### Measure priority journeys at honest completion boundaries

`signapse.dashboard.load` is an active server span around the protected Dashboard operation that resolves permissions/locale, active workspace, and the downstream data needed to assemble page state. Existing error and partial-data semantics remain unchanged. Browser rendering continues to be represented by Speed Insights rather than a fabricated Dashboard paint milestone.

`signapse.market_chart.initial_load` is a client measurement from an accepted asset/timeframe load through committing valid initial series data to the workbench success state. The event is described as initial data ready, not paint complete. Stale generations that are deliberately discarded finish with a cancelled/stale outcome rather than success.

`signapse.market_assistant.submit` is a client measurement from accepted submission through assistant-message availability. A first submission includes conversation creation and uses the low-cardinality classification `new`; later submissions use `existing`. The existing reveal animation starts after this milestone and is excluded.

Client measurements use a monotonic clock. When custom performance events are enabled and supported, the adapter reports stable event name, rounded duration, outcome, and approved classification fields through the existing Analytics package. Otherwise it records only local Web Performance entries. Client reporting exceptions are swallowed after local cleanup.

Alternative considered: infer these journey durations from backend spans only. Rejected because Market Chart state preparation and AI Assistant first-conversation orchestration are user-perceived client workflows that cross multiple requests or local transitions.

### Extend the existing EventSource adapter without changing the stream

The EventSource adapter already centralizes construction, schema parsing, named events, errors, and close behavior, making it the highest safe SSE measurement seam.

Maintain per-connection-attempt state:

- Creation starts an `initial` connect measurement.
- The first `open` ends connect latency and starts/continues first-live-data timing.
- The first valid `snapshot`, `price`, or `candle` ends first-live-data exactly once.
- `status`, retry directives, heartbeats, and error events never complete first-live-data.
- A transport interruption followed by a later `open` begins a `reconnect` attempt with fresh measurements.
- Invalid named payloads end the relevant pending measurement as `invalid_payload` without recording event data.
- Explicit `close()` terminates pending measurements as non-error `closed`.

The adapter continues forwarding the original callbacks and never reads ahead, buffers, replaces, or transforms the SSE body.

Alternative considered: measure the proxy response duration. Rejected because `fetch()` completes at response headers and cannot represent first usable event or client reconnect behavior.

### Make client custom events an optional enhancement

Use `NEXT_PUBLIC_SIGNAPSE_PERFORMANCE_EVENTS_ENABLED` as an explicit client build/deployment flag. Enabling requires confirmation that the Vercel plan supports custom events. Absence of that capability does not add a new endpoint and does not block server observability; local performance entries remain the fallback.

This keeps plan limitations from becoming an application-owned analytics service and avoids adding browser tracing dependencies.

### Verify through five high-level seams

1. The existing shared transport is the server request/output seam.
2. Root instrumentation registration is the configuration and propagation seam.
3. The existing EventSource adapter is the SSE lifecycle seam.
4. One client performance-event adapter is the client reporting seam.
5. Existing Dashboard, Market Chart, and AI Assistant operation boundaries are the journey-outcome seams.

Tests substitute a recording tracer/logger/analytics adapter or fake EventSource at these boundaries and assert emitted semantic records. They intentionally avoid testing internal helper order. Sensitive fixture values are injected to prove absence from all exported output.

### Separate deterministic completion from operational baseline

Repository tasks end with lint, typecheck, focused tests, build, static privacy review, and OpenSpec validation. A representative Preview trace inspection is documented as the Production rollout gate but not fabricated as an automated local assertion.

The seven-day Production baseline is a non-checkbox, user-owned operational follow-up. It compares p50/p75/p95/p99 per stable route/operation with Speed Insights by route/device/environment and ranks later optimization candidates by volume, tail latency, and journey importance. It does not block implementation completion or archive.

## Risks / Trade-offs

- [Automatic framework spans expose raw targets or unstable attributes] → Capture exported spans deterministically where possible, inspect representative Preview traces, sanitize or suppress unsafe span types, and block Production rollout on any allowlist violation.
- [Manual transport spans duplicate an automatic fetch span] → Make the application-owned span canonical and suppress the backend automatic span when it cannot add safe information.
- [Suppressing automatic fetch spans weakens a Vercel waterfall] → Preserve parent application operations and explicit context propagation; prefer privacy over duplicated unsafe detail.
- [OTel configuration behaves differently across Node, Preview, and Vercel runtime versions] → Keep registration isolated, test enable/disable and sampler parsing, and validate a production-like Preview before rollout.
- [A telemetry exporter adds latency or becomes unavailable] → Use asynchronous platform export, no request-path retries, fail-open adapters, sampling, and a fast disable/always-off rollback.
- [Full Production sampling costs more than expected] → Review volume during Preview and early baseline, shorten full sampling or reduce the ratio without changing semantics.
- [Client custom events are unavailable on the deployed plan] → Keep the feature conditional and retain local measurements; do not create a fallback ingestion service.
- [EventSource reconnect state is misclassified] → Drive tests with the existing reconnect fixture sequence and fake EventSource lifecycle, and use only low-cardinality initial/reconnect classifications.
- [Long-lived SSE sessions create unfinished measurements] → Close pending connect/first-data measurements on explicit close, invalid payload, or terminal transport outcome; do not use normal lifetime as latency.
- [Instrumentation changes observable application errors] → Catch telemetry failures separately, end spans in `finally`, and assert original success/error results through the existing feature seams.
- [A seven-day baseline delays perceived value] → Treat the instrumentation and Preview waterfall as immediate deliverables; record baseline as operational follow-up rather than archive work.

## Migration Plan

1. Add server/client observability adapters, semantic catalog, dependencies, configuration parsing, and deterministic recording tests with external export disabled.
2. Register server tracing and prove allowlist compliance for framework and transport spans in tests or a local exporter capture.
3. Instrument shared transport and selected validation boundaries, then verify existing transport/action behavior remains unchanged.
4. Add Dashboard, Market Chart initial-load/SSE, and AI Assistant measurements through the agreed seams.
5. Add the operational guide and configure Preview for full sampling with client events only if supported.
6. Exercise representative success, error, timeout, invalid-payload, and reconnect flows in Preview; inspect all exported attributes. Unsafe data blocks the next step.
7. Enable Production tracing for the seven-day baseline if Preview volume/cost supports full sampling; otherwise set a documented parent-based ratio.
8. After baseline, reduce sampling as needed and create separate optimization proposals from the ranked findings.

Rollback does not require code removal: disable `SIGNAPSE_TELEMETRY_ENABLED`, disable the client performance-events flag, or set the trace sampler to always off. If startup or bundle behavior is affected despite those controls, roll back the deployment while preserving the prior Speed Insights/Analytics integration.

## Open Questions

- Does the target Vercel project plan support Analytics custom events? This only controls optional client delivery; it does not change server tracing, local measurements, or task structure.
- Does the backend currently accept and continue W3C `traceparent`? This affects cross-service trace depth but does not change the UI propagation contract or block this change.
