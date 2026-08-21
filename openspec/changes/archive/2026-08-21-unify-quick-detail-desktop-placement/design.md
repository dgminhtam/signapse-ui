## Context

`LocalEntityQuickDetailDrawer` already provides one shared content, accessibility, loading-state, focus, and canonical-navigation composition for Dashboard, Graph View, and Market Charts. Its presentation resolver is the only place that diverges: Dashboard receives a viewport-right sheet at `1440px` or wider, while Graph View and Market Charts keep a bottom sheet at the same width.

The approved design direction is to make the reading surface visually consistent at wide desktop widths without changing owner-local interaction state. Graph View must retain its selected node inspector under the modal. Market Charts must close its annotation popup before opening quick detail, restore that context before return focus, and preserve its fullscreen-local portal.

## Goals / Non-Goals

**Goals:**

- Give every approved owner the same right-side Quick Detail geometry at an effective CSS viewport of `1440px` or wider.
- Preserve the existing entity-profile widths, narrow and tablet bottom-sheet behavior, state lifecycle, focus behavior, and reduced-motion behavior.
- Keep the existing shared Drawer composition rather than introducing owner-specific Sheet or Drawer trees.
- Synchronize all active Quick Detail policy documentation and remove legacy “quick view” terminology from the canonical guide.

**Non-Goals:**

- Do not redesign Graph View's node inspector, Market Charts' annotation popup, or Event/Article body content.
- Do not add Article reader support to Market Charts or change any route, API, permission, or data-fetch contract.
- Do not alter archived OpenSpec artifacts or replace the shared Drawer primitive.

## Decisions

### 1. Wide-desktop placement is shared, not owner-specific

The presentation resolver SHALL resolve a right-side sheet for all approved owners from `1440px` upward. Event inspection uses `32rem`; Article reader uses `44rem`; both use `100dvh` and the established right-dismiss direction. From `768px` through `1439px`, and below `768px`, each profile retains its current bottom-sheet geometry.

**Alternative considered:** Keep canvas owners on a wide bottom sheet. Rejected because quick detail is already modal, so the canvas cannot be interacted with; a right-side sheet leaves more of the visual canvas available and matches the same reading action on Dashboard.

### 2. Owner remains responsible for interaction context, not geometry

The owner input remains part of the shared composition for approved-surface scope, local state ownership, and host-specific restoration. It SHALL not select a different wide-desktop direction, width, or height.

Graph View leaves the selected node and its inspector mounted behind the modal so closing returns to the initiating inspector action. Market Charts retains its existing annotation-popover hand-off and restoration sequence. Fullscreen Market Charts retains the overlay portal container, so the same right-side composition remains inside the fullscreen surface.

**Alternative considered:** Close the Graph inspector or leave the Chart annotation popup open behind the drawer. Rejected because either loses useful context or creates competing layered surfaces.

### 3. Responsive transitions preserve an existing reading session

Crossing `1439px`/`1440px` through resize or zoom changes only the resolved geometry. The selected entity, modal instance, body scroll position, focus handling, state feedback, and reduced-motion behavior remain unchanged.

**Alternative considered:** Close and reopen the drawer when its direction changes. Rejected because it would interrupt reading and break focus continuity.

### 4. Active policy sources move together

The shared policy spec, Graph-specific refinement spec, documentation spec, design guidance, and canonical Quick Detail guide SHALL describe the same placement matrix and header contract. The legacy guide is renamed to use the glossary's “Signapse entity quick detail” terminology. Historical archives are evidence, not editable sources of truth.

## Risks / Trade-offs

- [Risk] A right-side sheet covers the Graph inspector at wide desktop widths. → The inspector remains mounted and its trigger regains focus on dismissal; the modal intentionally owns the active reading task.
- [Risk] Fullscreen portals can expose positioning defects when a bottom sheet becomes a right-side sheet. → Keep the existing portal-container composition and cover fullscreen opening/dismissal in the browser journey.
- [Risk] Resize transitions can reset scroll or focus. → Exercise the shared resolver and an open-session browser journey across `1439px`/`1440px`.
- [Risk] Documentation can drift again across feature-specific specs. → Update all active policy sources in one change and search for legacy placement/header language before completion.

## Migration Plan

1. Change the shared presentation resolver and its focused tests.
2. Update active design/docs/specs and rename the legacy guide while preserving its content as the canonical guide.
3. Add or update browser coverage for Graph View, Market Charts, fullscreen containment, and existing Dashboard regression behavior.
4. Validate OpenSpec, focused tests, targeted lint, and typecheck.

Rollback is a revert of the resolver, tests, and active documentation; no persisted state, API, or route migration is involved.

## Open Questions

None.
