## Context

Graph View's click inspector is meant to help users understand why a node matters in the graph without leaving the canvas. The current implementation renders a shared field grid for every node kind, so the inspector often displays fields that are irrelevant for the selected node. For example, assets can show timestamp slots, events can inherit article-oriented fields, and all node kinds can expose technical identifiers such as `slug` and `canonicalKey`.

The graph payload already contains enough metadata to create more useful summaries without changing the backend contract. The implementation should keep the existing local overlay, selection behavior, and quick detail actions, while making the content model kind-specific.

## Goals / Non-Goals

**Goals:**

- Make the inspector a compact analysis surface instead of a generic metadata dump.
- Show different primary fields for `event`, `news-article`, `asset`, `theme`, and `narrative` nodes.
- Remove `slug`, `canonicalKey`, and other technical identifiers from the primary inspector surface.
- Demote raw relation counts into a compact footer or secondary line.
- Preserve existing detail actions for `event` and `news-article` nodes and source URL actions for articles.

**Non-Goals:**

- No backend graph contract change.
- No new graph queries or additional backend fetches for the inspector.
- No redesign of event or article quick detail content.
- No new canonical detail route for asset, theme, or narrative nodes.
- No global shadcn wrapper or theme token changes.

## Decisions

### Use Kind-Specific Field Sets

The inspector should build its content from node kind instead of rendering every available metadata field. Each kind gets a small set of fields aligned to its job in graph analysis:

- `event`: occurred time, confidence, meaningful event status, compact relation summary, and event detail action.
- `news-article`: outlet, published time, source/detail actions, confidence only when it describes mapping quality, and compact linked context.
- `asset`: symbol/name, asset type, and compact graph relationship summary.
- `theme`: theme name and compact graph relationship summary.
- `narrative`: thesis, narrative status, confidence, and compact graph relationship summary.

Alternative considered: keep the generic grid but hide empty fields. That still leaves irrelevant non-empty technical fields on the surface and does not solve the user's core complaint.

### Keep Technical Metadata Out Of The Primary Surface

Fields such as `slug`, `canonicalKey`, raw backend ids, and implementation status values should not appear in the primary inspector. They may be useful for debugging, but they are not needed for graph analysis.

Alternative considered: move technical fields into a collapsed debug section. This may be useful later, but the current goal is simplification, so the first implementation should omit them entirely from the primary inspector.

### Use A Compact Relation Summary Instead Of Prominent Count Cards

Raw `relatedNodes` and `relatedEdges` are currently rendered as prominent grid cards. They should become a small secondary line or footer such as "12 nut lien quan - 28 canh" so they inform density without competing with content.

Alternative considered: remove relation counts entirely. Keeping a small summary helps users understand graph connectivity without adding visual weight.

### Preserve Quick Detail Escalation

The inspector remains a summary layer. Event and news article nodes still provide actions to open detail/quick detail. The inspector should not try to become the full reading surface.

Alternative considered: expand the inspector into a richer detail drawer. That overlaps with the existing quick detail drawer and would make the graph canvas feel crowded again.

## Risks / Trade-offs

- Some metadata might be useful for debugging but disappear from the panel -> Keep the change scoped to user-facing inspector content; add a separate debug affordance only if a real need appears.
- Status values may be backend-oriented and not user-friendly -> Display status only when it is meaningful and already localized or safe to present.
- Relation summaries can become vague -> Keep numeric relation summary concise and optional, and avoid replacing graph highlight behavior.
- More branching by node kind can make the component larger -> Use small helper functions or data arrays local to the inspector rather than broad abstractions.
