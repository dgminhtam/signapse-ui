# AGENTS.vi.md

Tài liệu này là bản tiếng Việt để chủ repo đọc hiểu các hướng dẫn repo-wide đang hoạt động cho Codex khi làm việc trong Signapse UI.

## Ngôn Ngữ Và Đồng Bộ

- `AGENTS.md` là file hướng dẫn vận hành bằng tiếng Anh cho agent.
- `AGENTS.vi.md` là bản tiếng Việt để chủ repo đọc.
- Hai file phải luôn đồng bộ. Khi thêm, xóa hoặc sửa bất kỳ rule nào trong một file, phải cập nhật section tương ứng trong file còn lại ở cùng thay đổi.
- Nếu không thể đồng bộ trong cùng thay đổi, phải báo rõ phần bị lệch, section bị ảnh hưởng và phần còn cần cập nhật.

## CodeGraph

- Khi người dùng hỏi về kiến trúc, luồng xử lý, bug, refactor, review tác động hoặc cần tìm nơi sửa code, ưu tiên dùng CodeGraph trước khi mở file thủ công hoặc chạy `rg`.
- Dùng `codegraph_context` làm cửa vào mặc định cho câu hỏi dạng "X hoạt động thế nào", điều tra bug, hoặc xác định entry point liên quan.
- Dùng `codegraph_trace` khi cần hiểu đường đi từ symbol/interaction A tới B, `codegraph_impact` trước refactor, `codegraph_search` để tìm symbol nhanh, và `codegraph_explore` để gom nhiều symbol/file liên quan trong một lượt.
- Chỉ fallback sang `rg`, đọc file trực tiếp hoặc tool khác khi CodeGraph thiếu index, trả chưa đủ ngữ cảnh, hoặc cần kiểm tra nội dung ngoài symbol như dictionary, CSS, Markdown, config hay OpenSpec docs.

## Scope Và Skills

- `AGENTS.md` giữ các quy tắc toàn repo: stack, auth/API, UI policy, layout invariant, verification và review categories.
- `.codex/skills` giữ recipe chi tiết. Khi task đụng các domain dưới đây, phải đọc skill tương ứng trước khi implement hoặc review.
- `shadcn`: thêm/sửa/compose shadcn component, wrapper, CLI, docs, preset, styling rules.
- `implementation-guardrails`: apply OpenSpec, refactor, bugfix, cleanup hoặc thay đổi scope-sensitive.
- `hydration-mismatch`: điều tra hydration mismatch trên Radix/shadcn overlay.
- `frontend-design`: redesign, polish UI, dashboard/workbench hoặc layout mới cần visual direction.
- `accessibility`: keyboard, focus, screen reader, semantic markup, dialog/form accessibility.
- `api-mapping-sync`: khi `docs/api_mapping.json`, `docs/APIMAPPING.md` hoặc backend contract thay đổi.
- OpenSpec skills: dùng `openspec-propose`, `openspec-apply-change`, `openspec-archive-change`, `openspec-explore` theo đúng phase.

## Lệnh

