## Why

Telegram scheduled asset analysis configuration is not aligned with the repository's form and overlay conventions or with the live schedule contract. The current Sheet, free-text asset/time/timezone inputs, weak error recovery, and lifecycle affordances make configuration easy to misconfigure and can lose backend-owned schedule data during edits.

## What Changes

- **BREAKING** Replace the multi-symbol/full-scope asset input with one required workspace-watchlist asset selected by `assetId`.
- Replace the schedule Sheet with a focused shadcn Dialog form.
- Replace comma-separated send times with one-to-four shadcn time inputs using minute precision.
- Replace free-text timezone input with a grouped, searchable IANA timezone Combobox.
- Add optional schedule output-language selection and preserve existing overrides during edits.
- Align schedule DTOs, validation, request construction, and response rendering with the singular asset and output-language backend contract.
- Add field-level validation, dirty-form protection, pending/error recovery, prerequisite explanations, loading/empty/error states, and read-only permission treatment.
- Make schedule lifecycle actions explicit: ACTIVE schedules can be edited, disabled, or deleted; DISABLED schedules can only be deleted; REMOVED schedules are not shown.
- Use separate intent-specific AlertDialogs for irreversible disable and delete actions, with delete using destructive treatment.
- Keep the schedule table while improving responsive behavior and action availability.
- Update the active Telegram specification, API mapping, localization, and domain terminology to remove schedule contract drift.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `telegram-configuration-ui`: Change scheduled asset analysis configuration controls, validation, API contract mapping, lifecycle actions, permissions, and operational states.

## Impact

- Affects the Telegram schedule page, schedule form and table behavior, Telegram schedule server actions and definitions, workspace watchlist and language data loading, localized dictionaries, shared confirmation dialog composition, active Telegram OpenSpec requirements, API mapping, and domain glossary.
- Requires no backend, database, runtime dependency, Quartz, or scheduled delivery changes.
- Keeps asset loading intentionally bounded to the complete current workspace watchlist; server-side asset search and pagination remain out of scope while watchlists are small.
