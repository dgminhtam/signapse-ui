# AGENTS.md

Tài liệu này cung cấp hướng dẫn cho Codex khi làm việc trong repository này.

## Lệnh

Sử dụng slash command: `/dev`, `/build`, `/lint`, `/format`, `/typecheck`

Để chạy production server: `pnpm start`

## Kiến trúc

Đây là dashboard quản trị dùng **Next.js 16 App Router** cho hệ thống tín hiệu giao dịch có tích hợp AI.

- **Xác thực:** Clerk, đính kèm JWT qua `fetchAuthenticated()`
- **UI:** shadcn/ui từ `@/components/ui/`, Tailwind CSS v4, Lucide icons, Inter font và Geist Mono
- **Toast:** chỉ dùng `sonner`, không dùng `alert()`
- **Validation:** Zod v4 cho validation frontend và mapping DTO backend

### Nhóm route

- `app/(main)/`: route được bảo vệ, `layout.tsx` kiểm tra Clerk auth ở server
- `app/(auth)/`: các trang đăng nhập Clerk
- `app/api/[feature]/action.ts`: server actions theo từng feature

### Quy ước cấu trúc thư mục feature

Mỗi feature nên nằm trọn trong thư mục riêng:

```text
app/(main)/[feature]/
├── page.tsx              # Server Component: cardless workspace + Suspense boundary
├── [id]/page.tsx         # Trang chi tiết: cardless workspace + nút quay lại chuẩn
├── error.tsx             # Local error boundary
├── [feature]-list.tsx    # Client Component: bảng/danh sách + toolbar
├── [feature]-form.tsx    # Client Component: form tạo mới/chỉnh sửa
└── [feature]-search.tsx  # Client Component: ô tìm kiếm debounce
```

### Quản lý state

- Giữ filter, search, sort và pagination trên URL
- Dùng query params `page` và `size` cho phân trang
- URL là 1-indexed, backend là 0-indexed
- Dùng `useTransition` với `router.push()` hoặc `router.replace()` khi cập nhật URL
- Ô tìm kiếm phải dùng `use-debounce` với `300ms`

### Quy ước search list

- Mỗi trang danh sách có search phải đặt search trong component `[feature]-search.tsx` cùng thư mục feature
- Search mặc định là live search dùng `use-debounce` với `300ms`, không thêm nút `Tìm kiếm` nếu không có yêu cầu nghiệp vụ riêng
- Search phải dùng controlled input, khởi tạo từ `useSearchParams()` và đồng bộ lại khi query param thay đổi; không dùng `defaultValue` cho list search
- Khi thay đổi search, luôn reset `page` về `1`
- Khi cập nhật URL từ search, dùng `startTransition()` với `router.replace()`
- Giá trị search phải được `trim()` trước khi ghi lên URL; nếu rỗng sau khi trim thì phải xóa query param tương ứng
- Search input phải có `type="search"`, `id` và `label` dạng `sr-only`
- Search phải hiển thị `<Spinner>` inline trong lúc pending route transition
- Nếu search theo nhiều field, khai báo query key thành hằng số cục bộ rõ nghĩa trong file search
- Search trên trang danh sách phải dùng wrapper responsive thống nhất `w-full sm:w-80 lg:w-96`: mobile chiếm đủ chiều ngang toolbar, desktop giữ độ rộng đồng đều; không dùng tự phát `max-w-sm` hoặc `flex-1 shrink-0` làm search dài/ngắn lệch giữa các màn
- Search trong toolbar danh sách phải nằm ở vùng leading cùng action chính; các view controls như filter tĩnh, sort và page size nằm ở vùng trailing, ưu tiên dùng `AppListToolbar`, `AppListToolbarLeading` và `AppListToolbarTrailing`
- Không tạo shared component search list mặc định; ưu tiên component cục bộ nhưng hành vi phải thống nhất theo các quy ước này

## Quy tắc phát triển

