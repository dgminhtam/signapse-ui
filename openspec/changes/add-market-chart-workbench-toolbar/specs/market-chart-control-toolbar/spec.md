## MODIFIED Requirements

### Requirement: Market chart controls use a compact toolbar
The system SHALL render market chart asset, timeframe, annotation visibility, refresh, indicator, screenshot, and fullscreen controls as a compact chart workbench toolbar that belongs to the chart surface.

#### Scenario: Controls are displayed on desktop
- **WHEN** the user opens `/market-charts` on a desktop viewport
- **THEN** the asset selector is shown as the primary leading control in the chart workbench toolbar
- **AND** timeframe toggles are shown as a single-select toolbar group
- **AND** annotation visibility, indicator, screenshot, fullscreen, and refresh actions are grouped as chart commands
- **AND** the toolbar is visually attached to the chart surface rather than rendered as a generic list toolbar or separate card-like surface

#### Scenario: Controls are displayed on mobile
- **WHEN** the user opens `/market-charts` on a narrow viewport
- **THEN** the controls remain usable without causing page-level horizontal overflow
- **AND** the asset selector can take full available width before secondary chart commands wrap, collapse, or use contained overflow

#### Scenario: Timeframe changes from the toolbar
- **WHEN** the user selects a supported timeframe from the toolbar toggle group
- **THEN** the workbench updates the selected timeframe
- **AND** the route URL continues to use only `assetId` and `timeframe` query params for chart state
- **AND** the workbench re-requests candle data for the selected watchlist asset and timeframe

### Requirement: Market chart toolbar preserves accessible labels
The system SHALL keep accessible labels for market chart toolbar controls while avoiding redundant visible form labels.

#### Scenario: Assistive technology reads controls
- **WHEN** a screen reader user navigates the market chart workbench toolbar
- **THEN** the asset selector, timeframe toggle group, annotation visibility command, indicator command, screenshot command, fullscreen command, and refresh action each expose a clear accessible name

#### Scenario: Sighted user scans controls
- **WHEN** a sighted user scans the market chart workbench toolbar
- **THEN** selected values, command labels, icon labels, and pressed states provide enough context without visible stacked field labels

#### Scenario: Toolbar command state changes
- **WHEN** the user toggles annotation visibility or switches timeframe
- **THEN** the active toolbar command exposes its selected or pressed state through shadcn/Radix semantics
- **AND** focus-visible treatment remains consistent with the app's shadcn controls

## ADDED Requirements

### Requirement: Market chart toolbar exposes chart commands
The system SHALL provide chart workbench commands for indicators, screenshot export, and fullscreen without leaking raw chart vendor APIs into the surrounding workbench.

#### Scenario: User opens indicator controls
- **WHEN** the user activates the indicator command
- **THEN** the system opens a Signapse-owned indicator control surface
- **AND** the surface lists supported chart indicators from the curated market chart UI set
- **AND** applying or removing an indicator updates the KLineCharts canvas through the market chart canvas adapter boundary

#### Scenario: User captures a screenshot
- **WHEN** the user activates the screenshot command while chart data is available
- **THEN** the system exports the current chart image through the market chart canvas adapter boundary
- **AND** the command provides non-crashing feedback if the chart instance is not ready

#### Scenario: User enters fullscreen
- **WHEN** the user activates the fullscreen command
- **THEN** the chart surface enters fullscreen when the browser supports fullscreen
- **AND** the top toolbar, chart canvas, annotation popup layer, and bottom status rail remain inside the fullscreen surface
- **AND** the chart is resized after fullscreen state changes

#### Scenario: Browser fullscreen is unavailable
- **WHEN** fullscreen is unsupported or rejected by the browser
- **THEN** the workbench remains usable
- **AND** the user receives non-blocking feedback in Vietnamese

### Requirement: Chart workbench toolbar keeps existing chart boundaries
The system SHALL preserve existing market chart selection, status, and data boundaries while adding chart workbench commands.

#### Scenario: Asset selection remains watchlist-only
- **WHEN** the toolbar renders the asset control
- **THEN** options are derived from the current workspace watchlist
- **AND** the toolbar does not expose free-form symbol input

#### Scenario: Manual time window remains hidden
- **WHEN** the toolbar renders chart controls
- **THEN** it does not expose editable `from` or `to` controls

#### Scenario: Update metadata remains in the status rail
- **WHEN** candle data includes a latest update timestamp
- **THEN** the chart update metadata remains in the bottom chart status rail
- **AND** the top toolbar does not render a separate `Cập nhật HH:mm dd/MM/yyyy` label
