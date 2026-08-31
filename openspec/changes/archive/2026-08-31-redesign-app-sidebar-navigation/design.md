## Context

The protected app shell currently receives one localized flat navigation array, filters it by the current permission collection, and renders direct entries or independent collapsible parents. Desktop icon mode hides every child list, so grouped destinations become unreachable while the parent button still toggles hidden disclosure state. The server layout also converts an absent sidebar cookie to `false`, overriding the shared provider's expanded default.

The redesign crosses localized configuration, server-owned default state, client-owned responsive interaction, account-menu composition, the shared mobile sheet's assistive metadata, and fixture-backed browser coverage. It must preserve locale-aware links, permission keys, destination URLs, the Nova selected-surface treatment, and the rule that app-specific behavior is composed outside default shadcn wrapper chrome.

The existing OpenSpec sidebar capabilities overlap: one requires a primary selected surface, one requires an accent-only active state, and one simultaneously contains both historical treatments plus a behavior-unchanged requirement. The change must leave one coherent normative contract.

## Goals / Non-Goals

**Goals:**

- Represent the agreed Analysis, Data, and Administration information architecture with stable localized ordering and distinct primary icons.
- Keep every permitted destination reachable in expanded desktop, collapsed desktop, and mobile navigation.
- Preserve a stable hierarchy after permission filtering, including single-child groups and empty-section removal.
- Make current-page, flyout, disclosure, keyboard, focus, touch-target, and mobile-dismiss behavior accessible and testable.
- Move the personal API access token to the authenticated account menu.
- Prove the external behavior through one fixture-backed P0 browser seam.
- Reconcile obsolete sidebar specification requirements with the accepted neutral selected-surface design.

**Non-Goals:**

- Change route URLs, backend permissions, backend contracts, global sidebar width, destination pages, or header layout.
- Add child icons, badges, favorites, custom ordering, persisted group disclosure, hover-only navigation, or a new runtime dependency.
- Modify shared sidebar tokens or introduce feature-specific chrome into the default sidebar wrapper.
- Claim that fixture permission personas prove real backend authorization.

## Decisions

### 1. Use a section-aware navigation tree with stable identifiers

The localized navigation configuration will expose ordered sections containing direct entries or grouped entries with ordered children. Sections and entries will use stable identifiers that do not depend on localized titles or array indexes. The same filtered tree will drive expanded, collapsed, mobile, active-state, and account-placement behavior.

This is preferred over hardcoding three render loops because one tree prevents label, permission, order, route, and active-state drift. Deriving navigation from the route filesystem was rejected because route availability does not encode product hierarchy, labels, icons, or permission policy.

### 2. Filter the tree without flattening its hierarchy

Permission filtering will operate bottom-up: filter children, omit an empty parent, retain a parent with one child, then omit an empty section. Remaining siblings keep their declared order.

Auto-promoting a single child was rejected because the same destination would move between hierarchy levels for different permission personas. Leaving empty labels or disabled destinations was rejected because the current product contract hides unavailable navigation rather than advertising inaccessible routes.

### 3. Render grouped navigation differently by sidebar mode

Expanded desktop and mobile will use independent collapsible groups. A group containing the active route opens initially, users may open multiple groups, and temporary disclosure state is not persisted.

Collapsed desktop will render a click-triggered flyout for grouped entries using the existing dropdown-menu composition at the application sidebar level. Direct entries retain tooltip behavior. The flyout will close after selection, Escape, or outside interaction, restore trigger focus when navigation does not replace the page, and leave app-shell width unchanged.

Automatically expanding the sidebar was rejected because it overrides the user's density preference and shifts the workspace. Patching the shared sidebar primitive to invent feature-specific group behavior was rejected by the component ownership rules.

### 4. Treat a missing sidebar cookie as expanded

The server layout will distinguish an absent cookie from explicit `true` and `false` values. Absence resolves to expanded; explicit values restore the user's preference. The shared provider's cookie persistence behavior remains the only persistence mechanism.

Always collapsed was rejected because it removes labels on first use. Ignoring the cookie was rejected because it would discard an established user preference.

### 5. Keep selected-surface visuals and add semantic current-page state

