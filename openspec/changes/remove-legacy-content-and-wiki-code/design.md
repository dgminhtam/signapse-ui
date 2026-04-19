## Context

Repo hiện đã có `source-documents` như domain nội dung canon và `sources` như domain cấu hình nguồn. Tuy vậy codebase vẫn còn ba lớp dư thừa:

- `articles` và `economic-calendar` vẫn tồn tại dưới dạng route tree, component, action, và definition riêng; một phần trong số này chỉ còn làm redirect sang `source-documents`.
- `wiki` vẫn còn là một feature frontend hoàn chỉnh với route, action, DTO, sidebar entry, và các nút ingest gắn vào source-document list/detail, dù backend spec hiện tại không còn expose bất kỳ endpoint wiki nào.
- Tài liệu và artifact nội bộ vẫn nhắc đến các domain cũ, làm mờ ranh giới giữa phần đã migrate và phần đã bị loại bỏ.

Sau khi người dùng đã xác nhận rõ rằng:
- `articles` -> `source-documents`
- `economic-calendar` -> `source-documents`
- `wiki` sẽ bị xóa

thì việc giữ các lớp tương thích hoặc route redirect cũ không còn mang giá trị định hướng nữa; ngược lại, nó làm repo khó đọc và dễ phát sinh reuse sai.

## Goals / Non-Goals

**Goals:**
- Xóa toàn bộ frontend surface không còn là domain hợp lệ: `articles`, `economic-calendar`, và `wiki`.
- Xóa các redirect wrapper, alias helper, và component thao tác còn sót từ các domain cũ.
- Loại bỏ các affordance wiki khỏi `source-documents` để content workflow chỉ còn bám vào contract backend đang tồn tại.
- Dọn navigation, config, docs, và các chỉ dấu nội bộ để frontend chỉ còn một mental model canon cho content domain.

**Non-Goals:**
- Thay đổi backend API hoặc khôi phục bất kỳ endpoint wiki/legacy content nào.
- Thiết kế một tính năng thay thế cho wiki trong change này.
- Refactor lớn lại `source-documents` hoặc `sources` ngoài các thay đổi tối thiểu cần thiết để cắt phụ thuộc vào legacy code.
- Bảo toàn backward compatibility cho các route `/articles`, `/economic-calendar`, hoặc `/wiki` nếu chúng không còn được xem là bề mặt được hỗ trợ.

## Decisions

### 1. Xóa cứng legacy route trees thay vì giữ redirect wrappers
Các thư mục route dưới `app/(main)/articles`, `app/(main)/economic-calendar`, và `app/(main)/wiki` sẽ bị xóa khỏi repo, thay vì tiếp tục giữ page redirect hoặc placeholder.

Why:
- Redirect wrappers vẫn kéo dài tuổi thọ của domain cũ trong codebase.
- Khi quyết định nghiệp vụ đã khóa, hard removal giúp route tree phản ánh đúng cấu trúc sản phẩm hiện tại.

Alternatives considered:
- Giữ redirect trong một release cycle nữa.
- Rejected vì mục tiêu của change là xóa code dư không còn sử dụng, không phải duy trì compatibility layer.

### 2. Xóa toàn bộ data layer và component layer gắn với legacy content/wiki
Các module dưới `app/api/articles`, `app/api/economic-calendar`, `app/api/wiki`, `app/lib/articles`, `app/lib/economic-calendar`, và `app/lib/wiki` sẽ bị gỡ cùng lúc với các component UI tương ứng.

Why:
- Nếu chỉ xóa route mà giữ action/type phía dưới, repo vẫn còn dead code dễ bị import lại sau này.
- Dọn triệt để tầng API + DTO + UI mới thật sự khóa mental model canon.

Alternatives considered:
- Giữ helper/action cũ như compatibility utilities nội bộ.
- Rejected vì backend contract hiện tại không còn các domain này; giữ helper chỉ tạo thêm đường dẫn sai.

### 3. Gỡ mọi thao tác wiki khỏi source-document management
Các nút ingest wiki và mọi flow điều hướng sang `/wiki/*` từ `source-documents` sẽ bị loại bỏ khỏi list/detail/component tree.

