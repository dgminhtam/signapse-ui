## Why

Main pages in `app/(main)` currently duplicate page identity inside a large wrapping `Card` even though the app shell already exposes the current location through breadcrumbs. The result is extra chrome, repeated titles, nested bordered surfaces, and inconsistent page rhythm across list, form, detail, and tool screens.

This change removes the default main-card pattern in one pass so active pages use a cleaner cardless workspace, while preserving meaningful inner surfaces such as tables, forms, detail panels, access-denied states, and repeated cards.

## What Changes

- **BREAKING**: Replace the repo-wide expectation that every main page is wrapped in a top-level `Card`.
- Introduce a shared cardless page workspace convention for `app/(main)` pages that relies on the app breadcrumb as the primary page identity.
- Remove duplicated `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `Separator` composition from pages where the `Card` only acts as the main page shell.
- Keep `Card` available for genuine inner surfaces: repeated dashboard tiles, form sections, detail panels, tool panels, access-denied/error panels, and any content block that needs its own boundary.
- Apply the new convention to all reachable pages that currently use a main `Card`; do not stage the migration by feature and do not keep compatibility wrappers for the old pattern.
- Clean unused imports, dead wrapper components, stale skeleton wrappers, and duplicate page copy as part of the same change.
- Update `AGENTS.md` so future work and reviews enforce the cardless page workspace convention instead of reintroducing main-card shells.
- Correct breadcrumb labels that become the source of truth for page identity, especially labels that currently drift from the route's user-facing name.

## Capabilities

### New Capabilities
- `cardless-main-page-workspace`: Defines the shared page-level workspace convention for `app/(main)` routes, including when to avoid a main `Card`, when inner `Card` surfaces remain appropriate, and how breadcrumb-driven page identity should behave.

### Modified Capabilities
- None.

## Impact

- Affected code: `app/(main)/**/page.tsx`, `components/app-breadcrumbs.tsx`, `AGENTS.md`, and any page-local skeletons or helper wrappers that only exist to support the old main-card shell.
- Affected UX: main pages will feel lighter and more direct, with less nested chrome around toolbars, tables, forms, and detail content.
- Affected architecture: page composition shifts from `Card > CardHeader > Separator > CardContent` to cardless workspace content backed by shared app-level surfaces.
- Dependencies and APIs: no backend API, route, DTO, auth, permission, or query-parameter contract changes.
