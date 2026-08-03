## Why

Dashboard Event Timeline và Latest News đang dùng anchor để mở quick-detail drawer rồi chặn navigation. `nextjs-toploader` vẫn nhận click anchor và hiển thị loading bar dù không có route change. Product decision là coi row như một local action button; canonical detail page vẫn có action riêng trong drawer.

## What Changes

- Đổi row trigger của Event Timeline và Latest News từ anchor-backed link thành native button-backed item.
- Xóa per-row canonical `href` và các hành vi modifier-click, middle-click, context-menu khỏi dashboard quick detail.
- Giữ nút mở canonical event/news-article detail page trong drawer.
- Cập nhật code comments/specs/docs liên quan để mô tả button-based quick detail.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `dashboard-event-news-quick-detail`: quick-detail rows trở thành local button actions và không còn giữ native link behavior.
- `dashboard-event-timeline`: event rows mở drawer bằng button; canonical route chỉ qua drawer action.
- `dashboard-latest-news`: article rows mở drawer bằng button; canonical route chỉ qua drawer action.

## Impact

- Affected UI: `app/[lang]/(main)/dashboard/dashboard-quick-detail.tsx`, `event-timeline.tsx`, `latest-news.tsx`.
- Affected OpenSpec requirements and quick-detail documentation.
- No API, permission, dependency, or route changes.
