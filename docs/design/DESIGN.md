# Signapse Visual Design Direction

Tài liệu này là nguồn chuẩn cho hướng thiết kế thị giác của Signapse. Mục tiêu là dịch tinh thần từ hai reference trong `docs/design/` thành một visual system phù hợp với dashboard quản trị dữ liệu tài chính, không sao chép nguyên layout landing page.

## Reference

- `docs/design/design_light.png`
- `docs/design/design_dark.png`

Hai reference thể hiện một ngôn ngữ thiết kế rất hợp với Signapse:

- Tối giản, sắc nét, nhiều khoảng thở.
- Card viền mảnh, bo lớn, shadow nhẹ.
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
- Giữ Be Vietnam Pro làm font chính cho khả năng đọc tiếng Việt.
- Tăng cảm giác tài chính, phân tích và vận hành mà vẫn giữ mật độ thông tin phù hợp admin tool.
- Bảo toàn accessibility, responsive layout và skeleton parity.

## Non-Goals

- Không clone layout hero/section của reference.
- Không biến dashboard thành marketing page.
- Không sửa shadcn primitives trong `components/ui`.
- Không đổi API, permission, form validation hoặc workflow nghiệp vụ.
- Không thêm font dependency mới trong first pass.
- Không thêm animation lớn hoặc motion trang trí nặng.
- Không rollout toàn bộ app trước khi pilot được kiểm tra.

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

## Token Direction

Các giá trị cụ thể sẽ được chốt trong implementation sau. First pass nên đi theo hướng sau:

| Token | Direction |
| --- | --- |
| `--background` | Warm neutral gần trắng ở light mode, near-black có độ sâu nhẹ ở dark mode |
| `--foreground` | Contrast cao, không quá gắt |
| `--card` | Gần background nhưng đủ tách lớp |
| `--card-foreground` | Rõ, ưu tiên readability |
| `--muted` | Surface phụ rất nhẹ, không làm đục UI |
| `--muted-foreground` | Metadata dịu nhưng vẫn đủ contrast |
| `--border` | Viền mảnh, opacity thấp, tạo structure hơn là decoration |
| `--input` | Đồng bộ border treatment với card/table |
| `--ring` | Focus rõ, chuyên nghiệp, không neon |
| `--primary` | Monochrome mạnh, dùng cho CTA chính |
| `--accent` | Dùng rất tiết chế cho hover/active surfaces |
| `--destructive` | Giữ rõ ràng, không pha quá tối |
| `--sidebar` | Cùng family với background/card, không lệch theme |
| `--chart-*` | Màu data có độ phân biệt tốt, tránh quá rực |
| `--radius` | Tăng nhẹ để gần reference, nhưng vẫn hợp bảng/form |

### Grid And Atmosphere

Grid nền nên rất nhẹ, gần như chỉ cảm nhận được khi nhìn tổng thể. Không đặt grid làm họa tiết chính.

Guideline:

- Light mode: grid opacity cực thấp, tone warm gray.
- Dark mode: grid hơi sáng hơn nền một chút, không tạo banding.
- Grid chỉ nên nằm ở app shell hoặc wrapper cấp cao.
- Không lặp grid trong từng card con.

### Shadow And Depth

Shadow nên dùng để tạo chiều sâu nhẹ, không tạo cảm giác floating SaaS generic.

Guideline:

- Table/card shell: shadow rất nhẹ hoặc không shadow.
- Focused workbench/hero-like surfaces: có thể dùng shadow sâu hơn nhưng opacity thấp.
- Destructive/alert states không dùng shadow để gây chú ý; dùng color/hierarchy.

## Component Translation

### App Shell

App shell là nơi nên mang grid/background atmosphere. Layout cần giữ cảm giác yên, có khoảng thở và không tạo quá nhiều border cạnh tranh.

Translation:

- Main content có background rhythm nhẹ.
- Header border mảnh, không quá nặng.
- Page padding đủ thoáng trên desktop, không làm mobile bị chật.

### Sidebar And Header

Sidebar là navigation vận hành, không phải brand hero. Cần sạch, ít nhiễu, active state rõ.

Translation:

- Giữ nav user behavior như hiện tại.
- Active menu rõ bằng token sidebar/accent.
- Không thêm decoration cạnh tranh với content.
- Label tiếng Việt phải đúng dấu và nhất quán.

### Page Card Shell

Card shell vẫn là convention chính của repo. Direction mới nên làm Card trông như một panel tài chính sạch:

- Border mảnh.
- Radius lớn vừa phải.
- Header có hierarchy rõ.
- Separator nhẹ.
- Không dùng nested Card chỉ để lấy border/radius nếu đã có shared surface phù hợp.

### List Table Surface

