## ADDED Requirements

### Requirement: Selected drawing style controls use compact popovers
The system SHALL render selected drawing style controls as compact trigger actions that open popovers instead of expanding all color and size options inline.

#### Scenario: Selected drawing toolbar is visible
- **WHEN** a Signapse drawing overlay is selected on the market chart
- **THEN** the selected drawing style toolbar exposes a color trigger, a size trigger, and a delete selected action
- **AND** the toolbar does not render every color and size option inline

#### Scenario: User opens color choices
- **WHEN** the user activates the selected drawing color trigger
- **THEN** the system opens a compact shadcn popover containing preset color swatches
- **AND** the popover does not expose a free-form color picker, HEX input, HSL input, RGB input, opacity input, or alpha input

#### Scenario: User opens size choices
- **WHEN** the user activates the selected drawing size trigger
- **THEN** the system opens a compact shadcn popover containing preset stroke size choices
- **AND** each size choice uses a visual line preview as the primary visual representation

### Requirement: Selected drawing toolbar controls use quiet chrome
The system SHALL use quiet ghost-style control treatment for selected drawing style toolbar actions because the toolbar and popovers already provide the visual surface boundary.

#### Scenario: Selected drawing style toolbar controls are displayed
- **WHEN** the selected drawing style toolbar is visible
- **THEN** the color trigger, size trigger, and selected delete action use ghost button treatment
- **AND** the toolbar avoids outline button treatment for these controls

#### Scenario: Selected style is represented
- **WHEN** the selected drawing style toolbar is visible
- **THEN** the current drawing color is represented by the color trigger swatch
- **AND** the current drawing size is represented by the size trigger line preview

### Requirement: Selected drawing style popovers remain accessible
The system SHALL keep selected drawing color and size popovers keyboard and screen-reader accessible.

#### Scenario: Assistive technology reads style controls
- **WHEN** assistive technology focuses the color trigger, size trigger, color option, size option, or delete selected action
- **THEN** each control exposes a clear localized accessible name

#### Scenario: Keyboard user changes selected drawing style
- **WHEN** a keyboard user opens a selected drawing style popover
- **THEN** the user can choose a color or size without pointer input
- **AND** the selected drawing updates without recreating the overlay
