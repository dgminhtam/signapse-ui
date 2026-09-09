## 1. Design Contract

- [x] 1.1 Update the durable landing design contract to define the fixed route-scoped navy/mint composition, surface mapping, palette anchors, theme-preference boundary, capture treatment, and Graphify reference boundary.
- [x] 1.2 Add a focused ADR for the fixed public-landing composition and clarify that the earlier Hero ADR's interaction, accessibility, lifecycle, and performance decisions remain accepted.

## 2. Landing Palette And Surfaces

- [x] 2.1 Add the route-scoped semantic landing palette using the approved Signapse color anchors and contrast-safe derived shades without changing global theme tokens or shared component chrome.
- [x] 2.2 Apply the dark surface family to the header, Hero, final access CTA, and footer, and the off-white surface family to Product Story, Analysis Flow, and Trust Boundary.
- [x] 2.3 Select landing logo variants by surface and keep global theme preference storage and document theme state untouched.
- [x] 2.4 Retint the existing grid, boundaries, controls, focus treatments, and product-capture frames while preserving layout, copy, CTA destinations, motion, and original capture pixels.

## 3. Hero Figure Palette

- [x] 3.1 Resolve interactive Hero renderer colors from the nearest landing palette owner instead of the global body theme while preserving renderer state and lifecycle behavior.
- [x] 3.2 Align the server-rendered static fallback with the same landing palette without changing figure geometry, interaction semantics, or reduced-motion behavior.

## 4. Regression Coverage

- [x] 4.1 Extend the existing landing component coverage for fixed surface roles, explicit logo treatment, unchanged localized composition, and unchanged approved capture identity.
- [x] 4.2 Extend the existing landing browser coverage to verify identical landing palette roles under global light and dark settings and preservation of the stored dashboard theme preference.
- [x] 4.3 Cover shared WebGL/fallback palette resolution without GPU pixel snapshots and retain the current pointer, keyboard, coarse-pointer, context-loss, and reduced-motion assertions.
- [x] 4.4 Verify product images have no filter, tint, overlay, blend mode, or decorative opacity and retain their approved sources and intrinsic geometry.
- [x] 4.5 Retain responsive overflow, zoom 200%, keyboard navigation, touch-target, locale parity, and WCAG axe checks at the existing target widths.

## 5. Automated Verification

- [x] 5.1 Run the targeted landing component and browser test suites.
- [x] 5.2 Run lint, typecheck, and the production build.
- [x] 5.3 Run static searches for leaked global palette edits, forbidden capture treatments, and stale landing light/dark parity guidance.
- [x] 5.4 Run strict OpenSpec validation for this change.

User-owned manual QA: review the final WebGL colors and overall visual hierarchy for Vietnamese and English on the preview deployment before public release approval.