`AGENTS.md` là file hướng dẫn repo-wide đang hoạt động duy nhất. Kiến thức tái sử dụng theo tác vụ phải nằm trong `.codex/skills`.

- Chỉ giữ skill thật sự sát stack và workflow của Signapse trong `.codex/skills`
- Không duy trì bộ skill vendor/community quá rộng nếu chúng không giúp Codex làm việc tốt hơn trong repo này

### Guardrail triển khai

- Trước thay đổi không tầm thường, khóa scope bằng mục tiêu, giả định, non-goals và tiêu chí hoàn thành rõ ràng.
- Ưu tiên giải pháp đơn giản nhất đủ yêu cầu; không tạo abstraction, cấu hình hoặc luồng dự phòng khi chưa có nhu cầu rõ.
- Chỉnh sửa phẫu thuật: chỉ sửa file liên quan trực tiếp, bám style hiện có và không dọn code ngoài scope.
- Khi thay thế thư viện/vendor UI hoặc chart engine, migration phải xóa sạch source cũ không còn dùng: dependency trong package/lockfile, import/type/helper, adapter, attribution/vendor copy, OpenSpec/docs reference đang active và dead component tạm thời; không giữ code legacy bị disable eslint nếu không có compatibility path đang chạy thật.
- Kết thúc bằng kiểm chứng phù hợp như lint, typecheck, test hoặc smoke test; nếu chưa chạy được thì nói rõ lý do.

### Core components

- `components.json` và các file trong `@/components/ui/` dùng shadcn preset `radix-nova` làm baseline chính thức (`base=radix`, `baseColor=neutral`, `iconLibrary=lucide`)
- Không tự chỉnh visual chrome trong `@/components/ui/`; khi cần đồng bộ wrapper shadcn phải dùng workflow `pnpm dlx shadcn@latest add ... --dry-run` và `--diff`, rồi sync theo preset hoặc proposal wrapper rõ ràng
- Nếu có lỗi như hydration mismatch hoặc layout bug, hãy sửa ở nơi sử dụng như `app-sidebar.tsx`, không sửa bên trong wrapper shadcn chỉ để xử lý bug của app
- Với component shadcn phức tạp như `sidebar.tsx`, không patch thủ công cho nhu cầu cục bộ; chỉ sync theo preset shadcn hoặc thay đổi qua proposal có scope rõ

### Gọi API

- Luôn dùng `fetchAuthenticated()` cho endpoint cần Clerk JWT
- Luôn đọc `response.text()` trước khi `JSON.parse()` để tránh crash khi backend trả về rỗng hoặc malformed

### Quy ước UI

- Dùng `@/components/ui/` cho shadcn primitives
- App code và feature code chỉ được dùng component shadcn đã bọc trong `@/components/ui/`; không import trực tiếp primitive gốc như `radix-ui`, `vaul` hoặc thư viện UI nền khi đã có hoặc có thể bổ sung component shadcn tương ứng
- Import primitive gốc chỉ được phép bên trong file wrapper shadcn ở `components/ui/*`; các màn hình, feature component và shared app component phải compose qua wrapper shadcn
- Không tự ý cài thêm thư viện UI bên ngoài cho nhu cầu component chuẩn; chỉ được thêm khi có proposal hoặc quyết định rõ ràng của người dùng giải thích vì sao shadcn không đáp ứng được
- Khi thêm, sửa, debug, style hoặc compose shadcn component, bắt buộc tham khảo skill `.codex/skills/shadcn` và kiểm tra docs shadcn tương ứng trước khi implement
- Feature/shared app code phải dùng default chrome của shadcn `radix-nova`; không thêm `h-*`, `min-h-*`, `rounded-*`, padding, text color, background, border, ring, shadow hoặc typography class lên shadcn primitives chỉ để đổi height, radius, màu, viền hoặc mật độ mặc định
- `className` trên shadcn primitives chỉ nên dùng cho layout thật sự như width, max-width, flex/grid, gap, alignment, max-height, overflow, truncate hoặc responsive constraints; không dùng để tái tạo chrome mà wrapper shadcn đã sở hữu
- Khi cần compact control, ưu tiên variant/size có sẵn của shadcn; chỉ hard-code height/radius khi không có size/variant phù hợp và có lý do sản phẩm rõ ràng
- Dùng relative import như `./component-name` cho component nằm cùng feature
- Ưu tiên `gap-*` trong layout `flex` hoặc `grid`, không dùng `space-y-*`
- Empty state phải dùng component `<Empty>`
- Icon bên trong button phải dùng `data-icon="inline-start"`
- `SelectItem` phải nằm trong `SelectGroup`
- `DropdownMenuItem` phải nằm trong `DropdownMenuGroup`
- Time metadata hiển thị trên list, detail, drawer hoặc supporting panel phải dùng treatment phụ: luôn có icon inline `size-3`, typography tương đương `text-xs text-muted-foreground tabular-nums`; không dùng `font-medium`, foreground/card value styling hoặc `Badge` cho timestamp thuần nếu timestamp không phải tín hiệu nghiệp vụ.

