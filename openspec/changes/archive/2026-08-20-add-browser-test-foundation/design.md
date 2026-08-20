## Context

The existing application test foundation deliberately provides deterministic Vitest, React Testing Library, user-event, and MSW coverage without a real browser, Clerk session, backend, or chart rendering runtime. Signapse has no dedicated QA function, so browser and manual verification currently cannot be repeated reliably by agents or enforced in CI.

The production dashboard is a Next.js App Router application. Its server actions and Server Components call the backend through the existing `API_BASE_URL` boundary, which means browser-only request interception cannot cover every application fetch. The existing non-production dev-auth mode can make protected dashboard workflows runnable without Clerk, but it grants wildcard permissions and therefore cannot prove authorization behavior. P0 adds a stricter fixture submode (`SIGNAPSE_E2E_MODE=fixture`) for the browser process so normal local dev-auth composition is not changed accidentally.

ADR-0004 establishes a layered quality strategy: P0 is a secret-free, deterministic UI-repository quality gate; P1 later covers disposable Clerk/backend infrastructure, real capability personas, cross-browser coverage, and Telegram delivery evidence. The completed Test message restoration change is a prerequisite: it must be synced and archived before P0 treats that behavior as the main-spec contract.

## Goals / Non-Goals

**Goals:**

- Make critical dashboard browser workflows runnable by agents, developers, and GitHub Actions without manual login or external credentials.
- Exercise the real Next application against a deterministic HTTP fixture backend at the existing API boundary, including Server Component and server-action fetches.
- Establish a fast P0 merge gate with deterministic data, critical behavior coverage, accessibility checks, selected visual assertions, and actionable failure evidence.
- Keep test state isolated, synthetic, resettable, and aligned with the frontend's backend contract expectations.
- Preserve the existing Vitest foundation as the fast lower-level layer and define a clear handoff to P1 rather than claiming mock coverage proves authorization or delivery.

**Non-Goals:**

- Real Clerk sessions, backend test-environment provisioning, real permission enforcement, Telegram delivery audit, or recipient-side delivery confirmation.
- Firefox, WebKit, mobile-browser, English-locale, or full visual-regression coverage.
- Browser E2E coverage for every route, broad full-page snapshots, canvas pixel correctness, direct database access, paid visual-testing services, or real dev/production data.
- Changing the public Test message endpoint response, creating test-only backend endpoints, or syncing/archiving the prerequisite Test message change.

## Decisions

### Use Playwright as the P0 browser runner

P0 adds Playwright and its test runner rather than extending jsdom tests or introducing a second browser framework. Playwright provides the required browser process, project configuration, trace/video/screenshot artifacts, screenshot assertions, and local/CI execution model in one dependency.

- **Alternative considered: browser-only MSW or `page.route()` interception.** Rejected because it does not intercept backend fetches issued from the Next server process.
- **Alternative considered: Cypress.** Rejected because it would add a second testing model without improving the required App Router/server-boundary coverage.

### Use `API_BASE_URL` as the single application fixture seam

P0 starts the application with `API_BASE_URL` pointing at a fixture HTTP service. The service responds to the same backend paths, methods, locale headers, response shapes, and SSE behavior that the application expects. Playwright drives only public browser interactions; it does not replace feature actions or inspect component internals.

This is the highest shared application seam: one fixture service covers Server Components, server actions, client interactions, and route refresh behavior without creating per-feature test adapters.

- **Alternative considered: mock individual server actions or feature components.** Rejected because it would miss composition errors and multiply test seams.
- **Alternative considered: call a live development backend.** Rejected because P0 must be deterministic, secret-free, and unable to alter development or production data.

### Keep P0 functional mode separate from real authorization

P0 uses the existing non-production disabled dev-auth mode plus the `SIGNAPSE_E2E_MODE=fixture` submode to make protected workflows runnable. Its fixture backend grants deterministic functional data but does not simulate Clerk or claim permission enforcement. A reserved integration command must fail clearly when P1 environment configuration is absent instead of skipping that coverage.

P1 will use the same application boundary with a disposable backend and real Clerk test identities. It is deliberately not implemented here.

### Make functional dev-auth startup self-contained

The current root composition unconditionally mounts Clerk client components, the application shell includes a Clerk sign-out control, and the proxy is unconditionally created through Clerk middleware. P0 cannot rely on a dummy or live Clerk publishable key because that would still make browser startup dependent on Clerk configuration and network availability. When the P0 fixture submode (`SIGNAPSE_AUTH_MODE=disabled` and `SIGNAPSE_E2E_MODE=fixture`) is enabled, the root composition SHALL use a narrow functional-test path that avoids live Clerk client initialization and third-party analytics/insights initialization. The proxy SHALL preserve locale redirect and locale-header behavior through an auth-independent path without constructing Clerk middleware. Client controls that require Clerk context, including sign-out, SHALL use a non-Clerk dev-auth-safe behavior in that submode.

The condition is the existing server-recognized dev-auth mode combined with the server-side fixture flag, not a client-controlled authorization bypass. Production, real-auth, and ordinary local dev-auth routes retain their current Clerk composition and proxy protection, and P0 does not exercise Clerk-owned sign-in UI.

