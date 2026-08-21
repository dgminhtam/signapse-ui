## 1. Shared responsive placement

- [x] 1.1 Update the shared Quick Detail presentation resolver so every approved owner uses the existing right-side Event (`32rem`) or Article (`44rem`) geometry at an effective CSS viewport of `1440px` or wider.
- [x] 1.2 Preserve the established `768px`–`1439px` and narrow-mobile bottom-sheet geometry, owner-local state, one-overlay lifecycle, focus restoration, scroll continuity, and reduced-motion behavior.
- [x] 1.3 Confirm the Graph inspector remains mounted behind the modal and Market Charts retains annotation hand-off, restoration, and fullscreen portal containment without introducing owner-specific Drawer trees.

## 2. Active documentation and policy alignment

- [x] 2.1 Sync the Quick Detail placement and Graph View refinement deltas into the active OpenSpec specifications, including removal of stale generic-header-description language.
- [x] 2.2 Update design guidance and all active policy documentation to describe the unified `1440px` desktop right-sheet rule, shared bottom fallback, and preserved host-specific restoration behavior.
- [x] 2.3 Rename the legacy PDP/quick-view guide to the canonical Signapse entity Quick Detail guide and update its terminology, placement matrix, header contract, and validation guidance without editing archives.

## 3. Automated verification

- [x] 3.1 Extend resolver tests to cover each approved owner at `767px`, `768px`, `1439px`, and `1440px`, including profile widths and no sidebar-dependent placement change.
- [x] 3.2 Update or add browser journeys that verify Dashboard, Graph View, and Market Charts observable placement, focus restoration, responsive session continuity, and Market Chart fullscreen/annotation restoration behavior.
- [x] 3.3 Run OpenSpec validation, focused automated tests, targeted lint, and typecheck; document any unrelated full-repository lint baseline failures separately.

### Verification notes

- OpenSpec validation passed; focused resolver and Drawer component tests passed (`19/19`); targeted ESLint passed.
- The Playwright journeys are implemented but could not launch Chromium in this environment because the browser process returns `spawn EPERM`.
- Full TypeScript checking is currently blocked by unrelated pre-existing worktree changes in `components/asset-multi-select-combobox.tsx` and `components/workspace-watchlist-editor.tsx` (missing dictionary keys).
- Full-repository lint retains the previously recorded seven unrelated baseline errors outside this change; targeted lint for the touched files passes.
