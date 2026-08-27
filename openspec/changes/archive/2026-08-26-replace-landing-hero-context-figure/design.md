## Context

See `proposal.md` for motivation. The application landing is currently server-rendered and keeps a localized static conceptual diagram inside the Hero's right column. Existing component and browser coverage asserts that diagram's semantics, section order, responsive behavior, accessibility, and localized product story.

The approved v9 demo supplies the desired graph geometry, large circular nodes, uniform edges, graph-to-price-action morph, drag rotation, and resumed auto-rotation. It is nevertheless a standalone dark Hero with hardcoded copy, a large fixed canvas, continuous rendering, and application-mode semantics. The implementation must adopt its visual core without importing those page-level assumptions. ADR-0010 records the progressive-WebGL boundary, while ADR-0005 keeps application-host implementation separate from apex cutover.

## Goals / Non-Goals

**Goals:**

- Keep the landing and Hero server-rendered except for one route-local interactive figure island.
- Preserve the approved v9 visual identity while making every meaningful interaction available to fine pointer, touch, keyboard, and assistive-technology users.
- Keep a meaningful static figure in the initial HTML and under every renderer failure state.
- Bound client bundle, CPU, GPU, motion, and layout costs without weakening the interaction contract.
- Keep localization, theme parity, product claims, and surrounding Hero composition authoritative outside the renderer.

**Non-Goals:**

- Rebuild the complete v9 page or change any Hero content outside the figure.
- Render live product data, a real chart, a product capture, or an executable trading surface.
- Create a reusable visualization framework, shared Three.js wrapper, analytics contract, or persisted interaction state.
- Change backend APIs, auth, metadata, social cards, deployment origin, indexability, or apex cutover.

## Decisions

### 1. Progressive server figure with one route-local client island

The server-owned figure shell will render its localized title, description, static dual-view geometry, and stable responsive footprint in the initial HTML. A route-local client component will enhance only the visual stage after hydration. The interactive component receives the smallest localized label set needed for hints, mode names, status announcements, and auto-rotation controls rather than serializing the complete landing dictionary.

The client will not replace the whole Hero, because that would move approved content and CTA behavior across an unnecessary server/client boundary. It will not become a shared component because no other route owns this public conceptual interaction.

### 2. Adopt v9 geometry through pinned Three.js rather than recreate it

The implementation will pin `three@0.180.0` and `@types/three@0.180.0`, then adapt the v9 scene construction, deterministic graph positions, large node texture, uniform graph edges, candle-like price-action geometry, morph interpolation, and drag rotation. Three.js will load dynamically from the client island after hydration.

Reimplementing the approved visual in G6, a chart engine, CSS, or an independently designed SVG was rejected because it would add translation risk and could no longer be treated as the approved v9 result. Copying the demo's Next.js, React, font, global CSS, or page shell was rejected because those are demo scaffolding rather than visual requirements.

### 3. Separate conceptual meaning from canvas pixels

The visible figure title, mode labels, input hints, current mode, controls, and assistive description remain localized DOM content. The canvas is decorative to the accessibility tree. The figure description states that the Market Knowledge Graph and price action are complementary market-context views and explicitly avoids a literal data-transformation claim.

The static fallback will show recognizable graph and price-action geometry without tickers, axes, values, metrics, input chrome, or dashboard styling. It is conceptual media, not synthetic product UI.

### 4. Use a small explicit interaction state model

The interactive state consists of the rendered morph position, whether price action is pinned, whether a fine pointer is hovering, the current orientation, whether a pointer gesture has crossed the drag threshold, whether auto-rotation is enabled, and whether rendering is currently eligible to run.

The target mode resolves as follows:

- A pointer-down drag locks the mode visible when the gesture began.
- A pinned selection wins over hover after the pointer is released.
- Otherwise a fine-pointer hover temporarily targets price action.
- The default target is the Market Knowledge Graph.

Click, tap, Enter, and Space toggle the pinned price-action state. Drag and arrow keys change orientation only. Resize and theme changes preserve in-memory state; unmount and remount reset to the default graph state. No URL, cookie, local-storage, or session-storage state is introduced.

### 5. Prefer semantic controls over application mode

The visual stage will be a labelled focusable group with a visible focus treatment and localized instructions. Enter and Space toggle mode; arrow keys rotate the current mode. A separate native button controls auto-rotation. A polite live region announces mode and fallback changes.

The demo's `role="application"` is rejected because it overrides ordinary screen-reader navigation semantics for a bounded conceptual figure. A giant button wrapping the stage is also rejected because rotation and mode switching are distinct operations.

### 6. Keep all new chrome inside the existing figure footprint

The interaction hint sits in the upper-left, the native auto-rotation control in the upper-right, and the current mode in the lower-right. Pointer-capability-aware visible hints distinguish hover from tap while the accessible description documents keyboard controls. There is no external toolbar or status row that would move the proof points or enlarge the surrounding Hero composition.

