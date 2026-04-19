## Why

Frontend đã hoàn tất hướng đi mới: `articles` và `economic-calendar` được thay bằng `source-documents`, còn `wiki` không còn nằm trong contract backend hiện tại. Tuy vậy repo vẫn giữ lại nhiều route, action, type, navigation item, và helper cũ chỉ còn vai trò redirect hoặc alias, khiến codebase tiếp tục mang mental model lỗi thời và làm tăng nguy cơ tái sử dụng nhầm các domain đã bị loại bỏ.

Change này cần thực hiện ngay để dọn sạch bề mặt dư thừa sau refactor, khóa lại domain canon mới trong frontend, và giảm chi phí bảo trì cho các thay đổi tiếp theo trên `sources` và `source-documents`.

## What Changes

- Xóa toàn bộ frontend surface không còn là domain hợp lệ nữa: `articles`, `economic-calendar`, và `wiki`.
- Xóa các route redirect tạm thời cho `articles` và `economic-calendar` sau khi đã xác nhận `source-documents` là đường đi duy nhất.
- Xóa toàn bộ server action, DTO/type, component, và helper chỉ còn phục vụ `articles`, `economic-calendar`, hoặc `wiki`.
- Gỡ các nút, affordance, và flow thao tác wiki đang cài vào source-document list/detail.
- Dọn sidebar, config, permission-gated navigation, và tài liệu nội bộ để chỉ còn các bề mặt còn được backend hỗ trợ.
- Cập nhật OpenSpec artifact và tài liệu mapping liên quan để phản ánh rằng `source-documents` là domain content canon duy nhất ở frontend.
- **BREAKING** Người dùng sẽ không còn truy cập được các route `/articles`, `/economic-calendar`, và `/wiki`; mọi workflow content hợp lệ phải đi qua `/source-documents` hoặc `/sources`.

## Capabilities

### New Capabilities
- `legacy-content-and-wiki-removal`: Loại bỏ hoàn toàn các bề mặt frontend, helper, và tài liệu dư thừa cho `articles`, `economic-calendar`, và `wiki` sau khi domain content canon đã chuyển sang `source-documents`.

### Modified Capabilities
- None.

## Impact

- Ảnh hưởng tới route tree dưới `app/(main)/articles`, `app/(main)/economic-calendar`, `app/(main)/wiki`, và các component liên quan trong `app/(main)/source-documents`.
- Ảnh hưởng tới server actions và definitions dưới `app/api/articles`, `app/api/economic-calendar`, `app/api/wiki`, `app/lib/articles`, `app/lib/economic-calendar`, và `app/lib/wiki`.
- Ảnh hưởng tới navigation/config như `config/site.ts` và mọi nơi còn hiển thị hoặc guard permission cho wiki/legacy content.
- Ảnh hưởng tới tài liệu như `docs/APIMAPPING.md` và các OpenSpec artifact đang còn mô tả wiki hay legacy content như một phần hợp lệ của frontend.
