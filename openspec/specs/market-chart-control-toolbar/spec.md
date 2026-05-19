# market-chart-control-toolbar Specification

## Purpose
TBD - created by archiving change refine-market-chart-control-toolbar. Update Purpose after archive.
## Requirements
### Requirement: Market chart controls use a compact toolbar
The system SHALL render market chart asset, timeframe, annotation visibility, and refresh controls as a compact toolbar without a surrounding card-like surface.

#### Scenario: Controls are displayed on desktop
- **WHEN** the user opens `/market-charts` on a desktop viewport
- **THEN** the asset selector is shown as the primary leading control
- **AND** timeframe, annotation visibility, and refresh controls are grouped as trailing controls
- **AND** the control group is not wrapped in a bordered or muted card surface

#### Scenario: Controls are displayed on mobile
- **WHEN** the user opens `/market-charts` on a narrow viewport
- **THEN** the controls remain usable without horizontal overflow
- **AND** the asset selector can take full available width before secondary controls wrap or stack

### Requirement: Market chart toolbar preserves accessible labels
The system SHALL keep accessible labels for market chart toolbar controls while avoiding redundant visible form labels.

#### Scenario: Assistive technology reads controls
- **WHEN** a screen reader user navigates the market chart toolbar
- **THEN** the asset selector, timeframe selector, annotation visibility switch, and refresh action each expose a clear accessible name

#### Scenario: Sighted user scans controls
- **WHEN** a sighted user scans the market chart toolbar
- **THEN** selected values, placeholders, and button text provide enough context without visible stacked field labels

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