Only the current direct or child destination will use the neutral `sidebar-primary` selected surface and normal text weight. Hover remains `sidebar-accent`; focus remains `sidebar-ring`; opening a parent rotates its chevron without adding background or weight. Current links will also expose `aria-current="page"`.

The obsolete accent-only active contract is removed rather than emulated. Introducing another active token or changing global theme tokens was rejected.

### 6. Complete mobile navigation at the application composition boundary

Mobile navigation will keep the existing shared sheet geometry and independent content scrolling. Application composition will provide a visible localized close action and mobile row density of approximately 44 CSS pixels. The sheet's accessible title and description will come from dictionaries.

If the wrapper cannot receive localized assistive metadata, it may gain generic accessibility-only inputs with backward-compatible defaults. Feature-specific labels, close chrome, density, and navigation behavior remain outside the wrapper. Removing the sheet or adding a second mobile navigation system was rejected.

### 7. Place API access token under the authenticated account

The API access token destination will be removed from Administration and added to the authenticated account menu with `KeyRound`. It remains a locale-aware link to the existing route and retains its existing availability contract.

Keeping it under system configuration was rejected because the token represents the signed-in user's identity and permissions rather than shared administration. Renaming it to API key was rejected by the domain glossary.

### 8. Use one fixture-backed P0 browser seam

The existing per-test-run `/me` permission state will be exposed through a generally named fixture control instead of a feedback-specific test API. P0 browser journeys will drive the real app shell for full, restricted, single-child, and empty-section personas and will cover desktop, collapsed flyout, mobile, localization, keyboard/focus, target geometry, current-page semantics, and axe states.

A parallel component reconstruction of sidebar behavior was rejected because it would mock responsive and overlay behavior below the highest available seam. Exact SVG paths will not be asserted; typed configuration and diff review protect icon identity while browser tests prove that primary destinations render icons.

### 9. Reconcile overlapping sidebar specifications during this change

The selected-surface capability remains authoritative. The historical accent-only state requirements are removed, contradictory accent-active requirements in the hierarchy capability are removed, and the historical behavior-unchanged requirement is replaced by the explicit responsive navigation contract. The overview destination remains on its existing `/dashboard` URL; no route migration is introduced.

## Risks / Trade-offs

- [Risk] More visible section labels and grouped entries can increase vertical height. → Mitigation: keep child entries text-only, allow independent content scrolling, and retain dashboard density on desktop while using touch-friendly mobile rows.
- [Risk] A collapsed flyout and expanded collapsible could drift because they are different primitives. → Mitigation: derive both from the same filtered tree and cover both modes in the same browser journey.
- [Risk] Generalizing fixture permissions could affect feedback P0 tests. → Mitigation: preserve the existing control as a compatibility alias during the test update or migrate all callers atomically, keeping per-test-run isolation unchanged.
- [Risk] Localized labels can exceed collapsed or mobile widths. → Mitigation: keep existing truncation/tooltip behavior and verify Vietnamese and English at target widths.
- [Risk] A generic wrapper accessibility input can drift from the selected Nova wrapper. → Mitigation: limit the extension to assistive metadata, retain defaults, and avoid visual or feature-specific wrapper changes.
- [Trade-off] Retaining a parent with one permitted child costs one disclosure action. → Benefit: hierarchy and destination placement remain stable across permission personas.
- [Trade-off] Group state is not persisted. → Benefit: reload returns to a predictable active-context state and avoids another persistence contract.

## Migration Plan

1. Add the localized section-aware configuration and bottom-up permission filtering while preserving all existing route URLs and permission constants.
2. Update sidebar rendering, selected semantics, collapsed flyouts, mobile composition, account-menu placement, and absent-cookie default as one app-shell change.
3. Generalize the fixture permission control and add the P0 app-shell navigation journey.
4. Remove obsolete navigation labels and verify no runtime caller retains the old hierarchy or Developer Token label.
5. Roll back by reverting the app-shell/configuration commit; no backend or persisted-data migration is required. Existing sidebar cookies remain valid in either direction.

## Open Questions

None. The information architecture, labels, icons, ordering, permission behavior, disclosure behavior, mobile scope, account placement, and testing seam were confirmed before proposal creation.
