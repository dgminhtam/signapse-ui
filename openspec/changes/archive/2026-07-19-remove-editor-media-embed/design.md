## Context

The Plate editor currently has two overlapping URL-based video paths. Insert → Embed calls Plate's `insertMedia` helper, which opens `window.prompt` and creates a `media_embed` node. The fixed-toolbar Video action opens the localized application dialog and creates a `video` node. Both render supported hosted videos, while `media_embed` additionally carries Tweet rendering. The previous URL-only media change deliberately preserved rich embeds and did not redesign the Insert menu, leaving this split intact.

## Goals / Non-Goals

**Goals:**

- Make `video` the only node type created for direct and supported hosted video URLs.
- Keep the existing localized Video URL dialog as the only video insertion experience.
- Remove the Embed action, `media_embed` plugin/rendering/type surface, and Tweet-only dependency.
- Preserve image, video, audio, and file URL insertion and existing Video rendering behavior.

**Non-Goals:**

- Adding URL auto-classification, a generic Media Link action, or another dialog abstraction.
- Supporting Tweets, arbitrary iframe embeds, or social-provider embeds.
- Migrating or rendering previously serialized `media_embed` nodes.
- Changing media upload policy, APIs, routes, or backend contracts.

## Decisions

### Keep the existing Video action as the sole insertion path

Remove Insert → Embed without adding a replacement Insert-menu item. The fixed-toolbar Video action already provides localization, URL validation, keyboard submission, and the required `video` node shape.

Alternative considered: make both toolbar locations open a shared dialog. A second entry point remains redundant and adds no capability, so it is rejected.

### Remove media embed support end to end

Delete the `media_embed` transform, client and static plugin registrations, renderer, editor type, alignment/caption allow-list entries, and Tweet dependency. The Video renderer will retain `parseVideoUrl` for supported video providers and stop parsing Twitter URLs.

Alternative considered: hide only the Insert action while preserving the plugin for compatibility. The user chose a clean removal, and no compatibility requirement or stored Plate document migration is in scope.

### Do not add a media classifier

The Video dialog continues accepting URL-backed video content and creates `video` nodes directly. Tweet and arbitrary iframe detection are removed instead of routing URLs between multiple node types.

Alternative considered: one generic dialog that chooses `video` or `media_embed`. That preserves the duplicate data model this change is intended to remove.

## Risks / Trade-offs

- Existing documents containing `media_embed` nodes will no longer render → Treat this as the declared breaking change; add migration only if a real stored-data requirement emerges.
- Tweet embeds disappear → Accept this product simplification; reintroducing social embeds requires a separate proposal.
- Unsupported URLs can still create non-working Video nodes because validation checks URL shape rather than remote media content → Preserve the existing link-only boundary and do not add network probing.

## Migration Plan

1. Remove the Embed insertion entry and transform.
2. Remove media-embed renderers, plugin registrations, types, and configuration references.
3. Restrict Video parsing to video providers and remove the Tweet dependency and lockfile entry.
4. Verify no `media_embed`, `MediaEmbedPlugin`, `parseTwitterUrl`, or `react-tweet` references remain and run scoped validation and production build.

Rollback is a direct revert. No content or backend migration is included.

## Open Questions

None.
