## ADDED Requirements

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

## REMOVED Requirements

### Requirement: Market chart toolbar provides a review-only event settings prototype

**Reason**: The approved prototype is becoming the functional replacement for the two separate event-layer toolbar toggles.

**Migration**: Use the consolidated Events settings command and its controlled Events, Economic Calendar, and impact controls.
