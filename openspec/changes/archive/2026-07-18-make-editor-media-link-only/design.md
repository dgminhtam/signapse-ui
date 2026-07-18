## Context

The localized Plate editor composes media rendering plugins with a separate upload pipeline. URL-backed image, video, audio, file, and rich-embed nodes already render independently, while `PlaceholderPlugin`, media file pickers, `useUploadFile`, and `/api/uploadthing` manage local files. The upload route has no product-owned persistence lifecycle or Clerk authorization requirement, and the client fallback can create temporary `blob:` URLs that do not survive reloads.

The change crosses editor UI, Plate plugin configuration, drag-and-drop behavior, an API route, dependencies, and localized copy. Existing serialized media nodes store URLs, so removing upload initiation does not require a content migration.

## Goals / Non-Goals

**Goals:**

- Make external URLs the only way to insert image, video, audio, file, and rich-embed media.
- Remove all local media file-picker, clipboard-file, drag/drop-file, placeholder, progress, and UploadThing paths.
- Preserve media rendering, captions, resizing, previews, link editing, rich embeds, and block drag-and-drop.
- Remove obsolete upload code and dependencies completely.

**Non-Goals:**

- Proxying, downloading, validating availability, or taking ownership of remote media.
- Migrating existing media URLs or changing the serialized media-node shape.
- Removing local Markdown, HTML, or DOCX import, which reads a local document without uploading it.
- Replacing Plate media renderers or redesigning the editor toolbar beyond removing upload choices.

## Decisions

### Use direct URL entry as the media-toolbar action

Image, video, audio, and file toolbar buttons will open the existing URL dialog directly. The split-button menu and `use-file-picker` integration will be removed from the media toolbar. Valid URLs will continue to create the existing `{ type, url, name? }` media nodes, and touched user-facing copy will use the localization dictionary.

Alternative considered: keep a one-item dropdown containing “Insert via URL.” This preserves more code and adds an unnecessary interaction, so it is rejected.

### Remove the Plate placeholder pipeline and explicitly disable uploads

`PlaceholderPlugin`, `BasePlaceholderPlugin`, placeholder renderers, upload-error toasts, and upload-placeholder transforms will be removed. Image, video, audio, and file plugins will explicitly set `disableUploadInsert: true`; URL embedding remains enabled. This blocks toolbar, clipboard, and data-insertion upload paths at the plugin boundary instead of relying only on hidden UI.

Alternative considered: retain `PlaceholderPlugin` with file drop disabled. It still carries upload state and APIs that the product no longer needs, so it is rejected.

### Preserve block drag-and-drop without accepting files

The custom `DndPlugin.onDropFiles` callback will be removed while retaining the DnD provider and block draggable renderer. Users can continue reordering editor blocks, but dropping local files will not create media placeholders.

### Delete UploadThing end to end

The API route, UploadThing router, client hook, mock upload fallback, direct dependencies, and generated lockfile entries will be removed together. No compatibility endpoint or alternate storage provider will be introduced.

### Keep URL media and document-import dependencies

`@platejs/media`, media node components, players, previews, captions, resizing, and floating link editing remain. `use-file-picker` also remains because the document import toolbar still consumes it independently of media upload.

## Risks / Trade-offs

- Remote URLs can expire, reject hotlinking, or require authentication → Keep the editor as a URL reference surface and do not imply that remote content is owned or durable.
- Old clients calling `/api/uploadthing` will receive a missing-route response → Treat endpoint removal as the intended breaking change; no product consumer was found outside the editor upload flow.
- A hidden Plate insertion path could still accept a local file → Explicitly disable upload insertion on every retained media plugin and verify there are no placeholder or UploadThing references.
- Existing uploaded media may carry `isUpload` metadata → Keep the current renderers and serialized node compatibility; stop creating new upload-backed nodes without rewriting existing content.

## Migration Plan

1. Convert media toolbar actions to direct URL entry and localize touched copy.
2. Disable media upload insertion and remove placeholder/plugin/drop callbacks and unused transforms.
3. Delete upload UI, hook, router, and API files.
4. Remove UploadThing dependencies and regenerate the lockfile.
5. Run static searches, typecheck, and production build.

Rollback consists of reverting the change; no stored-data migration is performed.

## Open Questions

None. The product decision is to accept remote-link durability trade-offs and avoid managed uploads.
