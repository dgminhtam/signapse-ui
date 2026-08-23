## 1. Observability Foundation

- [x] 1.1 Add the direct OpenTelemetry/Vercel tracing dependencies, retain the existing Analytics and Speed Insights dependencies, and verify `pnpm install` completes with the expected lockfile changes and no browser OTel SDK.
- [x] 1.2 Add the shared semantic catalog, strict attribute allowlist, stable outcome/error classifications, and backend-route normalization; verify focused unit tests strip scheme, authority, query, fragment, numeric/UUID-like identifiers, credentials, identity, prompts, and payload values from emitted records.
- [x] 1.3 Add the server-only tracing and structured-diagnostic adapter with fail-open execution, active trace-ID lookup, bounded validation summaries, and terminal span handling; verify recording-adapter tests cover success, throw, timeout, abort, missing trace context, and telemetry-adapter failure without changing the wrapped result.
- [x] 1.4 Add the client-safe monotonic performance adapter with local Performance entries and optional existing-Analytics delivery controlled by `NEXT_PUBLIC_SIGNAPSE_PERFORMANCE_EVENTS_ENABLED`; verify jsdom tests cover enabled, disabled, unsupported, rounded duration, approved fields, and reporting failure without importing server tracing code.

## 2. Server Registration, Privacy, and Transport

- [x] 2.1 Add root server instrumentation with stable `signapse-ui` service identity, explicit `SIGNAPSE_TELEMETRY_ENABLED` handling, fixture-mode suppression, parent-based standard sampler configuration, and backend-origin propagation allowlisting; verify registration tests mock `@vercel/otel` and cover enabled, disabled, fixture, full, ratio, invalid, and always-off configurations.
- [x] 2.2 Configure or suppress automatic framework/fetch telemetry so application-owned backend spans are canonical and exported attributes obey the strict allowlist; verify an exporter-capture or recording-span test proves representative sensitive incoming/backend URLs and queries do not survive in exported operation names or attributes.
- [x] 2.3 Instrument authentication resolution and the shared authenticated/public transport with `signapse.auth.resolve` and `signapse.backend.request`, stable outcomes, safe status/duration attributes, explicit backend-only W3C propagation, and `finally` completion; extend the existing transport tests to verify success, empty response, HTTP failure, timeout, cancellation, network failure, parse failure, original error preservation, and no successful duration log.
- [x] 2.4 Add structured failure diagnostics at the transport and selected Dashboard/Market Chart validation boundaries while preserving existing localized user errors; verify focused tests assert bounded issue metadata and the absence of authorization headers, raw remote messages, request/response bodies, query values, and arbitrary `Error` serialization.

## 3. Priority Journey Measurements

- [x] 3.1 Wrap the protected Dashboard data-assembly operation in `signapse.dashboard.load` without changing permission gates, parallel loads, partial-data states, or rendered output; verify feature-operation tests observe the parent operation and unchanged success/error results from mocked existing actions.
- [x] 3.2 Measure `signapse.market_chart.initial_load` from an accepted asset/timeframe load through committed initial data success, with explicit success, failure, and stale/cancelled outcomes; verify focused workbench tests confirm it reports data readiness once and does not claim browser paint.
- [x] 3.3 Extend the existing Market Chart EventSource adapter with `signapse.market_chart.live_connect` and `signapse.market_chart.first_live_data` attempt state while preserving stream callbacks; verify fake-EventSource tests cover initial open, status-before-data, first valid snapshot/price/candle once, invalid payload, transport error, explicit close, and reconnect classification without buffering event data.
- [x] 3.4 Measure `signapse.market_assistant.submit` from accepted submission through assistant-message availability, include conversation creation for first submissions, classify new versus existing conversation, and exclude reveal animation; verify client interaction tests cover create-plus-submit, existing submit, failure, stale request, reduced-motion/reveal behavior, and telemetry failure without exposing conversation ID or message text.

## 4. Operational Documentation and Static Safety Review

- [x] 4.1 Create the performance-observability operations guide covering the signal catalog, allowlist, flags, sampler settings, Vercel custom-event prerequisite, trace inspection, Preview privacy gate, seven-day baseline, cost review, backend `traceparent` dependency, fail-open behavior, and rollback; verify every implemented operation and configuration key is documented once with no secret values.
- [x] 4.2 Run targeted static searches over observability call sites and built client references to confirm no raw URL/query, authorization, identity, payload, prompt, or server-only OTel dependency crosses the approved boundaries; record the commands and results in the implementation verification notes.

## 5. Deterministic Verification

- [x] 5.1 Run the focused transport, instrumentation, observability-adapter, Dashboard, Market Chart, SSE, and AI Assistant tests and verify all new privacy, lifecycle, propagation, reconnect, and fail-open scenarios pass.
- [x] 5.2 Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`; verify every command succeeds and the production client bundle contains no server OpenTelemetry SDK.
- [x] 5.3 Run `openspec validate add-performance-observability --strict` and verify the change is valid and apply-ready.

User-owned operational rollout (non-checkbox): confirm the target Vercel plan supports optional custom events; enable full Preview tracing; inspect representative Dashboard, Market Chart, AI Assistant, failure, invalid-payload, and reconnect signals for allowlist compliance; then enable the Production baseline at a cost-appropriate sample rate. After seven representative days, review Web Vitals and p50/p75/p95/p99 by stable operation, confirm whether the backend continued `traceparent`, and create separate optimization proposals from the ranked findings. These external checks do not block implementation completion or archive.
