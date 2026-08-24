# tabs

2026-08-18 — official Base Nova `@base-ui/react/tabs` wrapper via shadcn CLI dry-run/diff; verdict: migrated and typechecked.

## Changed

- Replaced the Radix Tabs parts with the official Base Nova `@base-ui/react/tabs` root, list, tab, and panel parts.
- Updated wrapper prop types and part names to the Base UI contracts.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/tabs.tsx`.

## Left alone

- Existing Nova classes, orientation default, tab values, default-value flows, content composition, and account/schema-editor consumers.
- No consumer changes were required because these usages already use the shared wrapper contract.

## Behavior changes

- The wrapper now follows Base UI's `Tab`/`Panel` naming internally. No intended user-visible behavior change.

## Verify by hand

- Confirm the account route renders one direct cardless profile surface and a legacy `?tab=billing` query still resolves to that profile without a redirect or billing placeholder.
- Confirm schema Builder/JSON tabs switch correctly and preserve form/editor state.
- Confirm keyboard tab navigation, focus ring, selected styling, and panel visibility in light and dark themes.
