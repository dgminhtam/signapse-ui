# Signapse UI/UX Design System

Tài liệu này là nguồn chuẩn cho các quy ước UI/UX bền vững của Signapse: visual, theme, layout, component composition, interaction, content, state, accessibility và UI review. Mọi thay đổi hoặc review UI hiển thị cho người dùng dưới `app/[lang]/**` hoặc `components/**` phải tuân theo tài liệu này cùng các technical boundary trong `components/AGENTS.override.md`.

Tài liệu không sở hữu kiến trúc repository, dependency/import boundary, API, permission, validation, localization mechanism, workflow hay verification policy. Các nội dung đó vẫn thuộc `AGENTS.md`, scoped overrides và skills tương ứng.

## Reference

- `docs/design/design_light.png`
- `docs/design/design_dark.png`

Hai reference thể hiện một ngôn ngữ thiết kế rất hợp với Signapse:

- Tối giản, sắc nét, nhiều khoảng thở.
- Inner surface có viền mảnh, chiều sâu nhẹ và hierarchy rõ.
- Nền grid rất tinh tế, không cạnh tranh với nội dung.
- Typography rõ, heading mạnh, metadata nhỏ và tracking rộng.
- Metric cards và status surfaces có hierarchy rõ.
- Light mode và dark mode cùng một logic thẩm mỹ, không giống hai theme rời nhau.

## Direction

Tên direction: **Financial Command Surface**

Signapse không phải landing page marketing. Đây là công cụ vận hành cho admin/operator cần đọc dữ liệu, kiểm tra trạng thái, thao tác CRUD, quản lý workflow AI và phân tích thị trường. Vì vậy direction này ưu tiên cảm giác:

- Chuyên nghiệp, tĩnh, đáng tin.
- Dữ liệu rõ ràng, ít nhiễu.
- Bề mặt UI có chiều sâu nhẹ nhưng không bóng bẩy quá mức.
- Trạng thái, cảnh báo và insight nổi bật đúng lúc.
- Không dùng hiệu ứng trang trí gây xao nhãng.

## Goals

- Tạo một visual language thống nhất cho dashboard Signapse.
- Áp dụng reference theo hướng token, surface và hierarchy, không hardcode theo từng màn.
- Giữ UI tiếng Việt chuyên nghiệp, dễ đọc.
- Dùng Geist và Geist Mono theo stack hiện tại, với hierarchy rõ và khả năng đọc tiếng Việt tốt.
- Tăng cảm giác tài chính, phân tích và vận hành mà vẫn giữ mật độ thông tin phù hợp admin tool.
- Bảo toàn accessibility, responsive layout và skeleton parity.

## Non-Goals

- Không clone layout hero/section của reference.
- Không biến dashboard thành marketing page.
- Không đổi API, permission, form validation hoặc workflow nghiệp vụ.
- Không thêm animation lớn hoặc motion trang trí nặng.
- Không dùng tài liệu này để thay thế component API rules, skill workflow hoặc technical guardrails.

## Design Principles

### 1. Calm Financial Precision

UI nên tạo cảm giác chính xác và có kiểm soát. Màu sắc, border, shadow và spacing đều cần tiết chế. Những thứ quan trọng như trạng thái lỗi, confidence, active status hoặc destructive action mới được phép nổi bật.

### 2. Surface Hierarchy Over Decoration

Reference đẹp vì surface rhythm rõ: nền yên, card nổi nhẹ, metric module gọn, metadata nhỏ. Khi áp dụng vào Signapse, mỗi surface phải có vai trò:

- Page shell định hướng.
- Card shell gom nội dung chính.
- Table surface đọc dữ liệu.
- Toolbar surface điều khiển view.
- Form surface nhập liệu.
- Workbench surface hỗ trợ phân tích.

### 3. Token First

Màu sắc và cảm giác nền phải đi qua semantic tokens hoặc shared app-level surfaces. Tránh class màu tùy hứng trong feature page.

Ưu tiên:

- `app/globals.css` cho token nền, card, border, muted, sidebar, chart.
- Shared components ngoài `components/ui` cho table, toolbar, app shell.
- Feature-level class chỉ dùng khi cần hierarchy hoặc trạng thái nghiệp vụ riêng.

