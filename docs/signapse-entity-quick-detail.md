# Entity Quick Detail Overlay trong Signapse

Tài liệu này mô tả pattern quick detail hiện hành cho Signapse. Mục tiêu là cho phép người dùng đọc nhanh `event` hoặc `news-article` từ Dashboard, Graph View và Market Charts, nhưng không biến route detail canonical thành drawer toàn cục.

## Nguyên tắc chính

- `/events/{id}` và `/news-articles/{id}` luôn là full detail page khi user mở link bình thường, reload, paste URL, copy link hoặc đi từ các trang list/detail CRUD.
- Quick detail trong approved owner surface phải là local overlay do chính owner sở hữu bằng state cục bộ.
- Đóng quick detail chỉ clear state cục bộ; không dùng `router.back()`, `router.push()` hoặc `router.replace()` chỉ để đóng drawer.
- Drawer local cung cấp action "Mở trang đầy đủ" trỏ tới canonical detail URL cho cả Event inspection và Article reader.
- Không dùng global intercepted route làm default pattern cho quick detail trong repo này.

```text
Dashboard / Graph View / Market Charts
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

- User đang ở Dashboard hoặc một workspace có context đắt tiền cần giữ lại như graph layout, chart viewport, selected marker, lazy-loaded history hoặc filter state.
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

Khi một row trên dashboard chỉ có nhiệm vụ mở local quick detail và không cần điều hướng trực tiếp, row nên là container thường; native `<button type="button">` chỉ nên bọc title và được style như một link. Icon, description và metadata không nên là vùng action. Row không giữ canonical `href`; sticky header của mỗi profile cung cấp action rõ ràng để mở full detail page khi user cần.

Với Latest News, nếu article có `featureImage`, dùng `ItemMedia variant="image"` với URL ưu tiên `urlThumbnail`, `urlMedium`, `urlLarge`, rồi `urlOriginal`; nếu thiếu ảnh thì giữ newspaper icon làm fallback.

## UI Shell

Quick detail overlay dùng shadcn primitive đã wrap trong `@/components/ui`; policy thuộc composition dùng chung, không thêm mode hoặc chrome vào primitive. `event` luôn resolve thành **Event inspection**; `news-article` luôn resolve thành **Article reader**. Caller không tự chọn mode, direction hay width.

| Effective CSS viewport | Event inspection | Article reader |
| --- | --- | --- |
| Mọi owner được chấp thuận từ `1440px` | right-side sheet bám viewport, tối đa `32rem`, cao `100dvh` | right-side sheet bám viewport, tối đa `44rem`, cao `100dvh` |
| Mọi owner được chấp thuận từ `768px` đến dưới `1440px` | bottom sheet, content-fit, `max-height: min(60dvh, 36rem)` | bottom sheet, `height: min(72dvh, 48rem)` |
| Mọi owner dưới `768px` | bottom sheet, content-fit, tối đa `90dvh` | bottom sheet, cao `90dvh` |

Wide-desktop side sheet của mọi owner được chấp thuận bám cạnh phải viewport overlay đang hoạt động, không bị giới hạn bởi cột Latest News/Event Timeline hay canvas grid và không đổi mode khi sidebar mở/thu gọn. Graph View và Market Charts vẫn giữ context nền; Market Charts fullscreen phải portal overlay vào fullscreen container mà không tự thoát fullscreen.

Local quick detail cần có:

- Modal sticky header: localized entity/state title, Close thấy được và canonical action “Mở trang đầy đủ” trong cùng tab. Không thêm profile prefix hoặc generic description chỉ để lặp context; không dùng sticky footer để lặp action.
- Một body scroll duy nhất; loading, access denied, error/not-found nằm trong cùng profile/placement và skeleton mirror layout resolved.
- Khi mở, focus vào Close; Close, Escape, backdrop desktop hoặc swipe-down bottom sheet mobile đóng bằng cách clear local state và trả focus về trigger.
- Resize/zoom re-resolve placement theo effective CSS viewport, giữ entity/focus/scroll, không replay opening motion và tôn trọng `prefers-reduced-motion`.
- Dữ liệu là snapshot trong một lần mở; không tự refetch/reflow giữa lúc người dùng đọc. Mở lại hoặc retry mới lấy dữ liệu mới.

## Nội Dung

Quick detail là reading surface focused, không phải full detail page thu nhỏ.

Event quick detail nên ưu tiên:

- Tiêu đề, trạng thái, mô tả hoặc summary.
- Thời gian chính và confidence nếu có.
- Tối đa bốn evidence và bốn related assets.
- Action mở full event detail page.

Khi Event inspection ở bottom sheet, cụm facts/evidence/assets có `max-width: 64rem` và căn giữa. Click news evidence đi tới canonical News page cùng tab, không mở Article reader lồng bên trong Event inspection.

News article quick detail nên ưu tiên:

- Tiêu đề, nguồn tin, thời gian publish.
- Mô tả, nội dung đầy đủ và source context.
- Action mở full news article detail page.
- Link tới nguồn bài viết nếu có.

Article prose luôn có `max-width: 72ch`. Image/media có thể rộng theo panel; table, code hoặc content intrinsically wide chỉ scroll trong surface chủ đích. Original source là link provenance thứ cấp, không thay thế canonical action. Không đưa linked-event review vào Article reader.

Không nên đưa vào quick detail:

- Breadcrumb, nút quay lại list, page shell.
- Technical identifiers cấp thấp nếu không hỗ trợ quyết định.
- Mutation-heavy actions vốn thuộc full detail page.
- Placeholder cho roadmap hoặc implementation detail.

## Validation

Khi implement local quick detail, cần kiểm tra:

- Mở drawer không đổi URL workspace hiện tại.
- Đóng drawer không gọi `router.back()` và không làm reload graph/chart.
- Canonical action mở đúng `/events/{id}` hoặc `/news-articles/{id}` theo entity.
- Link bình thường tới canonical detail page không bị intercept thành drawer.
- Loading, error, access-denied và missing-entity state nằm trong drawer.
- Focus, ESC, scroll containment và mobile layout vẫn đúng với shadcn primitive.
- Profile resolver đúng (`event` → Event inspection, `news-article` → Article reader), placement đúng tại `767px`, `768px`, `1439px`, `1440px`, desktop rộng và zoom `200%`.
- Header có accessible entity/state title, Close thấy được, canonical action và không có generic description; state loading công bố busy và error/access denied được thông báo rõ.
- Không có nested quick detail, quick-detail back-stack hoặc auto refresh thay nội dung trong một lần đọc.
- Static search không còn active global quick-detail route slot hoặc intercepted quick-detail route nếu không có proposal riêng.

## Quy Ước Cho Proposal Tương Lai

Nếu một feature mới muốn dùng route interception cho quick detail, proposal phải giải thích rõ:

- Vì sao local state không đủ.
- Route interception được scope ở đâu và ảnh hưởng những link nào.
- Cách tránh reload workspace phía sau.
- Cách kiểm soát Back/Forward và direct URL.
- Cách dọn source nếu sau này bỏ pattern.

Mặc định của repo là local workspace quick detail, không phải global intercepted route.
