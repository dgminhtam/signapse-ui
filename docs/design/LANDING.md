# Signapse Public Landing Page

> Trạng thái: Đã chốt cho OpenSpec proposal và implementation  
> Phạm vi: Landing công khai tại `/vi` và `/en`  
> Cập nhật gần nhất: 2026-08-05

## Authority

Tài liệu này là nguồn chuẩn cho định vị, nội dung, bố cục, CTA, claim và media của public landing page Signapse.

- `docs/design/LANDING.md` sở hữu product story và page-specific design direction của landing.
- `docs/design/DESIGN.md` vẫn sở hữu shared tokens, typography, theme parity, component chrome và accessibility conventions.
- Runtime frontend, OpenSpec capability specs và `docs/APIMAPPING.md` sở hữu sự thật về tính năng đang khả dụng.
- OpenSpec change của landing sở hữu các requirement có thể kiểm chứng và kế hoạch triển khai.

Khi các nguồn xung đột, landing chỉ được claim capability đã có surface frontend khả dụng. Backend-only endpoint, code legacy hoặc roadmap không được xem là tính năng công khai. Claim matrix trong tài liệu này phải được cập nhật trước khi landing copy mở rộng theo capability mới.

## Purpose

Landing giúp một người chưa biết Signapse hiểu trong một lượt đọc:

1. Signapse dành cho ai.
2. Vấn đề phân tích thị trường nào sản phẩm giải quyết.
3. Những surface nào chứng minh được giá trị đó.
4. Giới hạn của sản phẩm.
5. Cách yêu cầu truy cập hoặc mở dashboard.

### Goals

- Định vị Signapse là workspace phân tích thị trường theo bối cảnh sự kiện.
- Chuyển câu chuyện từ danh sách tính năng sang hành trình phân tích có thể truy vết.
- Dùng product proof thật thay cho mock dashboard hoặc số liệu dựng sẵn.
- Chuyển khách phù hợp sang một đường dẫn yêu cầu truy cập rõ ràng.
- Giữ copy tiếng Việt và tiếng Anh chính xác với runtime hiện tại.
- Đạt WCAG 2.2 AA, responsive và light/dark parity.

### Non-goals

- Không định vị Signapse là nền tảng trade signal, tư vấn mua/bán hoặc hệ thống tự động đặt lệnh.
- Không hứa dự báo chắc chắn, lợi nhuận, hiệu suất đầu tư hoặc độ chính xác không có số liệu kiểm chứng.
- Không quảng bá backend-only capability hoặc surface frontend đã bị loại bỏ.
- Không thêm pricing, testimonial, customer logo, comparison table hoặc performance metric khi chưa có dữ liệu và quyền công khai.
- Không tạo request-access form, CRM integration hoặc lead-storage workflow trong lần rebuild này.
- Không biến landing thành tài liệu kỹ thuật về pipeline AI hoặc admin workflow nội bộ.

## Audience And Jobs To Be Done

### Primary audience

- Market analyst cần kết nối biến động giá với sự kiện và nguồn tin liên quan.
- Trader thiên về research cần kiểm tra bối cảnh trước khi tự đưa ra quyết định.
- Người theo dõi nhiều tài sản, tin tức và sự kiện kinh tế trong một workspace.

Landing không được ngầm hứa team collaboration, shared workspace membership hoặc portfolio execution vì runtime hiện tại không cung cấp các capability đó.

### Primary job

> Khi thị trường biến động, tôi muốn đặt giá, sự kiện, phản ứng và nguồn tin liên quan vào cùng một bối cảnh để biết điều gì đáng chú ý, kiểm tra bằng chứng và tiếp tục phân tích mà không phải ghép thủ công nhiều công cụ rời rạc.

### Supporting jobs

- Theo dõi các tài sản quan trọng trong workspace đang hoạt động.
- Xem sự kiện và lịch kinh tế cạnh diễn biến giá.
- Đọc phản ứng thị trường và nguồn bằng chứng khi dữ liệu khả dụng.
- Khám phá quan hệ giữa event, asset, news article và narrative.
- Tiếp tục hội thoại phân tích trong Trợ lý AI của active workspace.

