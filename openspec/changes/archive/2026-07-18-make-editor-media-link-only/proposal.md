## Why

The Plate editor currently exposes local media uploads through an unauthenticated UploadThing route, upload placeholders, file pickers, drag-and-drop, and clipboard handling even though the product does not need to own or manage uploaded files. Restricting media insertion to external URLs removes storage and lifecycle obligations while preserving images, video, audio, files, and rich embeds in editor content.

## What Changes

- Replace image, video, audio, and file upload controls with direct URL-entry actions.
- Preserve URL-based media rendering, captions, resizing, previews, link editing, and rich media embeds.
- Disable local-file insertion from toolbar pickers, clipboard paste, and drag-and-drop while preserving block drag-and-drop.
- Remove Plate upload placeholders, progress/error UI, mock blob fallback behavior, and unused placeholder transforms.
- **BREAKING**: Remove the `/api/uploadthing` endpoint, UploadThing client/server integration, and the `@uploadthing/react` and `uploadthing` dependencies.
- Keep document import file selection and its `use-file-picker` dependency because importing Markdown, HTML, or DOCX does not upload media.

## Capabilities

### New Capabilities

- `plate-editor-link-only-media`: Defines URL-only insertion and editing for Plate media while prohibiting local-file upload paths and upload infrastructure.

### Modified Capabilities

None.

## Impact

- Plate media toolbar, media plugins, upload placeholder components, block drag-and-drop configuration, and media insertion transforms.
- UploadThing route handler, router configuration, client upload hook, direct dependencies, and lockfile entries.
- The canonical localized editor route remains unchanged; existing media node renderers and URL-based serialized content remain supported.
