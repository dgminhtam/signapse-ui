---
name: openspec-archive-change
description: Archive một change đã hoàn tất trong experimental workflow. Dùng khi người dùng muốn finalize và archive một change sau khi triển khai xong.
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.3.0"
---

Archive một change đã hoàn tất trong experimental workflow.

**Input**: Có thể chỉ định tên change. Nếu bỏ qua, kiểm tra xem có thể suy ra từ ngữ cảnh hội thoại hay không. Nếu mơ hồ hoặc không rõ, BẮT BUỘC hỏi người dùng chọn từ các change hiện có.

**Các bước**

1. **Nếu chưa có tên change, hỏi người dùng chọn**

   Chạy `openspec list --json` để lấy các change hiện có. Dùng **AskUserQuestion tool** để người dùng chọn.

   Chỉ hiển thị active changes, không hiển thị change đã archive.
   Bao gồm schema đang dùng cho từng change nếu có.

   **QUAN TRỌNG**: KHÔNG đoán hoặc tự chọn change. Luôn để người dùng chọn.

2. **Kiểm tra trạng thái hoàn tất artifact**

   Chạy `openspec status --change "<name>" --json` để kiểm tra trạng thái hoàn tất artifact.

   Parse JSON để hiểu:
   - `schemaName`: workflow đang dùng
   - `artifacts`: danh sách artifact cùng trạng thái của chúng, ví dụ `done` hoặc trạng thái khác

   **Nếu có artifact chưa `done`:**
   - Hiển thị cảnh báo liệt kê artifact chưa hoàn tất
   - Dùng **AskUserQuestion tool** để xác nhận người dùng muốn tiếp tục
   - Tiếp tục nếu người dùng xác nhận

3. **Kiểm tra trạng thái hoàn tất task**

   Đọc tasks file, thường là `tasks.md`, để kiểm tra task chưa hoàn tất.

   Đếm task được đánh dấu `- [ ]` (chưa xong) và `- [x]` (đã xong).

   **Nếu có task chưa hoàn tất:**
   - Hiển thị cảnh báo với số lượng task chưa hoàn tất
   - Dùng **AskUserQuestion tool** để xác nhận người dùng muốn tiếp tục
   - Tiếp tục nếu người dùng xác nhận

   **Nếu không có tasks file:** Tiếp tục mà không cảnh báo liên quan đến task.

4. **Đánh giá trạng thái đồng bộ delta spec**

   Kiểm tra delta specs tại `openspec/changes/<name>/specs/`. Nếu không có, tiếp tục mà không hỏi sync.

   **Nếu có delta specs:**
   - So sánh từng delta spec với main spec tương ứng tại `openspec/specs/<capability>/spec.md`
   - Xác định các thay đổi sẽ được áp dụng: thêm, sửa, xóa, đổi tên
   - Hiển thị summary tổng hợp trước khi hỏi

   **Tùy chọn prompt:**
   - Nếu cần thay đổi: "Sync now (recommended)", "Archive without syncing"
   - Nếu đã sync: "Archive now", "Sync anyway", "Cancel"

   Nếu người dùng chọn sync, dùng Task tool với `subagent_type: "general-purpose"` và prompt: "Use Skill tool to invoke openspec-sync-specs for change '<name>'. Delta spec analysis: <include the analyzed delta spec summary>". Sau đó tiếp tục archive bất kể lựa chọn.

5. **Thực hiện archive**

   Tạo archive directory nếu chưa tồn tại:

   ```bash
   mkdir -p openspec/changes/archive
   ```

   Tạo tên target theo ngày hiện tại: `YYYY-MM-DD-<change-name>`

   **Kiểm tra target đã tồn tại chưa:**
   - Nếu có: fail với lỗi, gợi ý đổi tên archive hiện có hoặc dùng ngày khác
   - Nếu không: move change directory vào archive

   ```bash
   mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>
   ```

6. **Hiển thị summary**

   Hiển thị summary hoàn tất archive gồm:
   - Tên change
   - Schema đã dùng
   - Vị trí archive
   - Specs đã được sync hay chưa, nếu có
   - Ghi chú về cảnh báo, ví dụ artifact/task chưa hoàn tất

**Output Khi Thành Công**

```text
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** ✓ Synced to main specs (or "No delta specs" or "Sync skipped")

All artifacts complete. All tasks complete.
```

**Guardrails**

- Luôn hỏi chọn change nếu chưa được cung cấp
- Dùng artifact graph (`openspec status --json`) để kiểm tra trạng thái hoàn tất
- Không block archive chỉ vì warning; thông báo và xác nhận
- Giữ `.openspec.yaml` khi move vào archive vì nó đi cùng directory
- Hiển thị summary rõ ràng về việc đã xảy ra
- Nếu người dùng yêu cầu sync, dùng cách openspec-sync-specs (agent-driven)
- Nếu có delta specs, luôn chạy đánh giá sync và hiển thị summary tổng hợp trước khi hỏi