## Positioning And Locked Message Hierarchy

### Category

**Event-aware Market Intelligence Workspace**

Signapse khác một charting terminal, news reader hoặc chatbot độc lập ở chỗ sản phẩm đặt các surface đó quanh cùng lớp sự kiện và quan hệ thị trường. Landing phải nói về khả năng quan sát, kiểm tra và truy vết; không khẳng định quan hệ nhân quả khi dữ liệu chỉ cho thấy sự liên quan.

### Locked first-viewport copy

| Vai trò | Tiếng Việt | English |
| --- | --- | --- |
| Eyebrow | Phân tích thị trường theo bối cảnh sự kiện | Event-aware market intelligence |
| H1 | Không chỉ thấy giá thay đổi. Thấy bối cảnh quanh biến động đó. | See more than a price move. See the market context around it. |
| Supporting copy | Signapse đặt dữ liệu giá, sự kiện, phản ứng và nguồn tin trong cùng một workspace để bạn nhận ra điều đáng chú ý, kiểm tra bằng chứng liên quan và khám phá các mối quan hệ quanh biến động. | Signapse brings price data, market events, reactions, and sources into one workspace so you can spot what matters, inspect related evidence, and explore the relationships around a move. |
| Primary CTA | Yêu cầu truy cập | Request access |
| Hero secondary CTA | Xem cách hoạt động | See how it works |
| Signed-in CTA | Mở bảng điều khiển | Open dashboard |
| Trust line | Hỗ trợ phân tích dựa trên dữ liệu và nguồn tin — không phải tư vấn giao dịch hay cam kết dự báo. | Evidence-led analysis support — not trading advice or a guaranteed forecast. |

Các section body copy có thể được tinh chỉnh khi implementation, nhưng không được thay đổi audience, promise, capability boundary hoặc ý nghĩa của các câu đã khóa ở trên nếu chưa cập nhật tài liệu này.

## Canonical Product Language

| Khái niệm | Copy tiếng Việt | English | Nghĩa chính xác trên landing | Tránh dùng |
| --- | --- | --- | --- | --- |
| Workspace | workspace | workspace | Ngữ cảnh làm việc đang hoạt động của người dùng | shared workspace, team workspace |
| Tracked assets | danh sách tài sản theo dõi | tracked asset list | Một danh sách asset thuộc active workspace | named watchlists, watchlist groups |
| Market event | sự kiện thị trường | market event | Sự kiện có thời điểm, asset liên quan và metadata khả dụng | signal, guaranteed catalyst |
| Market reaction | phản ứng thị trường | market reaction | Đánh giá direction, horizon, confidence và reasoning khi có dữ liệu | prediction, trade setup |
| Evidence | nguồn tin và bằng chứng | sources and evidence | News article hoặc source context giúp truy vết event | AI proof, guaranteed truth |
| Narrative | mạch diễn giải thị trường | market narrative | Narrative node hoặc quan hệ narrative đã có trong graph | dedicated narrative workspace |
| Confidence | độ tin cậy | confidence | Metadata đánh giá của hệ thống, không phải xác suất lợi nhuận hoặc độ chính xác dự báo | win rate, forecast accuracy |
| Observed outcome | diễn biến ghi nhận | observed outcome | Phản ứng thực tế được ghi nhận khi dữ liệu khả dụng | result, guaranteed impact |
| Event-aware Charts | Biểu đồ theo bối cảnh sự kiện | Event-aware Charts | Candle chart có event/calendar context | trading signals |
| Reaction & Evidence | Phản ứng và bằng chứng | Reaction & Evidence | Event detail và annotation context có thể truy vết | Market Query evidence sheet |
| Connected Market Graph | Đồ thị quan hệ thị trường | Connected Market Graph | Graph của event, asset, news article và narrative | workspace graph slice, Theme node |
| AI Assistant | Trợ lý AI | AI Assistant | Hội thoại text-only có session/history theo active workspace | Market Query workbench |

