## ADDED Requirements

### Requirement: KLineCharts theme palette is deterministic
The system SHALL build market chart KLineCharts color styles from an explicit chart theme mode instead of timing-sensitive DOM color reads.

#### Scenario: Initial light theme palette
- **WHEN** the market chart renders while the resolved app theme is light
- **THEN** KLineCharts receives the light chart palette for candle up/down colors, grid, axes, tooltip text, crosshair labels, volume, and drawing overlays
- **AND** those core chart colors do not depend on reading theme-sensitive CSS variables during chart initialization

#### Scenario: Initial dark theme palette
- **WHEN** the market chart renders while the resolved app theme is dark
- **THEN** KLineCharts receives the dark chart palette for candle up/down colors, grid, axes, tooltip text, crosshair labels, volume, and drawing overlays
- **AND** those core chart colors do not depend on reading theme-sensitive CSS variables during chart initialization

#### Scenario: Light dark light transition is stable
- **WHEN** a user switches the market chart from light mode to dark mode and then back to light mode
- **THEN** the chart returns to the same light palette used before switching
- **AND** candle colors, grid colors, axis text colors, and crosshair colors do not drift because of stale CSS variable snapshots

#### Scenario: Unsupported or unresolved theme falls back safely
- **WHEN** the chart adapter cannot resolve a dark theme mode
- **THEN** the adapter uses the light chart palette
- **AND** KLineCharts still receives a complete style object without crashing or rendering partially themed colors

#### Scenario: Theme styling remains adapter-local
- **WHEN** market chart theme styling is implemented
- **THEN** KLineCharts palette selection stays inside the market chart canvas adapter boundary
- **AND** shared app theme providers, global shadcn tokens, backend DTO definitions, and non-chart features do not import KLineCharts style helpers
