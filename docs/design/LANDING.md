# Signapse Public Landing Page

> Trạng thái: Đã chốt cho OpenSpec proposal và implementation  
> Phạm vi: Landing công khai tại `/vi` và `/en`  
> Cập nhật gần nhất: 2026-08-10

## Authority

Tài liệu này là nguồn chuẩn cho định vị, nội dung, bố cục, CTA, claim và media của public landing page Signapse.

- `docs/design/LANDING.md` sở hữu product story và page-specific design direction của landing.
- `docs/design/DESIGN.md` vẫn sở hữu shared tokens, typography, theme parity, component chrome và accessibility conventions.
- Runtime frontend, OpenSpec capability specs và `docs/APIMAPPING.md` sở hữu sự thật về tính năng đang khả dụng.
- OpenSpec change của landing sở hữu các requirement có thể kiểm chứng và kế hoạch triển khai.

Khi các nguồn xung đột, landing chỉ được claim capability đã có surface frontend khả dụng. Backend-only endpoint, code legacy hoặc roadmap không được xem là tính năng công khai. Claim matrix trong tài liệu này phải được cập nhật trước khi landing copy mở rộng theo capability mới.

Trong phạm vi public landing `/{lang}`, tài liệu này override các câu dashboard-scoped trong `docs/design/DESIGN.md` về hero/section composition, việc lặp cùng một primary CTA và background grid. `DESIGN.md` vẫn là nguồn chuẩn cho semantic tokens, Geist typography, shadcn chrome, theme parity, responsive và accessibility. Landing chỉ được dùng một treatment grid/relationship decorative ở cấp page, dùng chung cho Hero và Analysis Flow; không lặp treatment này trong product frame/card và phải ẩn khỏi accessibility tree. Primary CTA chỉ được lặp tại Header, Hero và Final CTA với đúng destination trong CTA Contract.

`openspec/specs/public-landing-page/spec.md` hiện là known contract drift, không phải bằng chứng runtime cho claim mới. Các requirement về Market Query như primary pillar, synthetic workspace preview, pipeline nội bộ và workspace-scoped graph phải được `MODIFIED` hoặc `REMOVED` trong OpenSpec proposal trước implementation.

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
- Người theo dõi nhiều tài sản trong workspace đang hoạt động và cần đối chiếu chúng với tin tức, sự kiện kinh tế liên quan.

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
| Supporting copy | Signapse kết hợp dữ liệu giá với bối cảnh thị trường trong một trải nghiệm phân tích. Bạn có thể theo dõi tài sản trong workspace đang hoạt động, xem các sự kiện, phản ứng và nguồn tin liên quan khi dữ liệu khả dụng, rồi khám phá các mối quan hệ quanh biến động. | Signapse combines price data with market context in one analysis experience. Track assets in your active workspace, inspect related events, reactions, and sources when available, and explore the relationships around a move. |
| Primary CTA | Yêu cầu truy cập | Request access |
| Hero secondary CTA | Xem cách hoạt động | See how it works |
| Signed-in CTA | Mở bảng điều khiển | Open dashboard |
| Request-access microcopy | Mở ứng dụng email. | Opens your email app. |
| Trust line | Hỗ trợ phân tích dựa trên dữ liệu và nguồn tin — không phải tư vấn giao dịch hay cam kết dự báo. | Evidence-led analysis support — not trading advice or a guaranteed forecast. |

Implementation dùng các chuỗi trong first viewport và Locked Section Copy làm editorial baseline. Chỉ được sửa lỗi chính tả hoặc ngữ pháp mà không đổi nghĩa; mọi thay đổi về promise, qualifier, capability boundary, hierarchy hoặc CTA phải cập nhật tài liệu này và cả hai locale trong cùng change.

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
| Evaluated outcome | diễn biến đã đánh giá | evaluated outcome | Kết quả đánh giá của phản ứng chính trong chart annotation khi dữ liệu khả dụng | `observedAt` như outcome; result; guaranteed impact |
| Event-aware Charts | Biểu đồ theo bối cảnh sự kiện | Event-aware Charts | Candle chart có event/calendar context khi dữ liệu khả dụng | trading signals |
| Reaction & Evidence | Phản ứng và bằng chứng | Reaction & Evidence | Chi tiết sự kiện hiển thị nguồn tin và thẻ phản ứng khi dữ liệu khả dụng; chart annotation chỉ cung cấp preview ngắn và đường dẫn tới chi tiết | Market Query evidence sheet; annotation evidence reader; `observedAt` như observed outcome |
| Connected Market Graph | Đồ thị quan hệ thị trường | Connected Market Graph | Graph của event, asset, news article và narrative | workspace graph slice, Theme node |
| AI Assistant | Trợ lý AI | AI Assistant | Hội thoại text-only có session/history theo active workspace | Market Query workbench |