- **Alternative considered: provide a public Clerk development key to P0.** Rejected because `ClerkProvider` requires a publishable key and can load Clerk client resources, making supposedly deterministic P0 browser runs dependent on an external service.
- **Alternative considered: mock Clerk per browser test.** Rejected because it introduces a lower, repeated test seam and does not make the real app shell independently bootable in functional dev-auth mode.
- **Alternative considered: retain Clerk middleware but skip only `auth.protect()`.** Rejected because constructing the middleware still leaves P0 dependent on Clerk configuration before the bypass can apply.

### Make fixture state synthetic, isolated, and contract-first

The fixture service owns synthetic records and mutable test state. Every browser test obtains a `testRunId`; reset and seed behavior is idempotent and scoped to that run so test workers cannot share mutable state. The fixture provides deterministic success, empty, invalid, timeout, outage, mutation-failure, and SSE sequences.

Fixture handlers are maintained as a contract registry against the backend OpenAPI and the frontend API mapping ledger. The registry and fixture responses are typed or otherwise deterministically checked so a changed endpoint/method/status/shape cannot silently leave a stale fixture green.

- **Alternative considered: a shared hand-maintained fixture database.** Rejected because order dependence and parallel contamination produce flakes.
- **Alternative considered: direct database seeding.** Rejected because it is unavailable in P0 and would leak backend implementation details into UI tests.

### Run a non-production browser server and a separate production build gate

The P0 runner starts the fixture service and a non-production Next application server through a repeatable web-server lifecycle. The browser server MUST remain non-production because the existing disabled dev-auth mode is intentionally ignored in production. The quality aggregate runs the production build as a separate check before or alongside browser execution; it MUST NOT use `next start` as the P0 browser server. Local commands use the same fixture and readiness contract, and the runner waits for explicit readiness rather than fixed sleeps.

- **Alternative considered: use a built production server for browser tests.** Rejected because it disables the deliberately non-production dev-auth seam and would require real Clerk authentication or a new authorization bypass.

### Cover risk-selected browser journeys rather than every route

P0 implements the six accepted workflow groups: application shell/workspace, canonical list URL/history behavior, Personal Notes lifecycle, Telegram configuration and scheduled asset analysis including Test message UI states, market-chart controls/SSE, and representative destructive/failure recovery. Each journey exercises success and its meaningful recoverable error path.

The suite uses accessible role/name locators first. Stable test IDs are allowed only for ambiguous repeated controls or canvas-adjacent behavior that cannot be selected semantically.

### Treat accessibility and visual checks as focused behavioral evidence

P0 runs axe checks on the critical journey states and blocks serious or critical violations. Dialog and sheet flows receive explicit keyboard/focus assertions. Native Playwright screenshots cover stable application chrome, forms, sheets, empty/error states, and selected responsive layouts. Dynamic chart canvas pixels and broad full-page snapshots are excluded.

### Make failures diagnosable and gates honest

The P0 quality command runs lint, typecheck, deterministic tests, build, and browser tests. Browser failures preserve trace, screenshot, video, and relevant application/fixture logs. The runner has a bounded retry policy for diagnostics but must not normalize recurring flakes. P0 has a target PR duration of ten minutes, with browser execution targeted below five minutes.

The P0 workflow is safe for fork pull requests because it consumes no protected credentials. P1-only jobs that require protected GitHub Environment secrets remain outside this workflow.

### Preserve the P1 Test message audit boundary without implementing it

P0 verifies only deterministic Test message UI states. It leaves the normal `204 No Content` endpoint unchanged. The later P1 canary will create a test-only delivery-audit query keyed by `testRunId`; the audit will report destination, operation, timestamp, and `TELEGRAM_ACCEPTED`, `FAILED`, or `UNKNOWN` status. P0 does not add this backend contract or infer external delivery from fixture success.

## Risks / Trade-offs

- **Fixture behavior diverges from the backend contract** → Maintain a contract registry, type/check fixture responses, and require mapping updates to update the deterministic guard.
- **Next startup and browser setup exceed the PR budget** → Reuse installed browser binaries and dependencies in CI caches, run Chromium only in P0, and keep fixture data minimal.
- **Dev-auth wildcard permissions mask authorization regressions** → State that P0 is functional-only and reserve real capability personas for P1.
- **Visual assertions become flaky** → Limit snapshots to stable regions, control fixture data/time, exclude chart pixels, and require human approval for intentional baseline changes.
- **Parallel browser workers contaminate each other** → Namespace fixture state by `testRunId`, make reset idempotent, and keep any future external canary serial in P1.
- **A restored Test message feature is not yet present in the main spec** → Treat sync/archive of its completed change as a prerequisite rather than silently encoding a competing requirement.

## Migration Plan

1. Add the P0 browser runtime, fixture service, command surface, and deterministic support without changing the existing Vitest runner behavior.
2. Implement the agreed critical journeys with synthetic fixture scenarios, accessibility assertions, and selected visual baselines.
3. Add the GitHub Actions P0 quality gate and failure-artifact retention.
4. Run repository-runnable validation and keep P1 environment, credential, and backend test-only requirements as explicit external follow-up.
5. Roll back by removing the P0 workflow/scripts/dependencies and fixture/browser tests together; existing Vitest commands remain independently usable.

## Open Questions

- None for P0. P1 provisioning, protected GitHub Environment configuration, Clerk test identities, backend seed/reset operations, and the Test message delivery-audit query are accepted external prerequisites for the subsequent change.
