## Why

The public application landing currently inherits the neutral Nova light/dark palette used by the protected dashboard, so its accepted editorial layout does not yet have a distinct Signapse marketing identity. The landing needs a fixed, accessible navy-and-mint composition based on the previously approved Signapse palette while preserving the visitor's dashboard theme preference and all existing product-proof contracts.

## What Changes

- Give the localized public landing a route-scoped fixed brand composition that renders consistently regardless of the global light or dark theme.
- Use the approved Signapse navy, navy-surface, mint, off-white, muted, and boundary colors as the palette anchors, with contrast-safe derived shades from the same color families.
- Apply dark surfaces to the header, Hero, final access CTA, and footer, and light surfaces to the product story, analysis flow, and trust boundary.
- Make the Hero WebGL renderer and its static fallback resolve the same landing-scoped palette without changing figure geometry, interaction, motion, or meaning.
- Select logo treatment from the landing surface instead of the global theme while leaving the stored theme preference untouched for the protected application.
- Retint the existing grid, borders, surfaces, and CTA treatments without changing copy, typography, spacing, section topology, responsive behavior, or CTA destinations.
- Preserve approved product captures as unmodified product evidence; only their surrounding frame and caption treatment adopt landing tokens.
- Update the landing design contract and record the deliberate fixed-theme boundary against the application-wide theme model.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `public-landing-page`: Replace landing light/dark visual parity with a fixed route-scoped Signapse brand composition while preserving theme preference, product captures, responsive accessibility, and the Hero figure behavior contract.

## Impact

- Affects the localized public landing composition, route-local styling, logo selection on landing surfaces, and Hero figure palette resolution.
- Updates the landing design contract, a focused architecture decision, the existing landing component/browser coverage, and the public landing capability specification.
- Leaves global theme tokens, the Nova preset, shared shadcn wrapper chrome, protected dashboard appearance, product APIs, authentication, localization copy, metadata, and deployment policy unchanged.
- Adds no runtime dependency and performs no data migration.