### Quy ước theme

- Theme token trong `app/globals.css` và `tailwind.baseColor` trong `components.json` phải lấy shadcn `radix-nova` neutral default làm baseline; không tự pha token global/sidebar để sửa một vấn đề cục bộ nếu chưa có proposal riêng
- Khi cần tăng hierarchy, density hoặc spacing cho app-level surface cụ thể, ưu tiên composition/layout class ở nơi sử dụng hoặc shared app-level surface; không silently đổi `--primary`, `--accent`, `--sidebar-*`, chart tokens hoặc wrapper chrome làm lệch baseline shadcn `radix-nova`

### Quy ước sidebar

- Sidebar active item thật, tức item đại diện cho màn hình hiện tại, dùng `sidebar-primary` và `sidebar-primary-foreground`; `sidebar-primary` phải neutral-consistent với theme hiện tại, không dùng màu preset xanh/tím không liên quan đến visual baseline
- Sidebar hover dùng `sidebar-accent` và `sidebar-accent-foreground` để là feedback nhẹ, không tranh với active state
- Sidebar focus-visible giữ `sidebar-ring`; focus là accessibility state, không trộn với selected/current state
- Sidebar parent đang mở hoặc parent có child active dùng `sidebar-accent` context treatment và font/chevron emphasis nếu cần; parent không dùng màu mạnh hơn child item đang là màn hình hiện tại
- Không thêm custom active color token, không dùng global `accent`, và không silently đổi `--sidebar-*` để sửa một vấn đề cục bộ nếu chưa có proposal riêng
- Sidebar item density được xử lý ở `AppSidebar`: parent/top-level row và child row dùng height đồng bộ với input chuẩn khi cần tăng readability
- Child list trong sidebar giữ left indent rõ ràng, mở rộng hợp lý về bên phải, và dùng `py-1` để có khoảng thở mà không tạo gap quá lớn giữa parent và children

### Bố cục trang chuẩn

- Trang trong `app/(main)` dùng cardless workspace theo padding của layout cha; không bọc toàn bộ page bằng main `<Card>` chỉ để lặp lại breadcrumb title
- Breadcrumb trong app header là page identity chính cho các trang đơn giản; nếu breadcrumb label lệch với tên màn hình thì sửa breadcrumb mapping thay vì thêm heading trùng lặp
- Chỉ dùng `<Card>` cho inner surface có ranh giới thật như form section, detail panel, dashboard tile, access-denied/error panel hoặc repeated item
- Trang danh sách render trực tiếp shared toolbar, table và pagination surfaces; không thêm main `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>` và `<Separator />` bao ngoài
- Trang chi tiết phải có nút quay lại phía trên nội dung chính; các panel bên trong có thể dùng `<Card>` khi giúp nhóm dữ liệu rõ hơn

