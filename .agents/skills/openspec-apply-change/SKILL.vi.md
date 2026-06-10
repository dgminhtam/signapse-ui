---
name: openspec-apply-change
description: Triển khai task từ một OpenSpec change. Dùng khi người dùng muốn bắt đầu triển khai, tiếp tục triển khai hoặc xử lý các task.
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.3.0"
---

Triển khai task từ một OpenSpec change.

**Input**: Có thể chỉ định tên change. Nếu bỏ qua, kiểm tra xem có thể suy ra từ ngữ cảnh hội thoại hay không. Nếu mơ hồ hoặc không rõ, BẮT BUỘC hỏi người dùng chọn từ các change hiện có.

**Các bước**

1. **Chọn change**

   Nếu có tên được cung cấp, dùng tên đó. Nếu không:
   - Suy ra từ ngữ cảnh hội thoại nếu người dùng đã nhắc đến một change
   - Tự chọn nếu chỉ có một active change
   - Nếu mơ hồ, chạy `openspec list --json` để lấy các change hiện có và dùng **AskUserQuestion tool** để người dùng chọn

   Luôn thông báo: "Using change: <name>" và cách ghi đè, ví dụ `/opsx:apply <other>`.

2. **Kiểm tra trạng thái để hiểu schema**

   ```bash
   openspec status --change "<name>" --json
   ```

   Parse JSON để hiểu:
   - `schemaName`: workflow đang dùng, ví dụ "spec-driven"
   - Artifact nào chứa task, thường là "tasks" với spec-driven; kiểm tra status cho các schema khác

3. **Lấy hướng dẫn apply**

   ```bash
   openspec instructions apply --change "<name>" --json
   ```

   Kết quả trả về:
   - Đường dẫn context file, thay đổi theo schema, có thể là proposal/specs/design/tasks hoặc spec/tests/implementation/docs
   - Tiến độ: tổng số, đã xong, còn lại
   - Danh sách task với trạng thái
   - Hướng dẫn động theo trạng thái hiện tại

   **Xử lý trạng thái:**
   - Nếu `state: "blocked"` vì thiếu artifact: hiển thị thông báo, gợi ý dùng openspec-continue-change
   - Nếu `state: "all_done"`: chúc mừng, gợi ý archive
   - Trường hợp khác: tiếp tục triển khai

4. **Đọc context files**

   Đọc các file được liệt kê trong `contextFiles` từ output apply instructions.
   File phụ thuộc vào schema đang dùng:
   - **spec-driven**: proposal, specs, design, tasks
   - Schema khác: theo `contextFiles` từ CLI output

5. **Hiển thị tiến độ hiện tại**

   Hiển thị:
   - Schema đang dùng
   - Tiến độ: "N/M tasks complete"
   - Tổng quan task còn lại
   - Hướng dẫn động từ CLI

6. **Triển khai task, lặp cho đến khi xong hoặc bị chặn**

   Với mỗi task pending:
   - Hiển thị task đang làm
   - Thực hiện các thay đổi code cần thiết
   - Giữ thay đổi nhỏ gọn và tập trung
   - Nếu task pending là smoke/browser/visual/manual/auth/backend-data QA thuộc về người dùng và Codex không thể chạy đáng tin cậy, giữ chi tiết đó dưới dạng ghi chú không checkbox `User-owned manual QA` hoặc checked transfer note thay vì xem là blocker triển khai
   - Đánh dấu task hoàn tất trong tasks file: `- [ ]` thành `- [x]`
   - Tiếp tục task kế tiếp

   **Tạm dừng nếu:**
   - Task không rõ → hỏi lại
   - Khi triển khai phát hiện vấn đề thiết kế → đề xuất cập nhật artifact
   - Gặp lỗi hoặc blocker → báo cáo và chờ hướng dẫn
   - Người dùng ngắt

7. **Khi hoàn tất hoặc tạm dừng, hiển thị trạng thái**

   Hiển thị:
   - Các task đã hoàn tất trong phiên này
   - Tổng tiến độ: "N/M tasks complete"
   - Nếu xong hết: gợi ý archive
   - Nếu tạm dừng: giải thích lý do và chờ hướng dẫn

**Output Trong Khi Triển Khai**

```text
## Implementing: <change-name> (schema: <schema-name>)

Working on task 3/7: <task description>
[...implementation happening...]
✓ Task complete

Working on task 4/7: <task description>
[...implementation happening...]
✓ Task complete
```

**Output Khi Hoàn Tất**

```text
## Implementation Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 7/7 tasks complete ✓

### Completed This Session
- [x] Task 1
- [x] Task 2
...

All tasks complete! Ready to archive this change.
```

**Output Khi Tạm Dừng Vì Gặp Vấn Đề**

```text
## Implementation Paused

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 4/7 tasks complete

### Issue Encountered
<description of the issue>

**Options:**
1. <option 1>
2. <option 2>
3. Other approach

What would you like to do?
```

**Guardrails**

- Tiếp tục xử lý task cho đến khi xong hoặc bị chặn
- Luôn đọc context files trước khi bắt đầu, lấy từ apply instructions output
- Nếu task mơ hồ, tạm dừng và hỏi trước khi triển khai
- Nếu triển khai làm lộ vấn đề, tạm dừng và đề xuất cập nhật artifact
- Giữ thay đổi code tối thiểu và đúng scope từng task
- Cập nhật checkbox task ngay sau khi hoàn tất từng task
- Tạm dừng khi có lỗi, blocker hoặc yêu cầu không rõ; không đoán
- Dùng `contextFiles` từ CLI output, không tự giả định tên file cụ thể

**Tích Hợp Fluid Workflow**

Skill này hỗ trợ mô hình "actions on a change":

- **Có thể gọi bất kỳ lúc nào**: Trước khi mọi artifact xong nếu đã có tasks, sau khi triển khai một phần, hoặc xen kẽ với action khác
- **Cho phép cập nhật artifact**: Nếu triển khai làm lộ vấn đề thiết kế, đề xuất cập nhật artifact; không khóa cứng theo phase, làm việc linh hoạt
