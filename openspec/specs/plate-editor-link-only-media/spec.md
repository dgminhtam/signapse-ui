## Purpose

Define URL-only media behavior for the Plate editor while keeping document import and block reordering independent from media uploads.

## Requirements

### Requirement: Media insertion is URL-only
The Plate editor SHALL insert image, video, audio, and file media from valid external URLs without offering local media file upload controls.

#### Scenario: Insert media from a valid URL
- **WHEN** a user activates an image, video, audio, or file media action and submits a valid URL
- **THEN** the editor inserts the corresponding media node using that URL

#### Scenario: Reject an invalid media URL
- **WHEN** a user submits a value that is not a valid URL
- **THEN** the editor leaves the document unchanged and presents a localized validation error

### Requirement: Local media files are not accepted
The Plate editor MUST NOT create media nodes from local files selected through a media toolbar, pasted from the clipboard, or dropped onto the editor.

#### Scenario: Media toolbar contains no file picker
- **WHEN** a user activates an image, video, audio, or file toolbar action
- **THEN** the editor opens URL entry directly and does not open a local file picker

#### Scenario: Local file is pasted or dropped
- **WHEN** a user pastes or drops a local media file into the editor
- **THEN** the editor does not create an upload placeholder or media node for that file

### Requirement: URL-backed media editing remains available
The Plate editor SHALL preserve rendering and editing behavior for supported URL-backed image, video, audio, and file media, including applicable captions, resizing, previews, and link editing.

#### Scenario: Edit an existing media URL
- **WHEN** a user selects a supported URL-backed media node and changes its link
- **THEN** the editor updates the node using the existing media editing controls

#### Scenario: Render existing supported URL-backed content
- **WHEN** the editor loads serialized image, video, audio, or file content containing an external URL
- **THEN** the corresponding media renderer displays or links to that external resource without requiring UploadThing

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

### Requirement: Block drag-and-drop remains independent
The Plate editor SHALL preserve drag-and-drop reordering of editor blocks while disabling file-drop media insertion.

#### Scenario: Reorder a block
- **WHEN** a user drags an existing editor block to a new document position
- **THEN** the block is reordered without invoking media upload behavior

### Requirement: Upload infrastructure is absent
The application MUST NOT expose the editor UploadThing route, client upload hook, upload placeholders, upload progress UI, mock upload fallback, or direct UploadThing dependencies.

#### Scenario: Repository upload boundary check
- **WHEN** the implemented change is inspected or built
- **THEN** no editor UploadThing endpoint or editor media upload integration remains reachable

### Requirement: Document import remains available
Removing media uploads MUST NOT remove local Markdown, HTML, or DOCX import behavior from the editor.

#### Scenario: Import a supported document
- **WHEN** a user selects a supported document through the import toolbar
- **THEN** the editor continues to read and import that document without sending it through a media upload service
