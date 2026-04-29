## Context

`/graph-view` is already implemented as a protected browse surface with an SSR-safe shell and a client-only Sigma canvas. The current route now loads and renders correctly, but two regressions remain visible in normal use:

- parts of the workbench still contain corrupted Vietnamese copy instead of clean UTF-8 user-facing text
- node hover is treated as a high-importance state in too many places, so moving the pointer across the graph causes the shell, inspector prose, and canvas feedback to update together, which makes the page feel jittery

The backend contract, permissions, and core graph interactions are already correct. This change is about restoring language quality and rebalancing interaction ownership so hover feels lightweight and selection remains the stable source of detail.

## Goals / Non-Goals

**Goals:**
- Restore correct Vietnamese copy across the graph-view route and workbench.
- Make hover feedback feel fast and low-cost by keeping it local to the graph canvas or other bounded surfaces.
- Preserve selection as the primary driver for inspector detail and anchored status messaging.
- Keep the current route, permissions, API contract, and Sigma-based browse model intact.

**Non-Goals:**
- Reworking the overall graph-view information architecture again.
- Replacing Sigma, graphology, or the current SSR/client rendering boundary.
- Adding new backend data, new filters, or new detail routes.
- Turning hover into a delayed selection model or removing neighborhood highlighting entirely.

## Decisions

### 1. Treat corrupted copy as a source-text integrity bug, not a font bug

The fix will restore the affected graph-view strings directly in the relevant route and workbench modules using normal UTF-8 source text. The implementation will not add runtime decoding helpers, alternate fonts, or browser-side normalization tricks.

Why:
- The app-wide font configuration already supports Vietnamese correctly, so the problem is local to corrupted source strings.
- Runtime decoding logic would hide the real issue and add fragile behavior to user-facing copy.
- Directly restoring the text keeps the codebase aligned with the repo's language rules and easier to review.

Alternatives considered:
- Changing the font stack or loading an additional Vietnamese font.
- Rejected because unaffected files already render Vietnamese correctly under the current font setup.
- Adding runtime string repair logic.
- Rejected because the copy should be correct at the source rather than repaired at render time.

### 2. Separate transient hover feedback from stable shell and inspector state

Hover will remain a transient graph-reading aid. It should drive neighborhood emphasis and small, bounded canvas feedback, but it should no longer rewrite high-level shell copy, broad status chips, or inspector paragraphs on every pointer move. Selection will stay responsible for stable detail states outside the canvas.

Why:
- Hover changes at very high frequency, so using it to control large DOM regions creates reflow and perceptual jitter.
- Selection is the correct stable state for detail panels and anchored summaries.
- The graph still benefits from hover emphasis, but that emphasis belongs closest to the canvas.

Alternatives considered:
- Keeping the current hover wiring and only trying to smooth it with CSS transitions.
- Rejected because the core problem is state ownership, not styling alone.
- Removing hover-driven shell state entirely and exposing no textual hover feedback.
- Rejected because a small amount of local hover guidance can still improve readability when kept near the canvas.

### 3. Keep hover-driven rendering changes bounded and predictable inside Sigma

The canvas should continue to highlight neighborhoods on hover, but the implementation should avoid layering additional expensive shell work on top of Sigma's reducer refresh path. Hovered labels and emphasis should remain contextual and compact rather than triggering multiple parallel copy updates.

Why:
- Sigma already refreshes reducer output on hover-related state changes, so adding large DOM updates on top amplifies the perceived cost.
- Constraining hover output makes the graph feel smoother without removing useful local feedback.
- This keeps the bugfix focused on stability rather than introducing a larger interaction redesign.

Alternatives considered:
- Rewriting the graph interaction model around a throttled hover store or a more complex debounced interaction layer.
- Rejected for this change because the main win comes from narrowing hover ownership before adding more machinery.

### 4. Preserve selection-first semantics for drill-down and inspector content

The selected node or edge will remain the source of truth for inspector detail, drill-down affordances, and persistent status copy. Hover may provide transient hints, but it must not displace a current selection in the workbench shell.

Why:
- It keeps the graph experience legible: hover is exploratory, selection is intentional.
- It matches how operators expect a browse tool to behave once they pin a node or edge.
- It reduces shell churn without losing graph depth.

Alternatives considered:
- Letting hover temporarily override selection-focused copy.
- Rejected because it causes the exact instability users are reporting.

## Risks / Trade-offs

- [Reducing hover-driven shell updates could make the page feel less reactive] → Mitigation: keep hover emphasis and short feedback inside the canvas so the graph still feels alive.
- [Restoring copy in a large workbench file may miss a few corrupted strings] → Mitigation: audit all user-facing strings in `page.tsx`, `graph-view-workbench.tsx`, and `graph-view-canvas.tsx` as one pass instead of patching only the most obvious examples.
- [Selection-first shell messaging may surface less contextual hover information outside the canvas] → Mitigation: preserve concise hover hints in the canvas overlay where they do not trigger broad layout changes.
- [Sigma refresh cost will still exist at the canvas layer] → Mitigation: focus this change on eliminating avoidable DOM churn first, then reassess whether any remaining hover cost needs deeper reducer optimization.

## Migration Plan

1. Audit graph-view route and workbench copy, then restore all corrupted Vietnamese strings in the affected files.
2. Refactor hover ownership so transient hover feedback stays in the canvas layer or other bounded surfaces instead of driving broad shell and inspector rewrites.
3. Preserve selection-driven inspector and drill-down behavior while verifying that hovering no longer destabilizes surrounding layout.
4. Validate the screen in runtime and run typecheck, build, and targeted lint for changed files.

Rollback strategy:
- Revert the graph-view copy and hover-state wiring changes while keeping the current route structure, API integration, and SSR boundary intact.

## Open Questions

- None for proposal readiness. The root causes are specific enough to fix without further product or API clarification.
