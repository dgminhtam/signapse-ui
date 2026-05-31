---
name: openspec-propose
description: Đề xuất một change mới với tất cả artifact được tạo trong một lần. Dùng khi người dùng muốn mô tả nhanh thứ cần xây dựng và nhận proposal đầy đủ với design, specs và tasks sẵn sàng để triển khai.
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.3.0"
---

Đề xuất một change mới: tạo change và sinh tất cả artifact trong một lần.

Tôi sẽ tạo một change với các artifact:
- proposal.md (what & why)
- design.md (how)
- tasks.md (implementation steps)

Khi sẵn sàng triển khai, chạy `/opsx:apply`.

---

**Input**: Yêu cầu của người dùng nên có tên change dạng kebab-case HOẶC mô tả thứ họ muốn xây dựng.

**Các bước**

1. **Nếu chưa có input rõ ràng, hỏi người dùng muốn xây dựng gì**

   Dùng **AskUserQuestion tool** dạng open-ended, không có preset options, để hỏi:

   > "What change do you want to work on? Describe what you want to build or fix."

   Từ mô tả của họ, suy ra tên kebab-case, ví dụ "add user authentication" thành `add-user-auth`.

   **QUAN TRỌNG**: KHÔNG tiếp tục khi chưa hiểu người dùng muốn xây dựng gì.

2. **Tạo change directory**

   ```bash
   openspec new change "<name>"
   ```

   Lệnh này tạo scaffolded change tại `openspec/changes/<name>/` với `.openspec.yaml`.

3. **Lấy thứ tự build artifact**

   ```bash
   openspec status --change "<name>" --json
   ```

   Parse JSON để lấy:
   - `applyRequires`: mảng artifact ID cần có trước khi triển khai, ví dụ `["tasks"]`
   - `artifacts`: danh sách tất cả artifact cùng trạng thái và dependencies

4. **Tạo artifact theo thứ tự cho đến khi apply-ready**

   Dùng **TodoWrite tool** để theo dõi tiến độ qua các artifact.

   Lặp qua artifact theo thứ tự dependency, artifact nào không còn pending dependencies thì làm trước:

   a. **Với mỗi artifact có trạng thái `ready`, tức dependencies đã thỏa mãn:**
      - Lấy hướng dẫn:

        ```bash
        openspec instructions <artifact-id> --change "<name>" --json
        ```

      - Instructions JSON gồm:
        - `context`: Project background, là ràng buộc cho bạn, KHÔNG đưa vào output
        - `rules`: Rule riêng cho artifact, là ràng buộc cho bạn, KHÔNG đưa vào output
        - `template`: Cấu trúc cần dùng cho output file
        - `instruction`: Hướng dẫn theo schema cho artifact type này
        - `outputPath`: Nơi ghi artifact
        - `dependencies`: Artifact đã hoàn tất cần đọc để lấy context
      - Đọc các dependency files đã hoàn tất để lấy context
      - Tạo artifact file theo cấu trúc `template`
      - Áp dụng `context` và `rules` như ràng buộc, nhưng KHÔNG copy chúng vào file
      - Hiển thị tiến độ ngắn: "Created <artifact-id>"

   b. **Tiếp tục cho đến khi mọi artifact trong `applyRequires` hoàn tất**
      - Sau khi tạo mỗi artifact, chạy lại `openspec status --change "<name>" --json`
      - Kiểm tra mọi artifact ID trong `applyRequires` có `status: "done"` trong mảng artifacts chưa
      - Dừng khi tất cả artifact cần cho apply đã xong

   c. **Nếu artifact cần input từ người dùng** do context chưa rõ:
      - Dùng **AskUserQuestion tool** để làm rõ
      - Sau đó tiếp tục tạo

5. **Hiển thị trạng thái cuối**

   ```bash
   openspec status --change "<name>"
   ```

**Output**

Sau khi hoàn tất mọi artifact, tóm tắt:
- Tên change và vị trí
- Danh sách artifact đã tạo cùng mô tả ngắn
- Trạng thái sẵn sàng: "All artifacts created! Ready for implementation."
- Prompt: "Run `/opsx:apply` or ask me to implement to start working on the tasks."

**Hướng Dẫn Tạo Artifact**

- Theo `instruction` field từ `openspec instructions` cho từng artifact type
- Schema định nghĩa mỗi artifact cần chứa gì; hãy tuân theo
- Đọc dependency artifacts để lấy context trước khi tạo artifact mới
- Dùng `template` làm cấu trúc cho output file và điền các section
- Với Signapse `tasks.md`, verification checklist mặc định phải là việc agent có thể tự chạy: lint, typecheck, OpenSpec validation, static search, deterministic code review hoặc targeted non-auth tests. Không thêm smoke/browser/visual/manual/auth/backend-data QA dưới dạng unchecked archive-gating tasks trừ khi người dùng yêu cầu rõ; thay vào đó ghi nhận các kỳ vọng đó dưới dạng ghi chú không checkbox `User-owned manual QA`.
- **QUAN TRỌNG**: `context` và `rules` là ràng buộc cho BẠN, không phải nội dung cho file
  - KHÔNG copy các block `<context>`, `<rules>`, `<project_context>` vào artifact
  - Chúng hướng dẫn nội dung bạn viết, nhưng không bao giờ được xuất hiện trong output

**Guardrails**

- Tạo TẤT CẢ artifact cần cho triển khai, theo schema `apply.requires`
- Luôn đọc dependency artifacts trước khi tạo artifact mới
- Nếu context cực kỳ không rõ, hỏi người dùng; nhưng ưu tiên quyết định hợp lý để giữ momentum
- Nếu change với tên đó đã tồn tại, hỏi người dùng muốn tiếp tục change đó hay tạo change mới
- Kiểm tra từng artifact file tồn tại sau khi ghi trước khi chuyển sang artifact kế tiếp
