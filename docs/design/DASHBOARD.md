# Trading Intelligence Dashboard

**Status:** Accepted  
**Scope:** `app/[lang]/(main)/dashboard`  
**Target:** Desktop web  
**Last updated:** 2026-07-30

Tài liệu này mô tả mục đích, information architecture, bố cục và content rules
riêng cho trang `/dashboard`. Tài liệu mở rộng
[DESIGN.md](./DESIGN.md); khi có xung đột, `DESIGN.md` vẫn là nguồn chuẩn cho
design system, component chrome và accessibility toàn ứng dụng.

## Product Definition

> Dashboard là bề mặt market awareness được cá nhân hóa theo workspace và
> watchlist. Dashboard không phải nơi quan sát sức khỏe pipeline hoặc xử lý tác
> vụ quản trị.

Tên định hướng của trang là **Trading Intelligence Home**, không phải
Operations Console. Trang phục vụ người dùng theo dõi thị trường và hỗ trợ quá
trình ra quyết định giao dịch; không phục vụ việc giám sát hệ thống nội bộ.

## User Questions

Dashboard phải giúp người dùng nhanh chóng trả lời bốn câu hỏi:

1. Thị trường vừa có gì thay đổi?
2. Sắp có catalyst nào quan trọng?
3. Watchlist của tôi đang cần chú ý điều gì?
4. Narrative nào đang mạnh lên hoặc yếu đi?

Mọi module trên trang phải đóng góp trực tiếp vào ít nhất một trong bốn câu hỏi
trên.

## Goals

- Cho người dùng thấy market context quan trọng ngay sau khi mở ứng dụng.
- Kết nối workspace, watchlist, economic calendar, event, news và narrative
  thành một decision surface thống nhất.
- Ưu tiên thông tin mới, catalyst sắp tới và nội dung liên quan đến phạm vi theo
  dõi của người dùng.
- Cung cấp đường dẫn ngắn tới Economic Calendar, Events, News, Market Charts và
  Graph View.
- Giữ mật độ thông tin phù hợp với financial dashboard nhưng không tạo cảm giác
  như màn giám sát vận hành.

## Non-Goals

Dashboard không hiển thị:

- Derivation hoặc enrichment đang pending hay failed.
- Sync job, cronjob, queue hoặc pipeline health.
- AI provider, system prompt hoặc backend processing state.
- Administrative counts, permission diagnostics hoặc system telemetry.
- Nội dung giải thích implementation như “backend” hoặc “processing pipeline”.
- Full trading workbench hoặc candlestick chart lớn đã thuộc trách nhiệm của
  Market Charts.

Các trạng thái nội bộ vẫn có thể được dùng để xác định dữ liệu nào đủ điều kiện
hiển thị, nhưng không được lộ ra UI.

## Information Architecture

### Layout

Trang dùng grid 12 cột với hierarchy bất đối xứng, tránh chia mọi nội dung thành
các card có cùng trọng lượng.

```text
┌ Trading context ─────────────────────────────────────────────────┐
│ Workspace A · 8 tài sản theo dõi              [Quản lý watchlist]│
└──────────────────────────────────────────────────────────────────┘

┌ Catalyst kế tiếp ────────┐ ┌ Event 24h ┐ ┌ Narrative ┐ ┌ Tin mới ┐
│ CPI Hoa Kỳ · 19:30 · CAO │ │    12     │ │ 4 active  │ │   18    │
└───────────────────────────┘ └───────────┘ └───────────┘ └─────────┘

┌ Market intelligence — 8 cột ─────────────┐ ┌ Catalyst radar — 4 cột ┐
│ Event và news mới nhất                    │ │ Economic calendar        │
│ Confidence · thời gian · asset liên quan │ │ Giờ · currency · impact  │
│ [Mở event] [Đọc tin] [Xem trên biểu đồ]  │ │ Forecast / previous      │
└───────────────────────────────────────────┘ └─────────────────────────┘

┌ Watchlist focus — 7 cột ─────────────────┐ ┌ Narrative radar — 5 cột ┐
│ Symbol · loại · market context gần nhất  │ │ Emerging / Active        │
│ [Market Charts] [Graph View]             │ │ Weakening · confidence   │
└───────────────────────────────────────────┘ └─────────────────────────┘
```

## Module Specifications

### Trading Context

Trading Context là thanh ngữ cảnh gọn, không phải hero.

Nội dung:

- Tên workspace đang hoạt động.
- Tổng số tài sản đang theo dõi.
- Hành động quản lý watchlist khi người dùng có quyền phù hợp.

Không dùng mô tả dài hoặc thời gian sửa workspace làm nội dung nổi bật. Metadata
workspace không được cạnh tranh với market information.

### Trading Snapshot

Hàng snapshot cung cấp các tín hiệu có thể đọc trong vài giây:

- Catalyst high-impact kế tiếp.
- Số market event mới trong 24 giờ.
- Số narrative đang hoạt động hoặc mới hình thành.
- Số news item mới trong khoảng thời gian phù hợp.

Metric phải có time window hoặc context rõ. Không hiển thị số tổng tích lũy nếu
con số đó không giúp người dùng ra quyết định.

### Catalyst Radar

Catalyst Radar thay thế hoàn toàn ý tưởng Action Center mang tính vận hành.

Nội dung ưu tiên:

- Sự kiện high-impact sắp diễn ra.
- Thời gian diễn ra hoặc thời gian còn lại.
- Currency hoặc asset class liên quan.
- Forecast, previous và actual khi dữ liệu đã có.
- Impact level bằng label và icon, không chỉ bằng màu.
- Liên kết tới Economic Calendar.