Không dùng chuỗi copy Việt–Anh dày đặc nếu đã có cách diễn đạt tiếng Việt tự nhiên. Tên feature tiếng Anh chỉ xuất hiện như tên sản phẩm hoặc lần giải thích đầu tiên.

## Claim Matrix

| Surface | Claim được phép công khai | Qualifier bắt buộc | Không được claim | Runtime evidence |
| --- | --- | --- | --- | --- |
| Workspace và tracked assets | Người dùng có thể quản lý danh sách tài sản theo dõi của active workspace; chart chọn asset từ danh sách này. | Chỉ có một tracked-asset list cho active workspace. | Named/grouped/nested watchlists; shared team workspace; watchlist là evidence boundary của AI. | `openspec/specs/workspace-watchlist-management/spec.md`; `openspec/specs/market-chart-candle-workbench/spec.md` |
| Event-aware Charts | Chart tải historical candles cho asset được chọn từ tracked-asset list và có thể hiển thị market-event annotation cùng economic-calendar event liên quan; live quote hoặc partial candle có thể được cập nhật qua stream. | Annotation và calendar event chỉ xuất hiện khi backend trả dữ liệu phù hợp. Dùng từ “live” riêng cho dữ liệu chart; stream có thể stale, disconnected hoặc market closed, và candle response có thể rỗng. | Real-time intelligence toàn hệ thống; annotation/calendar luôn tồn tại; provider uptime guarantee; arbitrary symbol charting; trade entry/stop/target. | `openspec/specs/market-chart-candle-workbench/spec.md`; `openspec/specs/market-chart-live-sse-stream/spec.md`; `openspec/specs/market-chart-economic-calendar-events/spec.md`; `docs/APIMAPPING.md` mục API market charts |
| Hot-event annotation preview | Annotation popup có thể hiển thị thời điểm, tiêu đề/tóm tắt, phản ứng dự kiến và diễn biến đã đánh giá của phản ứng chính khi các field đó khả dụng; người dùng có thể mở chi tiết sự kiện tương ứng. | Đây là preview ngắn. Outcome chỉ xuất hiện khi `topMarketReaction.outcome` có dữ liệu; tương quan theo thời gian không chứng minh quan hệ nhân quả. | Rich evidence reader trong popup; reasoning/evidence blocks; toàn bộ phản ứng của sự kiện; outcome luôn tồn tại; guaranteed cause hoặc prediction accuracy. | `docs/APIMAPPING.md` mục API market charts; `app/[lang]/(main)/market-charts/market-chart-workbench.tsx` |
| Event detail: reaction và evidence | Chi tiết sự kiện có thể hiển thị nguồn tin liên kết và các thẻ phản ứng thị trường gồm asset, direction, horizon, confidence, reasoning và thời điểm ghi nhận khi dữ liệu khả dụng. | Evidence và reaction đều có thể vắng mặt. `observedAt` là thời điểm ghi nhận, không phải observed/evaluated outcome; confidence không phải forecast accuracy. | Event detail có realized return/evaluated outcome; mọi event luôn có evidence hoặc reaction; guaranteed cause; prediction; AI Assistant evidence sheet. | `docs/APIMAPPING.md` mục API events; `openspec/specs/event-market-reactions-ui/spec.md`; `app/[lang]/(main)/events/[id]/page.tsx`; `app/[lang]/(main)/events/event-quick-detail-content.tsx` |
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

## Locked Section Copy

