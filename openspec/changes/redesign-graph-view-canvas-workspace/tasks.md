## 1. Route shell and workspace hierarchy

- [x] 1.1 Refactor `app/(main)/graph-view/page.tsx` so `/graph-view` renders as a workspace-first route without the standard outer `Card` shell
- [x] 1.2 Rework the top-level graph-view layout so the canvas becomes the dominant viewport region and secondary copy no longer consumes equal visual weight

## 2. Contextual controls and reduced default chrome

- [x] 2.1 Replace the always-expanded overview and settings stack with compact control entry points that open on demand
- [x] 2.2 Move legend content, helper guidance, and advanced display settings into transient surfaces such as popovers, drawers, or overlays that stay closed by default
- [x] 2.3 Ensure hover and control toggles do not trigger layout churn, viewport resets, or other visible workspace instability

## 3. Modal-based selection inspection

- [x] 3.1 Replace the persistent right-side node inspector with a modal detail surface that shows node metadata and existing follow-up actions
- [x] 3.2 Replace the persistent right-side edge inspector with the same modal pattern for relation semantics and edge metadata
- [x] 3.3 Preserve the current graph camera position and surrounding browse context when the selection modal opens and closes

## 4. Responsive polish and verification

- [x] 4.1 Adapt the modal and contextual control surfaces for narrow layouts so graph exploration remains usable on smaller screens
- [ ] 4.2 Verify the redesigned graph-view route for uncluttered default state, modal inspection flow, and stable hover behavior on desktop and narrow layouts
- [x] 4.3 Run `pnpm typecheck`, targeted `pnpm lint`, and `pnpm build` after the redesign changes
