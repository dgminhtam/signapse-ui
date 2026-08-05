Kết luận: nên xem landing hiện tại là bản dùng một lần và xây lại toàn bộ. Chỉ giữ route/i18n, Server Component, CTA theo trạng thái đăng nhập, Geist và semantic tokens; không kế thừa cấu trúc hoặc nội dung cũ.

Không có file nào được sửa; working tree vẫn sạch.

## Vì sao cần xây lại

- Trang hiện là chuỗi `Hero → Problem → Pillars → Pipeline → Personalization → Trust → CTA`, nhưng hầu hết đều dùng cùng kiểu “heading + card grid”, tạo thành một card wall thiếu trọng tâm ([page.tsx](/D:/Development/Project/signapse-ui/app/[lang]/page.tsx:66)).
- Hero mock dùng chart và số liệu hardcode; “Xem evidence” lại là badge không tương tác. Đây không phải product proof đáng tin ([page.tsx](/D:/Development/Project/signapse-ui/app/[lang]/page.tsx:254)).
- Nội dung đang overclaim những tính năng runtime không còn có: Market Query với evidence/limitations, graph theo workspace, Theme node và AI bị giới hạn bởi watchlist ([vi.ts](/D:/Development/Project/signapse-ui/app/lib/i18n/dictionaries/vi.ts:551), [APIMAPPING.md](/D:/Development/Project/signapse-ui/docs/APIMAPPING.md:242)).
- Spec landing vẫn có `Purpose: TBD`, chồng cả câu chuyện V1 và V2, đồng thời khóa landing vào CSS mock tạm thời ([spec.md](/D:/Development/Project/signapse-ui/openspec/specs/public-landing-page/spec.md:3)).
- Route được gọi là public nhưng proxy hiện chỉ khai báo sign-in là public; `/{lang}` vẫn bị bảo vệ trong Clerk mode ([proxy.ts](/D:/Development/Project/signapse-ui/proxy.ts:12)).
- Design system chung nói Signapse “không phải landing page marketing”, nên landing cần một direction riêng thay vì cố áp dashboard rules trực tiếp ([DESIGN.md](/D:/Development/Project/signapse-ui/docs/design/DESIGN.md:25)).

## Định vị mới

Đề xuất định vị Signapse là:

> **Event-aware Market Intelligence Workspace**  
> Không chỉ thấy giá thay đổi. Thấy bối cảnh thị trường quanh biến động đó.

Đối tượng chính:

- Market analyst.
- Trader thiên về research.
- Người theo dõi nhiều tài sản, tin tức và sự kiện kinh tế.

Giá trị cốt lõi:

> Signapse đặt giá, sự kiện, phản ứng, nguồn tin và narrative trong cùng một workspace để người dùng phát hiện điều đáng chú ý, kiểm tra bằng chứng liên quan và khám phá quan hệ phía sau biến động.

Ba năng lực chính có thể chứng minh bằng runtime:

1. **Event-aware Charts** — biểu đồ giá có event annotation, economic calendar, hot event và warm period.
2. **Reaction & Evidence** — direction, horizon, confidence, reasoning, outcome và nguồn tin tại event detail khi dữ liệu khả dụng.
3. **Connected Market Graph** — quan hệ giữa event, asset, news article và narrative.

AI Assistant chỉ là lớp hỗ trợ xuyên suốt: hội thoại và lịch sử theo active workspace. Không gọi nó là Market Query có evidence sheet hoặc reasoning chain.

## Bố cục và thành phần mới

| Thứ tự | Thành phần | Nội dung và mục tiêu |
|---|---|---|
| 1 | `PublicHeader` | Logo; anchor “Sản phẩm”, “Cách hoạt động”, “Độ tin cậy”; chuyển VI/EN; Đăng nhập; một CTA chính. Mobile có disclosure điều hướng thật, không chỉ ẩn nav. |
| 2 | `HeroProductProof` | Một H1 theo outcome, mô tả ngắn, CTA “Yêu cầu truy cập”, secondary “Xem cách hoạt động”. Bên cạnh chỉ dùng một product proof rõ ràng: chart thật có event annotation. |
| 3 | `ContextGap` | Một dải nội dung ngắn giải thích vấn đề: giá, lịch kinh tế, tin tức và evidence đang nằm ở các công cụ rời rạc. Không dùng bốn problem cards. |
| 4 | `AnalysisFlow` | Luồng người dùng: **Theo dõi → Đặt vào bối cảnh → Kiểm chứng → Khám phá**. Đây là user journey, không phải pipeline kỹ thuật nội bộ. |
| 5 | `EventAwareChartsChapter` | Chương lớn dạng editorial: copy bên trái, media sản phẩm bên phải. Giải thích cách đặt event/calendar cạnh diễn biến giá. |
| 6 | `ReactionEvidenceChapter` | Cho thấy event detail, reaction, confidence, reasoning, outcome và source evidence. Luôn dùng cụm “khi dữ liệu khả dụng”. |
| 7 | `ConnectedGraphChapter` | Cho thấy graph thật với event–asset–news–narrative. Không có workspace slice, Theme node hoặc warm-episode node. |
| 8 | `WorkspaceAssistantSection` | Dashboard/watchlist giúp biết điều gì đáng chú ý; AI conversation giúp tiếp tục phân tích trong active workspace. Không claim watchlist là evidence boundary. |
| 9 | `TrustBoundary` | Nêu provenance, confidence, observed outcome và giới hạn sản phẩm. “Analysis, not prediction”; không trade signal, buy/sell advice hoặc automated execution. |
| 10 | `FinalAccessCta` + `PublicFooter` | Lặp đúng một conversion path; footer chỉ chứa link thật: đăng nhập, liên hệ, locale. Chưa thêm Docs/Privacy/Terms nếu chưa có route. |

