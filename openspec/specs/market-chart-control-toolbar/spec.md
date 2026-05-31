# market-chart-control-toolbar Specification

## Purpose
TBD - created by archiving change refine-market-chart-control-toolbar. Update Purpose after archive.
## Requirements
### Requirement: Market chart controls use a compact toolbar
The system SHALL render market chart asset, timeframe, annotation visibility, indicator, screenshot, and fullscreen controls as a compact toolbar without a surrounding card-like surface.

#### Scenario: Controls are displayed on desktop
- **WHEN** the user opens `/market-charts` on a desktop viewport
- **THEN** the asset selector is shown as the primary leading control
- **AND** timeframe, annotation visibility, indicator, screenshot, and fullscreen controls are grouped as toolbar commands
- **AND** the control group is not wrapped in a bordered or muted card surface

#### Scenario: Controls are displayed on mobile
- **WHEN** the user opens `/market-charts` on a narrow viewport
- **THEN** the controls remain usable without page-level horizontal overflow
- **AND** the asset selector can take full available width before secondary controls wrap or use contained overflow

### Requirement: Market chart toolbar preserves accessible labels
The system SHALL keep accessible labels for market chart toolbar controls while avoiding redundant visible form labels.

#### Scenario: Assistive technology reads controls
- **WHEN** a screen reader user navigates the market chart toolbar
- **THEN** the asset selector, timeframe selector, annotation visibility toggle, indicator command, screenshot command, and fullscreen command each expose a clear accessible name

#### Scenario: Sighted user scans controls
- **WHEN** a sighted user scans the market chart toolbar
- **THEN** selected values, placeholders, button text, and command icons provide enough context without visible stacked field labels

### Requirement: Chart surface shows instrument freshness context
The system SHALL render the selected instrument, timeframe, and latest update timestamp inside the chart surface as a concise chart-context label.

#### Scenario: Chart data is loaded
- **WHEN** the chart has loaded data for a selected asset and timeframe
- **THEN** the chart surface shows a label formatted with the asset symbol, timeframe label, and latest update timestamp
- **AND** the label follows the pattern `XAU/USD - 1 giờ - Cập nhật 10:17 07/05/2026`

#### Scenario: Chart data is loading or unavailable
- **WHEN** the chart has not loaded a latest timestamp yet
- **THEN** the chart context label avoids showing stale or misleading update time
- **AND** the toolbar does not render a separate freshness text beside the controls

### Requirement: Chart context label avoids duplicate identity
The system SHALL avoid rendering duplicate visible chart identity text when adding the Signapse-owned chart context label.

#### Scenario: Native chart title is visible
- **WHEN** KLineChart renders its own visible symbol and period title
- **THEN** the implementation suppresses, replaces, or visually coordinates with that title so users do not see competing duplicate instrument labels

#### Scenario: Chart engine changes later
- **WHEN** the chart engine internals change in a later migration
- **THEN** the market chart context label remains owned by Signapse UI code rather than relying on vendor tooltip or title copy

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

### Requirement: Market chart toolbar controls preserve compact shadcn treatment
The system SHALL use the smallest practical common shadcn-supported toolbar control size for market chart timeframe, annotation visibility, indicator, screenshot, and fullscreen controls without custom primitive chrome overrides.

#### Scenario: Toolbar commands render compactly
- **WHEN** the market chart toolbar is displayed
- **THEN** timeframe, annotation visibility, indicator, screenshot, and fullscreen controls render with a consistent compact control height
- **AND** the implementation relies on built-in shadcn size variants rather than ad hoc `h-*`, `min-h-*`, padding, radius, icon size, or typography overrides on the primitives

### Requirement: Market chart timeframe controls avoid clipped rounded corners
The system SHALL keep timeframe toggle borders, rounded corners, and focus rings visually intact inside the chart toolbar.

#### Scenario: Timeframe control is near the toolbar edge
- **WHEN** the timeframe control group is rendered inside its horizontal overflow container
- **THEN** the first and last visible timeframe controls do not appear clipped or lose their rounded corners
- **AND** any overflow behavior remains contained inside the timeframe control area instead of creating page-level horizontal scroll

### Requirement: Market chart event toggle uses command icon parity
The system SHALL render the annotation/event visibility toggle with an inline-start icon that follows the same icon convention as neighboring toolbar command buttons.

#### Scenario: Event toggle appears beside other commands
- **WHEN** the event toggle is rendered beside indicator, screenshot, and fullscreen commands
- **THEN** it includes an inline-start icon without explicit icon sizing classes
- **AND** its pressed, focus-visible, and disabled states remain controlled by the shadcn toggle primitive

