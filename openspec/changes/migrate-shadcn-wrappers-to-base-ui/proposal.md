## Why

Signapse currently uses Radix-backed shadcn wrappers while the current shadcn component direction supports Base UI. The repository also needs to upgrade its shadcn tooling and remove the obsolete Radix wrapper dependency without changing the product's visual contract or feature workflows.

This change establishes a controlled migration for shadcn wrappers only. It keeps the current Nova appearance, adopts the official latest Base UI implementations, and lets Radix and Base UI coexist until the last in-scope wrapper is migrated.

## What Changes

- Upgrade the shadcn CLI/package to the latest version available when implementation begins and lock the resolved baseline versions.
- Add `@base-ui/react` as an explicit dependency.
- Migrate the shadcn wrappers in `components/ui/` to the latest official Base UI registry implementations, one wrapper or dependency group at a time.
- Update consumers to the Base UI wrapper contracts, including `render`, Base Select `items`, `multiple` toggle groups, and Base focus/dismissal callbacks. **BREAKING** for internal wrapper consumer APIs.
- Keep the existing Nova visual contract: colors, spacing, typography, radius, layout, and overlay chrome do not become a redesign target.
- Keep only app-required custom behavior through composition or extensions outside the default Base UI wrapper implementation.
- Use native or CSS solutions where an official Base UI primitive does not exist; do not create replacement primitives or reimplement Radix behavior inside Base wrappers.
- Remove the unified `radix-ui` dependency after the final in-scope wrapper is migrated.
- Keep `@radix-ui/react-toolbar` and the Plate/editor toolbar outside this change.
- Verify each migration group with typecheck, lint/build milestones, and targeted browser/manual QA. A regression blocks dependent groups.

## Capabilities

### New Capabilities

- `base-ui-shadcn-wrapper-migration`: Defines the Base UI wrapper baseline, migration boundaries, consumer contract changes, dependency cleanup, and verification requirements for the shadcn wrapper set.

### Modified Capabilities

- `shadcn-radix-nova-conformance`: The authoritative shadcn baseline moves from Radix-backed `radix-nova` wrappers to Base UI-backed Nova wrappers while preserving the existing visual contract.
- `shadcn-dialog-close-composition`: Dialog close composition follows the official Base UI wrapper contract while retaining controlled-dialog and close-only workflow requirements.
- `radix-overlay-hydration-stability`: Overlay SSR, portal, deterministic relationship, focus, and hydration requirements apply to the migrated Base UI-backed shadcn overlays as well as any remaining Radix overlays.

## Impact

- Affected source: `components/ui/*` shadcn wrappers and their app consumers under `components/` and `app/[lang]/`.
- Affected configuration: `components.json`, `package.json`, and `pnpm-lock.yaml`.
- Affected dependencies: add `@base-ui/react`; upgrade `shadcn`; remove `radix-ui` only after the in-scope migration completes; retain `@radix-ui/react-toolbar`.
- Affected internal APIs: Radix-specific wrapper props and consumer composition patterns change to Base UI equivalents.
- Unchanged scope: business/API logic, permissions, form validation, feature workflows, Plate/editor toolbar behavior, `cmdk`, `vaul`, calendar, charts, and other non-shadcn primitives.
