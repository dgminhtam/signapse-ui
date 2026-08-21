## Context

Signapse already defines **Signapse entity quick detail** as a local modal reading overlay owned by Dashboard, Graph View, or Market Charts. The current implementation centralizes its data fetch and profile content in one local composition, but it always opens as a generic bottom Drawer and does not retain the owner, return-focus target, or opening-session lifecycle required by the current design policy.

The new policy specifies profile-aware geometry across two responsive thresholds, a sticky accessible header, stable per-opening snapshots, and exact focus restoration. Market Charts adds a special lifecycle problem: its current annotation action dismisses the annotation surface before it opens Event inspection, which removes the activating button before the Drawer can restore focus.

This design must preserve two existing contracts:

- Base UI and Nova wrapper chrome remain shared-component contracts. Entity-specific presentation belongs in local composition rather than a new shared Drawer variant.
- The completed fullscreen portal change keeps quick detail inside the fullscreen Market Charts surface through the nearest overlay portal container.

## Goals / Non-Goals

**Goals:**

- Apply the documented owner/profile/viewport placement policy without changing canonical routes or shared wrapper chrome.
- Give every quick-detail opening a stable modal, data snapshot, scroll position, and focus lifecycle.
- Make loading, error, missing, and denied states explicit, accessible, and compatible with their resolved presentation.
- Preserve the focused Event inspection and Article reader content contracts.
- Restore Market Charts annotation context after Event inspection closes while preventing simultaneous nested overlays.
- Add deterministic behavior coverage at the resolver and rendered-overlay boundaries.

**Non-Goals:**

- Adding Article reader entry points to Market Charts.
- Adding URL state, intercepted routes, a quick-detail history stack, or Back-driven reopening.
- Changing Event or News Article backend contracts, permissions, full-detail routes, or API transport.
- Changing default Base UI Drawer/Sheet chrome, adding a global overlay mode, or introducing a dependency.
- Redesigning canonical Event or News Article pages.

## Decisions

### 1. Keep one local Drawer composition and resolve presentation as policy

The existing local entity quick-detail composition will remain the only feature owner of quick-detail presentation. It will resolve a presentation from three inputs: owner, entity profile, and effective CSS viewport. The resolved presentation controls direction, geometry, swipe affordance, and reduced-motion behavior.

One Drawer instance changes direction between viewport-right and bottom placement instead of switching between unrelated Sheet and Drawer trees. This preserves the open entity, modal focus, and body scroll while resize or zoom crosses a threshold. The resolver is local and deterministic so callers only supply their approved owner and selected entity; they cannot choose width, direction, or mode.

Alternatives considered:

- Use a separate desktop Sheet and mobile Drawer: rejected because component replacement risks remounting, animation replay, scroll loss, and focus loss during responsive re-resolution.
- Add quick-detail variants to the shared Drawer wrapper: rejected because it violates the Base UI/Nova ownership contract and would couple unrelated consumers to entity policy.

### 2. Treat an opening as a request session, not a cache entry

An owner will open quick detail with a request that includes the entity, approved owner, and return-focus target. The local composition creates a new session whenever that request changes from closed to open, resets the body scroll to the top, and starts exactly one permission-aware fetch for that session.

The session retains the returned entity snapshot until dismissal. It does not refetch because surrounding UI data, viewport placement, or parent renders change. Explicit Retry creates a new request for the same entity. In-flight responses that no longer belong to the active session are ignored.

HTTP 404 responses are classified as missing through the existing status-bearing fetch error. Other request failures are transient errors. Permission denial remains a local state and does not request inaccessible content.

Alternatives considered:

- Reuse a detail cache keyed only by entity ID: rejected because reopening the same entity could show stale content before the new fetch completes and would not guarantee scroll reset.
- Fetch continuously while open: rejected because the policy requires a stable reading snapshot.

### 3. Compose one sticky modal header and one body scroll region

The local shell will render a sticky header containing a localized profile-plus-entity title, concise state-aware description, visible Close control, and the canonical internal full-detail action when the target is actionable. The body beneath it is the only scroll region.

The full-detail action is available for loading, ready, and transient-error states with a known permitted target. It is absent for missing and access-denied states. Original article source remains an Article-reader provenance action rather than a replacement for canonical escalation. There is no sticky footer duplicating the action.

The underlying Base UI popup will receive an initial-focus target for the Close control and a final-focus target for the original owner trigger. Escape, desktop backdrop dismissal, and mobile swipe dismissal use the same controlled close path.

### 4. Restore Market Charts context without nesting overlays

Market Charts will capture the annotation title trigger and the selected annotation context when opening Event inspection. The annotation popup or panel is dismissed while the modal is open, avoiding simultaneous nested overlays. When quick detail closes, the owner restores that source context before the Drawer final-focus callback resolves the original trigger.

Dashboard and Graph View only need to retain their activating button because their owner context stays mounted while modal quick detail is open.

Alternatives considered:

- Keep the annotation popup mounted behind the modal: rejected because it creates competing overlay state and risks violating the no-nested-overlay policy.
- Close the popup permanently and focus a generic chart element: rejected because it cannot restore focus to the exact trigger.

### 5. Keep profile content focused and bounded

Event inspection retains its existing maximum of four evidence items and four related assets. In bottom placement, the structured facts/evidence/assets cluster receives a centered `64rem` maximum width. Article reader restores its default `72ch` prose measure while feature media may use the wider panel and intrinsically wide content retains local scrolling.

Event evidence continues to navigate to canonical News Article routes in the same tab. Market Charts continues to expose Event inspection only; it does not acquire a nested Article reader path.

### 6. Test behavior through the resolver and overlay boundary

The deterministic resolver is the policy seam for the placement matrix. The existing quick-detail component boundary is the interaction seam for session state, header behavior, focus, and profile content. Browser coverage verifies the real primitive in responsive and fullscreen conditions.

Tests assert observable behavior and accessibility semantics rather than wrapper implementation classes. The existing component test is extended instead of introducing a separate quick-detail test harness.

## Risks / Trade-offs

- [Risk] A direction change during an open session can disturb focus or replay transition state. → Keep one controlled Drawer instance, avoid placement-based keys, preserve its session state, and test resize/zoom behavior with reduced motion.
- [Risk] Market annotation restoration may race with final focus. → Restore owner state before resolving final focus and wait for the trigger to be mounted before returning it.
- [Risk] Fixed Drawer geometry inside fullscreen can be clipped or escape the fullscreen top layer. → Preserve `DrawerContentInOverlay` and the nearest overlay portal container; test normal and fullscreen Market Charts.
- [Risk] A broad state refactor could accidentally fetch repeatedly. → Use an explicit session identity and narrowly scoped fetch effect with stale-response protection.
- [Risk] Header action rules can regress permission safety. → Derive action availability from the classified state and permission result; test ready, loading, error, missing, and denied states.

## Migration Plan

1. Introduce the local presentation/session policy and update approved owner adapters without changing shared wrapper contracts.
2. Add the sticky header, state-specific body content, focus handoff, and profile layout refinements.
3. Update localization and behavior tests, including Market Charts fullscreen containment.
4. Run OpenSpec validation, lint, typecheck, focused Vitest tests, and applicable browser coverage.
5. Roll back by reverting the local composition, owner adapters, dictionaries, and tests; no data migration, API migration, or route migration is required.

## Open Questions

None. Owner profile scope, canonical navigation behavior, state recovery, primitive choice, and Market Charts context restoration were confirmed during planning.
