## 1. Feature-setting contract and data loading

- [x] 1.1 Extend the Telegram feature-setting response and update-request boundary to model, normalize, and serialize the optional output-language override for every feature key; verify with focused core/API tests that preserved and cleared request payloads have the documented shape.
- [x] 1.2 Load the authenticated language catalog whenever Feature routing or Scheduled asset analysis is readable, while preserving an independently recoverable catalog-error state; verify with focused page/data-loading coverage or deterministic static assertions.

## 2. Feature routing language controls

- [x] 2.1 Refactor feature-route updates to derive one complete request from the route's current destination, enabled state, and output-language override, and serialize pending updates per row; verify component tests prove destination and switch updates retain a persisted override and block only their own row while pending.
- [x] 2.2 Add localized inline output-language selectors for the Calendar and News Feature routing rows, including the explicit owner-preference/system-default clear choice; verify component tests prove both supported selections and clearing leave destination and enabled state unchanged.
- [x] 2.3 Keep the Scheduled market-analysis row free of a feature-level language selector and make language controls truthful for missing destinations, read-only access, paused routes, catalog failure, and persisted unavailable languages; verify component tests cover each observable state.

## 3. Contract documentation and deterministic coverage

- [x] 3.1 Update the Telegram fixture behavior to return and mutate feature output language with clear-on-omission semantics; verify focused API/component tests and `pnpm test:contract` pass against the fixture contract.
- [x] 3.2 Update the frontend API mapping ledger to mark the feature-setting language fields integrated and record preservation and clearing semantics; verify the mapping matches the live OpenAPI contract and static searches find no stale feature-setting drift note.
- [x] 3.3 Extend the Telegram browser flow to cover Calendar/News language selection, default clearing, preservation through existing routing controls, and the absence of a Scheduled feature selector; verify with `pnpm exec playwright test tests/e2e/telegram.spec.ts`.

## 4. Verification

- [x] 4.1 Run the focused Telegram Vitest suites for core, API-boundary, and configuration-component behavior; verify all targeted tests pass.
- [ ] 4.2 Run `pnpm lint`, `pnpm typecheck`, `pnpm test:contract`, and `openspec validate add-telegram-flow-language-configuration --strict`; verify each command succeeds.

Verification note: the changed Telegram files pass targeted ESLint, `tsc --noEmit`, the fixture contract guard, and strict OpenSpec validation. Full-repository ESLint remains red on pre-existing `set-state-in-effect` findings in unrelated modules.
