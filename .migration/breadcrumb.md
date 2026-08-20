# breadcrumb

2026-08-18 — official Base Nova registry wrapper via shadcn CLI view/dry-run with the project Lucide icon adaptation; verdict: migrated and typechecked.

## Changed

- `components/ui/breadcrumb.tsx`: replaced `Slot`/`asChild` with Base UI `useRender` and `mergeProps`, keeping the existing Lucide icons because this project uses the Lucide icon library instead of the registry placeholder helper.
- `components/app-breadcrumbs.tsx`: changed dashboard and nested breadcrumb links to the Base UI `render` contract while preserving localized navigation and responsive visibility.
- Leftover Radix import scan is clean for the migrated files: no `radix-ui` or `@radix-ui` import remains in the wrapper or consumer.

## Left alone

- Breadcrumb labels, route mapping, localized links, separators, truncation, and Nova spacing/classes.
- `components/ui/toolbar.tsx` and `@radix-ui/react-toolbar`, which remain explicitly out of scope.

## Behavior changes

- Breadcrumb links now use Base UI `render`; the Radix-only `asChild` prop is intentionally removed. The separator keeps the official RTL-flip class without changing the current LTR appearance.

## Verify by hand

- Navigate through dashboard, list, and detail routes and confirm each breadcrumb link preserves locale-aware navigation.
- Confirm current-page text, hidden desktop crumbs, truncation, keyboard focus, and separator placement at mobile and desktop widths.