Không dùng chuỗi copy Việt–Anh dày đặc nếu đã có cách diễn đạt tiếng Việt tự nhiên. Tên feature tiếng Anh chỉ xuất hiện như tên sản phẩm hoặc lần giải thích đầu tiên.

## Claim Matrix

| Surface | Claim được phép công khai | Qualifier bắt buộc | Không được claim | Runtime evidence |
| --- | --- | --- | --- | --- |
| Workspace và tracked assets | Người dùng có thể quản lý danh sách tài sản theo dõi của active workspace; chart chọn asset từ danh sách này. | Chỉ có một tracked-asset list cho active workspace. | Named/grouped/nested watchlists; shared team workspace; watchlist là evidence boundary của AI. | `openspec/specs/workspace-watchlist-management/spec.md`; `openspec/specs/market-chart-candle-workbench/spec.md` |
| Event-aware Charts | Chart hiển thị historical candles cho asset được theo dõi, có event annotation và economic-calendar context; live quote hoặc partial candle có thể được cập nhật qua stream. | Dùng từ “live” riêng cho dữ liệu chart. Trạng thái có thể stale, disconnected hoặc market closed. | Real-time intelligence toàn hệ thống; provider uptime guarantee; arbitrary symbol charting; trade entry/stop/target. | `openspec/specs/market-chart-candle-workbench/spec.md`; `openspec/specs/market-chart-live-sse-stream/spec.md`; `openspec/specs/market-chart-economic-calendar-events/spec.md` |
| Annotation, reaction và evidence | Annotation/event detail có thể hiển thị event time, direction, horizon, confidence, reasoning, observed outcome và linked evidence khi các field đó khả dụng. | Luôn dùng “khi dữ liệu khả dụng”. Confidence không phải forecast accuracy; liên quan theo thời gian không tự động chứng minh quan hệ nhân quả. | Guaranteed cause; prediction; reaction luôn tồn tại; evidence sheet của AI Assistant. | `openspec/specs/event-read-and-enrichment/spec.md`; `openspec/specs/event-market-reactions-ui/spec.md`; `openspec/specs/market-chart-annotation-popup-surface/spec.md` |
| Connected Market Graph | Graph giúp khám phá node `event`, `asset`, `news-article`, `narrative` và các quan hệ hiện có giữa chúng. | Theme chỉ là metadata trên event/narrative; graph hiện không nhận workspace/watchlist filter. | Theme hoặc warm-episode node; workspace-focused graph slice; dedicated narrative management. | `docs/APIMAPPING.md` mục API graph view; `openspec/specs/graph-view-backend-contract/spec.md` |
| AI Assistant | Trợ lý AI cung cấp conversation text-only, persisted history và session theo active workspace. | Submission là synchronous; active workspace scope là conversation state/request scope, không phải cam kết mọi câu trả lời chỉ dùng watchlist evidence. | Streaming tokens; structured analysis workbench; evidence/limitations sheet; attachments; manual Telegram delivery; route Market Query. | `openspec/specs/ai-assistant-market-conversations/spec.md`; `docs/APIMAPPING.md` mục API market query |
| Narratives | Landing có thể nói graph chứa narrative node và quan hệ narrative–event/narrative–asset. | Narrative chỉ được trình bày trong phạm vi graph đang có. | Narrative list/detail, refresh workflow hoặc dedicated narrative workspace. | `docs/APIMAPPING.md` mục API graph view và API narratives |
| Telegram | Không đưa Telegram vào primary landing story của lần rebuild này. | Chỉ đánh giá lại sau khi frontend contract drift được xử lý và có product reason cho audience công khai. | Gửi thủ công câu trả lời AI sang Telegram; end-user alerting không cần cấu hình/quyền. | `docs/APIMAPPING.md` mục API telegram |
| Trading outcomes | Signapse hỗ trợ quá trình phân tích và kiểm chứng nguồn. | Trust copy phải xuất hiện trước final CTA hoặc trong cùng trust section. | Buy/sell advice; signal generation; automated execution; P&L; guaranteed forecast; performance return. | Product boundary của landing |

