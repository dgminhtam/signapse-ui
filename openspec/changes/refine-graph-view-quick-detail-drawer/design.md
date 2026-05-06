## Context

`add-graph-view-quick-detail-overlay` implemented Graph View quick detail using an app-level `EntityQuickDetailSheet` backed by shadcn `Sheet`. The result is functionally correct, but two UX issues remain:

- The route-level `@quickDetail/loading.tsx` renders its own open overlay, then the loaded page renders another open overlay. This creates a double-open animation.
- A right-side Sheet narrows the reading surface and competes with the graph canvas horizontally, making event/article detail harder to read.

shadcn provides a dedicated `Drawer` primitive for bottom-sheet style disclosure. For this use case, the quick detail overlay is a bottom reading surface, not a side panel.

## Goals / Non-Goals

**Goals:**

- Replace the Graph View quick detail shell with a bottom `Drawer`.
- Add the shadcn `Drawer` primitive as the only allowed `components/ui` addition for this change.
- Eliminate the double-open effect by ensuring skeleton/loading does not mount a separate overlay primitive before the loaded route.
- Preserve canonical route behavior for `/events/{id}` and `/news-articles/{id}`.
- Preserve existing focused event and news article quick detail content.
- Keep the bottom drawer readable on desktop and mobile with stable height and body scroll containment.

**Non-Goals:**

- No Market Charts quick detail changes.
- No backend API, DTO, or permission changes.
- No Graph View canvas layout, node selection, hover, drag, or rendering changes.
- No redesign of the event/article focused content beyond adapting it to the bottom drawer shell.
- No broad `components/ui` edits except adding shadcn Drawer through the standard component source flow.

## Decisions

### Use shadcn Drawer for the Bottom Surface

Replace `EntityQuickDetailSheet` with a drawer-based shell such as `EntityQuickDetailDrawer`. The shell should import from `@/components/ui/drawer` and use the shadcn composition pieces: `Drawer`, `DrawerContent`, `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, `DrawerFooter`, and `DrawerClose` where appropriate.

Why: Drawer is the semantic primitive for bottom-sheet disclosure and is a better match for the user expectation than forcing `Sheet side="bottom"`.

Alternative considered: keep `Sheet` and set `side="bottom"`. This is lower effort but keeps the wrong primitive and may still feel dialog/side-panel oriented rather than a real bottom drawer.

### Keep One Overlay Primitive Per Navigation

Remove or neutralize `app/(main)/@quickDetail/loading.tsx` so it does not render a separate `Drawer`/`Sheet` instance. Prefer one of these implementation approaches:

- Let route loading show no overlay until data is ready.
- Or move data fetching behind a route-level suspense boundary inside a stable drawer page shell, so the drawer mounts once and the drawer body swaps skeleton to content.

The preferred implementation is stable drawer shell with body-level skeleton if it can be done without large refactors. If that becomes too broad, removing the overlay-level loading route is acceptable because it fixes the double-open effect.

### Bottom Drawer Layout

Use a bottom drawer with stable dimensions:

- Desktop/tablet: full width, max readable content container inside, height around `min(76svh, 760px)`.
- Mobile: near full viewport height but still clearly a drawer, with body scroll containment.
- Header and footer stay visually stable while body scrolls.
- Graph canvas remains visible behind/above the drawer enough to preserve context.

### Preserve Full Detail Escalation

The drawer footer should keep an action for opening the full detail page. That action may remain a plain anchor/hard navigation so users can intentionally leave the overlay and enter the canonical full detail workspace.

### Preserve Current Data And Permission Flow

Interception routes should continue to use existing server fetchers and permission checks. Permission-denied, error, and not-found states should render using the new drawer shell if the route is intercepted, without introducing a second overlay animation.

## Risks / Trade-offs

- [Risk] Adding shadcn Drawer introduces Vaul dependency or generated component changes. → Mitigation: add only the official shadcn Drawer primitive and review the generated file before using it.
- [Risk] Removing route-level loading means users may wait briefly before the drawer appears. → Mitigation: prefer stable drawer shell with body skeleton when feasible; otherwise accept delayed open over double-open.
- [Risk] Bottom drawer can cover too much graph context. → Mitigation: cap height and keep a visible portion of the graph, while giving content enough width to read.
- [Risk] Drawer gesture behavior may differ from Sheet close behavior. → Mitigation: keep `router.back()` wired to `onOpenChange` close state and validate Back/Forward behavior.
- [Risk] Existing quick detail shell name remains misleading. → Mitigation: rename to `EntityQuickDetailDrawer` or clearly replace the old Sheet shell.

## Migration Plan

1. Add shadcn Drawer primitive.
2. Replace the app-level quick detail Sheet shell with a Drawer shell.
3. Update event/news-article intercepted routes and state routes to use the Drawer shell.
4. Remove or refactor `@quickDetail/loading.tsx` so it no longer mounts a separate overlay primitive before loaded content.
5. Verify typecheck, build, OpenSpec validation, and browser behavior for single-open animation and Back/Forward close.
