## Why

Signapse UI collects browser Web Vitals but cannot currently explain whether a slow Dashboard, Market Charts, or AI Assistant experience is caused by browser work, Next.js rendering, authentication, backend latency, response parsing, or validation. A privacy-bounded performance-observability foundation is needed before the team changes caching or data flow based on unverified bottleneck hypotheses.

## What Changes

- Add OpenTelemetry-based server tracing with Vercel Observability as the initial destination and portable OpenTelemetry semantics.
- Instrument the shared backend transport, authentication resolution, and selected parsing/validation boundaries with stable, low-cardinality operations.
- Add focused performance measurements for Dashboard loading, Market Chart initial data and live SSE behavior, and AI Assistant submission.
- Preserve Speed Insights as the browser Web Vitals source and conditionally report approved client milestones through existing Vercel Analytics capabilities.
- Add structured JSON diagnostics for HTTP, timeout, network, parse, validation, and telemetry failures without logging successful-request durations.
- Enforce a strict telemetry allowlist that excludes identity, credentials, payloads, prompts, raw URLs, and query strings, including for automatic framework spans.
- Add environment-controlled enablement, sampling, fail-open behavior, deterministic verification, rollout/rollback guidance, and a seven-day production-baseline procedure.
- Keep performance optimization, caching changes, backend-internal tracing, custom metrics infrastructure, SLOs, and alerting outside this change.

## Capabilities

### New Capabilities

- `performance-observability`: Defines privacy-safe performance signals, tracing and correlation behavior, priority journey measurements, failure isolation, configuration, verification, and baseline handoff for Signapse UI.

### Modified Capabilities

None. Existing Dashboard, Market Charts, AI Assistant, authentication, and backend-contract behavior remains unchanged; this change observes those flows without changing their user-facing contracts.

## Impact

- Affects Next.js server startup instrumentation, shared authenticated/public backend transport, selected feature-operation boundaries, Market Chart SSE client handling, AI Assistant submission timing, and operational documentation.
- Adds direct OpenTelemetry/Vercel tracing dependencies while keeping the existing Analytics and Speed Insights integrations.
- Adds environment configuration for telemetry enablement, client performance events, and trace sampling.
- Requires Preview inspection to prove exported spans obey the telemetry allowlist before Production rollout.
- Introduces a non-blocking backend integration expectation for W3C `traceparent`; backend internals remain outside this repository and change.