Các dictionary entry của landing phải bắt đầu từ copy dưới đây. Tên component và role chỉ là implementation mapping, không phải user-facing text.

### `PublicHeader` And `PublicFooter`

| Vai trò | Tiếng Việt | English |
| --- | --- | --- |
| Nav: Product | Sản phẩm | Product |
| Nav: How it works | Cách hoạt động | How it works |
| Nav: Trust | Độ tin cậy | Trust |
| Sign in | Đăng nhập | Sign in |
| Locale group label | Chọn ngôn ngữ | Choose language |
| Vietnamese locale | Tiếng Việt | Tiếng Việt |
| English locale | English | English |
| Footer descriptor | Phân tích thị trường theo bối cảnh sự kiện. | Event-aware market intelligence. |

CTA label trong Header và email fallback trong Footer dùng đúng CTA Contract, không tạo biến thể copy khác.

### `AnalysisFlow` — `#how-it-works`

| Vai trò | Tiếng Việt | English |
| --- | --- | --- |
| H2 | Từ biến động giá đến bối cảnh có thể kiểm tra. | From a price move to context you can inspect. |
| Intro | Hành trình phân tích đi qua bốn bước: chọn tài sản cần theo dõi, đặt diễn biến giá cạnh sự kiện, kiểm tra phản ứng và nguồn liên quan, rồi khám phá các mối quan hệ xung quanh. | The analysis path follows four steps: choose an asset to track, place its price action alongside events, inspect reactions and related sources, then explore the surrounding relationships. |
| Flow label | Theo dõi → Đặt vào bối cảnh → Kiểm tra → Khám phá | Track → Contextualize → Inspect → Explore |
| Step 1 title | Theo dõi | Track |
| Step 1 body | Chọn một tài sản từ danh sách theo dõi của workspace đang hoạt động và xem dữ liệu giá lịch sử. | Choose an asset from the active workspace’s tracked list and review its historical price data. |
| Step 2 title | Đặt vào bối cảnh | Contextualize |
| Step 2 body | Khi dữ liệu khả dụng, đọc chú thích sự kiện và lịch kinh tế cạnh diễn biến giá. | When data is available, read event annotations and economic-calendar context alongside the price move. |
| Step 3 title | Kiểm tra | Inspect |
| Step 3 body | Khi dữ liệu khả dụng, mở chi tiết sự kiện để xem phản ứng, lập luận, thời điểm ghi nhận và nguồn liên quan. | When data is available, open event detail to inspect reactions, reasoning, recorded time, and related sources. |
| Step 4 title | Khám phá | Explore |
| Step 4 body | Theo dấu các quan hệ hiện có giữa sự kiện, tài sản, bài viết tin tức và mạch diễn giải thị trường. | Trace the existing relationships among events, assets, news articles, and market narratives. |
| Flow note | Đây là luồng đọc, không phải mô hình nhân quả. | This is a reading path, not a causal model. |

### `ProductStory` — `#product`

| Vai trò | Tiếng Việt | English |
| --- | --- | --- |
| H2 | Ba lớp để đọc bối cảnh quanh một biến động. | Three layers for reading the context around a move. |
| Intro | Biểu đồ giúp định vị thời điểm. Chi tiết sự kiện giúp kiểm tra phản ứng và nguồn. Đồ thị mở rộng sang các quan hệ xung quanh — mỗi lớp giữ rõ phạm vi dữ liệu của mình. | Charts establish timing. Event detail helps inspect reactions and sources. The graph expands into surrounding relationships, with each layer keeping its data scope clear. |

#### Chapter 1 — Event-aware Charts

