## ADDED Requirements

### Requirement: Fixed toolbar omits redundant content actions
The shared Plate fixed toolbar SHALL omit standalone Link, To-do, and Toggle controls when equivalent creation and contextual editing paths remain available elsewhere in the editor.

#### Scenario: Inspect the editable fixed toolbar
- **WHEN** a user opens either editor host in editable mode
- **THEN** the fixed toolbar does not display standalone Link, To-do, or Toggle controls
- **AND** the remaining fixed-toolbar controls preserve their existing grouping and behavior

### Requirement: Alternative Link access remains available
The editor SHALL retain Link creation through Insert and contextual Link interaction through the floating toolbar.

#### Scenario: Create a link from Insert
- **WHEN** a user chooses Link from the Insert menu
- **THEN** the existing floating link workflow opens for the current editor selection

#### Scenario: Edit links contextually
- **WHEN** the floating toolbar is available for selected text or link content
- **THEN** it continues to expose the Link control

### Requirement: Alternative To-do and Toggle access remains available
The editor SHALL retain To-do and Toggle in Insert for new content and in Turn Into for current-block conversion.

#### Scenario: Create list content from Insert
- **WHEN** a user opens the Insert menu
- **THEN** To-do list and Toggle list remain available

#### Scenario: Convert current blocks
- **WHEN** a user opens Turn Into for an eligible selection
- **THEN** To-do list and Toggle list remain available as conversion targets

### Requirement: Existing content support remains active
The toolbar cleanup MUST retain the Link, List, and Toggle Plate plugins and MUST continue rendering and editing documents that contain those node types.

#### Scenario: Load existing supported content
- **WHEN** the editor loads a document containing links, To-do items, or Toggle blocks
- **THEN** the corresponding content remains rendered and editable through the existing plugins