### Global claim rules

- Không biến dữ liệu optional thành capability luôn khả dụng.
- Không dùng backend-only API làm bằng chứng cho public claim.
- Không dùng “AI-powered” như giá trị độc lập; phải nói rõ người dùng xem hoặc làm được gì.
- Không gọi correlation là causation.
- Không dùng số liệu hiệu quả, customer count, uptime, accuracy hoặc conversion khi chưa có nguồn được duyệt.
- Mọi headline, caption, alt text và metadata cũng phải tuân theo claim matrix.

## CTA Contract

### Locked destinations

```text
Request access: mailto:request-access@signapse.ai?subject=Signapse%20access%20request
Sign in:        /{lang}/sign-in
Open dashboard: /{lang}/dashboard
How it works:   #how-it-works
Product:        #product
Trust:          #trust
```

| Trạng thái | Vị trí | CTA | Destination | Hành vi |
| --- | --- | --- | --- | --- |
| Chưa đăng nhập | Header | Yêu cầu truy cập / Request access | Request-access `mailto:` | Mở email client của người dùng. |
| Chưa đăng nhập | Header secondary | Đăng nhập / Sign in | `/{lang}/sign-in` | Mở Clerk sign-in theo locale. |
| Chưa đăng nhập | Hero primary | Yêu cầu truy cập / Request access | Request-access `mailto:` | Cùng destination với header; không tạo funnel thứ hai. |
| Chưa đăng nhập | Hero secondary | Xem cách hoạt động / See how it works | `#how-it-works` | Cuộn tới user journey. |
| Chưa đăng nhập | Final CTA | Yêu cầu truy cập / Request access | Request-access `mailto:` | Cùng destination với hero. |
| Đã đăng nhập | Header, Hero, Final CTA | Mở bảng điều khiển / Open dashboard | `/{lang}/dashboard` | Mở protected dashboard theo locale. |
| Mọi người dùng | Footer contact | `request-access@signapse.ai` | Cùng request-access email | Hiển thị địa chỉ email để có thể copy khi máy không cấu hình mail client. |

### CTA behavior rules

- Microcopy cạnh request-access CTA phải nói rõ link sẽ mở ứng dụng email.
- Landing không hiển thị success toast hoặc confirmation giả vì nó không biết email đã được gửi hay chưa.
- Không dùng “Start free”, “Create account”, “Book demo” hoặc “Get started” khi chưa có destination tương ứng.
- Không thêm form trong landing change. Request form chỉ được đề xuất riêng khi đã chốt data owner, storage, abuse protection, privacy notice và success state.
- CTA analytics không nằm trong scope này; chỉ thêm khi có analytics event contract và consent policy.

## Public Asset Policy

### Approved now

Các asset sau đã nằm trong public runtime và được phép dùng trên landing:

| Asset | Vai trò được phép |
| --- | --- |
| `public/favicon.svg` | Favicon và browser identity. |
| `public/images/signapse_logo_dark.svg` | Logo vector trên nền phù hợp. |
| `public/images/signapse_logo_light.svg` | Logo vector trên nền phù hợp. |
| `public/images/signapse_logo_dark_2048x2048.webp` | Raster brand asset hoặc social artwork khi cần. |
| `public/images/signapse_logo_light_2048x2048.webp` | Raster brand asset hoặc social artwork khi cần. |

Ưu tiên SVG cho UI. Hai bản WebP chỉ dùng khi consumer cần raster; không tải file 2048px nếu kích thước hiển thị nhỏ hơn đáng kể.

### Product captures permitted after review

Hiện chưa có product screenshot nào được duyệt công khai. Các slot dưới đây được phép tạo, nhưng chỉ chuyển sang trạng thái approved sau khi đáp ứng checklist ở phần tiếp theo.

