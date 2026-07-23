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
- **THEN** the system opens a Signapse-owned indicator settings popover with a localized title and purpose description
- **AND** the surface lists every supported chart indicator from the curated market chart UI set in its own muted item
- **AND** each item exposes a labeled switch whose checked state matches the active indicator selection
- **AND** applying or removing an indicator updates the KLineCharts canvas through the existing market chart canvas adapter boundary
- **AND** the popover remains usable within the available viewport height and width

#### Scenario: User changes an indicator switch
- **WHEN** the user enables or disables an available indicator switch
- **THEN** only that indicator is added to or removed from the active selection
- **AND** all other indicator selections are preserved
- **AND** the indicator command count reflects the resulting active selection

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

### Requirement: Indicator controls expose data-aware Volume selection
The system SHALL expose Volume as a default-off option in the Signapse-owned market chart indicator control surface and SHALL prevent users from activating it when the active chart has no usable numeric volume.

#### Scenario: Volume data is available
- **WHEN** the active chart contains at least one candle with finite numeric volume
- **THEN** the indicator control lists an enabled Volume option
- **AND** Volume remains unselected until the user explicitly enables it

#### Scenario: User enables Volume
- **WHEN** the user selects Volume while usable volume data is available
- **THEN** Volume is included in the active indicator selection
- **AND** the indicator command count includes Volume

#### Scenario: Volume data is unavailable
- **WHEN** a successfully loaded active chart contains no finite numeric volume
- **THEN** the Volume option is disabled
- **AND** Volume is not retained as an active indicator

#### Scenario: Assistive technology reads the Volume option
- **WHEN** a screen reader user navigates the indicator control surface
- **THEN** the Volume option exposes the locale-neutral technical name `Volume` and its disabled or selected state

### Requirement: Market chart indicator controls expose ATR and DMI
The system SHALL expose ATR and DMI as independently selectable, default-off options in the Signapse-owned market chart indicator control surface.

#### Scenario: User opens indicator controls
- **WHEN** the user opens the market chart indicator control surface
- **THEN** ATR and DMI are listed with the existing curated indicators
- **AND** neither indicator is selected unless the user has explicitly enabled it

#### Scenario: User selects ATR or DMI
- **WHEN** the user selects ATR or DMI
- **THEN** the selected technical name is included in the active indicator selection
- **AND** the indicator command count includes the selection

#### Scenario: Assistive technology reads ATR and DMI
- **WHEN** a screen reader user navigates the ATR and DMI options
- **THEN** the options expose the locale-neutral technical names `ATR` and `DMI`
- **AND** each option exposes its selected state

### Requirement: Market chart indicator controls expose Ichimoku
The system SHALL expose the complete classic Ichimoku indicator through the existing market chart indicator control.

#### Scenario: Indicator selector is available
- **WHEN** the market chart has usable candle data
- **THEN** the indicator selector includes an option labeled `Ichimoku`
- **AND** the option participates in the existing multiple-selection control

#### Scenario: User enables Ichimoku
- **WHEN** the user selects Ichimoku
- **THEN** Ichimoku is included in the active indicator selection
- **AND** the indicator control's active count includes Ichimoku

#### Scenario: User disables Ichimoku
- **WHEN** the user deselects an active Ichimoku indicator
- **THEN** Ichimoku is removed from the active indicator selection
- **AND** other active indicators remain selected

### Requirement: Market chart toolbar provides consolidated event settings
The system SHALL provide one localized Events command whose popover controls the existing Events and Economic Calendar chart layers and filters visible economic calendar events by impact.

#### Scenario: Replace separate event layer commands
- **WHEN** the Market Chart toolbar is rendered
- **THEN** one localized Events settings command is displayed before the Indicator command
- **AND** the separate Events and Economic Calendar toolbar toggles are not displayed
- **AND** the command uses the existing compact shadcn toolbar treatment and an inline-start icon

#### Scenario: Open functional event settings
- **WHEN** a user activates the Events settings command
- **THEN** a compact popover opens with the approved localized title, purpose description, Events section, and Economic Calendar section
- **AND** focus, keyboard dismissal, and focus return follow the existing Popover behavior
- **AND** the popover remains within the available viewport width

#### Scenario: Toggle the Events layer
- **WHEN** a user changes the Events switch in the popover
- **THEN** the switch invokes the existing Events layer change behavior
- **AND** its checked state remains synchronized with the workbench annotation-layer state
- **AND** marker, warm-band, selection, loading, and lazy-history behavior remain consistent with the replaced Events toolbar toggle

#### Scenario: Toggle the Economic Calendar layer
- **WHEN** a user changes the Economic Calendar switch in the popover
- **THEN** the switch invokes the existing Economic Calendar layer change behavior
- **AND** its checked state remains synchronized with the workbench calendar-layer state
- **AND** enabling the layer retains the existing calendar loading and error behavior
- **AND** disabling the layer hides its impact controls, markers, lane, legend, and counts

#### Scenario: Filter economic calendar events by impact
- **WHEN** the Economic Calendar layer is enabled
- **THEN** High, Medium, and Low impact checkboxes are shown in the approved nested one-column layout
- **AND** all three impact levels are selected by default
- **AND** changing a checkbox filters already-loaded and subsequently loaded calendar events without requesting calendar data again
- **AND** only events whose normalized impact matches a selected level contribute to marker groups, calendar lane content, marker popovers, legend visibility, and event counts
- **AND** raw loaded calendar events remain available so changing the filter can restore them immediately

#### Scenario: No impact level is selected
- **WHEN** a user deselects High, Medium, and Low
- **THEN** no economic calendar marker, lane, legend, or event count is displayed
- **AND** the Economic Calendar switch remains enabled

#### Scenario: Calendar visibility preserves impact selection
- **WHEN** a user disables and later re-enables the Economic Calendar layer
- **THEN** the previously selected impact levels are preserved
- **AND** the restored calendar view applies those selections to current and newly loaded events

#### Scenario: Normalize calendar impact values
- **WHEN** an economic calendar event supplies a case-insensitive or whitespace-padded High, Medium, or Low impact value
- **THEN** the event is classified into the corresponding canonical impact level
- **AND** a null, empty, or unrecognized value matches no available impact selection

#### Scenario: Keep settings session-local
- **WHEN** a user changes an event setting
- **THEN** the workbench does not add URL parameters or persistent storage for that setting
- **AND** changing only an impact checkbox does not call a backend API
