## Why

Graph View node click currently opens an inspector that renders the same metadata grid for every node kind. This makes event, article, asset, theme, and narrative nodes all show irrelevant fields such as timestamps, slug, canonical key, symbol, or status even when those fields do not help graph analysis.

## What Changes

- Replace the one-size-fits-all inspector field grid with kind-specific summary content.
- Show only analysis-relevant fields for each node kind:
  - `event`: title, occurred time, confidence/status when meaningful, relation summary, and event detail action.
  - `news-article`: title, outlet, published time, source/detail actions, and linked event context when available.
  - `asset`: symbol/name, asset type, and graph relationship summary.
  - `theme`: theme name and graph relationship summary.
  - `narrative`: title, thesis, narrative status/confidence when present, and graph relationship summary.
- Demote raw graph counts to a compact footer treatment instead of prominent cards.
- Remove technical identifiers from the primary inspector surface, including `slug` and `canonicalKey`.
- Keep click selection, related-node emphasis, quick detail actions, and source URL actions intact.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `graph-view-node-detail-inspector`: Inspector content changes from a generic metadata grid to kind-specific summary surfaces with technical metadata removed from the primary view.

## Impact

- Affected code: `app/[lang]/(main)/graph-view/graph-view-canvas.tsx`.
- Affected i18n: graph view inspector copy may need new labels for compact relation summaries or kind-specific sections.
- No backend API or graph payload contract changes.
- No dependency changes.
- No global theme token or shadcn primitive changes.
