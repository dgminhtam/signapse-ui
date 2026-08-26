# Backend Review Request — Feedback API Integration

**Change tham chiếu:** `integrate-feedback-api`
**Mục đích:** gửi BE review và xác nhận contract trước khi frontend bắt đầu implement API.
**Trạng thái:** Answered on 2026-08-26 — xem `backend-clarification.md`. Tài liệu này được giữ làm lịch sử câu hỏi, không còn là implementation contract.

## 1. Bối cảnh

Frontend đã hoàn thành UI/UX cho feedback ở P0 fixture mode. Change tiếp theo sẽ thay fixture state bằng authenticated API nhưng hiện chưa thể implement an toàn vì OpenAPI còn thiếu lifecycle, action eligibility, filter grammar, response invariants, screenshot policy và error contract.

Live dev OpenAPI hiện có **8 paths / 11 operations**:

| Scope | Operations |
| --- | --- |
| Personal active user | list, create multipart, detail, withdraw, screenshot |
| Moderation `feedback:read` | list, detail, screenshot |
| Moderation `feedback:review` | promote, dismiss |
| Moderation `feedback:delete` | administrative delete |

Frontend không yêu cầu BE thay đổi endpoint path hiện có. Request này đề nghị BE bổ sung hoặc xác nhận semantics để frontend có thể khóa implementation và test fixture cùng một contract.

## 2. Những gì contract hiện tại đã xác nhận

### Submission

`FeedbackSubmissionRequest` có các field bắt buộc:

- `type`: `BUG` hoặc `IDEA`
- `title`: 5–150 ký tự
- `description`: 20–5000 ký tự
- `expectedOutcome`: 10–3000 ký tự

Optional:

- `reproductionSteps`: tối đa 5000 ký tự
- `clientContext`: `pagePath`, `appVersion`, `browserName`, `browserVersion`, `osName`, `osVersion`, `locale`, `observedTime`

Create dùng multipart với field `submission` bắt buộc và `screenshot` binary tùy chọn.

### Review

`FeedbackReviewRequest.reviewMessage` bắt buộc, 10–1000 ký tự. `githubIssueUrl` hiện optional nhưng chưa có format hoặc length constraint.

### Response hiện tại

`FeedbackListResponse` có `createdDate`, `lastModifiedDate`, `id`, `type`, `title`, `status`, `screenshot`.

`FeedbackDetailResponse` có thêm `description`, `expectedOutcome`, `reproductionSteps`, `clientContext`, `reviewMessage`, `githubIssueNumber`, `reporter`.

Các response feedback hiện chưa khai báo `required` hoặc nullable semantics rõ ràng.

`SpecificationFeedbackSubmission` hiện là schema rỗng nên filter runtime chưa thể được frontend serialize một cách authoritative.

## 3. Các điểm BE cần review và xác nhận

### A. Record action capabilities

Frontend đề nghị detail response bổ sung object bắt buộc:

```json
{
  "actionCapabilities": {
    "canWithdraw": true,
    "canPromote": false,
    "canDismiss": false,
    "canDelete": false
  }
}
```

Đề nghị xác nhận:

1. Bốn field luôn được trả về dưới dạng boolean, kể cả khi `false`.
2. Capability biểu thị **record eligibility**, không thay thế account permission.
3. `feedback:review` và `feedback:delete` vẫn được backend enforce độc lập.
4. Capability được trả ở personal detail và moderation detail; list không cần trả capability.
5. Sau mỗi promote/dismiss, response trả detail mới cùng capabilities mới.

Nếu BE muốn dùng tên hoặc shape khác, vui lòng gửi JSON Schema/OpenAPI example tương đương.

### B. Requiredness và nullability

Đề nghị BE đánh dấu rõ trong OpenAPI:

**List item bắt buộc:**

- `id`
- `type`
- `title`
- `status`
- `createdDate`
- trạng thái có screenshot hoặc screenshot metadata

**Detail bắt buộc:**

- toàn bộ list fields
- `description`
- `expectedOutcome`
- `actionCapabilities`

**Conditional/optional:**