Why:
- Nếu wiki bị xóa, việc để lại action button sẽ tạo broken affordance và giữ dependency vòng giữa content domain mới với feature đã chết.
- `source-documents` cần trở thành content surface độc lập, không còn phụ thuộc vào wiki như downstream consumer.

Alternatives considered:
- Ẩn tạm button bằng permission hoặc feature flag.
- Rejected vì vẫn giữ code chết và không giải quyết mục tiêu cleanup.

### 4. Dọn navigation và docs cùng lúc với cleanup code
Sidebar, API mapping, và các tài liệu thay đổi gần đây sẽ được cập nhật trong cùng change để tránh trạng thái “code đã xóa nhưng docs vẫn mô tả feature còn sống”.

Why:
- Cleanup chỉ thực sự hoàn tất khi developer entry points và tài liệu tham chiếu không còn dẫn về các domain đã bị bỏ.
- Điều này cũng giúp các change tiếp theo không phải liên tục giải thích lại rằng wiki và legacy content đã chết.

Alternatives considered:
- Tách cleanup code và cleanup docs thành hai change.
- Rejected vì phần lệch hiện tại xảy ra đồng thời ở code và docs; tách ra sẽ làm repo có thêm một giai đoạn nửa sống nửa chết.

### 5. Giữ `source-documents` và `sources` là hai surface còn lại của content management
Cleanup change này không gộp lại hai domain còn sống, mà chỉ làm rõ vai trò của chúng sau khi xóa phần thừa:
- `source-documents`: quản lý nội dung đã ingest
- `sources`: quản lý cấu hình nguồn

Why:
- Đây là mental model hiện tại đã được frontend và backend cùng xác nhận.
- Pha cleanup không nên trộn thêm quyết định IA lớn mới nếu không thật sự cần.

Alternatives considered:
- Kết hợp cleanup với một đợt tái cấu trúc navigation/content IA khác.
- Rejected vì sẽ làm change mất tính tập trung và khó kiểm chứng.

## Risks / Trade-offs

- [Bookmark hoặc deep link cũ tới `/articles`, `/economic-calendar`, `/wiki` sẽ hỏng] -> Chấp nhận đây là breaking cleanup sau khi domain mới đã được xác nhận; ghi rõ trong proposal và docs.
- [Có thể còn import gián tiếp tới module cũ ở nơi ít được chú ý] -> Dùng search toàn repo và validation lint/typecheck để phát hiện trước khi đóng change.
- [Xóa wiki button khỏi source-documents có thể làm người dùng mất một thao tác quen tay] -> Đây là hệ quả đúng của việc wiki không còn là feature được hỗ trợ; UI cần phản ánh sự thật backend thay vì duy trì affordance giả.
- [OpenSpec change cũ vẫn còn chứa nội dung wiki như bối cảnh lịch sử] -> Không bắt buộc rewrite toàn bộ lịch sử change cũ; ưu tiên cập nhật artifact active và docs tham chiếu hiện hành nơi cần thiết.

## Migration Plan

1. Xóa route trees và component trees cho `articles`, `economic-calendar`, và `wiki`.
2. Xóa các action/definition/helper tương ứng ở `app/api/*` và `app/lib/*`.
3. Gỡ các component wiki khỏi `source-documents` và sidebar/config.
4. Cập nhật tài liệu như `docs/APIMAPPING.md` để không còn mô tả legacy content/wiki là feature sống.
5. Chạy search toàn repo, lint, và typecheck để bảo đảm không còn import/reference sót.

Rollback:
- Nếu cần rollback, có thể khôi phục các file đã xóa từ git; change này không bao gồm migration dữ liệu.

## Open Questions

- Có cần giữ một thông báo migration ngoài codebase cho người dùng nội bộ đang quen các URL cũ, hay có thể chấp nhận hard break hoàn toàn?
- Có nên dọn luôn các phần OpenSpec cũ còn nhắc đến wiki như một deliverable active, hay chỉ cần cập nhật docs/frontend code ở change này?
