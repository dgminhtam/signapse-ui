## Why

Backend Economic Calendar đã bỏ `contentAvailable` khỏi list, detail và Market Chart event responses, đồng thời bỏ `content` khỏi detail response. Frontend hiện còn yêu cầu các field này; riêng Zod parser của Market Chart đang reject toàn bộ calendar response mới, còn list/detail giữ các trạng thái nội dung không còn đúng contract.

## What Changes

- **BREAKING** Xóa `contentAvailable` khỏi Economic Calendar và Market Chart frontend contracts; xóa `content` khỏi Economic Calendar detail contract.
- Dùng `status` (`PENDING` hoặc `AVAILABLE`) làm tín hiệu publication duy nhất trên list, detail và Market Chart.
- Xóa local supporting-content expansion khỏi Economic Calendar list, nhưng giữ canonical localized detail navigation cho mọi event.
- Xóa content section và content-unavailable state khỏi detail page; giữ description, release values, timestamps và technical metadata.
- Cập nhật Market Chart runtime schema để chấp nhận response mới và giữ nguyên marker, quick list cùng detail navigation.
- Xóa dictionary copy, helper fallback và layout/skeleton logic chỉ phục vụ các field đã bị loại bỏ.
- Đồng bộ main OpenSpec requirements và `docs/APIMAPPING.md` với trạng thái frontend sau triển khai; không sửa archived changes.

## Capabilities

### New Capabilities

Không có.

### Modified Capabilities

- `economic-calendar-list-workspace`: Thay supporting-content expansion bằng status-only event presentation và canonical detail navigation không phụ thuộc content availability.
- `economic-calendar-time-grouping`: Event rows chỉ cần giữ canonical detail links, không còn expandable support content.
- `economic-calendar-week-stream`: Week stream giữ grouped rows và detail navigation nhưng bỏ supporting-content expansion.
- `economic-calendar-merged-group-cells`: Bỏ expanded support-row alignment vì list không còn expanded rows.
- `market-chart-economic-calendar-events`: Chấp nhận response không có `contentAvailable` và mô tả detail navigation theo canonical entry details thay vì full content.

## Impact

- Contracts/helpers: `app/lib/economic-calendar/definitions.ts`, `app/lib/market-charts/definitions.ts`.
- Economic Calendar UI: list row composition, row-span calculation, detail page và detail skeleton.
- Market Chart UI: calendar status Badge; authenticated action giữ nguyên endpoint và dùng runtime schema đã cập nhật.
- Localization: Economic Calendar và Market Chart calendar copy trong dictionary tiếng Việt/Anh.
- API surface, permissions, search/sort/date grouping, marker grouping và routes không đổi.
- Không thêm dependency mới.
