## 1. Event Link Resolution

- [x] 1.1 Add a local helper to resolve `/events/{eventId}` from a valid annotation `eventId`.
- [x] 1.2 Add a safe fallback parser for `annotation.links.eventDetail` that only accepts internal event detail paths.
- [x] 1.3 Ensure annotations without a safe event route keep static title text.

## 2. Popup Title Navigation

- [x] 2.1 Render linked annotation titles with `next/link` when a safe event href exists.
- [x] 2.2 Preserve current title typography, line clamp, summary rendering, badges, and popup density.
- [x] 2.3 Close the local chart annotation popup when the event title link is clicked.
- [x] 2.4 Ensure linked titles use client-side internal navigation so the existing `@quickDetail` event drawer can open.
- [x] 2.5 Do not add news article, source document, evidence, or external source links to the chart popup.

## 3. Behavior Preservation

- [x] 3.1 Confirm red chart marker click still opens the annotation popup.
- [x] 3.2 Confirm marker rendering, annotation grouping, popup positioning, and lazy history loading are unchanged.
- [x] 3.3 Confirm event quick-detail drawer route/content is reused without modifying drawer implementation.

## 4. Verification

- [x] 4.1 Run targeted lint for market chart files.
- [x] 4.2 Run `pnpm typecheck`.
- [x] 4.3 Run `pnpm build`.
- [x] 4.4 Run `openspec validate --changes link-market-chart-annotations-to-event-drawer`.
- [x] 4.5 Smoke check clicking an annotation event title opens the event drawer when an authenticated chart session with annotation data is available; if unavailable, document the blocker.
  - Blocker: no authenticated Clerk chart session with annotation data is available from the terminal context, so browser smoke should be completed in an authenticated session.
