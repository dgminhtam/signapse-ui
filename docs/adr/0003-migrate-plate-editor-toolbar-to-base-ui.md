---
status: accepted
---

# Migrate the Plate/editor Toolbar to Base UI

ADR 0001 excluded the custom Plate/editor Toolbar because it was not a shadcn wrapper. Base UI now supplies a supported Toolbar API, so Signapse will migrate this integration in a dedicated change while preserving its public wrapper contract and editor interaction behavior; this removes the remaining direct `@radix-ui/react-toolbar` dependency without expanding the historical shadcn-wrapper migration.

## Considered Options

- Keep the Radix Toolbar exception: rejected because it preserves an unnecessary direct dependency after a supported Base UI mapping exists.
- Expand the original shadcn-wrapper migration: rejected because it would obscure the deliberate custom-editor boundary and its distinct compatibility decisions.
- Emulate Radix through a permanent compatibility layer: rejected because it would retain obsolete primitive semantics instead of adopting Base UI composition.

## Consequences

- The shared Plate/editor Toolbar keeps its supported consumer API and visual contract, but ordinary popup triggers adopt Base UI composition and split-list controls become semantic siblings.
- The migration records explicit keyboard, tooltip, font-size input, and overlay-focus contracts and removes only the direct Toolbar dependency; unrelated Radix dependencies remain outside scope.
