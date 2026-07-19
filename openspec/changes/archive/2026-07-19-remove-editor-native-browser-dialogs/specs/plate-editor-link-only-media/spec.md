## ADDED Requirements

### Requirement: Image insertion uses one localized URL dialog
The Plate editor SHALL use one localized application dialog for Image URL entry from both the fixed Image toolbar action and Insert → Image, and MUST NOT invoke a browser-native prompt from either entry point.

#### Scenario: Insert an image from the Insert menu
- **WHEN** a user selects Image from the Insert menu
- **THEN** the editor opens the localized media URL dialog used by the fixed Image toolbar action
- **AND** it does not open a browser-native prompt

#### Scenario: Submit a valid Image URL
- **WHEN** a user submits a valid URL through either Image insertion entry point
- **THEN** the editor inserts an `img` node using that URL

#### Scenario: Submit an invalid Image URL
- **WHEN** a user submits an invalid URL through either Image insertion entry point
- **THEN** the document remains unchanged
- **AND** the shared dialog presents the localized validation error
