# Entity Quick Detail Overlay trong Signapse

Tài liệu này mô tả pattern quick detail hiện hành cho Signapse. Mục tiêu là cho phép người dùng đọc nhanh `event` hoặc `news-article` khi đang làm việc trên các bề mặt phân tích như Graph View và Market Charts, nhưng không biến route detail canonical thành drawer toàn cục.

## Nguyên tắc chính

- `/events/{id}` và `/news-articles/{id}` luôn là full detail page khi user mở link bình thường, reload, paste URL, copy link hoặc đi từ các trang list/detail CRUD.
- Quick detail trong analytical workspace phải là local overlay do chính workspace sở hữu bằng state cục bộ.
- Đóng quick detail chỉ clear state cục bộ; không dùng `router.back()`, `router.push()` hoặc `router.replace()` chỉ để đóng drawer.
- Drawer local có thể cung cấp action "Mở trang đầy đủ" trỏ tới canonical detail URL.
- Không dùng global intercepted route làm default pattern cho quick detail trong repo này.

```text
Graph View / Market Charts
    |
    | click explicit quick-detail action
    v
local state: { kind: "event", id: 123 }
    |
    +-- render local Drawer above current workspace
    |
    +-- close -> clear local state, URL unchanged

Normal link /events/123
    |
    +-- render full event detail page
```

## Khi Nào Nên Dùng

Nên dùng local quick detail khi:

- User đang ở một workspace có context đắt tiền cần giữ lại như graph layout, chart viewport, selected marker, lazy-loaded history hoặc filter state.
- Nội dung detail là lớp đọc phụ, không phải flow chính của màn hình.
- User cần xem nhanh bằng chứng, summary hoặc context trước khi quyết định có mở full page hay không.

Không nên dùng local quick detail khi:

- User đang ở trang list CRUD và click title để đi vào detail.
- Detail page có mutation-heavy actions hoặc layout rộng cần full page.
- Mục tiêu là tạo shareable URL cho trạng thái drawer đang mở.
- Workspace không có state đáng kể cần bảo toàn.

## Route Và State

Pattern được khuyến nghị:

```tsx
const [quickDetailEntity, setQuickDetailEntity] = useState<
  | { kind: "event"; id: number }
  | { kind: "news-article"; id: number }
  | null
>(null)

<LocalEntityQuickDetailDrawer
  entity={quickDetailEntity}
  onClose={() => setQuickDetailEntity(null)}
/>
```

Không khuyến nghị:

```tsx
router.push(`/events/${eventId}`)
// hoặc close drawer bằng router.back()
```

Lý do: route transition có thể remount hoặc reload Server/Client Component phía sau, đặc biệt với chart/graph có dữ liệu và instance đắt tiền.

## Dashboard Row Trigger

Khi một row trên dashboard chỉ có nhiệm vụ mở local quick detail và không cần điều hướng trực tiếp, row nên là container thường; native `<button type="button">` chỉ nên bọc title và được style như một link. Icon, description và metadata không nên là vùng action. Row không giữ canonical `href`; drawer cung cấp action rõ ràng để mở full detail page khi user cần.

Với Latest News, nếu article có `featureImage`, dùng `ItemMedia variant="image"` với URL ưu tiên `urlThumbnail`, `urlMedium`, `urlLarge`, rồi `urlOriginal`; nếu thiếu ảnh thì giữ newspaper icon làm fallback.

## UI Shell

Quick detail overlay nên dùng shadcn primitive đã wrap trong `@/components/ui`, ví dụ `Drawer` hoặc `Sheet` tùy layout đã được proposal chốt. Với các workspace hiện tại, bottom `Drawer` phù hợp vì giữ được bề mặt đọc rộng mà vẫn không rời khỏi canvas/chart.

Local drawer cần có:

- Title rõ ràng theo entity đang đọc.
- Loading state trong drawer body.
- Access denied state trong drawer body.
- Error/not-found state gọn trong drawer body.
- Nội dung focused, không embed full page shell.
- Footer action mở full detail page bằng canonical link.
- Nút đóng chỉ clear local state.

## Nội Dung

Quick detail là reading surface focused, không phải full detail page thu nhỏ.

Event quick detail nên ưu tiên:

- Tiêu đề, trạng thái, mô tả hoặc summary.
- Thời gian chính và confidence nếu có.
- Evidence quan trọng và related articles nếu user có quyền.
- Action mở full event detail page.

News article quick detail nên ưu tiên:

- Tiêu đề, nguồn tin, thời gian publish.
- Mô tả, nội dung/excerpt hoặc source context.
- Linked events nếu user có quyền.
- Action mở full news article detail page.

Không nên đưa vào quick detail:

- Breadcrumb, nút quay lại list, page shell.
- Technical identifiers cấp thấp nếu không hỗ trợ quyết định.
- Mutation-heavy actions vốn thuộc full detail page.
- Placeholder cho roadmap hoặc implementation detail.

## Validation

Khi implement local quick detail, cần kiểm tra:

- Mở drawer không đổi URL workspace hiện tại.
- Đóng drawer không gọi `router.back()` và không làm reload graph/chart.
- Full detail action mở đúng `/events/{id}` hoặc `/news-articles/{id}`.
- Link bình thường tới canonical detail page không bị intercept thành drawer.
- Loading, error, access-denied và missing-entity state nằm trong drawer.
- Focus, ESC, scroll containment và mobile layout vẫn đúng với shadcn primitive.
- Static search không còn active global quick-detail route slot hoặc intercepted quick-detail route nếu không có proposal riêng.

## Quy Ước Cho Proposal Tương Lai

Nếu một feature mới muốn dùng route interception cho quick detail, proposal phải giải thích rõ:

- Vì sao local state không đủ.
- Route interception được scope ở đâu và ảnh hưởng những link nào.
- Cách tránh reload workspace phía sau.
- Cách kiểm soát Back/Forward và direct URL.
- Cách dọn source nếu sau này bỏ pattern.

Mặc định của repo là local workspace quick detail, không phải global intercepted route.
