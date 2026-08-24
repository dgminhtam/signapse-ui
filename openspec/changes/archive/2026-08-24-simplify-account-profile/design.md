## Context

The protected account route currently renders personal information and billing tabs. Billing is an empty roadmap placeholder, the profile form links its authorization role to an upgrade action, and the account avatar menu exposes non-functional Upgrade and Billing items. Signapse has no billing API, payment provider, subscription model, or checkout contract, so these surfaces overstate the product.

The profile form also uses the card-style focused form shell, although the account route is intended to read as a cardless workspace. Avatar upload and delete controls only mutate a local preview, Cancel navigates through browser history instead of resetting the form, and loading/error states do not mirror the final profile layout. The existing `/me` read and update contracts remain the authoritative data boundary.

This change crosses the account route, shared form shell, account avatar menu, localization, design documentation, active OpenSpec requirements, and component tests. It does not require a backend or dependency change.

## Goals / Non-Goals

**Goals:**

- Present one direct, cardless Account profile editing surface with no billing tab or upgrade path.
- Keep the shared card form shell unchanged by default while adding a documented plain surface for the profile route.
- Display the current avatar and Account role without implying unsupported mutation or commercial capabilities.
- Make validation, read-only state, dirty-state actions, loading, errors, and responsive behavior accessible and deterministic.
- Keep the existing `/me` request and response contracts unchanged.
- Cover the form's external behavior through one high-level component test seam and verify cross-module cleanup deterministically.

**Non-Goals:**

- Payment, billing, checkout, pricing, plan, or subscription architecture.
- Avatar upload, crop, deletion, or any media mutation.
- Editing the sign-in email or Account role.
- Making date of birth or phone optional.
- Implementing or removing Notifications.
- Redesigning other create/update forms or changing default shadcn wrapper chrome.
- Adding route-leave confirmation, backend APIs, permissions, dependencies, or an ADR.
- Rewriting archived OpenSpec artifacts.

## Decisions

### 1. Render the account route as one profile form

The account route will render the profile form directly and will no longer read tab state. Personal and Billing tabs, the billing placeholder, and the upgrade target are removed. A legacy `?tab=billing` query has no special behavior and resolves to the normal profile page.

This is preferred over keeping a single tab because a one-item tab list adds navigation chrome without another user task. A redirect or removal notice is also unnecessary because the route itself remains valid and no billing destination exists.

### 2. Add an explicit plain surface to the focused form shell

The shared focused form shell and its skeleton will accept an explicit plain surface while retaining the current card surface as the default. The profile selects the plain surface; existing CRUD consumers remain unchanged.

The plain surface removes the outer border, radius, background, and shadow. It keeps the established large form width, centers within the content pane, inherits app-shell gutters, and uses a transparent footer separated from the body by a top divider. `docs/design/DESIGN.md` will record this profile-specific contract so the feature does not rely on undocumented local chrome overrides.

This is preferred over bypassing the shared shell because the shell still owns semantic heading, width, body, footer, and skeleton parity. Making all forms cardless would broaden the change and remove useful boundaries from CRUD forms.

### 3. Use a cardless identity row and responsive field grid

The current avatar becomes a static identity element aligned with the visible profile title and description. It is not a button and has no upload or delete affordance. Missing image data continues to use the existing localized/name-derived fallback.

Editable fields use two columns at an appropriate desktop/container width and one column on mobile, narrow containers, and zoomed layouts. Last name pairs with first name; date of birth pairs with phone; email and Account role span the available width. The layout uses existing field primitives and gap-based composition without nested cards.

This is preferred over a single long column because the form has natural field pairs and enough width at the approved large form scale. It is preferred over fixed breakpoint-only geometry because container-aware reflow better preserves the layout inside the app shell and at 200% zoom.

### 4. Preserve profile and API boundaries

First name, last name, date of birth, and phone remain required editable values. The update mutation continues to send only `firstName`, `lastName`, `birthday`, and `phone` after trimming. Email remains excluded from the payload and is rendered with read-only semantics so it can be focused, selected, and copied. Account role remains a read-only authorization classification sourced from `role_name` and uses a localized missing-role fallback.

The profile must not call Role a package, plan, or subscription tier. It must not add an upgrade action. This keeps the UI aligned with the existing user and role contracts rather than introducing a commercial model through copy.

### 5. Derive actions from form state

