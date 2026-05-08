## Context

The current news article detail work has already shifted the page toward a review-first flow: summary, linked event validation, long-form content, then technical metadata. During review, the remaining raw identifiers were identified as unnecessary for normal operator decisions: linked event canonical key, article id, external key, and news outlet id.

These values still exist in backend data and may be useful in logs or API debugging, but showing them in the UI makes the page feel like a record dump. The detail surface should keep metadata that helps a human verify source/content recency, not implementation identifiers.

## Goals / Non-Goals

**Goals:**

- Remove `eventCanonicalKey` from the visible linked event card.
- Remove `Mã bài viết`, `External Key`, and `News Outlet ID` from the visible article technical metadata section.
- Keep `URL gốc`, `Tạo lúc`, and `Cập nhật` in `Thông tin kỹ thuật`.
- Preserve existing DTO fields in TypeScript definitions because other screens, actions, or future debugging may still need them.

**Non-Goals:**

- Do not remove fields from backend responses, frontend type definitions, or API mapping docs.
- Do not rename permissions, routes, or actions.
- Do not add an advanced debug mode, inspector, tooltip, or copy identifier control.
- Do not redesign the linked event card beyond removing identifier copy.

## Decisions

- Treat identifiers as hidden implementation details on this screen. The UI should not display `article.id`, `externalKey`, `newsOutletId`, or `eventCanonicalKey` unless a future operator workflow explicitly needs them.

- Keep source-relevant and recency metadata visible. `URL gốc`, `Tạo lúc`, and `Cập nhật` remain useful because they help operators validate provenance and understand whether reload/derive actions recently changed the record.

- Do not move removed identifiers into another visible section. Relocating them into a tooltip or secondary card would preserve the same noise in a smaller form; this change intentionally removes them from the page.

- Leave data fetching unchanged. The page can continue receiving the same `NewsArticleResponse` and `linkedEvents` payloads while simply not rendering selected fields.

## Risks / Trade-offs

- Debugging a specific backend record from the UI becomes slightly slower. Mitigation: developers and operators with deeper access can still use network responses, logs, backend admin tools, or URLs where relevant.
- Some support workflows may currently ask for article ids. Mitigation: this change is limited to the review surface; if a real support need appears, add an explicit support/debug workflow instead of keeping identifiers in the default screen.
- Removing `eventCanonicalKey` may reduce fallback identification when an event title is missing. Mitigation: keep the existing title fallback based on event id when present; do not show canonical key as routine copy.
