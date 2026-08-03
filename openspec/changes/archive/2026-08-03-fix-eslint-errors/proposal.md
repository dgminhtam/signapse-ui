## Why

`pnpm.cmd lint` currently exits with 16 ESLint errors and blocks the repository lint gate. The errors are concentrated in editor/plugin typing, shared UI components, and one market-conversation callback; the existing 26 warnings are explicitly out of scope for this change.

## What Changes

- Remove all 11 `@typescript-eslint/no-explicit-any` errors by using existing library types, narrow local types, or runtime guards at untyped boundaries.
- Fix the single `react-hooks/immutability` error by moving the callback declaration so it is not referenced before declaration.
- Fix the three `react/display-name` errors by returning named component references from the wrappers.
- Fix the single `react-hooks/refs` error by avoiding ref cloning/access during render in the color toolbar input.
- Preserve existing runtime behavior and UI output.
- Leave all 26 current ESLint warnings unchanged; do not disable rules, broaden ignores, or perform unrelated cleanup.

## Capabilities

### New Capabilities

- `lint-error-free-baseline`: The repository lint gate completes with zero blocking errors while the existing warnings remain outside this change.

### Modified Capabilities

None. No user-facing requirements, API contracts, or domain behavior change.

## Impact

- Affected areas: `components/editor/plugins/`, `components/market-conversation-assistant/`, and selected files under `components/ui/`.
- The implementation will touch only the files responsible for the 16 errors, including the block list/drag wrappers, callout/footnote/combobox/media/table nodes, and font-color toolbar.
- No API, database, dependency, route, or localization changes are expected.
- Verification will run `pnpm.cmd lint` and `pnpm.cmd typecheck`; lint must report zero errors while the pre-existing warnings remain out of scope.