CTA mặc định cho lần rebuild vẫn có thể dùng `mailto:` để tránh mở rộng sang backend lead form. Tuy nhiên tài liệu phải nói rõ người dùng sẽ gửi gì và nhận phản hồi thế nào. Form request-access nên là change riêng khi đã có data owner, storage và privacy policy.

## Hướng visual

Theo kết quả `ui-ux-pro-max`, hướng phù hợp nhất là **Product Demo + Features / Real-Time Operations**, với:

- Variance `5/10`: hiện đại nhưng không phá cấu trúc đọc.
- Motion `2/10`: rất ít chuyển động.
- Density `3/10`: nhiều khoảng thở cho landing.
- Hero-centric nhưng chỉ một proof chính.
- Các chương sản phẩm lớn xen kẽ media/copy, thay cho bento hoặc card wall.
- Giữ Geist/Geist Mono và token hiện tại; không áp font/palette sinh tự động từ skill.
- Không thêm GSAP hoặc animation dependency. CSS transition 150–250 ms là đủ.
- Light/dark cùng hierarchy; accent chỉ dành cho CTA và tín hiệu nghiệp vụ thật.
- Tablet dưới khoảng 1200px vẫn dùng hero một cột để tránh xung đột breakpoint hiện tại.
- Mobile và zoom 200% reflow hoàn toàn; không có popup absolute đè nội dung.

Media cần chuẩn bị:

1. Chart thật đã làm sạch dữ liệu nhạy cảm.
2. Event detail với reaction/evidence.
3. Graph thật.
4. Dashboard hoặc AI conversation, nếu cần cho section phụ.

Nếu chưa có screenshot được duyệt, dùng illustration bám đúng UI/runtime và ghi rõ “Minh họa”; tuyệt đối không tạo confidence, evidence count hay control giả.

## Claim boundary cho nội dung

Được phép nói:

- Chart chọn tài sản từ watchlist, có live quote/candle.
- Có event annotation và economic-calendar layer.
- Event detail có reaction/evidence khi dữ liệu khả dụng.
- Graph nối event, asset, news article và narrative.
- AI conversation có session/history theo active workspace.

Không được nói:

- Market Query có structured evidence, limitations hoặc reasoning chain.
- AI chỉ dùng evidence từ watchlist.
- Graph được lọc theo workspace/watchlist.
- Graph có Theme node.
- Team collaboration hoặc shared workspace membership.
- Trade signal, prediction, entry/stop/target, P&L hay auto execution.

## Kế hoạch tài liệu

Tạo một nguồn bền vững duy nhất:

`docs/design/LANDING.md`

Nội dung:

1. ICP và Jobs To Be Done.
2. Product promise và differentiation.
3. Capability truth table: `vấn đề → thao tác → kết quả → bằng chứng runtime`.
4. Claim được phép/cấm.
5. Message hierarchy VI/EN và glossary thuật ngữ.
6. Section/component map.
7. CTA state matrix cho anonymous/authenticated.
8. Media inventory.
9. Responsive, accessibility, SEO và performance criteria.
10. Quan hệ với `DESIGN.md`: landing kế thừa token/accessibility nhưng override dashboard composition.

Sau khi plan được duyệt, tạo OpenSpec change:

```text
openspec/changes/rebuild-public-landing-page/
├── proposal.md
├── design.md
├── tasks.md
└── specs/
    ├── public-landing-page/spec.md
    └── product-localization/spec.md
```

Change phải dùng `MODIFIED/REMOVED` để thay requirements cũ, không tiếp tục thêm `ADDED` chồng lớp. Không sửa hai archive lịch sử.

## Thứ tự triển khai sau này

1. Chốt `LANDING.md`, claim matrix, CTA destination và asset được phép công khai.
2. Tạo OpenSpec proposal và wireframe content-first ở 375, 768, 1024 và 1440px.
3. Sửa public-route contract trước.
4. Thay toàn bộ [page.tsx](/D:/Development/Project/signapse-ui/app/[lang]/page.tsx:54) và schema `landing` trong hai dictionary; xóa helpers/keys cũ.
5. Thêm media đã duyệt, metadata riêng, header/footer và locale switch.
6. Kiểm tra `/vi` và `/en`, anonymous/authenticated, light/dark, keyboard, reduced motion, zoom 200%.
7. Chạy OpenSpec validation, lint, typecheck, build và static search các claim/key cũ.

Không thêm testimonial, logo khách hàng, pricing, performance metric hoặc integration section cho tới khi có dữ liệu thật chứng minh.