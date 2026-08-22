## Why

Calendar and news Telegram flows support an output-language override in the live backend contract, but operators cannot configure it in the Feature routing surface. Worse, existing destination and enabled-state updates omit the field; the backend treats that omission as an explicit clear, so routine routing updates can silently erase a configured language.

## What Changes

- Add an output-language control for the `ECONOMIC_CALENDAR_ALERT` and `MARKET_NEWS_ALERT` Telegram feature settings.
- Model and preserve feature-setting output language in every feature-setting mutation, including the `SCHEDULED_MARKET_ANALYSIS` setting whose language remains hidden because it has no effect on current scheduled delivery.
- Make the fallback choice explicitly clear the feature override, which lets the backend resolve the owner's preferred language and then the system default.
- Keep language configuration safe through row-level pending state, destination prerequisites, language-catalog failure handling, and localized unavailable states.
- Align Telegram fixtures, API mapping documentation, and automated tests with backend clear-on-omission semantics.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `telegram-configuration-ui`: Extend API-backed Telegram feature routing to configure and safely preserve output-language overrides for the calendar and news flows.

## Impact

- Affects Telegram feature-setting definitions, authenticated update actions, configuration data loading, and the Feature routing UI.
- Uses the existing authenticated `GET /languages`, `GET /telegram/feature-settings`, and `PUT /telegram/feature-settings` APIs; no backend endpoint or dependency is added.
- Updates localized copy, frontend API mapping notes, deterministic Telegram fixtures, and API/component/E2E coverage.
