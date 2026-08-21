## Context

The shared `LocalEntityQuickDetailDrawer` is used by Dashboard, Graph View, and Market Charts for the same Event inspection and Article reader profiles. Its header currently combines an internal profile label with the entity title and renders a generic description. The profile label is not needed once the entity title is visible, and the ready-state description repeats or misstates the source context (“from the knowledge graph”) for Dashboard and Market Charts.

The drawer already provides state-specific body content and accessibility semantics: loading uses `role="status"` with `aria-busy`, errors use an assertive alert, and missing/access-denied states expose announced feedback. The change must preserve those behaviors while reducing header noise.

## Goals / Non-Goals

**Goals:**

- Make the visible and accessible drawer title the actual entity or state title without a profile prefix.
- Remove the redundant `DrawerDescription` from the shared quick-detail header.
- Keep loading, error, missing, and access-denied feedback announced through the existing body states.
- Remove localization entries used only by the deleted header copy and keep the Event/Article body content unchanged.
- Update the quick-detail contract, design guidance, and focused tests.

**Non-Goals:**

- Do not change drawer placement, owner adapters, portal behavior, focus return, fetch/session lifecycle, or canonical routes.
- Do not remove descriptions from other Dialog, Sheet, AlertDialog, command, or sidebar surfaces.
- Do not remove state descriptions still rendered inside the quick-detail body.
- Do not change API contracts, permissions, or shared Drawer wrapper chrome.

## Decisions

### 1. Use the existing detail title as the DrawerTitle

The drawer will render `detailTitle` directly. Ready Event and Article sessions therefore announce the actual entity title; loading, error, missing, and access-denied sessions continue to announce their state title. The `getProfileLabel` helper and `eventProfile`/`articleProfile` dictionary entries become unnecessary.

**Alternative considered:** Keep a visually hidden profile prefix for screen readers. Rejected because it preserves the same redundant label and keeps the profile/source distinction in the accessible name even though the user does not need it.

### 2. Remove the generic header description, not the body feedback

The shared header will no longer render `DrawerDescription`. Ready content already starts with the Event description or Article metadata/prose, while non-ready states retain their existing body `role`, `aria-live`, `aria-busy`, title, description, and recovery controls. Header-only strings (`quickDescription`, `quickAccessDeniedDescription`, and `loadingDescription`) will be removed from both dictionaries. `notFoundDescription` and `errorDescription` remain because the body still renders them.

**Alternative considered:** Keep the current description with `sr-only`. Rejected because it would still announce inaccurate “knowledge graph” context from Dashboard/Market Charts and would not solve the redundant-copy problem for assistive technology users.

### 3. Treat this as a contract change at the shared boundary

The component test will assert the actual title and absence of the header description. The browser assertion will stop depending on the internal profile label and will verify the event title. Other overlay descriptions remain unchanged because they explain a form, selection, confirmation, or hidden landmark.

## Risks / Trade-offs

- [Risk] Removing `DrawerDescription` could reduce contextual information for screen readers. → Keep the entity/state `DrawerTitle`, announce loading/error/missing/denied body states with their existing live-region semantics, and retain the actual Event/Article content descriptions.
- [Risk] Dictionary cleanup could remove strings still used by another surface. → Search all references before deleting; retain any state string used outside the header.
- [Risk] Tests may encode the old profile title or header copy. → Update focused component/browser assertions and run typecheck/lint/tests.

## Migration Plan

1. Update the shared drawer and both locale dictionaries.
2. Update the delta/main quick-detail specs and design guidance.
3. Update focused component and browser assertions.
4. Run OpenSpec validation, focused tests, lint, and typecheck.

Rollback is a revert of the shared drawer, dictionary, documentation, and test edits; no data or route migration is required.

## Open Questions

None.