- `reproductionSteps`
- `clientContext`
- `screenshot`
- `reviewMessage`
- `githubIssueNumber`
- `lastModifiedDate`

Đề nghị xác nhận thêm:

- `reviewMessage` có bắt buộc khi status là `PROMOTED` hoặc `DISMISSED` không?
- Khi có `screenshot`, `id`, `mimeType`, `size` có luôn bắt buộc không?
- Moderation detail có luôn có `reporter` không?
- Optional field sẽ bị omit hay trả `null`?
- `id` là integer như OpenAPI hiện tại hay có thể đổi sang string?

### C. Lifecycle và stale mutation

Frontend đang đề xuất lifecycle ban đầu sau:

| Status | Withdraw | Promote | Dismiss | Admin delete |
| --- | ---: | ---: | ---: | ---: |
| `PENDING_REVIEW` | Có | Có | Có | Có |
| `DISMISSED` | Không | Không | Không | Có |
| `PROMOTED` | Không | Không | Không | Không |

Đây là đề xuất để BE review, không phải frontend tự enforce. Frontend sẽ dùng `actionCapabilities` làm source of truth.

Đề nghị xác nhận:

1. Promote và dismiss có phải mutually exclusive và irreversible không?
2. Withdraw/delete có làm record không còn accessible ngay không?
3. Request lặp hoặc request đến record đã đổi state trả `409 Conflict` với stable error code nào?
4. Request đến record đã bị xóa trả `404` hay `409`?
5. DELETE hiện đang publish `200` empty body; BE muốn giữ nguyên hay đổi sang `204 No Content`?
6. Promote/dismiss có đảm bảo trả detail mới sau khi mutation thành công không?

### D. Moderation filter và sorting

Frontend cần các semantic query sau:

- title: case-insensitive contains
- type: exact `BUG` hoặc `IDEA`
- status: exact một status
- nhiều điều kiện: `AND`
- default status: `PENDING_REVIEW`
- default sort: `createdDate DESC`, sau đó `id DESC`
- ascending: `createdDate ASC`, sau đó `id ASC`
- page UI one-based, backend zero-based

OpenAPI hiện yêu cầu `specification` và `pageable`, nhưng `SpecificationFeedbackSubmission` rỗng. Repo frontend hiện có convention `$filter`, `page`, `size`, `sort`.

Đề nghị BE chọn và document một trong hai hướng:

1. Giữ `specification/pageable` và publish grammar, operators, field whitelist cùng request examples.
2. Đổi sang explicit query fields hoặc `$filter/page/size/sort` và cập nhật OpenAPI.

Trong cả hai hướng, BE cần xác nhận:

- syntax contains và exact equality;
- tên field canonical (`title`, `type`, `status`, `createdDate`, `id`);
- cách truyền multi-sort;
- behavior với page ngoài phạm vi;
- behavior với query field/operator không được phép;
- maximum page size.

### E. Screenshot upload và delivery

Frontend đề xuất chính sách thống nhất:

- tối đa một screenshot;
- MIME cho phép: `image/png`, `image/jpeg`, `image/webp`;
- kích thước tối đa: 5 MiB;
- upload thủ công, không automatic capture;
- trả binary bytes, không trả base64 JSON;
- response giữ MIME thực tế;
- không expose public storage URL;
- frontend proxy trả `Cache-Control: private, no-store` và `X-Content-Type-Options: nosniff`.

Đề nghị BE xác nhận hoặc sửa:

1. MIME allowlist chính thức.
2. Max upload size và max response size.
3. Server có sniff/verify content thật hay chỉ tin request MIME.
4. Binary response có dùng `Content-Disposition: inline` không.
5. Có `ETag`, `Last-Modified` hoặc caching requirement nào không.
6. Error status cho sai MIME, quá lớn, thiếu screenshot và unauthorized access.
7. Screenshot endpoint có trả `404` khi record không có ảnh không.
8. Có cần upload checksum hoặc idempotency key không.

### F. Error contract

Frontend đề nghị BE trả machine-readable error envelope, ví dụ:

