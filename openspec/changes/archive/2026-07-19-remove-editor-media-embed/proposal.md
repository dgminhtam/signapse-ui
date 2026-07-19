## Why

The Plate editor exposes overlapping video insertion paths: Insert → Embed creates `media_embed` nodes through a native browser prompt, while the Video toolbar action creates `video` nodes through the localized URL dialog. The duplicate paths produce inconsistent UX and allow the same hosted video to be serialized under different node types.

## What Changes

- Remove the Insert → Embed action and its `media_embed` insertion transform.
- Keep the existing Video toolbar URL dialog as the only supported video insertion path and `video` as the canonical video node type.
- Remove `MediaEmbedPlugin`, its renderer and editor types, rich-embed configuration references, and the now-unused Tweet rendering dependency.
- Keep direct video URLs and supported video-provider URLs rendered by the existing Video node.
- Preserve URL-only insertion for images, audio, files, and videos.
- **BREAKING**: Serialized `media_embed` nodes and Tweet embeds are no longer supported; this change adds no compatibility renderer or content migration.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plate-editor-link-only-media`: Remove rich-embed insertion/rendering requirements and require one canonical URL-based Video insertion path and node type.

## Impact

- Plate Insert and fixed-toolbar media actions.
- Editor media transforms, client/static plugin kits, alignment/caption configuration, and Plate document types.
- Media embed renderer source and the direct `react-tweet` dependency.
- No API, route, upload, or backend contract changes.