| Vai trò | Tiếng Việt | English |
| --- | --- | --- |
| Eyebrow | Biểu đồ theo bối cảnh sự kiện | Event-aware Charts |
| H3 | Đặt dấu mốc sự kiện ngay cạnh diễn biến giá. | Put event markers alongside price action. |
| Body | Biểu đồ tải nến lịch sử cho tài sản trong danh sách theo dõi. Chú thích sự kiện và lịch kinh tế xuất hiện khi dữ liệu khả dụng; báo giá trực tiếp hoặc nến đang hình thành có thể cập nhật khi luồng dữ liệu khả dụng, cùng trạng thái dữ liệu cũ, mất kết nối hoặc thị trường đóng cửa. | The chart loads historical candles for a tracked asset. Event annotations and economic-calendar context appear when data is available; live quotes or a partial candle can update when the stream is available, alongside stale, disconnected, and market-closed states. |
| Proof 1 | Nến lịch sử cho tài sản được theo dõi; khi chưa có dữ liệu nến, biểu đồ hiển thị trạng thái trống rõ ràng. | Historical candles for a tracked asset, with a clear empty state when no candle data is available. |
| Proof 2 | Chú thích sự kiện và lịch kinh tế khi dữ liệu liên quan khả dụng. | Event annotations and economic-calendar context when related data is available. |
| Proof 3 | Cập nhật trực tiếp cho báo giá hoặc nến đang hình thành khi luồng dữ liệu khả dụng. | Live quote or partial-candle updates when the stream is available. |
| Caption | Giá, dấu mốc sự kiện và lịch kinh tế trong cùng một khoảng thời gian, khi dữ liệu khả dụng. | Price action, event markers, and economic-calendar context across the same time range, when available. |

#### Chapter 2 — Reaction & Evidence

| Vai trò | Tiếng Việt | English |
| --- | --- | --- |
| Eyebrow | Phản ứng và bằng chứng | Reaction & Evidence |
| H3 | Đi từ dấu mốc sự kiện tới phản ứng và nguồn liên quan. | Move from an event marker to reactions and related sources. |
| Body | Chú thích trên biểu đồ cung cấp bản xem trước ngắn và đường dẫn tới chi tiết sự kiện. Khi dữ liệu khả dụng, trang chi tiết mở rộng thành các thẻ phản ứng cùng nguồn tin liên kết để người dùng kiểm tra bối cảnh. | A chart annotation provides a concise preview and a path to event detail. When data is available, the detail page expands into reaction cards and linked sources for contextual review. |
| Proof 1 | Bản xem trước có thể hiển thị tiêu đề, tóm tắt, phản ứng dự kiến và diễn biến đã đánh giá của phản ứng chính. | The preview can show a title, summary, expected reaction, and evaluated outcome for the primary reaction. |
| Proof 2 | Chi tiết sự kiện có thể hiển thị hướng, khung thời gian, độ tin cậy, lập luận và thời điểm ghi nhận. | Event detail can show direction, horizon, confidence, reasoning, and recorded time. |
| Proof 3 | Nguồn liên kết giúp truy vết bài viết hoặc ngữ cảnh nguồn tin liên quan. | Linked sources help trace the related article or source context. |
| Caption | Chú thích giữ vai trò bản xem trước; phản ứng và nguồn hiển thị trong chi tiết sự kiện khi dữ liệu khả dụng. | The annotation stays a preview; reactions and sources appear in event detail when available. |

#### Chapter 3 — Connected Market Graph

| Vai trò | Tiếng Việt | English |
| --- | --- | --- |
| Eyebrow | Đồ thị quan hệ thị trường | Connected Market Graph |
| H3 | Theo dấu các mối quan hệ quanh một chuyển động thị trường. | Trace the relationships around a market move. |
| Body | Đồ thị cho phép khám phá các thực thể và quan hệ hiện có giữa sự kiện, tài sản, bài viết tin tức và mạch diễn giải thị trường. Đây là góc nhìn thị trường rộng, không phải lát cắt theo workspace hoặc danh sách tài sản theo dõi. | The graph lets you explore existing entities and relationships among events, assets, news articles, and market narratives. It is a broader market view, not a slice filtered by workspace or tracked asset list. |
| Proof 1 | Bốn loại thực thể hiện có: sự kiện, tài sản, bài viết tin tức và mạch diễn giải thị trường. | Four current entity types: event, asset, news article, and market narrative. |
| Proof 2 | Khám phá các quan hệ hiện có giữa những thực thể này. | Explore the existing relationships among those entities. |
| Proof 3 | Góc nhìn thị trường rộng, không ngầm hứa bộ lọc theo workspace. | A broad market view, without implying workspace filtering. |
| Boundary | Chủ đề bổ sung ngữ cảnh cho sự kiện và mạch diễn giải; không xuất hiện như một loại thực thể riêng trên đồ thị. | Themes add context to events and market narratives; they do not appear as a separate entity type in the graph. |
| Caption | Đồ thị nối sự kiện, tài sản, bài viết tin tức và mạch diễn giải bằng các quan hệ hiện có. | The graph connects events, assets, news articles, and market narratives through existing relationships. |

