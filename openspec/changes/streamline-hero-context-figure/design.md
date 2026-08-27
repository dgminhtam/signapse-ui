## Context

The current text-first Hero combines landing copy, a labelled market-context figure, visible interaction controls, a persistent canvas boundary, and three proof points. The figure is a progressive enhancement over a localized static fallback and already supports pointer, keyboard, theme, viewport, and reduced-motion behavior. The confirmed direction keeps the figure's exploratory graph and price-action behavior while removing all visual control chrome and reclaiming its visual space.

The public landing contract currently requires visible figure identity, mode labels, hints, controls, statuses, and adjacent fallback text. This change replaces that requirement without changing the public product claims, the Hero's primary copy, access actions, trust note, or proof points.

## Goals / Non-Goals

**Goals:**

- Make the market-context figure read as a spacious conceptual visual rather than a miniature application surface.
- Preserve fine-pointer hover preview, pointer drag rotation, keyboard graph/price switching, and localized nonvisual guidance.
- Remove hidden click/tap pinning rather than leaving a gesture users cannot discover after the visual hint disappears.
- Bound nonessential automatic motion and preserve reduced-motion behavior.
- Keep a silent, layout-stable fallback when client enhancement or WebGL is unavailable.
- Preserve Hero hierarchy, primary content, responsive behavior, and claim boundaries.

**Non-Goals:**

- Replacing the conceptual figure with a product screenshot, chart, or new media asset.
- Changing Hero headline, supporting copy, CTA behavior, trust note, or the three proof points.
- Adding auto-cycling between graph and price action, continuous rotation, or a new visible control surface.
- Changing routes, APIs, authentication, localization infrastructure, or dependencies.

## Decisions

### 1. Separate visible chrome from figure semantics

The Hero visual header, figure caption, mode/status overlays, hover hint, pause button, fallback labels, and persistent boundary will be removed from the visible UI. The figure will retain a localized nonvisual name, description, and keyboard guidance so it remains understandable and operable without adding visible copy.

An `aria-hidden` decorative-only canvas was considered. It was rejected because the confirmed scope retains hover, drag, and keyboard exploration; hiding that capability from assistive technology would create a pointer-only interaction contract.

### 2. Retain intentional exploration and remove undiscoverable pinning

Fine-pointer hover will preview price action and pointer leave will return to graph mode. Drag will continue to rotate the active view. Click/tap pinning will be removed because its visible hint is removed and coarse pointers must not receive a hidden mode toggle.

Keyboard users will retain Arrow-key rotation and Enter/Space mode switching. A focus indicator will appear only while keyboard focus is present; it is an accessibility state, not persistent canvas chrome.

### 3. Bound decorative motion

The figure will perform one graph-only introductory rotation per page view, for at most four seconds, then settle. Viewport re-entry will not replay it. Reduced-motion will suppress the intro rather than using a slower or alternate looping animation.

Continuous rotation with the existing Pause control was considered. It was rejected because the confirmed visual direction removes all visible controls and indefinite nonessential motion would leave no visible pause path.

### 4. Reallocate existing Hero visual space

The canvas will consume the vertical space released by the removed visual header and caption at larger breakpoints. The outer Hero footprint will remain approximately stable, and the existing mobile minimum canvas footprint will be preserved. The persistent border will be removed; keyboard focus remains separately visible only on focus.

Making the whole Hero taller was considered. It was rejected because it would push the Hero's primary copy, access actions, and proof points farther down without improving the decision path.

### 5. Keep a silent progressive-enhancement fallback

The server-rendered fallback will remain a dual-view graphic with the same layout footprint, but without visible labels, statuses, or controls. It will retain a localized nonvisual description. This maintains visual continuity and avoids a blank media region when WebGL is unavailable.

Removing the figure entirely on failure was considered. It was rejected because it would create an empty Hero region and make the landing look broken despite the fallback being safe to render.

### 6. Treat visual-copy removal as a localized contract change

Visible-only Hero and figure strings will be removed from the rendered composition and dictionary contract where no nonvisual use remains. Existing localized strings needed for nonvisual title, description, and keyboard guidance will remain localized. Landing browser and component coverage will assert external behavior and absence of retired visual chrome rather than Three.js internals.

## Risks / Trade-offs

- [The figure becomes too visually quiet without labels or a border] → Reclaim the removed heading/caption space, retain the conceptual graph/price geometry, and validate light/dark contrast at target viewports.
- [Removing click/tap pinning prevents coarse-pointer price exploration] → This is intentional; coarse pointers keep drag rotation and do not receive an undiscoverable mode toggle.
- [Screen-reader users lose context after visible copy is removed] → Retain localized nonvisual identity, description, instructions, live mode feedback, keyboard focus, and keyboard controls.
- [One-time intro motion still distracts] → Limit it to four seconds, do not replay it on viewport re-entry, and suppress it for reduced-motion.
- [Fallback becomes ambiguous without visual labels] → Retain a nonvisual localized description and a recognizably dual-view graphic in the same footprint.
- [Removing visual Hero copy changes spacing unexpectedly] → Use responsive layout checks at mobile, desktop, and 200% zoom; keep the overall Hero footprint close to its current rhythm.

## Migration Plan

1. Update the Hero composition, figure behavior, styling, and localized visual-only strings together.
2. Replace the public landing contract and browser/component expectations for visible labels and controls with the control-free interaction contract.
3. Validate localized rendering, pointer and keyboard interaction, reduced motion, fallback behavior, and responsive layout before release.
4. Roll back by reverting the change if the new control-free visual does not preserve Hero readability or accessibility.

## Open Questions

- None.