### 4. Dashboard Translation, Not Screenshot Copy

Reference là landing page. Signapse là dashboard. Khi có xung đột, ưu tiên dashboard:

- Bảng phải dễ scan hơn là đẹp như card marketing.
- Form phải rõ validation và pending state.
- Workbench phải giữ density và decision path.
- Navigation phải ổn định, không trang trí quá mức.

### 5. Light And Dark Parity

Light mode và dark mode phải là hai biến thể của cùng một direction. Không để light mode quá trắng phẳng hoặc dark mode quá đen chìm.

## Theme And Component Chrome

- Feature/shared code dùng default chrome của preset `radix-nova` qua wrappers trong `@/components/ui/`.
- `className` trên shadcn primitives chỉ dùng cho layout như width, max-width, flex/grid, gap, alignment, max-height, overflow, truncate hoặc responsive constraints.
- Không thêm `h-*`, `min-h-*`, `rounded-*`, padding, foreground/background, border, ring, shadow hoặc typography classes chỉ để đổi height, radius, color, border hay density mặc định của primitive.
- Khi cần control compact, ưu tiên variant/size sẵn có; chỉ hard-code height/radius khi không có option phù hợp và có product reason rõ.
- Wrapper trong `components/ui` có thể được bảo trì theo shadcn workflow, nhưng không nhận feature-specific visual customization.

### Semantic Tokens

- `app/globals.css` và `tailwind.baseColor` trong `components.json` giữ neutral default của `radix-nova`.
- Không đổi `--primary`, `--accent`, `--sidebar-*`, `--chart-*`, radius hoặc wrapper chrome để sửa một vấn đề cục bộ.
- Màu feature đi qua semantic tokens hoặc shared app-level surfaces; không dùng raw palette tùy ý.
- Light và dark mode là hai biến thể của cùng một system, có contrast và hierarchy tương đương.
- Background grid hoặc depth decoration, nếu có, chỉ thuộc app shell/shared surface và phải rất nhẹ; không lặp ở từng card.
- Shadow tạo hierarchy nhẹ, không dùng để làm destructive/alert state nổi bật.

### Badge Colors

- Ưu tiên các variant `default`, `secondary`, `destructive`, `outline` hoặc `ghost`.
- Khi cần categorical color ngoài built-in variants, chỉ `<Badge>` được dùng các palette sau:
  - Blue: `bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300`.
  - Green: `bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300`.
  - Sky: `bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300`.
  - Purple: `bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300`.
  - Red: `bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300`.
- Exception này không cho phép raw palette hoặc manual `dark:` color classes trên primitive khác.

## Layout And Surface Composition

### App Shell

App shell giữ cảm giác yên, có khoảng thở và không tạo quá nhiều border cạnh tranh. Page padding phải đủ thoáng trên desktop nhưng không làm mobile chật.

- Pages trong `app/[lang]/(main)` dùng cardless workspace từ parent padding layout.
- Breadcrumb trong app header là page identity chính cho simple pages; sửa breadcrumb mapping thay vì thêm body heading trùng lặp.
- Top loading bar luôn bật cho page transitions.

### Sidebar And Header

Sidebar là navigation vận hành, không phải brand hero. Cần sạch, ít nhiễu, active state rõ.

- Real active item dùng `sidebar-primary` và `sidebar-primary-foreground` như neutral selected surface, không giống CTA/inverse button.
- Hover dùng `sidebar-accent`; focus-visible giữ `sidebar-ring`. Focus là accessibility state, không trộn với selected/current state.
- Open parent không có background state; expanded state chỉ cần chevron rotation.
- Active item và parent có active child không tăng font weight chỉ vì state.
- Không thêm active-color token, dùng global `accent` hoặc đổi `--sidebar-*` để sửa cục bộ.
- Density thuộc `AppSidebar`; child list giữ left indent rõ, mở rộng hợp lý và dùng `py-1`.
- Không thêm decoration cạnh tranh với content; label tiếng Việt phải đúng dấu và nhất quán.

### Page And Card Surfaces

