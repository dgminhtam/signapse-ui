## Context

The Telegram configuration page already loads bot connections and destinations in the server component. `DestinationLinkSheet` already calls the authenticated `POST /telegram/destinations/link-token` action, displays the returned `/start <token>` command, and exposes an explicit `router.refresh()` action.

The missing piece is a browser-facing deep-link action. The existing `TelegramBotConnectionResponse` supplies `botUsername`, while `TelegramLinkTokenResponse` supplies the short-lived `token` and its originating `botConnectionId`. The implementation must keep those two values paired and must not expose or modify the Telegram webhook flow.

## Goals / Non-Goals

**Goals:**

- Add Private and Group deep-link actions inside the existing destination-linking sheet.
- Build the links from the token response and the matching bot connection already loaded by `GET /telegram/bot-connections`.
- Open links in a new browser target and refresh the Telegram configuration workspace after activation.
- Preserve the existing copy-command fallback, expiry display, and manual refresh action.
- Keep all new visible copy localized in English and Vietnamese.

**Non-Goals:**

- No new API route, server action, backend contract, webhook handling, or dependency.
- No optimistic destination creation or polling while Telegram processes `/start`.
- No backend hardening for an empty `/start` command.

## Decisions

### Use the existing server-loaded bot connection data

Resolve the bot connection using `linkToken.botConnectionId` and read its `botUsername` from the `activeBotConnections` prop. This avoids a second client GET and prevents a token from being paired with the currently selected bot if the selection changes after token generation.

Alternative rejected: fetch bot connections again from the client. The page already performs the required GET and passes the typed response to the sheet.

### Build links with native URL handling

Construct `https://t.me/<botUsername>` with the native `URL` API and set either `start` or `startgroup` through `searchParams`. Strip an optional leading `@` from the username before assigning the path and let the platform encode the token.

Alternative rejected: concatenate query strings manually. Manual interpolation is shorter but can produce an invalid link if a token contains characters requiring URL encoding.

### Use labeled native external links styled as existing buttons

Render each available deep-link as a labeled `<a>` with `target="_blank"` and `rel="noopener noreferrer"`, composed through the existing `Button` wrapper. Attach the existing refresh behavior to activation so the browser handles external navigation and keyboard semantics natively.

Alternative rejected: `window.open()` from a button handler. It would require extra popup-blocking and failure handling while providing no benefit over a native external link.

### Keep refresh explicit after Telegram completion

Refresh immediately after opening the deep-link as requested, and retain the existing manual refresh button. The immediate refresh cannot see a destination until Telegram has sent `/start`; adding polling would add complexity and an unrequested lifecycle.

### Keep token state scoped to the selected bot

When the bot selector changes, clear the displayed token before generating a new one. Deep-link construction also uses the token response's `botConnectionId` as its source of truth. This prevents stale command/link data from being displayed under another bot.

## Risks / Trade-offs

- [Telegram processing is asynchronous] → The first refresh may happen before the destination exists; retain the manual refresh action and do not render an optimistic row.
- [A bot username or token may be absent in a malformed/partial response] → Do not render actionable deep-link URLs until both values are present; keep the copy/expiry UI guarded as it is today.
- [External navigation can be blocked or unavailable on a device] → Use standard HTTPS Telegram links with visible labels and preserve the copy-command fallback.
- [Changing the bot selection discards a generated token from the prior bot] → This avoids an invalid pairing; the user can generate another short-lived token for the new bot.

## Migration Plan

No data or API migration is required. Deploy the client UI and localized copy together; rollback is a normal client rollback that restores the existing copy-command-only flow.

## Open Questions

None for the requested happy path. Empty `/start` handling remains a separate backend hardening change.
