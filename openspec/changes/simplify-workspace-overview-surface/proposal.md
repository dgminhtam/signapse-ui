## Why

The workspace overview currently presents repeated status, duplicated watchlist actions, duplicated asset previews, and technical metadata as primary content. This makes the root workspace gate feel like an overbuilt dashboard instead of a simple orientation surface that helps users confirm their active workspace and act on the tracked-asset list.

## What Changes

- Simplify the root overview to focus on three user decisions: which workspace is active, whether tracked assets are configured, and what action to take next.
- Remove duplicated watchlist management entry points so the user sees one clear primary action.
- Remove or demote repeated status/scope information such as duplicate `Đang hoạt động`, `Trạng thái`, and redundant updated metadata.
- Demote technical workspace identifiers and created/updated fields out of the default first-viewport content.
- Render tracked assets in one compact preview format instead of showing the same assets as both symbol chips and repeated item cards.
- Preserve existing workspace gate states for missing workspace permission, workspace load failure, no readable workspace, watchlist access denied, empty watchlist, and watchlist load error.

## Capabilities

### New Capabilities
- `workspace-overview-surface`: Defines the simplified root workspace overview surface, information hierarchy, action placement, and watchlist preview behavior.

### Modified Capabilities
- None.

## Impact

- Affected code: `app/[lang]/(main)/page.tsx`, `app/[lang]/(main)/workspace-overview-actions.tsx` if action placement needs prop changes, i18n dictionary entries for removed or revised overview copy, and the overview skeleton.
- Affected UX: the root `Tổng quan` screen becomes calmer and more task-oriented, with fewer repeated panels and one clear watchlist action.
- Affected APIs: none expected; existing workspace and watchlist calls remain unchanged.
- Affected dependencies: none expected.
