## Why

React 19 hydration now reports attribute mismatches more visibly, and Radix/shadcn overlay triggers can surface mismatched generated ids such as `aria-controls` when server and client id generation diverge. Signapse needs a clear rule for fixing these issues without disabling SSR, patching shadcn wrappers ad hoc, or hiding warnings with hydration suppressions.

## What Changes

- Standardize how SSR-rendered Radix/shadcn overlays such as `Dialog`, `Sheet`, `AlertDialog`, `Popover`, and related trigger/content pairs handle hydration-sensitive generated ids.
- Add an `AGENTS.md` rule requiring root-cause investigation first, then deterministic ids for the affected usage when the mismatch is limited to Radix-generated trigger/content attributes.
- Keep SSR enabled for header actions and navigation controls; do not use `dynamic(..., { ssr: false })`, mount-only wrappers, or `suppressHydrationWarning` as the default fix.
- Keep shadcn wrappers aligned with the preset; apply stable ids at app usage or through an app-level helper only if the pattern repeats.
- Document the current quick personal notes sheet hydration fix as the reference implementation.

## Capabilities

### New Capabilities

- `radix-overlay-hydration-stability`: Defines how SSR-rendered Radix/shadcn overlay controls avoid hydration mismatches from generated ids while preserving accessibility and SSR.

### Modified Capabilities

- None.

## Impact

- Affected code: `components/personal-notes-quick-sheet.tsx`, future Radix/shadcn overlay usages, and `AGENTS.md`.
- Affected behavior: eliminates console hydration mismatch for affected overlay triggers without changing visible UI or business logic.
- No API, backend, dependency, or routing contract changes.