Table là bề mặt quan trọng nhất của dashboard. Reference có nhiều card metric, nhưng trong Signapse table phải ưu tiên scan dữ liệu.

Translation:

- Shell nhất quán qua `AppListTable`.
- Header row dịu, không quá đậm.
- Empty state nằm trong table surface.
- Skeleton phải giống bố cục table thật.
- Row hover nhẹ, không làm mất contrast.

### Toolbar

Toolbar là control surface. Nó nên gọn, có nhóm trái/phải rõ, không nổi bật hơn table.

Translation:

- Primary action bên trái.
- Search gần action chính.
- Sort/filter/page size bên phải.
- Control group có border/background nhẹ, gần reference pill/card treatment.

### Forms

Form cần rõ field, description, validation và pending state.

Translation:

- Field spacing thoáng nhưng không quá marketing.
- Description dùng muted foreground.
- Submit/pending state rõ với spinner.
- Cancel trong edit mode giữ ghost variant.

### Empty, Loading, Error, Permission

Các state này phải trông như một phần của system, không phải afterthought.

Translation:

- Empty dùng `<Empty>` và nằm đúng surface.
- Loading skeleton bám bố cục thật.
- Error copy tiếng Việt rõ, không kỹ thuật hóa quá mức.
- Permission denied nói rõ quyền cần thiết nhưng không đổ lỗi người dùng.

### Workbench Screens

Các màn như market query hoặc graph view cần áp dụng direction thận trọng hơn list page vì nhiều nội dung đặc thù.

Translation:

- Giữ decision path rõ.
- Dùng surface hierarchy thay vì chia quá nhiều card cùng trọng lượng.
- Evidence, status, confidence, limitations cần dễ scan.
- Decorative atmosphere không được che mất canvas hoặc data.

## Pilot Plan

Pilot mặc định:

- List/detail/form pilot: `/system-prompts`
- Rich workbench pilot: `/market-query`

Lý do:

- `/system-prompts` mới, có list, create, edit, delete, permission, empty/loading/error states tương đối rõ.
- `/market-query` có nội dung phân tích giàu hierarchy, phù hợp kiểm tra direction trên workbench thật.

Nếu cần đổi pilot:

- `/economic-calendar` là lựa chọn tốt cho list/detail data-heavy.
- `/graph-view` là lựa chọn tốt cho canvas/workspace, nhưng rủi ro cao hơn vì có đồ thị và layout phức tạp.

## Rollout Order

1. Hoàn thiện tài liệu này.
2. Token pass trong `app/globals.css`.
3. App shell pass trong `app/(main)/layout.tsx`.
4. Shared surface pass cho `AppListTable` và `AppListToolbar`.
5. Pilot `/system-prompts`.
6. Pilot `/market-query`.
7. Rollout sang các active list pages.
8. Rollout sang detail/form pages.
9. Rollout sang workbench/canvas pages còn lại.
10. Cập nhật `AGENTS.md` nếu có rule visual bền vững cần review.

## Deferred Rollout Targets

Các page nên được xem xét sau pilot:

- `/economic-calendar`
- `/news-outlets`
- `/news-articles`
- `/events`
- `/ai-provider-configs`
- `/cronjobs`
- `/roles`
- `/graph-view`

Các route hidden hoặc legacy redirect không nên là mục tiêu đầu tiên:

- `/topics`
- `/sources`
- `/news-sources`
- `/source-documents`

## Intentional Deviations From Reference

- Không dùng hero headline lớn trong admin pages.
- Không dùng nhiều CTA marketing như reference.
- Không biến mọi content block thành card marketing.
- Không giảm mật độ table quá nhiều.
- Không thêm decorative floating cards nếu không phục vụ dữ liệu.
- Không dùng animation reveal lớn trong first pass.
- Không đổi font khỏi Be Vietnam Pro trong first pass.

## Visual QA Checklist

Trước khi coi rollout visual là xong, cần kiểm tra:

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

## Implementation Guardrails

- Không sửa `components/ui`.
- Không đổi workflow nghiệp vụ.
- Không đổi API contract.
- Không hardcode màu nếu token/shared surface xử lý được.
- Không sửa các page ngoài pilot trong first implementation pass.
- Nếu full lint fail do nợ cũ, báo rõ lỗi nào không thuộc change.
- Nếu visual direction làm giảm readability hoặc density, ưu tiên readability.

## Rollback Notes

Nếu rollout visual gây vấn đề:

- Có thể revert code token/surface/pilot nhưng giữ lại tài liệu này để làm reference.
- Nếu direction không còn phù hợp, cập nhật tài liệu này trước rồi mới sửa code.
- Không cần rollback backend hoặc data vì direction này chỉ ảnh hưởng UI/documentation.
