## Context

The current `/users` feature combines two different ownership boundaries in one dialog: Clerk account creation and Signapse application-user updates. Create accepts only email, first name, and last name, calls Clerk from a server action, and waits for the existing `user.created` webhook to provision the backend record. Update operates on the backend user and owns Signapse-specific fields such as phone, birthday, and role.

The confirmed operating model makes the create branch redundant:

- Public Clerk registration is the normal account creation path.
- Clerk Dashboard is the manual path for testing or exceptional administration.
- Both sources emit `user.created`, and the backend webhook provisions the Signapse user.
- There is no invite-only, approval, initial role assignment, or initial workspace assignment requirement.

The user management list and update flow remain operationally useful and stay in scope.

## Goals / Non-Goals

**Goals:**

- Remove every Signapse-owned entry point and code path that directly creates a Clerk user.
- Keep `/users` search, pagination, inspection, and backend update behavior unchanged.
- Simplify the existing form dialog to own update behavior only.
- Remove create-only types, messages, imports, and specification requirements without leaving dormant compatibility code.
- Preserve the current public registration and webhook provisioning architecture.

**Non-Goals:**

- Do not add a dedicated `/sign-up` route or change Clerk Dashboard settings.
- Do not add invitations, approvals, account activation, bulk provisioning, or test-account helpers.
- Do not assign role or workspace during registration.
- Do not change the backend `user.created` webhook, `GET /users`, or `PATCH /users/{id}` contracts.
- Do not change sidebar visibility, route permissions, or reconcile the existing `user:update` versus `user:search` permission behavior in this change.
- Do not remove the Clerk dependency or `CLERK_SECRET_KEY`, which remain part of application authentication.

## Decisions

### Remove the create flow instead of hiding or feature-flagging it

Delete the toolbar action, create dialog state, create submit branch, Clerk server action, create request type, and create-only copy. A feature flag or hidden branch would retain sensitive, unneeded code and configuration for a workflow with no confirmed operator.

Alternative considered: keep the action available only to a narrower permission. Rejected because there is no operational creation requirement to authorize.

### Keep user management and narrow the existing dialog to update-only behavior

The user list continues to load Signapse backend users and open the existing dialog for row updates. Remove the mode prop and all conditional create behavior so email is always read-only and phone, birthday, and role are always part of the update form.

Keep the existing route-local dialog file rather than introducing a replacement abstraction or new component hierarchy. The remaining component has one submit owner and one backend mutation.

Alternative considered: remove the whole `/users` feature. Rejected because search, inspection, role assignment, and profile updates still provide domain-specific operational value.

### Keep account origination outside the Signapse dashboard

Public users continue through the Clerk-managed registration behavior exposed by the existing authentication surface. Administrators create exceptional testing accounts in Clerk Dashboard. Signapse does not add redirects, explanatory UI, or links to Clerk Dashboard as part of this change.

Alternative considered: replace create with an invitation flow. Rejected because invite-only access and approval were explicitly confirmed as unnecessary.

### Preserve webhook provisioning and backend contracts

No backend or API mapping change is required. Account creation from public registration or Clerk Dashboard continues to converge through `user.created`; user management continues to consume only the backend list and update endpoints.

Alternative considered: add a backend user-create endpoint. Rejected because Clerk remains the identity source of truth and the webhook already owns synchronization.

### Remove create-specific empty-state guidance

The empty user table must no longer suggest creating a user from Signapse. It should provide search-recovery guidance only, while the toolbar contains search and page-size controls without a primary create action.

## Risks / Trade-offs

- [An operator unexpectedly relied on dashboard creation] → Use Clerk Dashboard for the exceptional account and require a new product proposal before restoring an in-app provisioning workflow.
- [Public Clerk registration is later restricted] → Treat that as a new access-model decision; do not retain dormant create code as an undocumented fallback.
- [Create-only code or copy remains after the UI is removed] → Use static searches for `createUser`, `CreateUserRequest`, create-mode branches, `Tạo người dùng`, and their English equivalents, then run typecheck and lint.
- [The webhook fails after registration or Dashboard creation] → Continue handling this through the existing backend webhook retry and reconciliation ownership; this change neither creates nor worsens that failure mode.
- [Permission drift remains on `/users`] → Keep it explicitly out of scope so removal stays surgical; address it through a separate change if required.

## Migration Plan

1. Update the `user-management` delta specification to remove dashboard Clerk-account creation and make the remaining dialog/update behavior explicit.
2. Remove the create toolbar action and create-mode state from the user list.
3. Narrow the user form dialog to the backend update flow only.
4. Remove the Clerk create server action, create-only DTO, imports, and localized copy; update the empty-state text.
5. Run OpenSpec validation, static searches, typecheck, and lint.

No data migration or deployment ordering is required. Rollback restores the removed frontend action, dialog branch, types, dictionary entries, and specification requirement; backend and Clerk data are unaffected.

## Open Questions

None. The account creation sources, webhook behavior, and absence of invite/approval/initial-assignment requirements are confirmed.