| Planned asset | Surface được capture | Vị trí | Trạng thái |
| --- | --- | --- | --- |
| `public/images/landing/hero-market-chart.webp` | Market chart với candle, event annotation và calendar context thật | Hero | Chưa tồn tại; cần capture và duyệt |
| `public/images/landing/event-reaction-evidence.webp` | Event detail hoặc quick detail có reaction và source evidence khả dụng | Reaction & Evidence chapter | Chưa tồn tại; cần capture và duyệt |
| `public/images/landing/connected-market-graph.webp` | Graph có event, asset, news article và narrative | Connected Market Graph chapter | Chưa tồn tại; cần capture và duyệt |
| `public/images/landing/workspace-assistant.webp` | Workspace overview hoặc Trợ lý AI text-only | Supporting section, optional | Chưa tồn tại; chỉ thêm khi giúp câu chuyện rõ hơn |

### Capture approval checklist

Một product capture chỉ được công khai khi tất cả điều kiện sau đạt:

- Dùng seeded/demo workspace hoặc dữ liệu đã được chủ sở hữu xác nhận cho phép công khai.
- Không có tên, email, avatar, workspace riêng, watchlist riêng hoặc thông tin nhận dạng người dùng thật.
- Không có API key, token, permission detail, internal hostname, request payload, console log hoặc admin-only control nhạy cảm.
- Không hiển thị unreleased hoặc backend-only capability.
- Không chứa customer logo, testimonial, portfolio value, P&L hoặc performance metric chưa được duyệt.
- Headline, article excerpt và source content tuân thủ quyền sử dụng; ưu tiên demo copy do Signapse sở hữu hoặc dữ liệu được phép tái sử dụng.
- Vendor/source attribution vẫn hiển thị khi license hoặc ngữ cảnh yêu cầu.
- Số liệu trong capture là dữ liệu demo có chủ đích, không phải số ngẫu nhiên được trình bày như runtime truth.
- Crop không làm thay đổi ý nghĩa hoặc che limitation/status quan trọng.
- Có localized alt text; nội dung thiết yếu trong ảnh cũng được giải thích bằng text cạnh ảnh.
- Asset có intrinsic dimensions, được tối ưu WebP/AVIF và không gây layout shift.

### Prohibited assets and treatments

- Không publish `docs/design/design_light.png` hoặc `docs/design/design_dark.png`; đây là design reference, không phải product proof.
- Không dùng các bản logo trong `docs/design/logo/` làm runtime source khi đã có canonical asset dưới `public/images/`.
- Không dựng lại synthetic dashboard hiện tại với chart bars, confidence, evidence count hoặc control giả.
- Không dùng stock trader imagery, AI brain/blob, neon crypto aesthetic, ticker wallpaper hoặc candlestick chỉ để trang trí.
- Không dùng screenshot từ production/private workspace.
- Không dùng customer logo, quote, rating hoặc certification khi chưa có quyền bằng văn bản.
- Không dùng generated image để giả làm screenshot sản phẩm.

Nếu chưa có capture được duyệt, hero phải dùng text-first composition và bỏ media slot. Không dùng placeholder mock để lấp chỗ trống.

## Information Architecture