### `WorkspaceAssistantSection` — `#workspace-ai`

| Vai trò | Tiếng Việt | English |
| --- | --- | --- |
| H2 | Tiếp tục phân tích trong workspace đang hoạt động. | Continue the analysis in your active workspace. |
| Body | Danh sách tài sản theo dõi giữ lựa chọn biểu đồ trong ngữ cảnh đang làm việc. Trợ lý AI lưu phiên và lịch sử hội thoại bằng văn bản theo cùng workspace để bạn có thể tiếp tục đặt câu hỏi. | The tracked asset list keeps chart selection in the context you are working in. The AI Assistant persists text conversation sessions and history for the same workspace so you can continue asking questions. |
| Proof 1 | Một danh sách tài sản theo dõi cho workspace đang hoạt động. | One tracked asset list for the active workspace. |
| Proof 2 | Biểu đồ chỉ cho chọn tài sản từ danh sách đó. | The chart only offers assets from that list. |
| Proof 3 | Phiên và lịch sử hội thoại bằng văn bản được lưu theo workspace đang hoạt động. | Text conversation sessions and history are persisted for the active workspace. |
| Processing note | Hội thoại bằng văn bản diễn ra theo từng lượt; mỗi lượt gửi được xử lý đồng bộ. | The text conversation is turn-based; each submission is processed synchronously. |
| Boundary | Workspace giữ trạng thái hội thoại; Signapse không mô tả danh sách tài sản theo dõi như ranh giới bằng chứng của mọi câu trả lời. | The workspace keeps conversation state; Signapse does not present the tracked asset list as the evidence boundary for every answer. |

### `TrustBoundary` — `#trust`

| Vai trò | Tiếng Việt | English |
| --- | --- | --- |
| H2 | Kiểm tra được nguồn. Nhìn rõ giới hạn. | Inspect the sources. Keep the limits visible. |
| Intro | Signapse đặt nguồn liên quan và đánh giá của hệ thống cạnh sự kiện khi dữ liệu khả dụng. Độ tin cậy không phải xác suất lợi nhuận; diễn biến gần nhau theo thời gian hoặc được nối trong đồ thị không tự chứng minh quan hệ nhân quả. | Signapse places related sources and system assessments alongside events when data is available. Confidence is not a probability of profit, and temporal proximity or a graph relationship does not by itself prove causation. |
| Point 1 title | Nguồn liên quan | Related sources |
| Point 1 body | Mở nguồn đã liên kết để truy vết bối cảnh, khi dữ liệu khả dụng. | Open linked sources to trace the context, when data is available. |
| Point 2 title | Đánh giá có điều kiện | Qualified assessments |
| Point 2 body | Hướng phản ứng, khung thời gian, độ tin cậy, lập luận, thời điểm ghi nhận và diễn biến đã đánh giá chỉ xuất hiện ở nơi hỗ trợ chúng và khi dữ liệu khả dụng. | Reaction direction, horizon, confidence, reasoning, recorded time, and evaluated outcome appear only where supported and when data is available. |
| Point 3 title | Hỗ trợ phân tích | Analysis support |
| Point 3 body | Dựa trên dữ liệu và nguồn tin — không phải tư vấn giao dịch hay cam kết dự báo. | Evidence-led analysis support — not trading advice or a guaranteed forecast. |

### `FinalAccessCta` — `#access`

Anonymous state:

