# button

2026-08-18 — official Base Nova `@base-ui/react/button` wrapper via shadcn CLI dry-run/diff; verdict: migrated and typechecked.

## Changed

- Replaced the Radix Slot-backed button wrapper with the official Base Nova `@base-ui/react/button` implementation.
- Removed the wrapper-level `asChild` compatibility prop. Native button consumers remain on `Button`; link consumers use direct `Link`/`a` elements styled with the exported `buttonVariants`, while `render` remains available for compositions that preserve button semantics.
- Removed the app-specific `icon-xl` size and wrapper-level `data-variant`/`data-size` markers so the canonical Button matches the registry. The three assistant controls that needed the larger icon treatment now compose `size-11` and icon sizing at their usage sites.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/button.tsx`.

## Left alone

- Existing CVA variants, standard sizes, Nova classes, and native button behavior. Usage-site composition preserves the assistant trigger dimensions without extending the wrapper API.
- Native action, submit, disabled, and focusable button consumers that still require button semantics.

## Behavior changes

- `Button` keeps native button semantics by default. Link-style consumers must not render an anchor through `Button`; they use direct `Link`/`a` elements with `buttonVariants`, preserving native link semantics, keyboard behavior, and navigation.

## Verify by hand

- Verify one native button and one direct `buttonVariants` link before broad consumer validation.
- Verify focus, disabled state, submit behavior, link navigation, external-link targets, and the assistant trigger icon sizing.