| Thứ tự | Section / route-local component | ID | Mục tiêu | Nội dung chính | Product proof |
| --- | --- | --- | --- | --- | --- |
| 1 | `PublicHeader` | `#top` | Nhận diện, điều hướng và access path | Logo; Sản phẩm; Cách hoạt động; Độ tin cậy; locale; auth-aware CTA | Brand asset |
| 2 | `HeroProductProof` | — | Trả lời ngay đối tượng, outcome và hành động tiếp theo | Locked H1/supporting copy; primary và secondary CTA; trust line ngắn | Approved hero chart capture; nếu chưa có thì text-first |
| 3 | `AnalysisFlow` | `#how-it-works` | Giải thích hành trình, không giải thích pipeline nội bộ | Theo dõi → Đặt vào bối cảnh → Kiểm chứng → Khám phá | Một relationship line tĩnh; text vẫn tự đủ nghĩa |
| 4 | `ProductStory` | `#product` | Chứng minh ba giá trị chính bằng ba chương lớn | Event-aware Charts; Reaction & Evidence; Connected Market Graph | Một approved capture cho mỗi chapter khi có |
| 5 | `WorkspaceAssistantSection` | `#workspace-ai` | Cho thấy lớp ngữ cảnh và cách tiếp tục phân tích | Tracked assets, active workspace, text-only AI conversation/history | Optional approved capture |
| 6 | `TrustBoundary` | `#trust` | Xây niềm tin bằng traceability và giới hạn rõ | Nguồn tin; optional confidence/outcome; analysis-not-prediction boundary | Text và một evidence example đã duyệt |
| 7 | `FinalAccessCta` | `#access` | Kết thúc bằng cùng một conversion path | Outcome recap; auth-aware CTA; email behavior microcopy | Không cần media |
| 8 | `PublicFooter` | — | Cung cấp fallback và locale path | Brand; sign-in; request-access email; locale | Brand asset |

### Composition rules

- Không tạo section riêng chỉ để lặp lại problem statement; hero và `AnalysisFlow` đã sở hữu vấn đề.
- `ProductStory` dùng ba chapter editorial lớn, không dùng ba feature cards đồng trọng lượng.
- Mỗi chapter có một outcome heading, một đoạn giải thích, tối đa ba proof points và một media surface.
- Essential text đứng ngoài screenshot; screenshot không phải tài liệu đọc duy nhất.
- Header, Hero và Final CTA dùng cùng một primary destination.
- Footer chỉ hiển thị link đang tồn tại; không render Docs, Privacy hoặc Terms trước khi route thật có sẵn.
- Route-specific sections ở cạnh route. Không tạo shared component hoặc wrapper mới chỉ cho landing.

## Visual Direction

Tên direction: **Evidence-Led Editorial**.

Landing phải gợi cảm giác một market briefing rõ ràng, chính xác và có thể truy vết; không phải một dashboard demo dày đặc hoặc trang AI marketing chung chung. Dấu ấn chính là một mạch đọc liên tục từ biến động → sự kiện → phản ứng/bằng chứng → quan hệ.

### Design dials

- Variance: `5/10` — hiện đại, có nhịp editorial nhưng không phá cấu trúc đọc.
- Motion: `2/10` — transition nhẹ, không choreography hoặc scroll-jacking.
- Density: `3/10` — nhiều khoảng thở hơn dashboard.

### Visual rules

- Giữ Geist và Geist Mono theo stack hiện tại.
- Dùng semantic tokens, shadcn wrapper chrome và light/dark logic từ `DESIGN.md`; không thêm landing-only raw palette.
- Dùng một accent có kiểm soát cho primary CTA và tín hiệu nghiệp vụ thật.
- Nền grid hoặc relationship line chỉ được dùng rất nhẹ ở hero/flow và phải decorative đối với assistive technology.
- Product capture là visual chính; icon chỉ hỗ trợ scan và dùng Lucide, không dùng emoji.
- Section rhythm xen kẽ copy/media ở desktop nhưng giữ cùng reading order ở mobile.
- Không dùng bento wall, testimonial carousel, logo cloud, glassmorphism, purple gradient hoặc AI decoration không có product meaning.
- Không thêm GSAP hoặc animation dependency. CSS transition `150–250ms` là đủ cho hover/focus/disclosure.

## Responsive Behavior

