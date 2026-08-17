---
status: accepted
---

# Use Base UI for shadcn wrappers

Signapse will migrate shadcn wrappers from Radix-backed implementations to the latest official Base UI shadcn implementations through a progressive, dependency-locked migration. The existing Nova visual contract remains authoritative, Base UI defaults are not modified to emulate Radix, and app-specific behavior is composed outside the default wrappers; the custom Plate/editor `@radix-ui/react-toolbar` remains out of scope because it is not a shadcn wrapper.

## Considered Options

- Keep Radix wrappers and upgrade only the shadcn CLI: rejected because it leaves the project on the obsolete wrapper baseline.
- Emulate Radix behavior through a compatibility layer: rejected because it would preserve the old API and undermine the official Base UI wrapper contract.
- Migrate every Radix-based component, including Toolbar: rejected because Toolbar is a custom editor integration rather than a shadcn wrapper.

## Consequences

- Consumers move to Base UI contracts such as `render` and Base Select `items`.
- Radix and Base UI coexist during migration; `radix-ui` is removed only after the final in-scope wrapper, while `@radix-ui/react-toolbar` remains.
- Any capability without an official Base UI mapping must be reported and handled through an external composition or native/CSS mapping.