- Không bọc toàn bộ page trong main `<Card>` chỉ để lặp breadcrumb title.
- Chỉ dùng `<Card>` cho inner surface có boundary thật như form section, detail panel, dashboard tile, access-denied/error panel hoặc repeated item.
- Không dùng nested Card chỉ để lấy border/radius nếu đã có shared surface phù hợp.
- List page render toolbar, `AppListTable` và pagination trực tiếp, không thêm outer Card/Header/Title/Description/Separator.

### List Table Surface

Table là bề mặt quan trọng nhất của dashboard. Reference có nhiều card metric, nhưng trong Signapse table phải ưu tiên scan dữ liệu.

Translation:

- Shell nhất quán qua `AppListTable`; component này cung cấp standard `mt-4`, còn `AppListToolbar` không sở hữu bottom margin.
- Header row dịu, không quá đậm.
- Table dùng shared header và empty-state components; empty state nằm trong table surface.
- Skeleton phải giống bố cục table thật.
- Row hover nhẹ, không làm mất contrast.
- Multiline cell override default nowrap cục bộ; long text phải có wrapping, truncation hoặc line-clamp strategy rõ.
- Boolean toggle trong row dùng compact status capsule có label, switch, `aria-label`, pending/disabled behavior ổn định và skeleton cùng hình dạng.
- Plain timestamp dùng icon `size-3` và `text-xs text-muted-foreground tabular-nums`, không dùng badge hay strong value styling.

### Toolbar

Toolbar là control surface. Nó nên gọn, có nhóm trái/phải rõ, không nổi bật hơn table.

Translation:

- Layout responsive dùng `flex-col sm:flex-row sm:justify-between`.
- Leading area chứa primary action và search; trailing area chứa filter, sort và page size.
- Primary controls giữ default shadcn size/chrome; không thêm custom height/radius/padding hoặc `size="sm"` chỉ để đổi density.

### Forms

Form cần rõ field, description, validation và pending state.

Translation:

- Form dùng `AppFormShell`, `AppFormShellBody`, `AppFormShellFooter`; chọn width `sm` cho form đơn giản, `md` cho CRUD phổ biến và `lg` cho form dày.
- Body dùng `FieldGroup`, `FieldSet` và `gap-*`; flex/grid layouts dùng `gap-*`, không dùng `space-y-*`.
- Description dùng muted foreground.
- Footer tách khỏi body bằng border/subtle background và chứa primary/secondary actions.
- Submit/save pending phải disabled và hiển thị `<Spinner>`.
- Edit flow có ghost Cancel khôi phục initial data hoặc thoát an toàn.
- Switch trong create/update/detail dùng compact field treatment; row capsule, toolbar/workbench toggle, permission matrix và route-row switch giữ pattern riêng.

### Empty, Loading, Error, Permission

Các state này phải trông như một phần của system, không phải afterthought.

Translation:

- Empty dùng `<Empty>` và nằm đúng surface.
- Loading skeleton bám bố cục thật.
- Error copy tiếng Việt rõ, không kỹ thuật hóa quá mức.
- Permission denied nói rõ quyền cần thiết nhưng không đổ lỗi người dùng.
- Irreversible destructive action dùng `<AlertDialog>` với warning rõ.

### Workbench Screens

Các màn như market query hoặc graph view cần áp dụng direction thận trọng hơn list page vì nhiều nội dung đặc thù.

Translation:

- Giữ decision path rõ.
- Dùng surface hierarchy thay vì chia quá nhiều card cùng trọng lượng.
- Evidence, status, confidence, limitations cần dễ scan.
- Decorative atmosphere không được che mất canvas hoặc data.

## Interaction And Navigation

### Submit And Transition Feedback

- Sau submit thành công, dùng `router.push()` về list page rồi `router.refresh()`.
- Pending state không thay đổi layout đột ngột; spinner thay thế feedback cùng vị trí thay vì thêm decoration mới.

### URL State, Search And Pagination