| Viewport | Quy tắc |
| --- | --- |
| `< 768px` | Một cột; copy trước media; CTA full-width khi cần; mobile navigation dùng native disclosure; touch target ưu tiên tối thiểu 44×44px. |
| `768px–1199px` | Hero và product chapters vẫn một cột để product capture có đủ chiều rộng; flow có thể dùng hai cột nếu không làm đứt thứ tự đọc. |
| `≥ 1200px` | Hero có thể dùng split `5/7`; product chapters xen kẽ copy/media; content measure của body copy giữ khoảng 60–70 ký tự mỗi dòng. |
| Zoom `200%` | Reflow như narrow viewport; không page-level horizontal overflow; sticky/fixed surface không che focus hoặc heading. |

- Không đặt essential popup/content bằng absolute positioning trên screenshot mock.
- Media giữ aspect ratio, intrinsic dimensions và không làm thay đổi layout khi tải.
- Chapter order trong DOM luôn là heading/copy trước media, kể cả khi desktop đảo vị trí bằng CSS.

## Accessibility Requirements

- Mục tiêu WCAG 2.2 AA.
- Có skip link tới `<main>` khi header navigation lặp lại trên mọi locale.
- Mỗi route có đúng một `<h1>`; heading hierarchy không bỏ cấp.
- Header dùng `<nav>` có accessible label; mobile disclosure dùng native semantics và hoạt động bằng keyboard.
- Focus-visible luôn rõ, không bị border/background của product frame che mất.
- Link/button có accessible name trùng hoặc làm rõ visible label; icon decorative dùng `aria-hidden`.
- Target tối thiểu 24×24 CSS px và ưu tiên 44×44px trên mobile/coarse pointer.
- Không dùng color làm tín hiệu duy nhất cho direction, confidence, status hoặc graph relation.
- Meaningful image có localized `alt`; decorative image có `alt=""`.
- Alt text mô tả insight của capture, không liệt kê mọi chữ trong screenshot.
- Nội dung và hành động không phụ thuộc hover; screenshot không chứa control trông tương tác được nếu nó chỉ là ảnh.
- Tôn trọng `prefers-reduced-motion`; trang vẫn đầy đủ ý nghĩa khi tắt toàn bộ motion.
- Contrast tối thiểu `4.5:1` cho normal text và `3:1` cho large text, focus indicator và component boundary quan trọng trong cả light/dark mode.
- Trang sử dụng được hoàn toàn bằng keyboard và ở zoom `200%`.

## Localization And Copy Rules

- Mọi user-facing copy, alt text, metadata và accessible label lấy từ dictionary tiếng Việt/tiếng Anh.
- Tiếng Việt là bản biên tập tự nhiên, không phải bản dịch word-for-word từ tiếng Anh.
- Internal anchor IDs giữ ổn định bằng tiếng Anh giữa hai locale.
- Không hardcode `/vi` hoặc `/en`; dùng locale routing helpers.
- Không dùng `event`, `reaction`, `evidence`, `narrative`, `watchlist`, `reasoning` liên tục trong copy tiếng Việt khi canonical Vietnamese term đã được định nghĩa ở trên.
- Tên riêng và canonical feature name có thể giữ tiếng Anh ở lần xuất hiện đầu tiên, sau đó dùng cách gọi tiếng Việt nhất quán.

### Locked metadata

| Locale | Title | Description |
| --- | --- | --- |
| `vi` | Signapse \| Phân tích thị trường theo bối cảnh sự kiện | Kết nối dữ liệu giá, sự kiện, phản ứng và nguồn tin trong một workspace phân tích thị trường có thể truy vết. |
| `en` | Signapse \| Event-aware market intelligence | Connect price data, market events, reactions, and sources in one traceable market intelligence workspace. |

- Metadata dùng Next.js Metadata API và dictionary hiện hành.
- Khai báo canonical locale URL và language alternates cho `/vi` và `/en`.
- Cho tới khi có social artwork riêng được duyệt, Open Graph image chỉ dùng approved brand asset; không dùng product screenshot chưa duyệt.

## Performance And Technical Boundaries

