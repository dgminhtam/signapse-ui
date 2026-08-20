## MODIFIED Requirements

### Requirement: Dashboard quick-detail activation uses native button behavior
The shared dashboard title trigger SHALL open local quick detail for every normal button activation, including pointer click, keyboard Enter, and keyboard Space. It SHALL NOT perform route navigation or require modifier-click, middle-click, or context-menu link behavior. Canonical full-page escalation SHALL remain an explicit action only for entity types that provide it.

#### Scenario: User activates a row normally
- **WHEN** a user clicks an event or news title button, or activates it with Enter or Space
- **THEN** the trigger opens the existing drawer for that row's entity kind and ID
- **AND** the current dashboard URL remains unchanged
- **AND** no page-transition loading bar is started by the title activation

#### Scenario: User requests an Event full page
- **WHEN** a user activates the Event drawer's full-page action
- **THEN** the application navigates to the Event's canonical localized route
- **AND** the action intentionally leaves the dashboard

#### Scenario: User reads a News article in Quick detail
- **WHEN** a user opens a News article from a dashboard row
- **THEN** the drawer provides the focused News article reading body without a full-page action
- **AND** the current dashboard URL remains unchanged
