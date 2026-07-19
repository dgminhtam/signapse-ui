## 1. Remove the duplicate Embed insertion path

- [x] 1.1 Remove Insert → Embed and its unused icon/import without adding another Insert-menu video entry.
- [x] 1.2 Remove the `media_embed` branch from the shared editor block transform while preserving image insertion and the existing fixed-toolbar Video URL dialog.

## 2. Remove media-embed runtime support

- [x] 2.1 Remove client/static `MediaEmbedPlugin` registrations, caption/alignment allow-list entries, and the `media_embed` Plate document type.
- [x] 2.2 Delete the media-embed renderer and stop the Video renderer from parsing Twitter URLs while retaining supported video-provider parsing.
- [x] 2.3 Remove the unused `react-tweet` dependency and update the lockfile without adding a replacement dependency.

## 3. Verify the simplified media surface

- [x] 3.1 Run static inspection confirming no `media_embed`, `MediaEmbedPlugin`, `parseTwitterUrl`, or `react-tweet` references remain and that the Video URL action still inserts `video` nodes.
- [x] 3.2 Run scoped lint for affected editor/media files and run `pnpm typecheck`.
- [x] 3.3 Run `pnpm build` and strict OpenSpec validation for `remove-editor-media-embed`.
