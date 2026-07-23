## MODIFIED Requirements

### Requirement: Calendar quick list and detail navigation
The system SHALL provide an accessible, decision-focused quick list for loaded calendar events and route users to the existing economic calendar detail page for full content.

#### Scenario: Show quick-list hierarchy
- **WHEN** a user opens a calendar marker or grouped calendar marker
- **THEN** each event displays its available time and canonical localized impact Badge on the first metadata row
- **AND** its title is displayed as the event identity
- **AND** its available currency code and localized publication-status Badge are displayed together on the following metadata row
- **AND** the quick list does not display event type
- **AND** missing optional fields do not produce placeholder copy

#### Scenario: Show release comparison
- **WHEN** a quick-list event includes any of actual, forecast, or previous values
- **THEN** the available values are displayed in a compact comparison with actual first, forecast second, and previous third
- **AND** actual has stronger visual emphasis than forecast and previous
- **AND** an available revision is displayed as secondary supporting data rather than as a peer of the three primary values

#### Scenario: Omit better-or-worse metadata
- **WHEN** a quick-list event includes `actualBetterWorse` or `revisionBetterWorse`
- **THEN** the quick list does not render either field

#### Scenario: Localize publication status
- **WHEN** a quick-list event has status `AVAILABLE`
- **THEN** its status Badge displays `Published` in English and `Đã công bố` in Vietnamese
- **AND** the Badge is positioned beside the currency code rather than beside the time

#### Scenario: Pending publication status
- **WHEN** a quick-list event has status `PENDING`
- **THEN** its status Badge displays the localized pending label beside the currency code

#### Scenario: Missing quick-list impact
- **WHEN** a calendar quick-list event has no impact value
- **THEN** the quick list does not render an impact placeholder or no-impact badge

#### Scenario: Show supporting description
- **WHEN** a quick-list event includes a description
- **THEN** the description is displayed as clamped secondary text after the release values

#### Scenario: Separate multiple events
- **WHEN** a quick list contains more than one calendar event
- **THEN** a decorative Separator is displayed between adjacent event articles
- **AND** no Separator is displayed after the final event

#### Scenario: Scroll overflowing events
- **WHEN** quick-list content exceeds the bounded popover height
- **THEN** the events scroll inside the shared ScrollArea
- **AND** the scrollbar does not cover event content or prevent keyboard access to detail actions

#### Scenario: Open full calendar detail
- **WHEN** a calendar event is displayed in the quick list
- **THEN** the event provides one detail action labeled `Details` in English and `Chi tiết` in Vietnamese
- **AND** activating the action navigates to the locale-preserving `/economic-calendar/{id}` detail route
- **AND** it relies on the existing `GET /economic-calendar/{id}` detail endpoint for content
- **AND** the quick list does not render a separate content-availability sentence

#### Scenario: Keyboard calendar review
- **WHEN** calendar events are loaded
- **THEN** users can focus calendar lane markers and each quick-list detail action by keyboard
- **AND** every detail action has visible focus and can be activated without pointer-only chart interaction
