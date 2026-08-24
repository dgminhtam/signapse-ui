## 1. Design And Domain Documentation

- [x] 1.1 Document the Account profile `plain` focused-form surface in `docs/design/DESIGN.md`, including default-card compatibility, cardless chrome, large-width alignment, transparent divided footer, responsive identity/grid behavior, and skeleton/error parity.
- [x] 1.2 Replace the active `user-account-profile` Purpose placeholder with the Account profile capability summary after the accepted delta requirements are synced.
- [x] 1.3 Update `.migration/tabs.md` so it no longer requires Personal/Billing tab verification, and confirm the Account profile and Account role glossary entries remain implementation-free and canonical.

## 2. Shared Surface And Account Route

- [x] 2.1 Add an explicit `plain` surface to the shared focused form shell and skeleton while preserving the existing card surface as the default for every current consumer.
- [x] 2.2 Simplify the account route to render one profile form directly, remove tab/query-state composition and the upgrade target, and delete the billing placeholder component.
- [x] 2.3 Add a cardless account loading skeleton that mirrors the final identity row, responsive field grid, large-width alignment, and footer footprint.
- [x] 2.4 Align the account error boundary with the cardless profile width and localized Retry pattern, and prevent raw exception messages from reaching user-facing copy.

## 3. Account Profile Form Behavior

- [x] 3.1 Replace avatar mutation controls with a static, accessible identity row containing the current avatar or fallback, visible profile title, and localized description.
- [x] 3.2 Arrange editable fields in the approved responsive two-column grid with full-row email and Account role, one-column constrained reflow, visible required labels, semantic input types, and autocomplete metadata.
- [x] 3.3 Render email with read-only semantics and localized helper text, render `role_name` as the read-only Account role with a localized missing-role fallback, and remove package/plan/upgrade presentation.
- [x] 3.4 Remove redundant input placeholders and associate each field error and helper description with its control through stable accessible identifiers while preserving visible focus and keyboard order.
- [x] 3.5 Derive Save and Restore availability from dirty, valid, and pending state; make Restore reset the initial baseline without navigation or mutation; and keep the footer footprint stable during submission.
- [x] 3.6 Keep the existing trimmed `PATCH /me` payload boundary, retain user input after failure, and establish successfully submitted values as the new clean baseline before refreshing route data.

## 4. Commercial Affordance And Localization Cleanup

- [x] 4.1 Remove the non-functional Upgrade and Billing entries, unused icons, and obsolete grouping chrome from the account avatar menu without changing Account, Notifications, or Sign Out behavior.
- [x] 4.2 Remove obsolete English and Vietnamese billing, upgrade, package, avatar-mutation, and redundant-placeholder keys; add or rename localized Account role, missing-role, Restore, loading, error, and accessibility copy required by the final UI.
- [x] 4.3 Run scoped static searches over production UI, active dictionaries, migration notes, and active specs to confirm no billing/payment/package/plan/subscription/checkout/upgrade affordance remains while excluding archives, tools, and skill examples.

## 5. Automated Verification

- [x] 5.1 Add a high-level Account profile component test using the real localization provider and mocked mutation/router boundaries to cover initial rendering, static avatar, read-only email and Account role, required validation, accessible associations, and absence of commercial affordances.
- [x] 5.2 Extend the Account profile component test to cover pristine and dirty actions, Restore without mutation, normalized payload, duplicate-submit protection, successful clean-baseline reset, and failed-submit input retention and recovery feedback.
- [x] 5.3 Run the focused Account profile component tests and any directly affected shared-shell or sidebar tests.
- [x] 5.4 Run targeted lint for changed account, shared component, dictionary, and test files, then run full `pnpm typecheck`.
- [x] 5.5 Run `openspec validate simplify-account-profile --strict`, `openspec status --change "simplify-account-profile"`, scoped commercial-copy searches, and `git diff --check` for all touched files.

User-owned manual QA: authenticated light/dark and responsive visual review may be performed after implementation, but it is not an archive-blocking checkbox.
