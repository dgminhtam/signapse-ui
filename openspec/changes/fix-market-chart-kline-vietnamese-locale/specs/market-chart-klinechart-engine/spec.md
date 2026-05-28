## ADDED Requirements

### Requirement: KLineCharts locale is safe for app locales
The system SHALL initialize market chart KLineCharts instances with a KLineCharts-supported locale that preserves localized chart tooltip copy when available.

#### Scenario: Vietnamese market chart tooltip renders
- **WHEN** a user opens the market chart route with the Vietnamese app locale
- **THEN** the chart registers Vietnamese KLineCharts locale labels before initializing the chart instance
- **AND** KLineCharts receives a supported Vietnamese locale for tooltip rendering
- **AND** the candle tooltip does not crash while resolving the `time` i18n key

#### Scenario: Vietnamese tooltip labels are localized
- **WHEN** KLineCharts renders candle tooltip labels for a Vietnamese route
- **THEN** labels for time, open, high, low, close, volume, turnover, and change are shown in professional Vietnamese

#### Scenario: Unsupported chart locale falls back safely
- **WHEN** the app provides a locale that has not been registered with KLineCharts
- **THEN** the chart adapter uses a KLineCharts-supported fallback locale
- **AND** tooltip rendering does not crash because of a missing locale dictionary

#### Scenario: Locale setup remains adapter-local
- **WHEN** market chart locale handling is implemented
- **THEN** KLineCharts-specific locale registration and fallback logic stays inside the market chart chart-adapter boundary
- **AND** shared app i18n helpers and backend DTO definitions do not import KLineCharts locale APIs
