## Why

Destination linking currently requires users to copy a generated `/start <token>` command and manually send it in Telegram. This adds unnecessary friction and makes the existing destination-linking flow harder to complete; Telegram deep-links can take the user directly to the selected bot with the correct token.

## What Changes

- Keep the existing `POST /telegram/destinations/link-token` flow for generating short-lived tokens.
- Use the selected bot's `botUsername` from the existing `GET /telegram/bot-connections` data.
- Add localized deep-link actions for:
  - Private chats: `https://t.me/<botUsername>?start=<token>`
  - Groups: `https://t.me/<botUsername>?startgroup=<token>`
- Open the selected deep-link in Telegram and refresh the destinations workspace.
- Keep the existing manual refresh action because destination creation completes asynchronously after Telegram sends `/start`.
- Preserve the copy-command path and link-token expiry display as fallback behavior.
- Guard the deep-link actions when the token or bot username is unavailable.
- Exclude backend handling for an empty `/start` command; that is a separate hardening change.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `telegram-configuration-ui`: extend destination linking from copy-only `/start` commands to localized Private and Group Telegram deep-link actions while preserving explicit destination refresh.

## Impact

- UI: `app/[lang]/(main)/telegram/telegram-configuration.tsx`.
- Localization: the English and Vietnamese Telegram destination dictionaries.
- Existing server action and DTO contracts remain in use; no new API route, webhook handling, dependency, or backend change is required.
- The Telegram configuration specification will gain scenarios for deep-link construction, opening, and refresh behavior.
