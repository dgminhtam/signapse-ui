## MODIFIED Requirements

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

## ADDED Requirements

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
