## Context

The protected Signapse app is locale-routed under `app/[lang]/(main)`. The root protected route already renders a workspace overview and handles workspace permission, loading, and no-active-workspace states. However, the sidebar navigation starts with feature workspaces such as Graph View and Market Charts, while the root route is reachable mainly through the brand link and breadcrumb `Trang chủ` / `Home`.

Product-wise, protected screens depend on workspace context. The root route should therefore act as the visible workspace overview and the safe place users return to when workspace context is missing or needs attention.

## Goals / Non-Goals

**Goals:**

- Make `/` the canonical protected app overview destination while preserving the existing route.
- Add `Tổng quan` / `Overview` as the first sidebar item and ensure it is active only for the root protected path.
- Align breadcrumb/root copy with workspace overview identity instead of generic home-page language.
- Keep the existing workspace overview states for missing permission, load error, and no readable workspace.
- Establish a workspace-context gate rule so protected feature screens do not appear to operate normally without a resolvable workspace.

**Non-Goals:**

- Do not create a new `/overview` route or migrate existing URLs.
- Do not redesign the workspace overview content beyond identity/navigation changes.
- Do not change backend workspace APIs, permission names, or workspace selection semantics.
- Do not add manual browser QA as an archive-gating requirement.

## Decisions

1. Keep `/` as the canonical overview route.

   This avoids locale redirect churn and preserves current links. A new `/overview` route would make navigation labels more explicit in the URL, but it would also require redirect behavior and duplicated route identity without adding product value.

2. Add root overview as a top-level sidebar item.

   The item should live in the existing site config so permission filtering, localized labels, icons, route matching, and collapsed sidebar tooltips continue to use the current navigation pipeline. The route matcher already treats `/` specially, so the active state can remain deterministic.

3. Root overview remains reachable as the workspace gate.

   Users may arrive at `/` with no workspace permission, no workspace, or load failure. The page should keep rendering explicit states for these cases instead of redirecting away from itself. Other workspace-dependent screens should either block with an access/empty state or route users back to the overview gate when no workspace can be resolved.

4. Use i18n dictionary copy for all touched labels.

   `Tổng quan` / `Overview` belongs in navigation/root identity dictionary entries. The breadcrumb should not hardcode route copy or keep using generic `home` text inside the protected workspace app.

## Risks / Trade-offs

- Root item visibility could expose an item to users without `workspace:read` -> Keep `/` as a protected gate and render the existing no-permission state rather than hiding the only safe landing destination.
- Workspace gate behavior could become duplicated across pages -> Prefer a small shared helper or consistent local pattern only if implementation review shows multiple pages need the same check.
- Breadcrumb copy could affect auth/public contexts -> Scope root overview label to the protected app breadcrumb/navigation path and avoid changing Clerk auth route labels unnecessarily.
- Treating `/` as overview without changing URL may be less explicit for copied links -> The sidebar, breadcrumb, and page state provide the user-facing identity while preserving stable routing.
