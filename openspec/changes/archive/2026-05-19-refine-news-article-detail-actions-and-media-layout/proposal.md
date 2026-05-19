## Why

The news article detail page now has a cleaner review hierarchy, but the top-right action cluster still wraps awkwardly and the article image feels detached from the summary area. This change tightens the header actions and balances the description/image composition so the first viewport reads as one intentional review surface.

## What Changes

- Keep the primary event derivation action visible, but shorten its label from `Suy diễn sự kiện chính` to `Suy diễn sự kiện`.
- Move secondary actions into a single `Hành động` dropdown placed beside the primary action.
- Include `Tải lại nội dung`, `Mở liên kết gốc`, and `Xóa` inside the dropdown, with `Xóa` visually separated and still protected by the existing confirmation flow.
- Add a `Hình ảnh bài viết` section label matching the existing `Mô tả` section label.
- Render `Mô tả` and `Hình ảnh bài viết` as two balanced columns on desktop, with equal-height surfaces and mobile stacking.
- Keep the image as supporting recognition media, not a hero/banner, so `Sự kiện liên kết` stays high in the reading order.
- Update loading skeletons to mirror the refined header action and summary/media layout.

## Capabilities

### New Capabilities

- `news-article-detail-action-media-composition`: Defines the header action composition and balanced summary/media layout for the news article detail review screen.

### Modified Capabilities

- None.

## Impact

- Affects `app/(main)/news-articles/[id]/page.tsx`.
- May affect `app/(main)/news-articles/news-article-derive-event-button.tsx` if the shorter button text is implemented at the component default level.
- May add a local client action menu component under `app/(main)/news-articles/` if needed to compose `DropdownMenu` with existing client action components and `AlertDialog`.
- Does not require backend API changes, route changes, permission changes, or new dependencies.
