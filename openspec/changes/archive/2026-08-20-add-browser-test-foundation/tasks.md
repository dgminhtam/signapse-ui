> Prerequisite: the completed `restore-telegram-destination-test-message` change must be synced and archived before this change treats Test message behavior as the main-spec contract. Its archival is owned by that change and is not a task below.

## 1. Browser runtime and command surface

- [x] 1.1 Add the Playwright and browser-accessibility dependencies, plus secret-free P0 browser, quality-aggregate, and fail-closed reserved P1 integration commands.
- [x] 1.2 Configure the P0 runner to start the fixture HTTP service and a non-production Next browser server with explicit readiness checks, bounded retries, artifact capture, and Chromium desktop/Vietnamese defaults.
- [x] 1.3 Keep the production build as a separate quality-aggregate check and prove the P0 browser server cannot accidentally run in production mode with dev-auth disabled.
- [x] 1.4 Add a narrowly gated functional dev-auth root and proxy composition that avoids live Clerk client, Clerk middleware, and analytics/insights initialization, preserves locale routing plus real-auth/production behavior, and keeps the P0 user menu Clerk-safe.
- [x] 1.5 Add shared browser fixtures, synthetic identity/workspace data, and `testRunId` lifecycle helpers that keep test state isolated across workers.

## 2. Fixture HTTP boundary and contract guard

- [x] 2.1 Implement the local HTTP fixture service at the existing backend API boundary so Server Components, server actions, and browser interactions use normal application request paths.
- [x] 2.2 Implement deterministic synthetic response scenarios for success, empty data, validation error, timeout, outage, mutation failure, and market-chart SSE/reconnection behavior.
- [x] 2.3 Add idempotent fixture seed/reset behavior scoped by `testRunId`, and reject unexpected live-network, Clerk, Telegram, development, production, or direct-database access.
- [x] 2.4 Add a deterministic contract registry/guard for every P0-covered fixture route so backend mapping changes cannot leave stale methods, statuses, request shapes, or response shapes green.

## 3. Critical browser journeys

- [x] 3.1 Cover application shell/workspace switching and one canonical list's search, filter, pagination, URL state, and Back/Forward behavior.
- [x] 3.2 Cover Personal Notes create, autosave, dirty-state handling, recoverable save failure, retry or later success, and delete behavior.
- [x] 3.3 After the Test message prerequisite is synced and archived, cover Telegram Bot Telegram, Điểm nhận, feature-routing, scheduled asset analysis, and Test message pending/success/failure/timeout/inactive/unavailable states against fixture data.
- [x] 3.4 Cover market-chart controls, fullscreen behavior, deterministic live-data interruption, and reconnect or recoverable stream state without canvas-pixel assertions.
- [x] 3.5 Cover a representative destructive confirmation and a fixture-backed application outage with observable pending, failure, retry, cancel, and confirmed-success behavior.

## 4. Accessibility and stable visual evidence

- [x] 4.1 Add axe checks that fail serious or critical violations for P0 journey states, plus keyboard and focus-return assertions for covered dialogs and sheets.
- [x] 4.2 Add committed native Playwright baselines for selected stable application chrome, forms, sheets, empty/error, and responsive states while excluding full-page and dynamic-canvas snapshots.

  - Baselines are committed under `tests/e2e/visual.spec.ts-snapshots/`; the visual suite passes without update mode.

## 5. Pull-request quality gate and failure evidence

- [x] 5.1 Add a secret-free GitHub Actions pull-request workflow that installs browser requirements, runs the P0 quality aggregate for fork-safe changes, and never receives protected P1 credentials.
- [x] 5.2 Publish Playwright trace, screenshot, video, and relevant application/fixture logs when the P0 browser suite fails.
- [x] 5.3 Document reviewer approval for intentional visual-baseline updates and the risk-based requirement for future interactive changes and regressions to add the narrowest effective test layer.

## 6. Verification

- [ ] 6.1 Run the documented deterministic test, lint, typecheck, production-build, P0 browser, accessibility, and visual-baseline checks.

  - P0 browser (13/13), accessibility, visual-baseline, Vitest (44/44), typecheck, contract guard, targeted P0 lint, and direct HTTP fixture/server checks pass. Full lint is blocked by seven pre-existing repository errors; production build cannot fetch Google Fonts in this restricted environment.
- [x] 6.2 Run `openspec validate add-browser-test-foundation --type change --strict --no-interactive` and resolve all validation errors.
- [x] 6.3 Perform a deterministic review confirming P0 remains secret-free, non-production, fixture-backed, contract-aligned, isolated by `testRunId`, and does not imply P1 authorization or Telegram delivery evidence.
