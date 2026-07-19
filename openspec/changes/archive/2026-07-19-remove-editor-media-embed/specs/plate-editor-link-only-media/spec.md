## ADDED Requirements

### Requirement: Video insertion uses one canonical node type
The Plate editor SHALL expose the localized Video URL action as the only supported video insertion path and SHALL serialize direct and supported hosted video URLs as `video` nodes.

#### Scenario: Inspect available video insertion actions
- **WHEN** a user inspects the Plate editor toolbar and Insert menu
- **THEN** the editor exposes the Video URL action and does not expose a separate Embed action

#### Scenario: Insert a direct or hosted video URL
- **WHEN** a user submits a valid direct video URL or supported video-provider URL through the Video action
- **THEN** the editor inserts a `video` node using that URL
- **AND** it does not create a `media_embed` node

#### Scenario: Inspect media-embed support
- **WHEN** the editor media plugins and renderers are inspected
- **THEN** no `media_embed` insertion, rendering, type, or Tweet-specific dependency remains

## MODIFIED Requirements

### Requirement: Media insertion is URL-only
The Plate editor SHALL insert image, video, audio, and file media from valid external URLs without offering local media file upload controls.

#### Scenario: Insert media from a valid URL
- **WHEN** a user activates an image, video, audio, or file media action and submits a valid URL
- **THEN** the editor inserts the corresponding media node using that URL

#### Scenario: Reject an invalid media URL
- **WHEN** a user submits a value that is not a valid URL
- **THEN** the editor leaves the document unchanged and presents a localized validation error

### Requirement: URL-backed media editing remains available
The Plate editor SHALL preserve rendering and editing behavior for supported URL-backed image, video, audio, and file media, including applicable captions, resizing, previews, and link editing.

#### Scenario: Edit an existing media URL
- **WHEN** a user selects a supported URL-backed media node and changes its link
- **THEN** the editor updates the node using the existing media editing controls

#### Scenario: Render existing supported URL-backed content
- **WHEN** the editor loads serialized image, video, audio, or file content containing an external URL
- **THEN** the corresponding media renderer displays or links to that external resource without requiring UploadThing
