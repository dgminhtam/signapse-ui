## ADDED Requirements

### Requirement: Market chart toolbar provides a review-only event settings prototype
The system SHALL present a localized Events command that opens a compact, keyboard-accessible event-settings popover for UI review while preserving the existing Events and Economic Calendar controls.

#### Scenario: Show prototype command beside existing controls
- **WHEN** the Market Chart toolbar is rendered
- **THEN** a new localized Events command is displayed after the existing Events and Economic Calendar toggles and before the Indicator command
- **AND** both existing toggles remain visible and retain their current state and behavior
- **AND** the new command uses the existing compact shadcn toolbar treatment and an inline-start icon

#### Scenario: Open prototype popover
- **WHEN** a user activates the new Events command
- **THEN** a popover opens with a localized event-settings title
- **AND** a localized secondary description explains that the settings control which event types and impact levels appear on the chart
- **AND** the popover presents separate Events and Economic Calendar sections
- **AND** focus, keyboard dismissal, and focus return follow the existing Popover behavior

#### Scenario: Review event visibility controls
- **WHEN** the prototype popover is open
- **THEN** the Events section displays its label and default-checked uncontrolled switch in one muted section surface
- **AND** the Economic Calendar section displays its label, default-checked locally controlled switch, and impact controls in a separate muted section surface
- **AND** neither section repeats the popover purpose with a secondary visibility description
- **AND** changing either prototype switch does not change chart state, marker visibility, legend content, URL state, or data loading

#### Scenario: Review economic calendar impact controls
- **WHEN** the prototype popover is open
- **THEN** the Economic Calendar section displays default-checked uncontrolled High, Medium, and Low impact checkboxes
- **AND** the impact controls are visually nested with an indent and subtle left border
- **AND** clear vertical spacing separates the Economic Calendar visibility row from the nested impact controls
- **AND** the controls are stacked in one column beneath the localized “Displayed impact levels” text using weaker secondary treatment than the Economic Calendar heading
- **AND** High, Medium, and Low use localized title-case labels rather than all-uppercase text
- **AND** the options use localized impact option labels as plain checkbox text without Badge treatment
- **AND** changing an impact checkbox does not filter loaded or subsequently loaded economic calendar events
- **AND** the impact options are hidden when the prototype Economic Calendar switch is unchecked
- **AND** previously changed impact checkbox selections are preserved when the switch is turned on again

#### Scenario: Preserve prototype boundary
- **WHEN** a user interacts with any control in the prototype popover
- **THEN** the system does not call an API or invoke the existing Events or Economic Calendar layer handlers
- **AND** the workbench adds no prototype state beyond the local Calendar disclosure boolean, persistence, or query parameters

#### Scenario: Keep prototype usable on narrow viewports
- **WHEN** the toolbar and prototype popover render on a narrow viewport
- **THEN** the toolbar continues to wrap without page-level horizontal overflow
- **AND** the popover remains within the available viewport width
