## Why

The current PDP quick-view document describes a useful Next.js App Router pattern, but its ecommerce framing and example routes do not match Signapse. Signapse needs a documentation-ready pattern for reading event and news-article detail from graph nodes and market-chart annotations without forcing users to leave the analytical workspace.

## What Changes

- Rewrite the existing quick-view documentation into a Signapse-specific entity quick detail overlay pattern.
- Replace PDP/product/cart language with admin-dashboard concepts: graph node detail, market chart annotation, event detail, news article detail, and source evidence.
- Document that the first implementation target is a right-side shadcn `Sheet` quick detail overlay, not a product `Drawer`.
- Document the intended route model: full detail pages remain canonical, while soft navigation from supported workspaces may render the same entity as an overlay.
- Document the first supported entities as `event` and `news-article`; asset/theme/source-document support remains future scope unless a later proposal adds it.
- Explicitly state that this change updates documentation only and does not implement routes, shared detail components, or overlay UI in this round.

## Capabilities

### New Capabilities

- `entity-quick-detail-overlay-documentation`: Defines the documentation requirements for the Signapse quick detail overlay pattern, including supported use cases, route model, UI shell guidance, scope boundaries, and rollout notes.

### Modified Capabilities

- None.

## Impact

- Affected docs: `docs/pdp-quick-view-drawer-nextjs-shadcn.md` should be refocused or replaced with Signapse-specific quick detail overlay guidance.
- Affected OpenSpec artifacts: add a new documentation-focused capability spec for the quick detail overlay pattern.
- No app routes, components, API calls, dependencies, or shadcn primitives are changed by this proposal.
