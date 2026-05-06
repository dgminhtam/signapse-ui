# Entity Quick Detail Overlay với Next.js App Router và shadcn Sheet

Tài liệu này mô tả cách điều chỉnh pattern quick view cho Signapse. Mục tiêu không phải là Product Detail Page cho ecommerce, mà là cho phép người dùng đọc nhanh chi tiết `event` hoặc `news-article` ngay trên các bề mặt phân tích như Graph View và Market Charts.

Pattern cốt lõi:

- Khi người dùng mở một event hoặc bài viết từ Graph View, Market Charts hoặc một analytical workspace được hỗ trợ: URL vẫn đổi sang route detail canonical như `/events/{id}` hoặc `/news-articles/{id}`, nhưng UI có thể hiển thị quick detail bằng `Sheet` trên nền workspace hiện tại.
- Khi người dùng reload, F5, paste link, mở link trực tiếp hoặc share URL: route canonical vẫn render full detail page hiện có.
- Khi đóng quick detail: quay lại workspace trước đó bằng browser history, giữ lại ngữ cảnh biểu đồ, graph, filter hoặc vị trí đọc.

Đây là pattern "một URL, hai cách trình bày theo navigation context". Nó giúp người dùng đọc chứng cứ và diễn giải sự kiện nhanh hơn mà không phải rời khỏi canvas hoặc chart đang phân tích.

## Mục Tiêu UX

Pattern này phù hợp với các màn hình mà ngữ cảnh chính là bề mặt phân tích, không phải bản thân trang detail:

- Graph View: người dùng click node `event` hoặc `news-article` để đọc thêm nội dung nhưng vẫn cần giữ graph layout, spotlight và quan hệ node.
- Market Charts: người dùng click annotation để đọc sự kiện, lập luận phản ứng thị trường và bằng chứng nguồn mà không mất vùng chart đang xem.
- Các workbench tương lai: người dùng đang so sánh dữ liệu dày và cần mở detail như một lớp đọc phụ.

Trải nghiệm mong muốn:

- Click event/article trong graph hoặc chart: URL đổi sang canonical detail URL và `Sheet` mở trên workspace hiện tại.
- Đóng `Sheet`: quay về đúng workspace trước đó bằng `router.back()`.
- Reload khi URL detail đang active: render full detail page.
- Copy URL trong lúc quick detail đang mở: người nhận link vào full detail page.
- Browser Back/Forward hoạt động tự nhiên.

```text
Graph View hoặc Market Charts
    |
    | client navigation từ node hoặc annotation
    v
/events/123 hoặc /news-articles/456
    |
    +-- soft navigation: Quick detail Sheet trên workspace hiện tại
    |
    +-- hard navigation / reload / direct link: Full detail page
```

## Khi Nào Nên Dùng

Nên dùng quick detail overlay khi:

- Người dùng đang ở một bề mặt phân tích có context quan trọng như graph, chart, timeline hoặc workbench.
- Detail giúp người dùng xác nhận quyết định nhanh, ví dụ đọc title, summary, status, confidence, evidence, nguồn tin hoặc phản ứng thị trường.
- Full page vẫn cần tồn tại để xem toàn bộ section, action, metadata kỹ thuật và deep link.

Không nên dùng quick detail overlay khi:

- Màn hình detail là tác vụ chính và user không cần giữ context phía sau.
- Nội dung cần form editing phức tạp hoặc nhiều action phá hủy dữ liệu.
- Overlay chỉ dùng để trang trí nhưng không giảm navigation cost thật sự.
- Entity chưa có route canonical ổn định.

## Entity Scope Ban Đầu

Đợt đầu chỉ nên coi các entity sau là scope chính:

- `event`: mở từ Graph View event node hoặc Market Chart annotation.
- `news-article`: mở từ Graph View news article node hoặc từ evidence/source link khi contract hỗ trợ id rõ ràng.

Các entity sau là future scope:

- `asset`: có thể cần inspector riêng hoặc route detail riêng trước khi quick detail có ý nghĩa.
- `theme`: thường là context/category, chưa chắc cần full detail page.
- `source-document`: chỉ nên thêm khi có route canonical và content shell ổn định.
- Workbench-specific objects như annotation group hoặc graph cluster: nên giữ trong popup/inspector cục bộ, không biến thành route canonical nếu chưa có entity thật.

## Nền Tảng Kỹ Thuật Nên Dùng

Trong Next.js App Router, pattern tương lai nên dùng:

