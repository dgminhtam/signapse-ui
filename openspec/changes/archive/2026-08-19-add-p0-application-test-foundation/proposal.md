## Why

The production dashboard has lint, typecheck, and build gates but no standard automated test suite. High-risk deterministic behavior—including permissions, locale routing, request normalization, authenticated transport, and market-chart helper logic—can regress until manual QA discovers it, while existing assertions are fragmented outside one application runner.

## What Changes

- Add a deterministic P0 test foundation for the production dashboard using Vitest, React Testing Library, user-event, MSW, jsdom, and V8 coverage reporting.
- Establish non-watch, watch, and coverage test commands without merging the coming-soon or internal-skill suites into the dashboard runner.
- Cover the agreed high-risk pure helpers, request schemas, authenticated transport, Telegram schedule mutations, Personal Notes CRUD actions, and existing deterministic market-chart helper requirements.
- Move conversation-history behavioral assertions into the standard runner while preserving any still-useful static contract checks separately.
- Add a small component-test milestone for the schedule form, schedule destructive actions, and shared pagination controls after the Base UI wrapper migration is complete.
- Keep tests deterministic: no real Clerk session, backend, seeded data, browser E2E, chart canvas, or network dependency.

## Capabilities

### New Capabilities

- `application-test-foundation`: Defines the production dashboard test runner, deterministic test boundaries, high-priority behavioral coverage, commands, and verification expectations.

### Modified Capabilities

- None. Existing `market-chart-deterministic-helpers` requirements already define the behavior P0 will cover.

## Impact

- Affects development dependencies, package scripts, test configuration, shared test fixtures and mocks, and selected production helper, action, and component test files.
- Does not change backend API contracts, production runtime behavior, Clerk configuration, or the active Base UI wrapper migration scope.