### Tối giản nội dung màn hình

- Mỗi màn hình chỉ nên hiển thị text giúp người dùng ra quyết định hoặc hoàn thành tác vụ; không thêm mô tả chỉ để giải thích lại điều đã rõ qua breadcrumb, label, control hoặc dữ liệu.
- Không lặp lại page identity trong body bằng heading/hero paragraph nếu breadcrumb/app header đã đủ rõ, trừ dashboard hoặc landing surface thật sự cần narrative riêng.
- Tránh badge trang trí như loại surface, tên kỹ thuật hoặc trạng thái hiển nhiên nếu chúng không thay đổi quyết định của user; badge nên biểu thị trạng thái, phạm vi, permission, loại dữ liệu hoặc tín hiệu scan có giá trị.
- `CardDescription` chỉ dùng khi description bổ sung ngữ cảnh không suy ra được từ title/metric; không viết mô tả kiểu "Snapshot...", "Danh sách...", "Thông tin..." nếu nội dung card đã tự nói rõ.
- Các màn hình dữ liệu dày như chart, graph, dashboard hoặc workbench phải ưu tiên controls và dữ liệu chính lên trước; copy dài, implementation detail, roadmap/future feature và legal/vendor note nên chuyển thành tooltip, help text nhỏ, footer legal hoặc tài liệu riêng.
- Không render panel placeholder cho tính năng tương lai trong main workspace nếu chưa có dữ liệu/action thật; chỉ giữ tín hiệu nhỏ hoặc empty state khi nó trực tiếp giúp user hiểu vì sao dữ liệu vắng mặt.
- Copy kỹ thuật như backend contract, provider bridge, `from/to`, dependency chart library hoặc DTO chỉ xuất hiện khi cần cho lỗi, empty state, debug/operator context hoặc attribution compliance.
- Attribution của thư viện/vendor có yêu cầu giấy phép không được xóa im lặng; nếu bỏ logo hoặc attribution inline khỏi bề mặt chính, phải thay bằng notice/link ở vị trí người dùng truy cập được.

### Bố cục màn hình tạo mới và chỉnh sửa

- Màn hình create/update đang active phải dùng focused form shell qua shared component ngoài `components/ui`, không render form trần trực tiếp trên workspace
- Focused form shell là inner task surface có `rounded-xl`, border, `bg-card`, header gọn, body field và footer action zone; không phải main Card shell lặp lại breadcrumb title
- Header trong form shell mô tả tác vụ cụ thể như tạo mới hoặc chỉnh sửa; breadcrumb vẫn là page identity chính
- Màn create và edit không được dùng chung một submit-owning form component; mỗi flow phải có form container riêng như `[feature]-create-form.tsx` và `[feature]-update-form.tsx`, không branch bằng `initialData`, `mode` hoặc `isEdit`
- Chỉ được share field primitive/helper không phụ thuộc mode nếu helper đó không sở hữu submit, không chứa footer action, không gọi mutation và không branch create/edit
- Body form dùng `FieldGroup`, `FieldSet` và `gap-*` nhất quán; không lồng thêm `Card` chỉ để lấy border, radius hoặc clipping cho từng section
- Footer form phải chứa action chính và action phụ, tách khỏi body bằng border/subtle background; không để submit/cancel trong ad hoc action row sau `Separator`
- Với page-level focused form, footer action có thể căn trái khi giúp primary/cancel action tiếp nối cùng trục đọc với field; không đổi default shared footer chỉ vì một màn cần căn trái.
- Chọn width có chủ đích: form đơn giản dùng `max-w-xl`, form CRUD phổ biến dùng `max-w-2xl`, form URL-heavy hoặc form dày/editor/prompt/API key/model picker dùng `max-w-3xl`; không kéo form full-width nếu chưa có lý do layout mạnh hơn.
- Form create có action hủy an toàn như quay về danh sách hoặc reset theo flow hiện có; form update phải có nút Hủy `variant="ghost"` reset về dữ liệu ban đầu hoặc luồng an toàn tương đương
- Switch boolean trong màn create/update/detail phải dùng treatment field compact: label hierarchy như field thường, switch căn phải hoặc cùng hàng hợp lý, description chỉ giữ khi giải thích hậu quả/phạm vi không hiển nhiên; không dùng nested Card hoặc block `p-4` chỉ để bọc một switch.
- Rule form/detail switch này không áp cho switch capsule trong row list/table, toolbar/workbench toggle, dialog permission matrix hoặc route row switch vì đó là các ngữ cảnh density riêng.
- Skeleton hoặc Suspense fallback của create/update phải mirror form shell gồm header, body và footer để tránh layout shift

