## Why

Opening History currently requests the first conversation page every time, even when the same workspace and query were already loaded moments earlier. Preserving the existing route-local History state as an in-memory cache removes duplicate requests and loading flashes without changing backend contracts.

## What Changes

- Cache the successfully loaded History result set for the current normalized query during the assistant component's workspace-scoped lifetime.
- Reuse cached summaries, pagination, empty state, and search state when History is closed and reopened.
- Allow an active History request to complete after the Popover closes so reopening does not start a duplicate request.
- Keep explicit retry behavior after failures and continue invalidating state when the workspace or result query changes.
- Preserve existing local History reconciliation after conversation creation and message submission.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `demo-conversation-history-api`: Change History reopen behavior from unconditional first-page refresh to reuse of the successfully loaded workspace/query result set.

## Impact

- Affects route-local History state and request lifecycle in `components/market-conversation-assistant/market-conversation-assistant.tsx`.
- Extends the deterministic assistant check for cache, empty-result, error, and duplicate-request behavior.
- Does not change market-conversation actions, API parameters, DTOs, permissions, dependencies, or shared UI primitives.
