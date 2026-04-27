## Why

Signapse cần một tài liệu thiết kế thị giác chính thức trước khi triển khai redesign UI toàn hệ thống. Hai reference trong `docs/design/design_light.png` và `docs/design/design_dark.png` đã cho thấy direction phù hợp, nhưng cần được diễn giải thành quy tắc cho dashboard quản trị thay vì áp dụng trực tiếp vào code.

Change này chỉ đóng vai trò documentation baseline: tạo `docs/design/DESIGN.md` để làm nguồn chuẩn cho các change implementation sau.

## What Changes

- Tạo `docs/design/DESIGN.md`.
- Ghi lại direction `Financial Command Surface` cho dashboard Signapse.
- Tham chiếu `docs/design/design_light.png` và `docs/design/design_dark.png`.
- Mô tả goals, non-goals, design principles, token direction, component translation, pilot plan, rollout order, deferred targets, visual QA checklist và rollback notes.
- Không sửa code UI, không đổi token trong `globals.css`, không sửa layout, không sửa shared components và không rollout vào page nào trong change này.

## Capabilities

### New Capabilities

- `financial-command-surface-design`: Lưu trữ tài liệu direction thiết kế thị giác cho Signapse để các redesign implementation sau có một nguồn chuẩn chung.

### Modified Capabilities

- Không có.

## Impact

- Tài liệu mới: `docs/design/DESIGN.md`.
- OpenSpec artifacts cho documentation baseline.
- Không có thay đổi runtime, API, schema backend, permission, dependency hoặc code UI.
