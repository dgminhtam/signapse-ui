## 1. Navigation Identity

- [x] 1.1 Add localized `Tổng quan` / `Overview` dictionary entries for protected root navigation identity.
- [x] 1.2 Add the root overview item as the first top-level sidebar navigation item through the existing site config.
- [x] 1.3 Ensure the sidebar root item links through locale-aware routing and is active only on the locale-normalized root path.
- [x] 1.4 Update protected app breadcrumb/root identity to use the overview label instead of generic home copy.

## 2. Workspace Gate Behavior

- [x] 2.1 Review the existing root workspace overview states for missing workspace permission, workspace load failure, and no readable workspace.
- [x] 2.2 Adjust root overview copy or actions only where needed so the no-workspace state clearly functions as the workspace gate.
- [x] 2.3 Review workspace-dependent protected screens touched by this change and prevent normal operation when no readable workspace can be resolved.
- [x] 2.4 Keep existing workspace API calls, permission names, and workspace resolution semantics unchanged unless a defect is found during implementation.

## 3. Verification

- [x] 3.1 Run `openspec validate make-root-workspace-overview-gate --strict`.
- [x] 3.2 Run the repo lint check.
- [x] 3.3 Run the repo typecheck.
- [x] 3.4 Perform a deterministic code review for hardcoded root labels, route matching regressions, and workspace-gate gaps.

User-owned manual QA note: after implementation, a logged-in user can optionally open `/vi`, `/en`, and one feature route to confirm the sidebar active state and breadcrumb read naturally in the browser.
