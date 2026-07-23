## MODIFIED Requirements

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
