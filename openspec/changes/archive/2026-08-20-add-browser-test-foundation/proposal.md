## Why

Signapse has deterministic Vitest coverage but no agent-runnable browser suite or CI gate for its critical workflows. With no dedicated QA function, regressions in app navigation, mutation recovery, browser state, accessibility, and responsive UI currently depend on manual verification that agents cannot perform reliably.

## What Changes

- Add a secret-free Playwright Chromium browser-test foundation that runs the Next application against a deterministic fixture HTTP backend at the existing API boundary.
- Add a required P0 quality gate for lint, typecheck, deterministic tests, critical browser journeys, serious/critical accessibility checks, and selected stable visual baselines.
- Run browser workflows through a non-production Next test server so a narrowly gated P0 fixture submode (`SIGNAPSE_AUTH_MODE=disabled` plus `SIGNAPSE_E2E_MODE=fixture`) remains available; keep the production build as a separate quality-gate check.
- Make the existing functional dev-auth root and proxy composition self-contained for P0 by avoiding live Clerk-client, Clerk middleware, and third-party analytics initialization only in that non-production mode, while preserving real auth, locale routing, and production composition.
- Cover the agreed critical browser journeys: app shell/workspace, a canonical list, Personal Notes, Telegram configuration and scheduled asset analysis, Test message UI states, market-chart controls/SSE, and representative destructive and failure recovery.
- Make fixture data synthetic, namespaced, idempotently resettable, contract-aligned, and able to model controlled success, failure, timeout, outage, and SSE behavior.
- Capture Playwright traces, screenshots, videos, and relevant logs when P0 browser checks fail; add agent/developer commands that do not silently skip unavailable integration coverage.
- Keep real Clerk authorization, backend test-environment provisioning, cross-browser coverage, and Telegram delivery evidence in the separately planned P1 authenticated-quality-canary change.

## Capabilities

### New Capabilities

- `browser-test-foundation`: Defines the deterministic browser-test runtime, fixture boundary, critical journey coverage, P0 quality gate, accessibility and visual assertions, failure evidence, and isolation rules for the production dashboard.

### Modified Capabilities

- None.

## Impact

- Adds browser-test dependencies, package commands, fixture/test support, browser tests, visual baselines, and GitHub Actions workflow configuration to the UI repository.
- Adds a narrowly gated functional-test root/proxy composition and non-Clerk user-menu behavior needed to boot the protected application shell without live Clerk configuration while retaining locale routing.
- Uses the existing non-production dev-auth mode plus the P0 fixture submode and `API_BASE_URL` boundary; no real Clerk token, backend, Telegram, or production/development data is used in P0.
- The P0 workflow uses no protected credentials, including when it evaluates a fork pull request; protected GitHub Environment credentials remain exclusive to the future P1 lane.
- Requires the completed Test message restoration change to be synced and archived before P0 treats its UI behavior as the main-spec contract.
- Establishes P0 artifacts and contracts that P1 will reuse, without creating test-only backend endpoints or external credentials in this change.