### Bố cục toolbar

- Bên trái: action chính như Tạo mới/Crawl và ô tìm kiếm
- Bên phải: cụm view controls như filter tĩnh, sort và số mục mỗi trang
- Page size selector thuộc cụm controls bên phải, không đặt lại trong footer phân trang
- Dùng `flex-col sm:flex-row sm:justify-between` để responsive
- Primary controls trong toolbar danh sách như search input, action chính, sort select và page size select phải dùng size/chrome mặc định của shadcn `radix-nova` primitives (`Input`, `Button`, `SelectTrigger`); không tự thêm `h-*`, `min-h-*`, `rounded-*`, padding hoặc `size="sm"` chỉ để chỉnh chiều cao, radius hay mật độ
- Sort select và page size select trong toolbar dùng disable-only pending feedback khi URL transition đang chạy; không render `<Spinner>` bên trong trigger hoặc bên cạnh select vì đây là view control phụ và có thể làm rối/shift layout
- Page size selector của list dùng options chuẩn `10`, `20`, `50`, `100` và default `10`; chỉ override khi có lý do sản phẩm rõ ràng
- Wrapper toolbar chỉ quản layout nội bộ, gap, alignment và responsive width; không bọc thêm card/chrome hoặc padding riêng làm lệch chiều cao so với search input
- `AppListToolbar` không sở hữu margin ngoài phía dưới; khoảng cách từ toolbar/search controls đến bảng thuộc về `AppListTable` qua `mt-4`
- Compact size vẫn được phép cho row actions, icon-only buttons, dialog controls và pagination navigation vì đây là các ngữ cảnh density riêng, không cần bằng chiều cao search toolbar

### Bề mặt bảng danh sách