| Vai trò | Tiếng Việt | English |
| --- | --- | --- |
| H2 | Xem thị trường trong đúng bối cảnh. | See the market in context. |
| Body | Yêu cầu truy cập để khám phá cách Signapse đặt dữ liệu giá cạnh sự kiện, phản ứng và nguồn tin liên quan khi khả dụng, rồi mở rộng sang các quan hệ thị trường. | Request access to explore how Signapse places price data alongside related events, reactions, and sources when available, then expands into market relationships. |
| CTA | Yêu cầu truy cập | Request access |
| Microcopy | Liên kết này mở ứng dụng email tới `request-access@signapse.ai`. Nếu không mở được, hãy sao chép địa chỉ trong footer. | This link opens your email app to `request-access@signapse.ai`. If it does not open, copy the address from the footer. |

Authenticated state:

| Vai trò | Tiếng Việt | English |
| --- | --- | --- |
| H2 | Tiếp tục từ workspace đang hoạt động. | Continue from your active workspace. |
| Body | Mở bảng điều khiển để tiếp tục hành trình phân tích của bạn. | Open the dashboard to continue your analysis. |
| CTA | Mở bảng điều khiển | Open dashboard |

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
| Chưa đăng nhập | Footer secondary | Đăng nhập / Sign in | `/{lang}/sign-in` | Giữ một đường vào sign-in ở cuối trang. |
| Chưa đăng nhập | Hero primary | Yêu cầu truy cập / Request access | Request-access `mailto:` | Cùng destination với header; không tạo funnel thứ hai. |
| Chưa đăng nhập | Hero secondary | Xem cách hoạt động / See how it works | `#how-it-works` | Cuộn tới user journey. |
| Chưa đăng nhập | Final CTA | Yêu cầu truy cập / Request access | Request-access `mailto:` | Cùng destination với hero. |
| Đã đăng nhập | Header, Hero, Final CTA, Footer secondary | Mở bảng điều khiển / Open dashboard | `/{lang}/dashboard` | Thay Sign in trong Footer và mở protected dashboard theo locale. |
| Mọi người dùng | Footer contact | `request-access@signapse.ai` | Cùng request-access email | Hiển thị địa chỉ email để có thể copy khi máy không cấu hình mail client. |

### CTA behavior rules

- Microcopy cạnh request-access CTA phải nói rõ link sẽ mở ứng dụng email.
- Landing không hiển thị success toast hoặc confirmation giả vì nó không biết email đã được gửi hay chưa.
- Không dùng “Start free”, “Create account”, “Book demo” hoặc “Get started” khi chưa có destination tương ứng.
- Không thêm form trong landing change. Request form chỉ được đề xuất riêng khi đã chốt data owner, storage, abuse protection, privacy notice và success state.
- CTA analytics không nằm trong scope này; chỉ thêm khi có analytics event contract và consent policy.
- Trước public release, product owner phải xác nhận `request-access@signapse.ai` đã được provision, nhận được email từ bên ngoài và có người theo dõi. Nếu chưa đạt, locked destination chưa được phép ship và phải được thay bằng destination đã duyệt trong tài liệu này.

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
| `public/images/landing/{lang}/hero-market-chart.webp` | Market chart với candle, event annotation và calendar context thật | Hero | Chưa tồn tại; cần capture và duyệt độc lập cho `vi`/`en` |
| `public/images/landing/{lang}/event-reaction-evidence.webp` | Event detail có reaction và source evidence khả dụng | Reaction & Evidence chapter | Chưa tồn tại; cần capture và duyệt độc lập cho `vi`/`en` |
| `public/images/landing/{lang}/connected-market-graph.webp` | Graph có event, asset, news article và narrative | Connected Market Graph chapter | Chưa tồn tại; cần capture và duyệt độc lập cho `vi`/`en` |
| `public/images/landing/{lang}/workspace-assistant.webp` | Workspace overview hoặc Trợ lý AI text-only | Supporting section, optional | Chưa tồn tại; chỉ thêm khi giúp câu chuyện rõ hơn |

