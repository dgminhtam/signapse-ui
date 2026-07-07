## Why

The annotation API changed from a flat event shape to a timeline shell: `HOT_EVENT` annotations carry point-marker content in `hotEvent`, and `WARM_EPISODE` annotations carry range content in `warmEpisode`. The current frontend and this change's artifacts still describe flat fields and the legacy top-level warm event type, so implementation would keep mapping the wrong contract.

## What Changes

- Align the frontend annotation response mapping with the timeline shell: top-level `id`, `annotationType`, `assetId`, `time`, `hotEvent`, and `warmEpisode`.
- Preserve existing hot marker behavior, but read point marker popup data from `annotation.hotEvent`.
- Render only `WARM_EPISODE` annotations as chart time-range bands from `warmEpisode.periodStart` to `warmEpisode.periodEnd`.
- Replace the warm popup reuse of the hot event layout with an episode-oriented popup: episode summary, episode outcome, and compact `warmEpisode.events[]` timeline.
- Remove legacy top-level warm event handling and old flat annotation fields such as top-level `title`, `summary`, `periodStart`, `periodEnd`, `topMarketReaction`, `marketReactions`, and `outcome`.
- Keep optional warm event ticks out of scope until users need direct scan markers inside the range.

## Capabilities

### New Capabilities

### Modified Capabilities
- `market-chart-annotation-markers`: Annotation layer maps the new timeline annotation contract, keeps hot point markers, and renders warm episode range bands.
- `market-chart-annotation-popup-surface`: Annotation popup renders hot events from `hotEvent` and warm episodes as an episode overview with nested event timeline.

## Impact

- Affected code: market chart annotation definitions/schema, annotation grouping helpers, chart canvas warm band derivation, workbench popup/detail rendering, and market chart i18n copy.
- API contract: aligns frontend Zod mapping with `GET /market-charts/annotations` timeline shell and removes stale top-level warm event support.
- Dependencies: none.
