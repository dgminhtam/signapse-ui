## ADDED Requirements

### Requirement: Annotation popup uses shadcn-composed shell
The system SHALL render the desktop market chart annotation popup shell through shadcn Popover composition while preserving existing annotation behavior.

#### Scenario: Popup header uses Popover composition
- **WHEN** the user opens an annotation marker popup
- **THEN** the popup shared header content is rendered through `PopoverHeader`
- **AND** the popup title/count content is rendered through `PopoverTitle`
- **AND** the close action remains available in the header

#### Scenario: Popup content uses ScrollArea
- **WHEN** the selected annotation group contains enough event content to exceed the popup content height
- **THEN** the popup body scrolls through shadcn `ScrollArea`
- **AND** the header and close action remain visible while the body scrolls

#### Scenario: Annotation logic is preserved
- **WHEN** the popup composition is standardized
- **THEN** annotation grouping, group color, event count, event opening, close behavior, mobile fallback, and outcome rendering continue to behave as before
