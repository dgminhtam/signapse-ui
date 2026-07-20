## ADDED Requirements

### Requirement: Media insertion actions are consolidated under Insert
The Plate editor SHALL expose Image, Video, Audio, and File together in the Media section of the Insert menu and MUST NOT expose standalone fixed-toolbar actions for those media types.

#### Scenario: Inspect available media actions
- **WHEN** a user opens the Insert menu
- **THEN** its Media section contains localized Image, Video, Audio, and File actions
- **AND** the fixed toolbar contains no standalone Image, Video, Audio, or File media action

#### Scenario: Select a media action
- **WHEN** a user selects Image, Video, Audio, or File from the Insert menu's Media section
- **THEN** the Insert menu closes
- **AND** the localized media URL dialog opens for the selected media node type

## MODIFIED Requirements

### Requirement: Image insertion uses one localized URL dialog
The Plate editor SHALL use one localized application dialog for Image URL entry from Insert → Media → Image and MUST NOT invoke a browser-native prompt.

#### Scenario: Insert an image from the Insert menu
- **WHEN** a user selects Image from the Insert menu's Media section
- **THEN** the editor opens the localized media URL dialog configured for Image
- **AND** it does not open a browser-native prompt

#### Scenario: Submit a valid Image URL
- **WHEN** a user submits a valid URL through the Image insertion action
- **THEN** the editor inserts an `img` node using that URL

#### Scenario: Submit an invalid Image URL
- **WHEN** a user submits an invalid URL through the Image insertion action
- **THEN** the document remains unchanged
- **AND** the shared dialog presents the localized validation error

### Requirement: Local media files are not accepted
The Plate editor MUST NOT create media nodes from local files selected through a media action, pasted from the clipboard, or dropped onto the editor.

#### Scenario: Insert media actions contain no file picker
- **WHEN** a user activates an Image, Video, Audio, or File action from the Insert menu
- **THEN** the editor opens URL entry directly and does not open a local file picker

#### Scenario: Local file is pasted or dropped
- **WHEN** a user pastes or drops a local media file into the editor
- **THEN** the editor does not create an upload placeholder or media node for that file

### Requirement: Video insertion uses one canonical node type
The Plate editor SHALL expose the localized Video URL action in the Insert menu as the only supported video insertion path and SHALL serialize direct and supported hosted video URLs as `video` nodes.

#### Scenario: Inspect available video insertion actions
- **WHEN** a user inspects the Insert menu and fixed toolbar
- **THEN** the Insert menu's Media section exposes the Video URL action
- **AND** the fixed toolbar does not expose a standalone Video or Embed action

#### Scenario: Insert a direct or hosted video URL
- **WHEN** a user submits a valid direct video URL or supported video-provider URL through the Video action
- **THEN** the editor inserts a `video` node using that URL
- **AND** it does not create a `media_embed` node

#### Scenario: Inspect media-embed support
- **WHEN** the editor media plugins and renderers are inspected
- **THEN** no `media_embed` insertion, rendering, type, or Tweet-specific dependency remains
