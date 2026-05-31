## Why

The protected app currently has a root workspace overview at `/`, but the sidebar does not expose it as a first-class destination and the breadcrumb still frames it as a generic home page. Because Signapse screens depend on an active workspace context, the root route should become the clear workspace overview and gate for the rest of the app.

## What Changes

- Add a first-level sidebar item for the root route labeled `Tổng quan` / `Overview`.
- Treat `/` as the canonical workspace overview route after locale normalization, while preserving the existing URL.
- Update root breadcrumb/page identity copy so the workspace overview is not presented as a generic home page inside the protected app.
- Define the root route as the workspace gate that handles missing workspace permission, load failure, and no active/readable workspace states.
- Require protected app destinations that depend on workspace context to avoid operating as normal workspaces when no workspace can be resolved.

## Capabilities

### New Capabilities
- `workspace-root-overview-gate`: Defines the root protected route as the canonical workspace overview and workspace-context gate.

### Modified Capabilities
- `sidebar-navigation-hierarchy`: The sidebar navigation contract changes to include and activate the root overview item.
- `workspace-header-switcher`: Workspace shell copy changes so breadcrumb/root identity uses professional Vietnamese overview language instead of generic home language.

## Impact

- Affected code: `config/site.ts`, `components/app-sidebar.tsx`, `components/app-breadcrumbs.tsx`, root workspace overview page under `app/[lang]/(main)/`, i18n dictionaries, and workspace context helpers if a shared guard is introduced.
- Affected UX: authenticated users see `Tổng quan` as the first sidebar item and land on a clear workspace-scoped overview when opening `/`.
- Affected permissions: root overview remains reachable as the protected workspace gate, but its content states continue to respect workspace permissions and available workspace data.
- No backend API or dependency changes are expected.
