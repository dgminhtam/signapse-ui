## Why

The news article detail screen is being refined into a focused review surface, but it still exposes backend identifiers that do not help operators decide whether an article and linked event are correct. Removing raw identifiers from the visible UI keeps attention on source, evidence, status, content, and review actions.

## What Changes

- Remove linked event `eventCanonicalKey` from the primary `Sự kiện liên kết` card.
- Remove article technical identifier cards for `Mã bài viết`, `External Key`, and `News Outlet ID` from `Thông tin kỹ thuật`.
- Keep operational metadata that can help review or debug recent changes: `URL gốc`, `Tạo lúc`, and `Cập nhật`.
- Keep the same backend DTO usage, routes, permissions, and action behavior.
- Do not add a replacement debug drawer or copy-to-clipboard identifier control.

## Capabilities

### New Capabilities

- `news-article-detail-technical-identifier-minimization`: Defines which technical identifiers are intentionally hidden from the news article detail UI and which operational metadata remains visible.

### Modified Capabilities

- None.

## Impact

- Affects `app/(main)/news-articles/[id]/page.tsx` only.
- Does not require backend API changes, dependency changes, permission changes, or documentation changes.
- Complements `resolve-news-article-detail-review-findings` by further reducing record-dump details from the same detail surface.