```json
{
  "code": "FEEDBACK_STATE_CONFLICT",
  "fieldErrors": [
    { "field": "reviewMessage", "code": "too_short" }
  ]
}
```

`message` nếu có chỉ dùng cho log/debug, không phải copy mà frontend render trực tiếp.

Đề nghị xác nhận status/code mapping:

| Tình huống | HTTP đề xuất | Error code cần xác nhận |
| --- | ---: | --- |
| Validation | `400` hoặc `422` | field-level code |
| Session thiếu/hết hạn | `401` | auth code |
| Không đủ permission | `403` | permission code |
| Không tồn tại/không thuộc scope | `404` | not-found code |
| Lifecycle đã thay đổi | `409` | state-conflict code |
| Screenshot quá lớn | `413` | size code |
| MIME không hỗ trợ | `415` | media-type code |
| Rate limit | `429` | rate-limit code |
| Backend failure | `5xx` | server code |

Đề nghị publish OpenAPI examples cho từng loại error và field name dùng trong validation.

### G. Ownership và permission

Đề nghị xác nhận:

- `/me/feedback-submissions*` luôn scope theo authenticated user hiện tại.
- `feedback:read` gate moderation list/detail/screenshot.
- `feedback:review` gate promote/dismiss.
- `feedback:delete` gate administrative delete.
- Không có cách dùng moderation endpoint để đọc feedback của user không có `feedback:read`.
- Personal forbidden và missing có thể được frontend trình bày cùng một missing state để tránh ownership enumeration.
- Permission collection của `GET /me` tiếp tục là nguồn server-side; không cần feedback-specific client token.

### H. Technical context

Frontend sẽ chỉ gửi technical context khi user giữ toggle bật. Đề nghị BE xác nhận:

- `observedTime` nhận ISO 8601 UTC date-time.
- max length/nullable cho từng field.
- `pagePath` có được phép chứa locale path nhưng không query/hash không.
- `appVersion` lấy từ frontend build có được chấp nhận không.
- browser/OS version có thể vắng mặt không.
- BE có lưu nguyên payload hay normalize trước khi persist.

### I. GitHub reference

Frontend hiện không gửi editable `githubIssueUrl` và chỉ muốn hiển thị `githubIssueNumber` dạng `#123`.

Đề nghị xác nhận:

- `githubIssueUrl` có còn được backend sử dụng trong review request không.
- `githubIssueNumber` chỉ là reference tới issue đã tồn tại hay có trigger tạo issue.
- Nếu cần link, BE có cung cấp canonical URL/repository base URL không.

## 4. Acceptance checklist cho BE

BE có thể review bằng cách đánh dấu từng mục:

- [ ] `actionCapabilities` shape và semantics đã được xác nhận.
- [ ] Required/optional/nullable response fields đã được đánh dấu trong OpenAPI.
- [ ] Lifecycle transition, stale mutation và DELETE semantics đã được xác nhận.
- [ ] Filter grammar, field/operator whitelist, page base và multi-sort đã có OpenAPI examples.
- [ ] Screenshot MIME, size, binary body, headers, caching và error behavior đã được xác nhận.
- [ ] Structured error envelope, error codes và status mapping đã được xác nhận.
- [ ] Ownership và permission behavior đã được xác nhận.
- [ ] Technical-context constraints và privacy behavior đã được xác nhận.
- [ ] GitHub reference semantics đã được xác nhận.
- [ ] Dev OpenAPI đã được cập nhật và deploy để frontend/API mapping sync lại.
- [ ] Có test hoặc runtime probe chứng minh các transition/error/screenshot behavior đã nêu.

## 5. Phản hồi BE cần gửi lại

Vui lòng phản hồi theo format:

1. **Confirmed** — giữ nguyên đề xuất.
2. **Changed** — ghi rõ field/status/endpoint/semantics mới.
3. **Not supported** — ghi rõ phần nào không làm được và alternative contract.
4. **Target release** — dev contract có hiệu lực từ build/version nào.

Frontend sẽ chỉ tiếp tục task implementation sau khi các mục blocker đã có câu trả lời và OpenAPI dev đã phản ánh contract được thống nhất.
