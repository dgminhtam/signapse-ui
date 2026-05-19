## 1. Header Action Composition

- [x] 1.1 Shorten the visible derive-event button label to `Suy diễn sự kiện` while keeping pending and accessible text clear.
- [x] 1.2 Replace the multi-button header cluster with a visible primary derive action plus a `Hành động` dropdown.
- [x] 1.3 Move `Tải lại nội dung` into the dropdown while preserving pending, disabled, toast, refresh, and permission behavior.
- [x] 1.4 Move `Mở liên kết gốc` into the dropdown while preserving external-link behavior.
- [x] 1.5 Move `Xóa` into the dropdown as a visually separated destructive action that still opens the existing confirmation dialog.
- [x] 1.6 Ensure all `DropdownMenuItem` entries are inside `DropdownMenuGroup` and icons inside buttons/menu triggers follow project conventions.

## 2. Summary And Image Composition

- [x] 2.1 Add a `Hình ảnh bài viết` section heading that matches the treatment of `Mô tả`.
- [x] 2.2 Render `Mô tả` and `Hình ảnh bài viết` in the same desktop grid row with balanced equal-height surfaces.
- [x] 2.3 Keep the feature image as a supporting thumbnail/preview with stable aspect ratio and object-cover behavior, not a hero/banner.
- [x] 2.4 Preserve mobile stacking with `Mô tả` before `Hình ảnh bài viết` and no horizontal overflow.
- [x] 2.5 Avoid reserving an unexplained empty image column when an article has no feature image.

## 3. Loading And Verification

- [x] 3.1 Update the news article detail skeleton to mirror the concise primary action, action dropdown, and balanced summary/media row.
- [x] 3.2 Run targeted ESLint for touched news article detail/action files.
- [x] 3.3 Run typecheck, or document unrelated blockers if the project typecheck cannot complete.
- [x] 3.4 Inspect the rendered page or review JSX to confirm the header actions and summary/media row match the accepted direction.
