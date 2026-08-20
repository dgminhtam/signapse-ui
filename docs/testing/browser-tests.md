# P0 browser tests

The P0 lane is a secret-free, fixture-backed Chromium check for the highest-risk Signapse UI workflows. It runs the real Next.js application in non-production mode and points `API_BASE_URL` at the local fixture HTTP service, so Server Components and server actions use the same request boundary as the application.

## Commands

```text
pnpm test:browser       # run Chromium/Vietnamese browser journeys
pnpm test:browser:update # update selected native screenshot baselines; reviewer approval required
pnpm test:contract      # verify fixture routes against docs/APIMAPPING.md
pnpm test:quality       # lint, typecheck, Vitest, contract guard, build, and browser suite
pnpm test:integration   # fail-closed P1 placeholder; requires protected P1 environment values
```

The Playwright config starts both local services and sets the P0-only process contract:

- `SIGNAPSE_AUTH_MODE=disabled`
- `SIGNAPSE_E2E_MODE=fixture`
- `NODE_ENV=development`
- `API_BASE_URL=http://127.0.0.1:4100`

The fixture mode is a stricter submode of the existing non-production dev-auth mode. It does not initialize Clerk middleware or the Clerk client provider, does not load analytics/insights, and never proves real authorization or external Telegram delivery.

Each test receives a unique `testRunId`. The browser context carries it through the cookie and request header; the fixture resets and namespaces mutable state by that ID. Requests without the ID, authenticated requests, unregistered routes, or unexpected external browser requests fail the P0 test.

## Scope and evidence

The suite covers the application shell/workspace, canonical list URL/search/pagination/history behavior, Personal Notes save/retry/delete flows, Telegram configuration and Test message states, market-chart controls and SSE recovery, accessibility, and selected stable visual regions. Dynamic chart canvas pixels and full-page snapshots are intentionally excluded.

Failed browser runs retain Playwright traces, screenshots, videos, HTML reports, fixture state, and application/fixture logs under `test-results/`. The pull-request workflow uploads that directory only when the job fails and uses no protected credentials, so it is fork-safe.

P0 does not replace the future P1 authenticated canary. `pnpm test:integration` must fail clearly when P1 credentials and test-environment values are absent; it must not silently skip authorization, backend, or Telegram delivery checks.

Visual baseline changes are intentional test changes: run the update command narrowly, inspect the diff, and obtain reviewer approval. A feature or bug fix that changes an interactive state should add the narrowest effective test layer (unit, component, browser, or P1 integration) rather than broadening snapshots.