Module chỉ thể hiện điều người dùng trading cần chú ý, không thể hiện lỗi hay
trạng thái xử lý nội bộ.

### Market Intelligence Feed

Market Intelligence Feed kết hợp market event và news user-ready thành một
timeline chung.

Event hiển thị:

- Tiêu đề.
- Thời gian xảy ra.
- Confidence khi có.
- Asset hoặc theme liên quan khi có dữ liệu phù hợp.
- Hành động mở event hoặc xem trong context liên quan.

News hiển thị:

- Tiêu đề.
- Nguồn tin.
- Thời gian xuất bản.
- Hành động đọc bài viết.

Event và News phải được phân biệt bằng icon và text label, không chỉ bằng màu.
Feed sắp xếp theo thời gian và ưu tiên nội dung mới nhất.

### Narrative Radar

Narrative Radar tập trung vào các trạng thái có ý nghĩa giao dịch:

- `EMERGING`: luận điểm mới hình thành.
- `ACTIVE`: luận điểm đang có hiệu lực.
- `WEAKENING`: luận điểm đang suy yếu.

Mỗi narrative có thể hiển thị:

- Tiêu đề hoặc thesis.
- Status user-facing.
- Confidence.
- Primary asset hoặc primary theme.
- Thời điểm cập nhật gần nhất.

`INVALIDATED` và `ARCHIVED` không nằm trên dashboard chính. Các trạng thái này
phù hợp với lịch sử hoặc màn danh sách đầy đủ hơn.

### Watchlist Focus

Giai đoạn đầu sử dụng dữ liệu hiện có:

- Symbol.
- Tên tài sản.
- Loại tài sản.
- Quick link tới Market Charts và Graph View.
- Event hoặc narrative gần nhất nếu có thể ghép dữ liệu mà không tạo N+1
  request.

Khi có aggregate API, module có thể bổ sung:

- Giá hiện tại và biến động 24 giờ.
- Sparkline ngắn.
- Catalyst gần nhất.
- Số event mới liên quan trong 24 giờ.
- Top mover trong watchlist.

Không tải riêng dữ liệu thị trường cho từng tài sản bằng N request độc lập.

## Data Eligibility And Internal Status

Dashboard chỉ hiển thị dữ liệu đã đủ điều kiện phục vụ người dùng.

- Không hiển thị các nhãn như `ENRICHMENT_PENDING`,
  `ENRICHMENT_FAILED`, `DERIVATION_PENDING` hoặc `DERIVATION_FAILED`.
- Item chưa sẵn sàng không xuất hiện trong Market Intelligence Feed.
- Internal status có thể được dùng ở data layer để lọc eligibility.
- Không chuyển internal failure thành alert card màu đỏ trên dashboard.
- Lỗi tải module được biểu đạt bằng ngôn ngữ user-facing và không tiết lộ cơ chế
  xử lý phía sau.

## Empty, Loading And Error States

- Mỗi module có loading skeleton tương ứng với bố cục thật.
- Module tải độc lập; một nguồn dữ liệu chậm hoặc lỗi không chặn toàn bộ
  dashboard.
- Empty state giải thích người dùng có thể làm gì tiếp theo.
- Không dùng copy như “Khi backend trả về dữ liệu...”.
- Error state dùng câu ngắn như “Không thể tải thông tin thị trường” và cung cấp
  retry khi phù hợp.
- Optional module không có quyền truy cập nên được ẩn hoặc thay bằng nội dung
  khác có giá trị; tránh lấp dashboard bằng permission-denied panels.

## Visual Direction

Trang kế thừa direction **Financial Command Surface**:

- Data-dense nhưng tĩnh, rõ và có khoảng thở.
- Dùng Geist và Geist Mono theo design system hiện tại.
- Dùng semantic tokens, không tạo palette riêng cho dashboard.
- Motion nhẹ và chỉ dùng để giải thích state change.
- Light mode và dark mode giữ cùng hierarchy.
- Xanh/đỏ trading chỉ dùng cho biến động giá hoặc tín hiệu thị trường phù hợp,
  không dùng cho trạng thái backend.
- Không đặt candlestick chart lớn trên dashboard; full chart thuộc Market
  Charts.

## Delivery Phases

### Phase 1: Existing Data

- Thu gọn workspace thành Trading Context.
- Thêm Trading Snapshot.
- Thêm Catalyst Radar từ Economic Calendar.
- Kết hợp event và news thành Market Intelligence Feed.
- Trình bày lại Narrative Radar.
- Chuyển watchlist từ decorative tiles thành danh sách có quick actions.
- Dùng permission-aware rendering và loading/error boundary độc lập theo module.

### Phase 2: Aggregated Trading Data

- Thêm dashboard summary endpoint nếu số lượng request tổng hợp trở nên lớn.
- Thêm watchlist price snapshot, biến động 24 giờ và sparkline.
- Thêm catalyst và event count theo từng tài sản.
- Thêm top mover và watchlist impact ranking.

## Design Completion Criteria

Thiết kế được xem là đạt khi:

- Người dùng nhìn thấy catalyst quan trọng trước khi thấy metadata workspace.
- Không có process, pipeline hoặc admin status xuất hiện trên dashboard.
- Mỗi metric có time window hoặc decision context rõ.
- Event, news, narrative và watchlist đều có đường dẫn điều tra tiếp theo.
- Dashboard vẫn hữu ích khi một hoặc nhiều optional modules không có dữ liệu.
- Loading skeleton, empty state và error state giữ cùng hierarchy với nội dung
  thật.