The old `01 / 03` marker is removed because the figure is not a sequence. The figure title changes to the approved localized two-view title; the Hero proof heading and proof-point copy remain unchanged.

### 7. Treat motion as controllable and render only while necessary

Normal-motion visitors receive auto-rotation by default, v9-style morph interpolation, drag rotation, and automatic rotation resumption after drag. Pausing affects only auto-rotation; direct interaction remains available.

Reduced-motion visitors start with auto-rotation disabled and mode changes applied immediately. They may explicitly enable auto-rotation for the current mount, but morphs remain immediate. This makes the opt-in narrower than globally overriding the operating-system preference.

The renderer caps device-pixel ratio and schedules frames only while auto-rotation, morphing, or manual interaction needs them. Document visibility and an intersection observer suspend work when the page or figure is inactive. Cleanup disposes the renderer, texture, geometries, materials, observers, frame requests, and event handlers.

Continuous unbounded requestAnimationFrame rendering was rejected because the Hero remains mounted for the entire landing visit and would consume CPU/GPU even when no visible change is needed.

### 8. Derive renderer colors from the active Signapse theme

The DOM surface uses existing semantic landing tokens. Renderer colors are resolved from the active theme into a small scene palette that preserves the v9 relationships among background, nodes, edges, grid, and price-action lines. Theme updates recolor the existing scene without recreating it or resetting interaction state.

Keeping the demo's fixed green-black palette in both themes was rejected because it would create a landing-only visual system and weaken light/dark parity.

### 9. Preserve the current Hero footprint

The interactive stage uses the current figure's responsive reading position and a bounded height of approximately `288–352px`; it does not import the standalone demo's `520/430/350px` breakpoints. The fallback and enhanced canvas share the same footprint, so hydration and renderer failure do not cause layout shift.

The existing one-column narrow reading order and split desktop Hero remain authoritative. The figure must not create page-level overflow at the landing's existing breakpoint and zoom matrix.

### 10. Fail back to static content instead of showing an error panel

The static dual-view remains available until WebGL initializes successfully. On initialization failure or graphics-context loss, the client removes or disables unavailable controls, restores the static figure, and announces that the static view is active. It does not render raw errors, a blocking Retry panel, or an empty media frame.

An explicit Retry action was rejected because the complete conceptual meaning already exists in the fallback and a graphics failure should not interrupt the public landing conversion path.

### 11. Test at the existing highest seams

The primary seam is the public landing route in browser coverage, which can observe hydration, pointer/touch/keyboard interactions, reduced motion, theme, responsive layout, accessibility, and fallback behavior. The only supporting seam is the server-rendered landing composition test for localized initial HTML, canonical section order, fallback semantics, and unchanged surrounding Hero content.

Renderer objects, buffers, exact frames, and GPU pixels are implementation details and will not receive dedicated assertions. Pixel snapshots were rejected because WebGL output varies across GPU and browser environments; product visual sign-off remains a release-owner check rather than an implementation archive gate.

## Risks / Trade-offs

- [Three.js increases public landing client JavaScript] → Dynamically import it inside the narrow client island, pin its version, preserve complete server content, and record the production build impact.
- [Hover-first behavior is unavailable on touch] → Add tap pinning, a drag threshold, capability-aware hints, and keyboard equivalence without changing the v9 visual core.
- [Continuous motion causes accessibility or battery regressions] → Provide a visible control, honor reduced motion, cap pixel ratio, and stop rendering while idle, hidden, paused, or offscreen.
- [Candlestick-like geometry is mistaken for live or predicted data] → Keep the figure abstract, omit values and product chrome, use canonical labels, and retain the explicit complementary-view claim boundary.
- [Theme color conversion changes the approved aesthetic] → Preserve v9 contrast relationships rather than its literal fixed palette and include light/dark visual sign-off in the release review.
- [WebGL differs or fails across devices] → Keep the same-footprint server fallback as the source of semantic continuity and avoid pixel-based automated gates.
- [Interaction state becomes confusing across hover, pin, and drag] → Use the explicit state precedence above, lock the mode during drag, show the current mode, and reset predictably on remount.

## Migration Plan

1. Update the landing design contract and localized figure vocabulary before replacing runtime markup.
2. Add the pinned renderer dependencies and the route-local progressive figure with its static fallback.
3. Replace the old conceptual diagram in place, then remove its obsolete helper markup, dictionary entries, tests, and styling.
4. Update behavior-focused component and browser coverage and run the repository-owned verification gates.
5. Ship the implementation to the existing application-host preview under the current noindex policy; do not combine it with apex cutover.

Rollback consists of reverting the runtime figure and dependency changes to the previous static conceptual diagram while retaining immutable repository history. ADR-0005's separate application-host and apex-cutover boundary remains unchanged.