The form validates after meaningful field interaction and exposes validity, dirty state, and pending state through stable controls. Save is enabled only when the form is dirty, valid, and not pending. Restore is enabled only when the form is dirty and not pending.

Restore resets all editable values to the initially loaded baseline and does not navigate or call the API. A successful update makes the submitted values the new clean baseline before refreshing route data. A failed update retains entered values and re-enables recovery actions.

This replaces browser-history Cancel because history does not represent form state and can unexpectedly leave the account route. No unload confirmation is added because the form is short and Restore provides an explicit local recovery path.

### 6. Make field state programmatically available

Every editable input retains a visible localized label, native required state, semantic input type, and suitable autocomplete value. Redundant placeholders that only repeat labels are removed. Field errors remain adjacent to their controls, use an alert/live announcement pattern, and are associated through stable `aria-describedby` identifiers. Submit failure must not clear valid input.

Email uses `readOnly` plus localized explanatory text instead of `disabled` or a required indicator. The static avatar has meaningful alternative text when user identity is available. Keyboard order follows visual order, focus remains visible, and the grid must remain usable at mobile widths and 200% zoom.

### 7. Mirror the profile in loading and error states

The account route gains a cardless loading skeleton using the same plain surface, width, identity row, field grid, and footer footprint as the resolved form. The local error boundary uses the same content alignment and a localized Empty state with Retry. It never renders raw exception messages to users.

This is preferred over a generic centered panel because loading and error states should not change the route's content-width mode or reintroduce a card around the account workspace.

### 8. Remove unsupported commercial copy across active surfaces

Upgrade and Billing items are removed from the account avatar menu along with their unused icons, separators, and localized keys. Account profile billing-tab, billing-empty, package, and upgrade keys are removed or replaced with Account role terminology in both supported dictionaries. Notifications remains untouched.

The active `user-account-profile` specification and migration note are updated. Archived change artifacts remain historical evidence. The domain glossary entries for Account profile and Account role remain the canonical vocabulary; no Billing domain term is added until such a capability exists.

### 9. Test at the highest practical seam

The primary automated seam renders the complete Account profile form through the real localization provider while mocking only the profile mutation and router refresh boundary. It verifies behavior visible to users: initial content, static avatar, read-only fields, validation, dirty-state actions, Restore, normalized payload, pending protection, success baseline, failure retention, and absence of commercial affordances.

Cross-module removal in route composition, avatar menu, dictionaries, and active specs is verified with deterministic static search, OpenSpec validation, lint, and typecheck. This is preferred over extracting small helpers solely for tests or introducing an authenticated browser fixture that the profile feature does not otherwise need.

## Risks / Trade-offs

- [Risk] A plain option on a shared shell could be reused without a clear product reason. → Mitigation: document it as the Account profile contract and keep the card surface as the default.
- [Risk] Changing email from disabled to read-only makes it focusable and could be mistaken for editable. → Mitigation: preserve default read-only browser behavior and show localized helper text explaining the restriction.
- [Risk] Save availability based on validity may initially remain disabled for incomplete legacy profiles. → Mitigation: keep all four editable fields visibly required and expose field-level recovery guidance after interaction.
- [Risk] Removing billing links may leave external bookmarks with a stale query. → Mitigation: ignore the query and render the valid profile route without redirect or error.
- [Risk] Static search can over-match historical or tooling content. → Mitigation: scope cleanup assertions to production UI, active dictionaries, migration notes, and active specifications while explicitly excluding archives and skill examples.
- [Trade-off] No browser visual test is an archive-blocking check. → Component behavior, static verification, skeleton parity review, lint, typecheck, and OpenSpec validation remain agent-owned; visual/authenticated QA can be recorded as non-blocking user-owned QA.

## Migration Plan

1. Extend and document the plain focused-form surface without changing existing consumers.
2. Simplify the account route, profile form, loading/error states, avatar menu, and dictionaries.
3. Remove the billing placeholder and obsolete commercial keys/imports.
4. Add component behavior coverage and deterministic cleanup checks.
5. Validate OpenSpec, lint, typecheck, component tests, and static searches.

Rollback is local: restore the previous account route composition and profile form while leaving the backward-compatible default card surface unchanged. There is no backend or data migration.

## Open Questions

None. The profile field requirements, cardless geometry, Account role terminology, avatar scope, action semantics, legacy query behavior, and test seam were confirmed before proposal creation.
