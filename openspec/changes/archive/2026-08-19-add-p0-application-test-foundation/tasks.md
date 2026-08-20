## 1. Dashboard test runner foundation

- [x] 1.1 Add the Vitest, Testing Library, user-event, MSW, jsdom, jest-dom, and V8 coverage development dependencies, plus non-watch, watch, and coverage dashboard test scripts without merging the coming-soon or internal-skill suites.
- [x] 1.2 Add the shared Vitest configuration and test setup for source aliases, Node-by-default execution, jsdom component tests, jest-dom matchers, automatic cleanup/mock restoration, and V8 coverage reporting.
- [x] 1.3 Add reusable deterministic test support for fixed locale/time values, public-boundary mocks, fixtures, and narrowly scoped MSW handlers where a browser-facing HTTP seam requires them.

## 2. Shared deterministic behavior coverage

- [x] 2.1 Add public-export tests for permission checks, locale configuration/routing/formatting, and query serialization helpers, including fail-closed and invalid-input cases.
- [x] 2.2 Add public-export tests for Telegram schedule schemas/normalization and market-query schemas/message normalization across valid, malformed, duplicate, and boundary values.
- [x] 2.3 Add vendor-independent tests that fulfil the market-chart deterministic-helper requirements for annotation grouping, candle normalization/merge behavior, older-history requests, and drawing mappings without loading chart registration or canvas rendering.

## 3. Transport and server-action coverage

- [x] 3.1 Add Node-environment tests for the public authenticated and public transport functions, controlling fetch, Clerk auth, locale, and environment boundaries for configuration, authentication, timeout, success, empty, not-found, and failed responses.
- [x] 3.2 Add tests for Telegram scheduled asset analysis create, update, disable, and delete actions that verify request shape, localized success/failure results, and route revalidation through mocked shared boundaries.
- [x] 3.3 Add tests for Personal Notes CRUD actions that verify request shape, valid and invalid outcomes, localized error handling, and affected-route revalidation through mocked shared boundaries.

## 4. Consolidate existing behavioral assertions

- [x] 4.1 Move conversation-history behavioral assertions into Vitest tests for message rendering, pagination/history merge, loading decisions, and response-reveal behavior through exported helpers.
- [x] 4.2 Remove duplicated standalone behavioral assertions and retain static source-contract checks only where they protect an independently justified structural invariant.

## 5. Representative component coverage after Base UI stabilization

- [x] 5.1 After the Base UI wrapper migration has finalized its consumer contract, add accessible jsdom tests for Telegram schedule form validation, normalized submission, pending state, recoverable failure, retry, and retained-input behavior.
- [x] 5.2 Add accessible jsdom tests for Telegram configuration disable/delete schedule confirmation, pending state, failure recovery, retry, and completed mutation behavior without testing wrapper internals.
- [x] 5.3 Add accessible jsdom tests for shared pagination controls and their resulting URL/query-state behavior.

## 6. Verification

- [x] 6.1 Run `pnpm test` and `pnpm test:coverage`, confirming that coverage is reported without a repository-wide threshold.
- [ ] 6.2 Run `pnpm lint`, `pnpm typecheck`, and `pnpm build`.
- [x] 6.3 Run retained independent static checks and `openspec validate --change add-p0-application-test-foundation --strict`.

> Verification note: `pnpm typecheck`, `pnpm build`, targeted ESLint for change-owned files, the retained demo conversation check, and strict OpenSpec validation pass. Full `pnpm lint` remains blocked by seven pre-existing errors in unrelated search/effect and hook files; no unrelated source was changed to mask them.
