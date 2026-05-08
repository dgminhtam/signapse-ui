## 1. Linked Event Card Cleanup

- [x] 1.1 Remove the `Khóa chuẩn` row from linked event cards in `app/(main)/news-articles/[id]/page.tsx`.
- [x] 1.2 Confirm linked event title, status badges, evidence role, confidence, evidence note, and `Xem sự kiện` action still render as before.
- [x] 1.3 Confirm the missing-title fallback still uses event id when available and does not introduce canonical key copy.

## 2. Technical Metadata Cleanup

- [x] 2.1 Remove the `Mã bài viết` technical metadata card from the news article detail page.
- [x] 2.2 Remove the `External Key` technical metadata card from the news article detail page.
- [x] 2.3 Remove the `News Outlet ID` technical metadata card from the news article detail page.
- [x] 2.4 Keep `URL gốc`, `Tạo lúc`, and `Cập nhật` in `Thông tin kỹ thuật`.

## 3. Verification

- [x] 3.1 Run targeted ESLint for `app/(main)/news-articles/[id]/page.tsx`.
- [x] 3.2 Run typecheck, or document unrelated blockers if the project typecheck cannot complete.
- [x] 3.3 Inspect the rendered detail page or review the rendered JSX to confirm `Khóa chuẩn`, `Mã bài viết`, `External Key`, and `News Outlet ID` no longer appear in the visible page.
