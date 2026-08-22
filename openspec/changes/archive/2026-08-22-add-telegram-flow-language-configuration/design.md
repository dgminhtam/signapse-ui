## Context

See `proposal.md` for motivation. The Telegram Feature routing surface currently owns destination and enabled-state updates for three feature settings. Its feature-setting contract does not model the backend's optional output language, so every existing update omits it. The backend interprets omission, `null`, and blank values as an explicit request to clear the override.

The backend uses the Feature output language only for economic-calendar and market-news delivery. Scheduled asset analysis instead resolves from its per-schedule override, then the owner's preferred language, then the system default. The existing schedule form already contains a separate language override and is not a substitute for the missing calendar/news configuration.

## Goals / Non-Goals

**Goals:**

- Preserve the full feature-setting language contract through the frontend boundary.
- Add truthful, localized calendar/news language configuration without changing the current routing workflow.
- Make coupled feature-setting updates safe under pending state, unavailable catalogs, and stale persisted languages.
- Retain an observable request-boundary seam that verifies clear-on-omission and preservation behavior.

**Non-Goals:**

- Change backend language resolution or make scheduled delivery inherit a feature-setting override.
- Expose a non-effective Scheduled market-analysis language selector.
- Add owner preferred-language management or a new language API.
- Change scheduled-analysis form behavior, bot/destination lifecycle, or permissions.

## Decisions

### 1. Model every feature-setting language, but expose only runtime-effective controls

The feature-setting response will model its optional output language and the update request will accept a normalized optional ISO code for all three feature keys. This is required to preserve values during any existing update, including for `SCHEDULED_MARKET_ANALYSIS`.

Only Calendar and News receive a language selector. The Scheduled row retains destination, enabled-state, and nested schedule management, but no feature-level language control because that value does not currently affect delivery.

Alternative considered: expose a selector for all contract-supported feature keys. Rejected because it would let an operator save a setting that has no delivery effect.

### 2. Compose every feature-setting PUT from the full current route state

Destination, enabled-state, and language interactions share one feature-setting mutation shape. Each request includes the current destination, enabled state, and output-language ISO code, replacing only the value the operator changed. The fallback selection intentionally omits the ISO code, causing the backend to clear the override.

Alternative considered: let individual controls submit partial updates. Rejected because the backend treats omitted language as a clear and partial UI intent would lose persisted configuration.

### 3. Serialize mutation state per feature row

The Feature routing row is the unit of mutation state. While any update for one row is pending, all three mutable controls in that row are unavailable; other rows remain operable. On success, the configuration data refreshes; on failure, the control values remain recoverable and localized feedback describes the error.

Alternative considered: independent pending state per control. Rejected because simultaneous requests built from stale row state can overwrite a destination, enabled state, or language override.

### 4. Use the authenticated language catalog for choice availability, not as a mandatory update-time dependency

The configuration loader requests the catalog whenever either Feature routing or Scheduled asset analysis is readable. Calendar/news selectors use it to expose supported values. A catalog failure disables only the language selector, while destination and enabled controls retain the returned language code in their requests.

The update action normalizes and structurally validates the optional code but does not fetch the catalog for every PUT. This preserves safe routing operations during a catalog outage; backend validation remains authoritative. A persisted response language absent from the catalog is rendered as unavailable rather than cleared.

Alternative considered: validate every update against a fresh language catalog in the server action. Rejected because a catalog outage would prevent unrelated routing updates and could force loss of an existing override.

### 5. Keep prerequisites, permissions, and fallback language explicit

A language change requires the same valid destination required by the backend update request. A paused route with a destination remains configurable. Read-only users can see configured language but cannot mutate it. The clear choice explains the actual fallback: owner preferred language, then system default. This fallback is not managed by the Telegram UI in this change.

Alternative considered: label the clear choice only as “default.” Rejected because it hides the effective behavior from operators.

### 6. Align contract documentation and deterministic test behavior

The API mapping ledger and fixture backend will record clear-on-omission behavior. The fixture will return and mutate feature output languages like the backend, so component and E2E tests exercise the real preservation and clearing risk rather than a partial imitation.

Alternative considered: test only the selector's rendered value. Rejected because rendering alone cannot detect the destructive mutation regression.

## Risks / Trade-offs

- [A stale or retired language is returned by the backend] → Keep it visible as unavailable and preserve it during non-language mutations.
- [The language catalog is temporarily unavailable] → Disable only selection; retain routing operations that preserve current state.
- [Operators change controls quickly] → Use row-scoped pending state and refresh after each resolved mutation.
- [A direct caller submits an unsupported ISO code] → Perform structural frontend validation and rely on the authenticated backend as final authority.
- [A future backend version makes Scheduled feature language effective] → Handle it in a separate change that revisits runtime resolution and UI scope.

## Migration Plan

1. Extend the feature-setting contract boundary and page data loading.
2. Add the two effective language controls and compose full, row-scoped updates.
3. Update localization, fixture behavior, API mapping documentation, and automated coverage.
4. Validate the OpenSpec change and run the targeted repository checks.

No data migration or backend deployment dependency is required. Rollback is a frontend rollback; persisted backend language overrides remain intact.

## Open Questions

None.
