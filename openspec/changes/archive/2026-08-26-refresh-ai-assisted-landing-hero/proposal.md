## Why

The public landing Hero is visually clean but too generic: it does not explain how AI supports a trader's analysis workflow, its abstract relationship treatment does not communicate product value, and the mobile header can collapse or clip brand and access controls. Signapse needs a more specific AI-assisted market-analysis story that remains faithful to the product's evidence, trust, and no-prediction boundaries.

## What Changes

- Reposition the Hero around AI-assisted market analysis for active and research-oriented traders while keeping inspectable market context—not prediction or execution—as the primary promise.
- Replace the unlabeled decorative relationship treatment with a localized conceptual market-context figure that explains how Signapse brings price, events, reactions, sources, and related relationships into an ask, explore, and verify workflow without presenting synthetic product UI.
- Tighten the Hero proof and trust copy in Vietnamese and English, retain the existing auth-aware primary CTA behavior, and keep the secondary CTA anchored to the analysis flow.
- Add restrained one-shot Hero motion using CSS transforms and opacity, with a complete static reduced-motion state and no new client boundary or animation dependency.
- Reflow the small-viewport header so brand, primary CTA, and menu remain visible while locale and secondary access actions remain available inside the disclosure.
- Update localized metadata and brand-only social-card text to match the AI-assisted positioning without introducing prediction, signal, advice, or automated-trading claims.
- Update the landing design documentation, canonical public-landing requirements, and behavior-focused tests for the revised positioning, semantics, responsive layout, metadata, and motion boundary.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `public-landing-page`: Modify the Hero positioning, conceptual product proof, localized metadata, responsive mobile header behavior, and reduced-motion requirements while preserving the existing public route, access model, product-story sequence, and trust boundaries.

## Impact

- Public localized landing composition, Hero content, header reflow, and conceptual visual treatment.
- Vietnamese and English landing dictionaries, metadata titles/descriptions, and social-card accessible text.
- Canonical landing design documentation, domain vocabulary, and the existing public landing specification.
- Existing public landing component, policy, metadata, accessibility, responsive, and browser tests.
- No backend API, permission, authentication, request-access destination, global theme token, font, shared primitive, or runtime dependency changes.