`{lang}` là `vi` hoặc `en`. Capture có visible UI text phải có hai asset dùng cùng demo scenario, product state và crop tương đương; text trong ảnh phải khớp locale của route. Asset không có text phụ thuộc ngôn ngữ có thể dùng chung dưới `public/images/landing/shared/` sau khi được duyệt. Nếu asset của một locale chưa tồn tại hoặc chưa approved, locale đó bỏ media slot và dùng text-first composition; không fallback sang ảnh của locale còn lại.

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
- Visible UI text khớp locale của route; asset selection, caption và alt text lấy từ dictionary.
- Có localized alt text; nội dung thiết yếu trong ảnh cũng được giải thích bằng text cạnh ảnh.
- Hai locale được duyệt độc lập trên cùng demo scenario; không dùng ảnh sai locale làm fallback.
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
| 8 | `PublicFooter` | — | Cung cấp fallback và locale path | Brand; sign-in hoặc dashboard theo auth state; request-access email; locale | Brand asset |

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
- Chỉ dùng một page-level grid/relationship treatment rất nhẹ, chia sẻ giữa hero và flow; không lặp trong chapter/card và phải decorative đối với assistive technology.
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

### Locale switch contract

- Locale control hiển thị link `Tiếng Việt` và `English` trong một group có localized accessible label.
- Mỗi link có `lang`, `hreflang`; locale hiện tại có state nhìn thấy được và `aria-current="page"`.
- Khi đổi locale, chỉ thay segment locale của pathname; giữ query string và hash hợp lệ trong `#top`, `#how-it-works`, `#product`, `#workspace-ai`, `#trust`, `#access`; bỏ hash không được hỗ trợ.
- Destination được tạo bằng locale routing helper, không hardcode `/vi` hoặc `/en`.
- Header và Footer dùng cùng behavior; locale switch không làm thay đổi CTA/auth state.

### Locked metadata

| Locale | Title | Description |
| --- | --- | --- |
| `vi` | Signapse \| Phân tích thị trường theo bối cảnh sự kiện | Signapse kết hợp dữ liệu giá với sự kiện, phản ứng, nguồn tin và quan hệ thị trường liên quan khi dữ liệu khả dụng. |
| `en` | Signapse \| Event-aware market intelligence | Signapse brings price data together with related market events, reactions, sources, and relationships when available. |

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
- Header, từng section, chapter, trust boundary và final CTA dùng Locked Section Copy cho đúng locale.
- Mọi copy, metadata, caption và alt text qua claim-matrix review.
- Không còn claim về workspace graph slice, Theme node, watchlist evidence boundary hoặc Market Query evidence sheet.

### Routing and CTA

- Người chưa đăng nhập mở được `/vi` và `/en` mà không bị chuyển tới sign-in.
- Dashboard shell không xuất hiện trên landing.
- Request-access CTA dùng đúng locked `mailto:` destination và có email fallback hiển thị ở footer.
- Mailbox request-access đã được owner xác nhận provision, nhận external mail và có người theo dõi trước release.
- Sign-in và dashboard destinations giữ locale.
- Anonymous và authenticated CTA states đúng với CTA matrix.
- Locale switch giữ query và supported hash, đánh dấu current locale đúng semantics và không đổi auth state.

### Media

- Chỉ approved brand asset hoặc approved product capture xuất hiện trên trang.
- Nếu chưa có approved hero capture, hero render text-first và không có synthetic mock.
- Product capture đáp ứng toàn bộ capture approval checklist.
- Capture có visible UI text dùng đúng asset `vi`/`en`; thiếu một locale thì locale đó dùng text-first, không fallback chéo ngôn ngữ.
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
- `openspec/specs/public-landing-page/spec.md` — migration input có known drift; không dùng làm claim evidence cho tới khi được sync
- `openspec/specs/workspace-watchlist-management/spec.md`
- `openspec/specs/market-chart-candle-workbench/spec.md`
- `openspec/specs/market-chart-live-sse-stream/spec.md`
- `openspec/specs/market-chart-economic-calendar-events/spec.md`
- `openspec/specs/event-read-and-enrichment/spec.md` — migration input có field naming drift; claim evidence dùng runtime và `docs/APIMAPPING.md` cho tới khi được sync
- `openspec/specs/event-market-reactions-ui/spec.md`
- `openspec/specs/market-chart-annotation-popup-surface/spec.md` — migration input có requirement nội bộ mâu thuẫn; runtime và `docs/APIMAPPING.md` quyết định concise-preview contract
- `openspec/specs/graph-view-backend-contract/spec.md`
- `openspec/specs/ai-assistant-market-conversations/spec.md`