- Trang list dùng bảng phải bọc phần table trong shared surface ngoài `components/ui`, không lồng thêm `Card` chỉ để lấy border, radius hoặc clipping
- Shared table surface `AppListTable` sở hữu khoảng cách mặc định phía trên bằng `mt-4`, để nhịp toolbar -> table và table -> pagination đều là 16px
- Nếu `AppListTable` xuất hiện trong ngữ cảnh không có toolbar/list controls phía trước và top spacing là sai, chỉ override cục bộ bằng `className="mt-0"` sau khi có lý do layout rõ ràng
- Header của bảng list phải dùng cùng một treatment nền, border và bo góc thông qua shared table surface; không tự pha trộn kiểu `plain`, `bg-muted` và shell riêng theo từng page
- Empty state trong bảng phải dùng `<Empty>` bên trong một shared empty row của table, không tự đặt `py-12`, `py-24` hoặc wrapper rời theo từng trang
- Skeleton của bảng list phải bám đúng shell, header treatment, spacing và footer của bảng thật; không dựng loading header bar khác với UI cuối hoặc dùng parent `gap-*` tạo double spacing giữa toolbar và table
- Mỗi bảng list phải có chiến lược chiều rộng cột rõ ràng: cột nội dung chính được phép co giãn, còn metadata, trạng thái, timestamp và action phải có width hoặc min-width ổn định theo nhiệm vụ scan của từng cột
- Không để nội dung dài từ backend làm nở bảng ngang trên desktop; cột chứa title, description, URL, slug, model id, prompt name, cron expression hoặc text dài phải dùng `min-w-0` ở wrapper phù hợp và chọn rõ `truncate`, `line-clamp-*`, `break-words` hoặc `whitespace-normal`
- Vì `TableCell` mặc định `whitespace-nowrap`, cell chứa nội dung nhiều dòng hoặc long-form text phải override cục bộ bằng `whitespace-normal align-top`; không sửa mặc định trong `components/ui/table.tsx` nếu chưa có proposal riêng
- Switch toggle trạng thái boolean trực tiếp trong row list/table phải dùng capsule trạng thái compact: label trạng thái hiện tại và `<Switch>` nằm trong cùng một surface ổn định, không để label, switch và pending indicator rời rạc.
- Capsule switch trong row list/table phải có `aria-label` theo từng entity, disabled state rõ khi không có quyền hoặc đang pending, pending feedback không làm đổi width/shift layout, và skeleton phải mirror đúng shape cuối.
- Rule capsule switch này chỉ áp dụng cho toggle trong row list/table; không áp cho form switch, dialog switch hoặc toolbar switch như control lọc/hiển thị.
- Horizontal scroll của `Table` chỉ là fallback cho viewport hẹp hoặc bảng dữ liệu rất dày, không phải cơ chế chính để desktop list không vỡ layout
- Skeleton của bảng list phải mirror cùng column width strategy với bảng thật; không để skeleton khai báo width khác với table runtime

### Yêu cầu UX

- Nút Submit và Lưu phải hiển thị `<Spinner>` trong lúc pending
- Nút Submit và Lưu phải bị disable trong lúc pending
- Action phá hủy dữ liệu phải dùng `<AlertDialog>` với cảnh báo rõ ràng nếu hành động không thể hoàn tác
- Form chỉnh sửa phải có nút Hủy với `variant="ghost"`
- Hành động hủy phải reset form về dữ liệu ban đầu hoặc dùng một luồng an toàn tương đương
- Sau khi submit thành công, luôn gọi `router.push()` về trang danh sách rồi `router.refresh()`
- Skeleton loader phải bám sát bố cục cuối cùng để tránh layout shift
- Thanh loading phía trên phải luôn được bật cho page transition

### Màn hình theo API đã giản lược

- Khi backend giản lược contract của một feature, frontend phải giản lược lại hierarchy thay vì giữ nguyên bố cục cũ
- Bỏ các field, badge, filter, section hoặc metadata card không còn trong response hiện tại; không giữ placeholder rỗng cho concept backend đã loại bỏ
- Nếu nhiều lifecycle cũ đã được backend gom thành một field `status`, UI chỉ hiển thị một tín hiệu trạng thái rõ nghĩa thay vì nhiều badge lifecycle cũ
- Trang danh sách phải ưu tiên tên entity, mô tả ngắn, trạng thái hiện tại, timestamp chính, tín hiệu confidence/impact nếu có và action chính trước các field kỹ thuật
- Trang chi tiết phải đưa core facts và bằng chứng/hệ quả quan trọng lên trước; các field như `id`, `slug`, `canonicalKey`, `createdDate`, `lastModifiedDate` nên nằm trong vùng thông tin kỹ thuật cấp thấp hơn
- Khi cập nhật theo contract giản lược, skeleton, empty state, toast, APIMAPPING và review checklist liên quan phải phản ánh hierarchy mới

### Ngôn ngữ

- Toàn bộ UI text hướng đến người dùng phải là tiếng Việt chuyên nghiệp, rõ ràng và nhất quán
- Không trộn tiếng Anh và tiếng Việt trong label, placeholder, toast, description, metadata hoặc menu
- Chỉ giữ tiếng Anh cho tên riêng, thuật ngữ kỹ thuật, model name hoặc token mã nguồn khi thực sự cần thiết

