## Why

The live backend contract removed Telegram bot-connection updates, destination updates, and destination test messages, while the frontend still exposes those operations and still submits a backend-owned display label when connecting a bot. The Bot Telegram and Điểm nhận surfaces also rely on wide tables and Sheets that break at narrow widths and do not match the repository's configuration, form, and accessibility conventions.

## What Changes

- **BREAKING** Remove frontend actions, validation, types, copy, and controls for the three Telegram endpoints removed by the backend.
- Connect a Bot Telegram with `botToken` only and treat backend-returned display labels as read-only identity data.
- Replace the Bot Telegram and Điểm nhận tables with responsive Card and Item-based operational lists, including matching empty, loading, permission, invalid, disabled, and removed-record behavior.
- Replace their create/link Sheets with focused Dialog flows and preserve destructive mutations in AlertDialogs.
- Present disable as the non-reversible-in-UI action `Vô hiệu hóa`, provide lightweight replacement guidance, and retain backend authority over dependency conflicts.
- Make destination linking explicit and truthful: support private/group handoff, token expiry/regeneration, and user-triggered refresh without claiming that Telegram linking succeeded prematurely.
- Split the two configuration boundaries into feature-local modules while leaving feature routing and schedule management unchanged.
- Refresh active Telegram specification and API-mapping documentation to match the implemented contract.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `telegram-configuration-ui`: Align Bot Telegram and Điểm nhận management, lifecycle, permissions, responsive presentation, and linking behavior with the current backend contract.

## Impact

- Affects the Telegram settings route, Telegram server actions, Telegram DTO validation/types, localized dictionaries, route loading skeleton, active Telegram OpenSpec, domain glossary, and API-mapping status.
- Deletes the standalone destination test-message control and all active references to the removed endpoints.
- Adds no runtime dependency, backend change, channel-linking workflow, polling, migration wizard, test framework, or change to feature-routing/schedule behavior.