- Filter, search, sort, `page` và `size` nằm trong URL; browser URL 1-indexed, backend pagination 0-indexed.
- Search nằm trong `[feature]-search.tsx`, là controlled `type="search"` input khởi tạo từ `useSearchParams()` và sync khi query param thay đổi.
- Input có `id` và `sr-only` label; search debounce `300ms` qua `use-debounce`, không thêm Search button nếu không có business requirement.
- Khi search đổi, trim value, xóa query param nếu rỗng và reset `page` về `1`.
- Search dùng `InputGroup`, `InputGroupInput`, `InputGroupAddon`; idle icon và pending `<Spinner>` thay nhau trong leading addon. Không dùng absolute icon, trailing spinner hoặc reserved trailing width.
- Wrapper dùng `w-full sm:w-80 lg:w-96` và nằm ở leading area của toolbar.
- Page-size selector nằm trong trailing controls với options `10`, `20`, `50`, `100`, mặc định `10`; không lặp trong footer pagination.
- Sort/page-size pending chỉ disabled control, không render spinner trong hoặc cạnh select trigger.

### Quick Detail Overlay

- Quick detail trong Graph View, Market Charts hoặc dense workbench là local overlay do workspace sở hữu qua local state.
- Open/close overlay không đổi URL và không dùng `router.back()`, `router.push()` hoặc `router.replace()` chỉ để quản lý drawer state.
- Canonical routes như `/events/{id}` và `/news-articles/{id}` vẫn là full detail pages cho normal link, reload, copied URL, direct navigation và list/detail CRUD.
- Drawer chứa loading, error/access-denied state bên trong overlay, focused content không embed full page shell và action rõ để mở canonical full detail page.

## Content And Language

- Mỗi screen chỉ hiển thị text giúp người dùng ra quyết định hoặc hoàn thành task; không lặp ý nghĩa của breadcrumb, control hoặc metric.
- Tránh decorative badge, body heading lặp page identity, hero copy, `CardDescription`, placeholder panel hoặc implementation-detail copy không có decision value.
- Dense data screen ưu tiên controls và primary data; long copy, roadmap/future notes và legal/vendor notes chuyển sang tooltip, help text, footer legal area hoặc docs.
- User-facing copy phải được localization và tiếng Việt phải tự nhiên, đúng dấu; technical instructions chịu trách nhiệm quy định helper cụ thể.
- Vendor/license attribution phải ở vị trí người dùng truy cập được khi rời main surface.

## Accessibility And Responsive Behavior

- Preserve semantic elements, labels, keyboard interaction, focus visibility và screen-reader names.
- Dialog/overlay restore focus an toàn; icon-only control có accessible name.
- Search, form controls và switches có label hoặc `aria-label` phù hợp.
- Icons trong button dùng wrapper `data-icon` treatment.
- Skeleton và Suspense fallback mirror final layout ở mọi breakpoint.
- Desktop, tablet và mobile giữ hierarchy và không tạo horizontal overflow ngoài surface chủ đích.

## Intentional Deviations From Reference

- Không dùng hero headline lớn trong admin pages.
- Không dùng nhiều CTA marketing như reference.
- Không biến mọi content block thành card marketing.
- Không giảm mật độ table quá nhiều.
- Không thêm decorative floating cards nếu không phục vụ dữ liệu.
- Không dùng animation reveal lớn hoặc decorative motion gây xao nhãng.

## UI Review Criteria

Khi implement hoặc review UI, kiểm tra các state và breakpoint liên quan:

- Light mode và dark mode.
- Sidebar mở rộng và collapsed.
- Desktop, tablet và mobile width.
- List normal state.
- List empty state.
- Loading skeleton.
- Error boundary.
- Permission denied.
- Create form.
- Edit form.
- Delete confirmation.
- Workbench idle/loading/success/error.
- Focus ring và keyboard navigation cơ bản.
- Không có mojibake.
- Không có UI copy tiếng Anh mới hướng người dùng, trừ tên riêng hoặc thuật ngữ kỹ thuật cần thiết.

Ưu tiên finding theo các UI drift category: shadcn chrome, toolbar/table spacing, main-card shell, form shell, table surface, skeleton mismatch, URL/search state, accessibility regression, UI copy noise và non-Vietnamese UI copy. Nếu visual direction làm giảm readability hoặc data density cần thiết, ưu tiên readability và decision path.