### Validation và typing

- Dùng Zod v4 trở lên cho schema validation
- Nếu `zodResolver` có lỗi type tạm thời như `_zod.version`, chỉ được dùng `as any` như một workaround hẹp ngay tại ranh giới resolver

### Kỳ vọng khi review

- Review theo các rule trong file này, không dựa trên metadata Claude cũ
- Kiểm tra trang danh sách dùng cardless workspace, toolbar đúng bố cục và loading feedback phù hợp
- Kiểm tra app code không override visual chrome của shadcn `radix-nova` primitives; đánh dấu `h-*`, `min-h-*`, `rounded-*`, padding, foreground/background, border, ring, shadow hoặc typography class trên primitive là review finding nếu class đó không phải layout-only hoặc không có lý do sản phẩm rõ ràng
- Kiểm tra primary toolbar controls dùng default shadcn `radix-nova` size/chrome; đánh dấu `h-*`, `min-h-*`, `rounded-*`, padding hoặc `size="sm"` trong toolbar chính là review finding nếu không có lý do sản phẩm rõ ràng
- Kiểm tra list toolbar không tự có `mb-*`; table surface phải là nơi sở hữu `mt-4` giữa toolbar/search controls và bảng
- Đánh dấu top-level main `<Card>` chỉ để lặp lại breadcrumb title và bọc toàn page là review finding
- Đánh dấu body heading/hero copy, badge trang trí, `CardDescription`, panel placeholder hoặc implementation-detail copy dư thừa là review finding khi chúng lặp lại breadcrumb/control/metric hoặc không giúp user ra quyết định
- Kiểm tra bảng list dùng shared table surface nhất quán cho shell, header và empty state
- Đánh dấu list table để nội dung dài làm nở ngang layout, thiếu chiến lược width cho cột chính/metadata, hoặc skeleton lệch width với bảng thật là review finding
- Đánh dấu wrapper skeleton/list dùng `gap-*` gây double spacing giữa toolbar và `AppListTable` là review finding
- Kiểm tra trang chi tiết có flow quay lại chuẩn và chỉ dùng `<Card>` cho inner surface có ý nghĩa
- Kiểm tra create/update form dùng focused form shell với header, body, footer action zone và width phù hợp mật độ field
- Đánh dấu form trần trên workspace, submit/cancel row tự dựng sau `Separator`, skeleton create/update lệch shell hoặc nested card chỉ để lấy border/radius là review finding
- Kiểm tra mutation có xử lý kiểu `ActionResult`, có pending state, spinner và disable control đúng lúc
- Kiểm tra action xóa có dùng `AlertDialog`
- Đánh dấu `any`, skeleton lệch bố cục, toolbar control height drift, toolbar/table spacing drift, main-card shell drift, form-shell drift, table surface drift, UI copy dư thừa và UI copy không phải tiếng Việt là review finding

## Biến môi trường

Cần khai báo trong `.env`:

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
API_BASE_URL
```

Ví dụ:

```text
API_BASE_URL=http://localhost:8484
```

## Checklist hoàn thành feature

Trước khi đánh dấu một feature là xong:

- [ ] `page.tsx` dùng cardless workspace, không có main `Card` shell chỉ để lặp lại breadcrumb title
- [ ] `page.tsx` có `Suspense` với `Skeleton` bám sát bố cục thật
- [ ] Có `error.tsx` để xử lý local server error
- [ ] Search tuân thủ quy ước search list trong file này
- [ ] Bảng list dùng shared table surface cho shell, header và empty state
- [ ] Màn hình create/update dùng focused form shell với header, body và footer action zone
- [ ] Toàn bộ UI text là tiếng Việt chuyên nghiệp
- [ ] Nút Submit và Lưu có `Spinner` và trạng thái disabled
- [ ] Action xóa dùng `AlertDialog`
- [ ] Redirect sau khi thành công dùng `router.push()` và `router.refresh()`
