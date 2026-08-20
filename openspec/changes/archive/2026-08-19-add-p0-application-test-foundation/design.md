## Context

The production dashboard has no configured JavaScript/TypeScript application test runner or package test scripts. Existing executable checks are lint, typecheck, and build; the coming-soon site and internal agent skills have independent Node and Python suites. Some production behavior is also covered by standalone assertion scripts, while the existing market-chart deterministic-helper specification requires tests that cannot yet run through one dashboard suite.

The P0 foundation must work with Next.js App Router, strict TypeScript, path aliases, Clerk-backed server actions, and the active Base UI wrapper migration. It must not depend on an authenticated browser session, seeded backend data, or a live API. The repository's agent-owned verification policy requires archive-gating checks to be runnable from the repository context.

## Goals / Non-Goals

**Goals:**

- Establish one deterministic production-dashboard test runner with non-watch, watch, and coverage commands.
- Cover the agreed high-risk pure logic, schema/normalization, transport, action, and representative component behaviors.
- Fulfil the existing deterministic market-chart helper test requirements through the new runner.
- Keep tests behavior-focused, isolated from external services, and maintainable across the Base UI migration.
- Preserve the coming-soon and internal-skill suites as separate concerns.

**Non-Goals:**

- Browser E2E, Playwright, real Clerk sessions, live backend calls, database seeding, or fixture-dependent integration testing.
- A CI-provider workflow, global coverage threshold, full CRUD/page coverage, or testing every server action.
- Canvas/KLineCharts lifecycle tests, shadcn/Base UI wrapper-internal tests, visual snapshots, or product behavior changes.
- Changes to backend contracts, authentication configuration, or the active Base UI migration scope.

## Decisions

### 1. Use Vitest as the single dashboard test runner

P0 adds Vitest with React Testing Library, user-event, MSW, jsdom, jest-dom matchers, and V8 coverage reporting. `pnpm test` runs the dashboard suite in non-watch mode; separate watch and coverage commands serve developer feedback and reporting.

Node is the default environment for pure helpers, transport, and server-action tests. Component tests opt into jsdom through the shared test configuration. This avoids a browser-like runtime for code that does not need one.

Alternative considered: Jest. Rejected because the project is ESM-first and Vitest provides a smaller aligned runner, mocks, DOM environment support, and V8 coverage in one toolchain. Native `node:test` remains suitable for the standalone coming-soon site but would require more custom setup for the dashboard's TypeScript, aliases, DOM, and mocking needs.

### 2. Test at existing public behavior seams

Pure modules are tested through public helper exports. Authenticated transport is tested through its public authenticated/public fetch functions, with native fetch, Clerk auth, locale, and environment dependencies controlled at the boundary. Feature server actions mock the shared transport and cache revalidation boundary rather than reimplementing HTTP setup in every test.

Component tests interact through accessible roles, labels, and observable states. They do not inspect Base UI/shadcn internals, CSS classes, React state, or broad rendered snapshots. MSW is used only when a browser-facing HTTP boundary is the seam under test; module mocks remain the correct seam for server-action dependencies.

Alternative considered: mocking internal functions or using MSW for every test. Rejected because both approaches make the test suite follow implementation mechanics instead of the actual side-effect owner.

### 3. Limit P0 coverage to a defined risk matrix

P0 covers shared permission checks; locale configuration, routing, and formatting; query helpers; Telegram schedule schemas and normalization; market-query schemas and message normalization; market-chart annotation, candle, history, and drawing mappings; authenticated transport; Telegram schedule mutations; and Personal Notes CRUD actions.

The chart suite tests vendor-independent public behavior only. It excludes chart registration, canvas lifecycle, and rendering. Existing conversation-history behavioral assertions move into the standard runner; static source-contract checks remain separate only when they retain an independent structural purpose.

Alternative considered: testing every `app/lib` and server-action module in P0. Rejected because it would delay a working foundation and dilute review attention from the highest-risk contracts.

### 4. Keep test structure close to source while centralizing reusable harnesses

Pure and feature-focused tests are colocated with their source. Shared setup, fixtures, and MSW handlers live in a dedicated test-support area. The test configuration owns aliases, setup, automatic mock restoration, environment defaults, and coverage reporting.

Fixture values use fixed dates, a deterministic timezone, and explicit locale inputs. Tests use fake timers only for time-dependent behavior and never rely on an ambient browser timezone or external state.

Alternative considered: a feature-specific runner/configuration for each area. Rejected because a single configuration gives the project one predictable command and avoids duplicated setup.

### 5. Sequence component tests after Base UI wrapper migration

Runner setup, pure logic, transport, and server-action coverage can be implemented independently. Component coverage follows the finalized Base UI consumer contracts and targets the schedule form, Telegram destructive schedule actions, and shared pagination controls. The test change must not modify canonical wrappers to accommodate tests.

Alternative considered: wait for the entire P0 change until the Base UI migration is archived. Rejected because its deterministic portions are independent and can provide confidence immediately.

### 6. Report coverage without an initial global threshold

P0 exposes a coverage command and reports V8 coverage, but completion is based on the documented behavior matrix and deterministic checks rather than a repository-wide percentage. A future change can establish targeted thresholds after the baseline is measured.

Alternative considered: adding an 80% global threshold immediately. Rejected because a new suite can inflate shallow coverage while leaving important contracts untested.

## Risks / Trade-offs

- [Base UI migration changes component contracts while tests are added] → Keep component tests after the migration's finalized consumer contract and do not test wrapper internals.
- [Server-only imports or Clerk modules are difficult to load in tests] → Mock at the public transport/auth boundary and keep tests in the Node environment unless DOM behavior is required.
- [MSW adds complexity where no browser request exists] → Use it only for browser-facing HTTP boundaries; use module mocks for server actions.
- [Locale and time assertions vary by machine] → Fix input locale/timezone/date values and assert deterministic output contracts.
- [A coverage report is mistaken for an adequate quality gate] → Make the behavior matrix, not percentage coverage, the P0 completion condition.
- [Standalone assertions regress during migration] → Move behavioral assertions into Vitest and preserve only independent static checks.

## Migration Plan

1. Add the test dependencies, shared configuration, setup, and package commands without changing production runtime behavior.
2. Add tests for shared pure helpers, schemas, and deterministic market-chart behavior.
3. Add transport, Telegram schedule action, and Personal Notes CRUD action tests with controlled side-effect boundaries.
4. Convert conversation-history behavior assertions to the standard runner and retain independent static checks only where justified.
5. After the Base UI wrapper migration has stabilized, add the three representative component test surfaces.
6. Run the dashboard test suite, coverage report, lint, typecheck, build, static checks, and OpenSpec validation.

Rollback is a source and development-dependency rollback. The change does not migrate data, alter backend state, or require deployment ordering.

## Open Questions

None. Browser E2E, CI-provider wiring, external authentication, backend fixtures, and global coverage thresholds are intentionally deferred.
