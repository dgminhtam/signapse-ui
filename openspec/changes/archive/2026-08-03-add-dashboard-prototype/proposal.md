## Why

The accepted dashboard direction in `docs/design/DASHBOARD.md` needs a safe, reviewable UI prototype before the production dashboard is refactored. Stakeholder review found that trading terminology, mixed event/article content, relationship metadata that may not exist yet, footer actions with module-wide scope, and uniformly neutral badges obscured each module's purpose and status hierarchy. A separate mock-data route lets the refined hierarchy, action scope, and semantic color treatment be validated without changing the existing API- and permission-backed dashboard.

## What Changes

- Add an authenticated locale-aware `/[lang]/dashboard-prototype` route that renders the proposed Trading Intelligence Home with local mock data only.
- Present Current Workspace, Trading Snapshot, Event Timeline, Latest News, Assets in Focus, and Market Narratives using the existing Financial Command Surface design system.
- Show every workspace asset as a detailed, neutral item with its full name, symbol, and asset type; keep news separate from events; and identify the theme and assets affected by each market narrative.
- Present the active workspace name as the Current Workspace heading, add concise scope copy beneath it, and introduce a localized tracked-asset subsection heading with a neutral count badge and description without reducing the detailed asset list.
- Show the workspace's localized mock update time as plain `AppTimeMetadata` between its description and tracked-asset subsection, and render the Next Key Event impact with the complete Economic Calendar badge contract.
- Present Latest News as raw recent news with concise summaries, source, and publication time without requiring asset or event relationships, and place module-wide navigation in module headers while keeping asset-specific Market Charts actions in asset rows.
- Enrich Event Timeline mock rows with occurred time, description, confidence, neutral themes, and affected-asset context without adding direction or backend integration.
- Use localized Manage Assets terminology for the workspace-wide asset-management action instead of exposing the implementation-oriented watchlist term.
- Give decision-bearing badges a restrained semantic hierarchy: reproduce the complete Economic Calendar impact badge presentation for Next Key Event and map narrative states to upstream Badge variants.
- Keep workspace assets, related assets, affected assets, and raw news visually neutral so color remains focused on status with decision value.
- Add URL-selectable `default`, `loading`, `empty`, and `partial-error` prototype scenarios.
- Add localized prototype copy and a friendly breadcrumb label while keeping the route out of the sidebar.
- Keep `/[lang]/dashboard`, its imports, its API calls, and its permission behavior unchanged.
- Add no backend integration, new dependency, global style, semantic token, chart, redirect, or feature flag.

## Capabilities

### New Capabilities

- `dashboard-ui-prototype`: Defines the isolated mock-data dashboard prototype, its information hierarchy, scenario states, navigation boundaries, responsive behavior, localization, and accessibility requirements.

### Modified Capabilities

None.

## Impact

- Adds route-local UI files under `app/[lang]/(main)/dashboard-prototype/`.
- Adds prototype-only localization keys to the Vietnamese and English dictionaries and one friendly breadcrumb segment mapping.
- Updates `docs/design/DASHBOARD.md` so the canonical dashboard information architecture matches the reviewed prototype direction.
- Reuses existing shadcn wrappers, semantic tokens, localized navigation, and the protected main layout.
- Reuses the existing `Item` and `Badge` wrappers for the responsive Current Workspace asset grid without creating item-level navigation or a shared feature abstraction.
- Reuses the existing localized number formatter for the additive tracked-asset count and keeps the workspace and asset descriptions prototype-local.
- Reuses the shared `AppTimeMetadata`, date-time formatter, and Economic Calendar impact helpers without adding timestamp copy or a prototype-specific impact label.
- Keeps event themes as neutral text and affected asset symbols as neutral outline badges using route-local mock records only.
- Reuses the existing Economic Calendar impact badge helpers for Next Key Event and upstream Badge variants for narrative status mapping, without extending the shared wrapper or adding a global token or CSS rule.
- Does not change APIs, backend contracts, permissions, dependencies, the sidebar, or the existing dashboard route.
