## Why

The live dev contract again publishes `POST /telegram/destinations/{destinationId}/test-message`, but the frontend removed its server action and destination control after a transient dev build omitted the endpoint. Operators need the supported delivery check restored without reversing the newer token-only, read-only-label, Card/Item configuration work.

## What Changes

- Restore the authenticated destination test-message server action with no request body, a void result, and no Telegram workspace revalidation.
- Restore a localized, visible `Gửi thử` action on each destination Item with row-scoped pending state and accessible permission/status explanations.
- Preserve the current responsive Card/Item layout and lifecycle overflow actions while keeping bot and destination rename/update controls removed.
- Restore the test-message requirements, domain wording, and API integration ledger entries that were removed because of the transient contract mismatch.
- Keep success feedback limited to backend-confirmed send acceptance; do not add delivery receipts, retries, persisted test state, or a message composer.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `telegram-configuration-ui`: Restore destination test-message behavior and its accessible Item action while retaining the current infrastructure layout and read-only label contract.

## Impact

- Telegram server actions and authenticated backend transport usage.
- Telegram destination Item actions, responsive skeleton parity, and localized feedback.
- Vietnamese and English Telegram dictionaries and the Telegram domain glossary.
- `docs/APIMAPPING.md` and the main Telegram configuration UI specification.
- No backend, dependency, route, DTO, rename/update operation, form, persistence, feature-routing, or schedule change.
