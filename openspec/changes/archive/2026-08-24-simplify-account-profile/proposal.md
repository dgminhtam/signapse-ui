## Why

The account profile currently exposes billing and upgrade affordances even though Signapse has no payment, subscription, or checkout capability. The same screen also presents an authorization role as a commercial package and wraps the profile form in card chrome that conflicts with the desired cardless account workspace.

## What Changes

- Replace the personal/billing tab container with one direct account profile editing surface.
- Remove billing, payment, package, and upgrade affordances from the account page and account avatar menu.
- Present `role_name` as the read-only Account role rather than a package or plan.
- Remove non-persistent avatar upload and delete controls while retaining the current avatar as identity context.
- Add a documented plain surface to the shared focused form shell for the account profile, including matching loading and error states.
- Rework the profile form into a responsive, accessible field grid with read-only email, dirty-state actions, reset behavior, and localized recovery feedback.
- Preserve the existing `/me` read and update contracts and the four required editable profile fields.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `user-account-profile`: Remove billing and upgrade requirements, define the single cardless profile form, clarify Account role and display-only avatar semantics, and strengthen form state, accessibility, loading, and error behavior.

## Impact

- Account route composition, profile form behavior, route loading/error states, and the shared form-shell surface contract.
- Account avatar-menu contents and localized English/Vietnamese profile copy.
- Signapse design documentation, Account profile domain vocabulary, component tests, and active OpenSpec requirements.
- No backend API, schema, payment provider, dependency, permission, or route contract changes.