- Ưu tiên slash command: `/dev`, `/build`, `/lint`, `/format`, `/typecheck`.
- Fallback shell tương ứng: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm format`, `pnpm typecheck`.
- Chạy production server bằng `pnpm start`.

## Kiến Trúc

Signapse UI là dashboard quản trị dùng **Next.js 16 App Router** cho hệ thống tín hiệu giao dịch có tích hợp AI.

- **Xác thực:** Clerk; endpoint cần JWT phải đi qua `fetchAuthenticated()`.
- **UI:** shadcn/ui wrapper trong `@/components/ui/`, Tailwind CSS v4, Lucide icons, Geist font và Geist Mono.
- **Toast:** chỉ dùng `sonner`.
- **Validation:** Zod v4 cho frontend validation và mapping DTO backend.
- **Route groups:** `app/(main)/` là protected app, `app/(auth)/` là Clerk auth, `app/api/[feature]/action.ts` là server actions theo feature.

## Cấu Trúc Feature

Mỗi feature nên nằm trọn trong thư mục riêng khi phù hợp:

```text
app/(main)/[feature]/
├── page.tsx              # Server Component: cardless workspace + Suspense boundary
├── [id]/page.tsx         # Detail page: cardless workspace + nút quay lại chuẩn
├── error.tsx             # Local error boundary
├── [feature]-list.tsx    # Client Component: bảng/danh sách + toolbar
├── [feature]-create-form.tsx
├── [feature]-update-form.tsx
└── [feature]-search.tsx
```

- Dùng relative import như `./component-name` cho component nằm cùng feature.
- Có `error.tsx` cho local server error khi feature có route/page đáng kể.
- Create và update không dùng chung một submit-owning form component; chỉ share field primitive/helper không phụ thuộc mode.

## Guardrail Triển Khai

- Trước thay đổi không tầm thường, khóa scope bằng mục tiêu, giả định, non-goals và tiêu chí hoàn thành.
- Ưu tiên giải pháp đơn giản nhất đủ yêu cầu; không tạo abstraction, config hoặc fallback khi chưa có nhu cầu rõ.
- Chỉnh sửa phẫu thuật: chỉ sửa file liên quan trực tiếp, bám style hiện có, không dọn code ngoài scope.
- Khi thay thế thư viện/vendor UI hoặc chart engine, migration phải xóa sạch source cũ không còn dùng: dependency, import/type/helper, adapter, attribution/vendor copy, OpenSpec/docs reference active và dead component tạm thời.
- Khi sửa Markdown, TS hoặc TSX, giữ UTF-8 và tránh rewrite toàn file bằng command có thể đổi encoding/newline. Ưu tiên `apply_patch`; nếu buộc dùng script/bulk edit thì edit hẹp, encoding-aware và kiểm tra diff/readability sau đó.
- Kết thúc phần agent-owned bằng kiểm chứng phù hợp như lint, typecheck, OpenSpec validation, static search hoặc deterministic review; nếu chưa chạy được thì nói rõ lý do.
- Khi tạo/cập nhật OpenSpec `tasks.md`, verification checklist mặc định chỉ gồm checks Codex có thể chạy từ repo. Không thêm smoke/browser/visual/manual/auth/backend-data QA thành checkbox chặn archive trừ khi người dùng yêu cầu rõ; nếu cần ghi nhận, dùng ghi chú không checkbox như `User-owned manual QA`.

## API Và Data

- Luôn dùng `fetchAuthenticated()` cho endpoint cần Clerk JWT.
- Luôn đọc `response.text()` trước khi `JSON.parse()` để tránh crash khi backend trả rỗng hoặc malformed.
- Khi backend giản lược contract, frontend phải giản lược hierarchy theo response hiện tại; bỏ field, badge, filter, section hoặc metadata card không còn trong contract.
- Danh sách ưu tiên tên entity, mô tả ngắn, trạng thái hiện tại, timestamp chính, confidence/impact nếu có và action chính trước field kỹ thuật.
- Detail page đưa core facts và bằng chứng/hệ quả quan trọng lên trước; `id`, `slug`, `canonicalKey`, `createdDate`, `lastModifiedDate` thuộc vùng thông tin kỹ thuật cấp thấp.

## I18n Và Locale Routing

- App dùng locale route `app/[lang]` với locale khai báo trong `app/lib/i18n/config.ts`; không tạo UI route song song ngoài `[lang]`.
- User-facing copy phải lấy từ dictionary qua `getDictionary()`, `getServerDictionary()` hoặc `useLocalization()`; không hardcode label, toast, placeholder hoặc menu text trong component mới.
- Client component dùng `useLocalization()` cho `dictionary`, `formatMessage`, `formatDateTime`, `formatNumber` và `formatCurrency`.
- Server action/API action cần localized message phải dùng `getRequestLocale()` hoặc `getServerDictionary()` thay vì tự suy đoán locale.
- Internal app links phải preserve locale bằng `LocalizedLink`, `useLocalizedHref()`, `useLocalizedPath()` hoặc `withLocalePath()`; không hardcode `/vi` hoặc `/en`.
- Locale-sensitive date, number và currency phải dùng formatter trong i18n provider/helper; tránh gọi `toLocaleString()` trực tiếp trong render để giảm hydration mismatch.

## Shadcn Và Theme Policy

- `components.json` và `@/components/ui/` dùng shadcn preset `radix-nova` làm baseline chính thức (`base=radix`, `baseColor=neutral`, `iconLibrary=lucide`).
- App/feature/shared code chỉ compose qua wrapper trong `@/components/ui/`; không import trực tiếp primitive gốc như `radix-ui`, `vaul` hoặc UI nền khi đã có hoặc có thể bổ sung wrapper shadcn.
- Chỉ file wrapper trong `components/ui/*` được import primitive gốc.
- Không tự chỉnh visual chrome trong `@/components/ui/`. Khi cần sync wrapper shadcn, dùng workflow `pnpm dlx shadcn@latest add ... --dry-run` và `--diff`, rồi sync theo preset hoặc proposal wrapper rõ ràng.
- Feature/shared code phải dùng default chrome của `radix-nova`; `className` trên shadcn primitives chỉ dùng cho layout như width, max-width, flex/grid, gap, alignment, max-height, overflow, truncate hoặc responsive constraints.
- Không thêm `h-*`, `min-h-*`, `rounded-*`, padding, foreground/background, border, ring, shadow hoặc typography class lên primitive chỉ để đổi height, radius, màu, viền hoặc mật độ mặc định.
- Khi cần compact control, ưu tiên variant/size có sẵn; chỉ hard-code height/radius khi không có size/variant phù hợp và có lý do sản phẩm rõ ràng.
- Theme token trong `app/globals.css` và `tailwind.baseColor` trong `components.json` phải theo `radix-nova` neutral default; không silently đổi `--primary`, `--accent`, `--sidebar-*`, chart tokens hoặc wrapper chrome để sửa vấn đề cục bộ.
- Khi thêm/sửa/debug/style/compose shadcn component, bắt buộc tham khảo skill `.codex/skills/shadcn` và kiểm tra docs shadcn tương ứng trước khi implement.

## UI Composition Invariants

- Ưu tiên `gap-*` trong `flex`/`grid`; không dùng `space-y-*`.
- Empty state phải dùng `<Empty>`.
- Icon trong button phải dùng `data-icon="inline-start"` hoặc treatment tương ứng từ shadcn skill.
- `SelectItem` phải nằm trong `SelectGroup`; `DropdownMenuItem` phải nằm trong `DropdownMenuGroup`.
- Nút Submit/Lưu phải có `<Spinner>` và disabled trong lúc pending.
- Action phá hủy dữ liệu phải dùng `<AlertDialog>` với cảnh báo rõ nếu không thể hoàn tác.
- Form chỉnh sửa phải có nút Hủy `variant="ghost"` và reset về dữ liệu ban đầu hoặc flow an toàn tương đương.
- Sau submit thành công, dùng `router.push()` về trang danh sách rồi `router.refresh()`.
- Skeleton/Suspense fallback phải mirror bố cục cuối cùng đủ gần để tránh layout shift.
- Thanh loading phía trên phải luôn bật cho page transition.
- Time metadata trên list/detail/drawer/supporting panel dùng treatment phụ: icon inline `size-3`, `text-xs text-muted-foreground tabular-nums`; không dùng badge hoặc value styling mạnh cho timestamp thuần.

## List, Search Và Pagination

- Giữ filter, search, sort và pagination trên URL.
- Dùng query params `page` và `size`; URL là 1-indexed, backend là 0-indexed.
- URL updates dùng `useTransition` với `router.push()` hoặc `router.replace()`.
- Search list đặt trong `[feature]-search.tsx`, dùng controlled input khởi tạo từ `useSearchParams()` và sync lại khi query param thay đổi.
- Search dùng `use-debounce` `300ms`, không thêm nút `Tìm kiếm` nếu không có yêu cầu nghiệp vụ riêng.
- Khi search đổi, trim giá trị, xóa query param nếu rỗng và reset `page` về `1`.
- Search input có `type="search"`, `id`, `label` dạng `sr-only`.
- Search compose bằng `InputGroup`, `InputGroupInput`, `InputGroupAddon`; icon idle và `<Spinner>` pending thay thế nhau trong leading addon, không dùng absolute icon/trailing spinner/reserved trailing width.
- Search wrapper thống nhất `w-full sm:w-80 lg:w-96`; search nằm vùng leading cùng action chính, view controls như filter/sort/page size nằm trailing.
- Page size selector thuộc trailing controls, dùng options chuẩn `10`, `20`, `50`, `100`, default `10`; không đặt lại trong footer pagination.
- Sort/page size dùng disable-only pending feedback, không render spinner trong/bên cạnh select trigger.

## Page, Toolbar, Table Và Form Layout

- Trang trong `app/(main)` dùng cardless workspace theo padding layout cha; không bọc toàn page bằng main `<Card>` chỉ để lặp breadcrumb title.
- Breadcrumb trong app header là page identity chính cho trang đơn giản; nếu label lệch, sửa breadcrumb mapping thay vì thêm heading trùng.
- Chỉ dùng `<Card>` cho inner surface có ranh giới thật như form section, detail panel, dashboard tile, access-denied/error panel hoặc repeated item.
- Trang list render trực tiếp shared toolbar, `AppListTable` và pagination surface; không thêm main Card/Header/Title/Description/Separator bao ngoài.
- `AppListToolbar` không sở hữu margin ngoài phía dưới; khoảng cách toolbar/search tới bảng thuộc về `AppListTable` qua `mt-4`.
- Toolbar responsive dùng `flex-col sm:flex-row sm:justify-between`; leading là action chính/search, trailing là view controls.
- Primary toolbar controls dùng size/chrome mặc định shadcn; không tự thêm height/radius/padding hoặc `size="sm"` chỉ để chỉnh density.
- Table list phải dùng shared table surface cho shell, header và empty state. Nội dung dài không được làm nở ngang desktop; cột text dài phải có strategy rõ như `min-w-0`, `truncate`, `line-clamp-*`, `break-words` hoặc `whitespace-normal`.
- `TableCell` mặc định `whitespace-nowrap`; cell long-form/multiline override cục bộ bằng `whitespace-normal align-top`, không sửa wrapper table core khi chưa có proposal.
- Row list/table boolean toggle dùng capsule trạng thái compact có label, switch, `aria-label`, disabled/pending ổn định và skeleton mirror đúng shape.
- Create/update dùng focused form shell ngoài `components/ui`: `rounded-xl`, border, `bg-card`, header gọn, body fields, footer action zone. Không render form trần, không dùng nested Card chỉ để lấy border/radius.
- Form body dùng `FieldGroup`, `FieldSet` và `gap-*`. Footer tách khỏi body bằng border/subtle background, chứa primary và secondary action.
- Width form có chủ đích: đơn giản `max-w-xl`, CRUD phổ biến `max-w-2xl`, form dày/editor/prompt/API key/model picker `max-w-3xl`.
- Switch trong create/update/detail dùng field compact; rule này không áp cho row list/table capsule, toolbar/workbench toggle, dialog permission matrix hoặc route row switch.

## Quick Detail Overlay

- Quick detail trên analytical workspace như Graph View, Market Charts hoặc workbench dữ liệu dày phải là local overlay do workspace sở hữu bằng state cục bộ.
- Mở/đóng quick detail không được đổi URL hoặc dùng `router.back()`, `router.push()` hay `router.replace()` chỉ để quản lý drawer state.
- Canonical detail routes như `/events/{id}` và `/news-articles/{id}` vẫn là full detail page mặc định cho normal link, reload, copied URL, direct navigation và list/detail CRUD.
- Local quick detail drawer phải có loading, error/access-denied state trong overlay, nội dung focused không embed full page shell, và action rõ để mở canonical full detail page.
- Nếu muốn route interception cho quick detail, cần proposal riêng nêu rõ scope route, affected links, Back/Forward behavior, cách tránh reload workspace phía sau và kế hoạch dọn source; không thêm `@quickDetail` global dưới `(main)` như default pattern.

## Hydration Mismatch

- Khi xử lý trường hợp này, đọc skill `.codex/skills/hydration-mismatch`.

## Content, Language Và Accessibility

- Mỗi màn hình chỉ hiển thị text giúp user ra quyết định hoặc hoàn thành tác vụ; không thêm mô tả lặp breadcrumb/control/metric.
- Tránh badge trang trí, page identity body heading, hero copy, `CardDescription`, panel placeholder hoặc implementation-detail copy nếu không tạo giá trị quyết định.
- Màn hình dữ liệu dày ưu tiên controls và dữ liệu chính; copy dài, roadmap/future feature, legal/vendor note chuyển thành tooltip/help text nhỏ/footer legal/docs riêng.
- Attribution vendor/license không được xóa im lặng; nếu bỏ khỏi bề mặt chính, thay bằng notice/link ở vị trí user truy cập được.
- Khi thay đổi UI có keyboard/focus/screen reader risk, đọc skill `.codex/skills/accessibility`.

## Sidebar

- Sidebar active item thật dùng `sidebar-primary` và `sidebar-primary-foreground` như neutral selected surface; không mang cảm giác CTA/inverse button.
- Hover dùng `sidebar-accent`; focus-visible giữ `sidebar-ring`; focus là accessibility state, không trộn với selected/current state.
- Parent đang mở không dùng background state; expanded chỉ cần chevron rotate.
- Active item và parent có child active không tự tăng font weight chỉ vì state.
- Không thêm custom active color token, không dùng global `accent`, không silently đổi `--sidebar-*` để sửa issue cục bộ.
- Density xử lý ở `AppSidebar`; child list giữ left indent rõ, mở rộng hợp lý và dùng `py-1`.

## Validation Và Typing

- Dùng Zod v4 trở lên cho schema validation.
- Nếu `zodResolver` có lỗi type tạm thời như `_zod.version`, chỉ dùng `as any` như workaround hẹp ngay tại ranh giới resolver.
- Đánh dấu `any` là review finding nếu không phải boundary workaround có lý do rõ.

## Kỳ Vọng Khi Review

- Review theo các rule trong file này và skill liên quan.
- Ưu tiên finding theo drift category: shadcn chrome drift, toolbar/table spacing drift, main-card shell drift, form-shell drift, table surface drift, skeleton mismatch, URL state/search mismatch, API contract hierarchy drift, accessibility regression, UI copy noise, non-Vietnamese UI copy, unsafe destructive action, unchecked `any`.
- Với mỗi finding, chỉ ra file/line, rủi ro hành vi hoặc UX, và sửa tối thiểu nên làm.
- Nếu không có finding, nói rõ không tìm thấy issue và nêu residual risk hoặc checks chưa chạy.

## Checklist Hoàn Thành Feature

Trước khi đánh dấu một feature là xong:

- [ ] Suspense/Skeleton mirror bố cục thật đủ gần để tránh layout shift.
- [ ] Có `error.tsx` khi feature có route/page đáng kể.
- [ ] Search/list/pagination tuân thủ URL state và composition policy.
- [ ] Bảng list dùng shared table surface cho shell, header, empty state và width strategy.
- [ ] Create/update dùng focused form shell với header, body, footer action zone và width phù hợp.
- [ ] Submit/save/delete/cancel có pending, disabled, destructive confirmation và reset/redirect đúng policy.
- [ ] Agent-owned verification đã chạy hoặc được báo rõ lý do chưa chạy: lint, typecheck, OpenSpec validation, static search hoặc deterministic review.
