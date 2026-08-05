## 1. Deep-link UI behavior

- [x] 1.1 Update `DestinationLinkSheet` to clear an existing link token when the selected bot changes and resolve the generated token's matching bot connection by `botConnectionId`.
- [x] 1.2 Build encoded Private (`start`) and Group (`startgroup`) Telegram HTTPS links with the native `URL` API, guarding missing token or bot username values.
- [x] 1.3 Add labeled external-link actions using the existing button wrapper, opening in a new target and invoking the existing Telegram workspace refresh behavior while preserving the copy-command and manual-refresh fallback.

## 2. Localized copy

- [x] 2.1 Add the Private/Group deep-link labels and any required guarded-state copy to both English and Vietnamese Telegram destination dictionaries with matching typed shape.

## 3. Verification

- [x] 3.1 Run `pnpm typecheck` and confirm the Telegram configuration and dictionary changes compile without new type errors.
- [x] 3.2 Run `pnpm lint` and confirm the changed files pass repository lint rules.
