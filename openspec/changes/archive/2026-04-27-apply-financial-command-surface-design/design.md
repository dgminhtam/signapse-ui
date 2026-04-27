## Context

Signapse là dashboard quản trị cho hệ thống tín hiệu giao dịch có tích hợp AI. Dự án đã có nhiều màn hình chức năng, nhưng trước khi áp dụng visual redesign dựa trên reference trong `docs/design/`, cần có một tài liệu direction bền vững để tránh các chỉnh sửa màu/layout rời rạc.

User đã khóa scope của change này: chỉ tạo `docs/design/DESIGN.md`, không sửa code UI.

## Goals / Non-Goals

**Goals:**

- Tạo `docs/design/DESIGN.md` làm nguồn chuẩn cho direction `Financial Command Surface`.
- Diễn giải reference light/dark thành nguyên tắc phù hợp admin dashboard.
- Ghi lại token direction, component translation, pilot plan, rollout order, deferred targets và visual QA checklist.
- Để lại nền tảng rõ ràng cho một hoặc nhiều implementation changes sau.

**Non-Goals:**

- Không sửa `app/globals.css`.
- Không sửa `app/(main)/layout.tsx`.
- Không sửa `components/app-list-table.tsx`, `components/app-list-toolbar.tsx`, `components/app-sidebar.tsx` hoặc bất kỳ code UI nào.
- Không cập nhật `AGENTS.md` trong change này.
- Không rollout visual style vào pilot screen.
- Không chạy lint/typecheck cho code vì không có code thay đổi.

## Decisions

### 1. Archive this as a documentation-only baseline

Change này được archive khi `docs/design/DESIGN.md` đã tồn tại và mô tả đủ design direction. Các bước implementation như token pass, shared surface pass và pilot screen pass sẽ thuộc change khác.

Why:

- Documentation-first giúp thống nhất direction trước khi code.
- Tách implementation giúp diff nhỏ, review rõ và không mạo hiểm với visual rollout toàn app.

Alternatives considered:

- Giữ change này để tiếp tục implementation.
- Rejected vì user đã yêu cầu change này chỉ tạo `DESIGN.md`.

### 2. Keep future rollout guidance inside `DESIGN.md`

Tài liệu vẫn mô tả rollout order, pilot screens và visual QA checklist, nhưng các mục đó là guidance cho future changes, không phải task đã triển khai trong change này.

Why:

- `DESIGN.md` cần đủ hữu ích cho lần apply sau.
- OpenSpec task list của change này không nên giả vờ code rollout đã hoàn thành.

Alternatives considered:

- Xóa toàn bộ guidance implementation khỏi `DESIGN.md`.
- Rejected vì tài liệu sẽ mất giá trị định hướng.

## Risks / Trade-offs

- [Tài liệu không tự thay đổi UI] -> Chấp nhận; đây là baseline để giảm rủi ro trước implementation.
- [Future implementation có thể diễn giải sai] -> `DESIGN.md` ghi rõ goals, non-goals, translation rules, rollout order và QA checklist.
- [OpenSpec spec nếu quá rộng sẽ tạo contract chưa triển khai] -> Spec của change này chỉ yêu cầu tồn tại tài liệu direction, không yêu cầu code redesign.

## Migration Plan

1. Tạo `docs/design/DESIGN.md`.
2. Cập nhật OpenSpec tasks để chỉ phản ánh documentation scope.
3. Sync spec documentation baseline vào `openspec/specs/financial-command-surface-design/spec.md`.
4. Archive change.

Rollback strategy:

- Nếu cần rollback documentation baseline, xóa hoặc revert `docs/design/DESIGN.md` và archived change. Không có code hoặc data migration liên quan.

## Open Questions

- Future implementation change sẽ chọn pilot `/system-prompts` + `/market-query` như tài liệu đề xuất hay chọn cặp khác.