- Landing tại `/{lang}` phải thực sự public và không render protected dashboard shell.
- `/{lang}/dashboard` và các app route khác vẫn protected.
- Giữ landing là Server Component mặc định; chỉ thêm client boundary khi native HTML/CSS không đáp ứng interaction bắt buộc.
- Ưu tiên native disclosure cho mobile navigation; không thêm dependency mới.
- Reuse `Logo`, `Button`, locale routing helpers và shadcn wrappers hiện có.
- Không thêm shared UI abstraction chỉ phục vụ landing.
- Product images dùng `next/image`, intrinsic dimensions và responsive `sizes`.
- Hero image được ưu tiên tải chỉ khi asset đã approved; below-fold images lazy-load.
- Mục tiêu CLS `< 0.1`; không thêm third-party script hoặc external font cho landing.
- Khi rebuild, xóa toàn bộ unused landing mock helpers, copy keys và old section code; không giữ compatibility component không còn caller.

## Acceptance Criteria

### Product and content

- First viewport hiển thị audience outcome, locked promise, CTA và trust boundary trong một lượt scan.
- Ba product chapters là Event-aware Charts, Reaction & Evidence và Connected Market Graph.
- AI Assistant là supporting capability, không phải structured Market Query pillar.
- Mọi copy, metadata, caption và alt text qua claim-matrix review.
- Không còn claim về workspace graph slice, Theme node, watchlist evidence boundary hoặc Market Query evidence sheet.

### Routing and CTA

- Người chưa đăng nhập mở được `/vi` và `/en` mà không bị chuyển tới sign-in.
- Dashboard shell không xuất hiện trên landing.
- Request-access CTA dùng đúng locked `mailto:` destination và có email fallback hiển thị ở footer.
- Sign-in và dashboard destinations giữ locale.
- Anonymous và authenticated CTA states đúng với CTA matrix.

### Media

- Chỉ approved brand asset hoặc approved product capture xuất hiện trên trang.
- Nếu chưa có approved hero capture, hero render text-first và không có synthetic mock.
- Product capture đáp ứng toàn bộ capture approval checklist.
- Không có fake metric, fake control hoặc private/runtime-sensitive data.

### Layout and accessibility

- Kiểm tra ở `375`, `768`, `1024` và `1440px`, light/dark và zoom `200%`.
- Không có page-level horizontal overflow.
- Tab order, focus, skip link, nav disclosure và CTA đều dùng được bằng keyboard.
- Reduced-motion mode không mất nội dung hoặc interaction.
- Screenshot alt text và adjacent copy truyền đạt cùng insight chính.

### Verification

- OpenSpec change dùng `MODIFIED`/`REMOVED` để thay requirement cũ, không chồng thêm “V2” requirements.
- Chạy targeted OpenSpec validation, lint, typecheck và production build.
- Static search xác nhận old landing keys, old mock components và forbidden claims đã được loại bỏ.
- Kiểm tra metadata, canonical/alternate locale URLs và mọi CTA/link destination.

## Deferred Until Explicitly Approved

- Request-access form hoặc CRM integration.
- Pricing, free trial hoặc self-service signup.
- Customer logos, testimonials, ratings, case studies hoặc product metrics.
- Telegram/integration section.
- Interactive product demo, video hoặc autoplay media.
- Client-side scroll animation framework.
- Team collaboration hoặc shared-workspace positioning.
- Dedicated social artwork ngoài approved brand assets.

## Source References

- `docs/design/DESIGN.md`
- `docs/APIMAPPING.md`
- `openspec/specs/public-landing-page/spec.md`
- `openspec/specs/workspace-watchlist-management/spec.md`
- `openspec/specs/market-chart-candle-workbench/spec.md`
- `openspec/specs/market-chart-live-sse-stream/spec.md`
- `openspec/specs/market-chart-economic-calendar-events/spec.md`
- `openspec/specs/event-read-and-enrichment/spec.md`
- `openspec/specs/event-market-reactions-ui/spec.md`
- `openspec/specs/market-chart-annotation-popup-surface/spec.md`
- `openspec/specs/graph-view-backend-contract/spec.md`
- `openspec/specs/ai-assistant-market-conversations/spec.md`