- Intercepting Routes: bắt canonical detail route khi điều hướng client-side từ workspace được hỗ trợ.
- Parallel Routes: giữ workspace hiện tại trong `children` và render quick detail ở slot song song.
- shadcn `Sheet`: dùng right-side Sheet làm reading overlay cho admin dashboard.
- Shared detail content: tách nội dung detail khỏi page shell để full page và quick detail không bị lệch dữ liệu.

Repo hiện tại đã có `components/ui/sheet.tsx`, vì vậy tài liệu này khuyến nghị `Sheet` trước. Không dùng import từ workspace UI khác và không cần cài thêm Drawer chỉ cho pattern này.

Nguồn tham khảo:

- [Next.js Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)
- [Next.js Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
- [shadcn/ui Sheet](https://ui.shadcn.com/docs/components/sheet)

## Kiến Trúc Route Đề Xuất Cho Tương Lai

Nếu triển khai, nên ưu tiên một shared slot ở route group `(main)` để nhiều workspace có thể dùng cùng quick detail model:

```text
app/
  (main)/
    layout.tsx
    @quickDetail/
      default.tsx
      (.)events/
        [id]/
          page.tsx
      (.)news-articles/
        [id]/
          page.tsx
    events/
      [id]/
        page.tsx
    news-articles/
      [id]/
        page.tsx
    graph-view/
      page.tsx
    market-charts/
      page.tsx
```

Ý nghĩa:

- `events/[id]/page.tsx`: canonical full detail page của event.
- `news-articles/[id]/page.tsx`: canonical full detail page của bài viết.
- `@quickDetail/(.)events/[id]/page.tsx`: quick detail route khi client navigation mở event từ workspace hiện tại.
- `@quickDetail/(.)news-articles/[id]/page.tsx`: quick detail route khi client navigation mở bài viết từ workspace hiện tại.
- `@quickDetail/default.tsx`: render `null` khi không có quick detail active.
- `(main)/layout.tsx`: render song song `{children}` và `{quickDetail}`.

Ví dụ shape tương lai:

```tsx
// app/(main)/layout.tsx
export default function MainLayout({
  children,
  quickDetail,
}: {
  children: React.ReactNode
  quickDetail: React.ReactNode
}) {
  return (
    <>
      {children}
      {quickDetail}
    </>
  )
}
```

```tsx
// app/(main)/@quickDetail/default.tsx
export default function Default() {
  return null
}
```

Lưu ý: đây là hướng dẫn kiến trúc cho proposal triển khai sau này, không phải phần đã được implement bởi tài liệu này.

## Luồng Dữ Liệu

Nên có fetch detail duy nhất cho mỗi entity:

```text
getEventById(id)
    |
    +-- app/(main)/events/[id]/page.tsx
    |      -> EventDetailPageShell
    |
    +-- app/(main)/@quickDetail/(.)events/[id]/page.tsx
           -> EventQuickDetailSheet

getNewsArticleById(id)
    |
    +-- app/(main)/news-articles/[id]/page.tsx
    |      -> NewsArticleDetailPageShell
    |
    +-- app/(main)/@quickDetail/(.)news-articles/[id]/page.tsx
           -> NewsArticleQuickDetailSheet
```

Nội dung detail nên được tách khỏi page shell:

```text
EventDetailContent
NewsArticleDetailContent
  props: entity data, mode
  contains:
    title
    status
    summary/description
    timestamps
    confidence
    evidence
    linked entities
    source links

Full page shell:
  breadcrumb context
  back button
  full action set
  full metadata and technical panels

Quick detail Sheet shell:
  compact header
  scrollable reading body
  focused evidence and summary
  footer action: Mở trang đầy đủ
```

Không nên render nguyên full page vào Sheet. Full page thường có breadcrumb, back button, nhiều action và section kỹ thuật, dễ làm quick detail nặng và khó đọc.

## Summary Surface Và Reading Surface

Graph node inspector và Market Chart annotation popup không nên trở thành full detail mini page. Chúng nên giữ vai trò summary surface:

- Cho biết user đang chọn node/annotation nào.
- Hiển thị title, status, timestamp, confidence, relation count hoặc evidence ngắn.
- Giúp user quyết định có cần mở quick detail hay không.

Quick detail Sheet là reading surface:

- Đủ rộng để đọc event/article summary, evidence, reasoning và source context.
- Có scroll riêng, không tranh scroll với canvas/chart phía sau.
- Có link mở full detail page khi cần action hoặc metadata đầy đủ.

Full detail page là workspace đầy đủ:

- Dùng cho direct link, reload, share URL.
- Chứa toàn bộ section, action, technical metadata và flow quản trị.
- Không phụ thuộc vào việc user đến từ graph/chart hay không.

```text
Marker hoặc node
  -> Summary popup / inspector
      -> Quick detail Sheet
          -> Full detail page
```

## Link Từ Graph View Và Market Charts

Link phải trỏ đến route canonical, không trỏ đến route overlay riêng:

```tsx
<Link href={`/events/${eventId}`}>Xem sự kiện</Link>
```

```tsx
<Link href={`/news-articles/${articleId}`}>Xem bài viết</Link>
```

Quick detail là cách Next.js render route đó trong bối cảnh soft navigation, không phải URL riêng.

Trong Graph View:

- Node `event:{id}` có thể mở `/events/{id}`.
- Node `news-article:{id}` có thể mở `/news-articles/{id}`.
- Node `asset` và `theme` chưa thuộc scope quick detail ban đầu.

Trong Market Charts:

- Annotation có `eventId` hoặc `links.eventDetail` nội bộ có thể mở event canonical URL.
- Evidence chỉ nên mở news article quick detail khi contract có id canonical rõ ràng.
- External source URL vẫn mở tab mới nếu đó là nguồn gốc bên ngoài.

## Đóng Sheet Và Browser History

Đóng quick detail nên gọi `router.back()` thay vì `router.push("/graph-view")` hoặc `router.push("/market-charts")`.

Lý do:

- Nếu user mở từ Graph View, Back đưa về đúng graph context trước đó.
- Nếu user mở từ Market Charts, Back giữ đúng asset, timeframe, annotation state hoặc query hiện tại.
- Browser Back và nút đóng Sheet có cùng mental model.
- Browser Forward có thể mở lại detail theo lịch sử navigation.

Cần tránh tạo fallback route tùy tiện trong Sheet. Pattern chuẩn là hard navigation vào full detail page, còn Sheet chỉ xuất hiện khi có soft navigation từ workspace được hỗ trợ.

## UI Shell Khuyến Nghị

Quick detail nên dùng right-side `Sheet`:

- Desktop: `side="right"`, width đủ rộng để đọc, ví dụ `sm:max-w-xl` hoặc `sm:max-w-2xl` tùy mật độ content.
- Mobile: Sheet có thể chiếm gần full width và scroll nội dung bên trong.
- Header: có `SheetTitle` rõ ràng theo entity title, `SheetDescription` chỉ dùng khi có ngữ cảnh bổ sung thật.
- Body: scroll riêng, ưu tiên title, status, summary, evidence và links.
- Footer: có action phụ như `Mở trang đầy đủ`, không nhồi toàn bộ action quản trị nếu không cần.

Ví dụ shell tương lai:

```tsx
"use client"

import { useRouter } from "next/navigation"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function EventQuickDetailSheet({ event }: { event: EventDetail }) {
  const router = useRouter()

  return (
    <Sheet open onOpenChange={(open) => !open && router.back()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>{event.title}</SheetTitle>
          <SheetDescription>Chi tiết sự kiện từ bề mặt phân tích hiện tại.</SheetDescription>
        </SheetHeader>

        <EventDetailContent event={event} mode="quick-detail" />

        <SheetFooter className="border-t">
          <Button asChild variant="outline">
            <a href={`/events/${event.id}`}>Mở trang đầy đủ</a>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
```

Ví dụ trên chỉ minh họa pattern. Khi triển khai thật, cần dùng `Link` hoặc navigation phù hợp với yêu cầu giữ/thoát overlay của flow cụ thể.

## Nội Dung Nên Có Trong Quick Detail

Quick detail nên ưu tiên thông tin giúp user hiểu và quyết định nhanh:

- Entity title.
- Status hoặc lifecycle chính.
- Summary hoặc description ngắn.
- Occurred/published timestamp.
- Confidence nếu có.
- Evidence quan trọng nhất.
- Source outlet hoặc source URL.
- Relation với asset/theme/event/article liên quan.
- Market reaction reasoning nếu đến từ annotation.
- Action `Mở trang đầy đủ`.

Thông tin nên để ở full detail page:

- Technical metadata dày như id, slug, canonical key, created/modified date.
- Toàn bộ action quản trị nếu chúng làm Sheet quá nặng.
- Section dài như toàn bộ evidence history, enrichment log, debug/operator detail.
- Form chỉnh sửa hoặc action phá hủy dữ liệu.

## State Cần Xử Lý Khi Triển Khai Sau Này

Quick detail route nên có state riêng:

- Loading: skeleton trong Sheet, không làm nhảy graph/chart phía sau.
- Error: message ngắn, có action đóng Sheet hoặc mở full page nếu phù hợp.
- Not found: dùng `notFound()` hoặc empty/error surface tùy chiến lược route.
- Permission denied: dùng treatment tương đương `AccessDenied`, nhưng gọn trong Sheet.
- Source external: link mở tab mới với `rel="noreferrer"` hoặc `noopener noreferrer`.

Với shadcn, ưu tiên:

- `Sheet` cho overlay.
- `Skeleton` cho loading.
- `Empty` cho empty/not found khi không dùng `notFound()`.
- `Button` với `Spinner` và `disabled` cho action pending.
- Semantic tokens như `bg-background`, `text-muted-foreground`, `border-border`, `bg-card`.

## Accessibility Checklist

- Sheet có accessible title bằng `SheetTitle`.
- Nếu title visually hidden thì dùng `sr-only`, không bỏ title.
- Nút đóng có label rõ ràng.
- Focus được trap trong Sheet.
- ESC đóng Sheet.
- Body Sheet có vùng scroll rõ ràng, không tranh scroll với chart/canvas.
- Link external nói rõ mở nguồn bên ngoài khi cần.
- Loading state không làm mất focus hoặc đổi layout mạnh.
- Nội dung dài có heading hierarchy rõ ràng.

## Performance Và Data

- Fetch detail nên diễn ra ở Server Component route để tránh client waterfall nếu dùng intercepted route.
- Nếu graph/chart đã có summary, vẫn nên fetch detail riêng cho quick detail vì nội dung đọc cần đầy đủ và đúng quyền.
- Link canonical có thể tận dụng prefetch mặc định của Next.js nếu phù hợp.
- Nếu detail API chậm, thêm `loading.tsx` trong slot `@quickDetail`.
- Không load nội dung bài viết/event đầy đủ cho mọi marker/node từ đầu chỉ để quick detail mở nhanh. Cách đó dễ làm graph/chart nặng.

## Scope Không Triển Khai Trong Tài Liệu Này

Tài liệu này chỉ mô tả pattern và định hướng. Nó không triển khai:

- Route `app/(main)/@quickDetail`.
- Intercepted routes cho `events` hoặc `news-articles`.
- Shared detail content components.
- Quick detail `Sheet` trong app code.
- API mới hoặc contract backend mới.
- Refactor Graph View hoặc Market Charts.
- Cài thêm shadcn Drawer hoặc chỉnh sửa `components/ui`.

Các phần trên cần proposal triển khai riêng nếu muốn build.

## Checklist Triển Khai Tương Lai

- [ ] Xác nhận entity scope: `event`, `news-article` hoặc thêm entity khác.
- [ ] Tách `EventDetailContent` khỏi full page shell.
- [ ] Tách `NewsArticleDetailContent` khỏi full page shell.
- [ ] Tạo `app/(main)/@quickDetail/default.tsx`.
- [ ] Tạo intercepted route cho `events/[id]` trong slot quick detail.
- [ ] Tạo intercepted route cho `news-articles/[id]` trong slot quick detail.
- [ ] Render `{quickDetail}` trong `(main)/layout.tsx`.
- [ ] Cập nhật Graph View node action để link đến route canonical.
- [ ] Cập nhật Market Chart annotation action để link đến route canonical.
- [ ] Đảm bảo Sheet đóng bằng `router.back()`.
- [ ] Kiểm tra soft navigation mở Sheet và giữ graph/chart context.
- [ ] Kiểm tra reload/direct URL vào full detail page.
- [ ] Kiểm tra copy URL và mở ở tab mới.
- [ ] Kiểm tra browser Back/Forward.
- [ ] Kiểm tra focus trap, ESC, scroll containment và mobile layout.
- [ ] Kiểm tra loading, error, not found và permission denied state.

## Kết Luận

Với Signapse, quick detail overlay nên được xem là một lớp đọc phụ cho analytical workspace:

```text
Same URL: /events/{id} hoặc /news-articles/{id}

Soft navigation từ Graph View / Market Charts
  -> Intercepted route
  -> Quick detail Sheet

Hard navigation / reload / shared link
  -> Normal route
  -> Full detail page
```

Hướng này giúp người dùng đọc chi tiết event hoặc bài viết ngay trong luồng phân tích, nhưng vẫn giữ URL thật, browser history thật và full detail page thật.
