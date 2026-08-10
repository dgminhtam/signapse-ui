# Signapse coming-soon site

Đây là site tĩnh độc lập cho `signapse.cloud`. Site không dùng Next.js, Clerk,
API, font CDN, analytics hoặc quy trình build của ứng dụng đang chạy tại
`dev.signapse.cloud`.

## Chạy và kiểm tra cục bộ

Từ thư mục gốc repository:

```powershell
python -m http.server 4173 --directory coming-soon
```

Các URL cần kiểm tra:

- Tiếng Việt: `http://localhost:4173/`
- English: `http://localhost:4173/en/`
- Một đường dẫn không tồn tại, ví dụ `http://localhost:4173/not-found`, phải trả
  về `404`.

Chạy kiểm thử xác định cho countdown, metadata, asset và phạm vi tích hợp:

```powershell
node --test coming-soon/site.test.mjs
```

Thời điểm ra mắt được cố định trong `assets/countdown.js` là
`2026-09-01T09:00:00+07:00` (`2026-09-01T02:00:00Z`). Logo triển khai tại
`assets/signapse-logo.svg` là bản sao nguyên byte của
`public/images/signapse_logo_dark.svg`.

## Tạo Vercel project độc lập

1. Import repository vào một Vercel project mới; không đổi project đang phục vụ
   `dev.signapse.cloud`.
2. Đặt **Root Directory** là `coming-soon/`.
3. Chọn **Framework Preset: Other**.
4. Tắt/để trống **Build Command**. Không chạy `pnpm` và không khai báo biến môi
   trường của ứng dụng. Nếu giao diện yêu cầu Output Directory, dùng `.`.
5. Deploy preview, sau đó xác nhận `/`, `/en/`, CSS, logo, social preview,
   language switch và một unknown route trả `404` trước khi gắn domain.

## Cutover `signapse.cloud`

Các bước dưới đây là thao tác do người sở hữu tài khoản Vercel và Cloudflare
thực hiện. Không thay DNS trước khi preview đã được duyệt.

1. Chụp hoặc export các DNS record hiện tại của `signapse.cloud`, đặc biệt record
   apex (`@`), `www` và `dev`. Lưu Type, Name, Value và TTL để rollback.
2. Trong **Vercel project mới → Settings → Domains**, thêm
   `signapse.cloud`, rồi thêm `www.signapse.cloud` và cấu hình `www` redirect
   vĩnh viễn về `https://signapse.cloud`.
3. Mở trạng thái/Inspect của từng domain trong Vercel. Ghi lại chính xác Type,
   Name và Value mà Vercel yêu cầu tại thời điểm cutover; không dùng một IP/CNAME
   ví dụ từ tài liệu này.
4. Trong **Cloudflare → DNS**, chỉ sửa/tạo record apex và `www` theo đúng kết quả
   Inspect của Vercel. Đặt **Proxy status: DNS only** (đám mây xám) và giữ TTL
   `Auto`, trừ khi kế hoạch cutover đã quy định TTL khác.
5. Không sửa hoặc xóa record `dev.signapse.cloud`, wildcard liên quan, hay domain
   trên project ứng dụng hiện tại.
6. Chờ Vercel báo domain hợp lệ và certificate sẵn sàng, rồi kiểm tra:

   ```powershell
   Resolve-DnsName signapse.cloud
   Resolve-DnsName www.signapse.cloud
   Resolve-DnsName dev.signapse.cloud
   curl.exe -I https://signapse.cloud/
   curl.exe -I https://signapse.cloud/en/
   curl.exe -I https://www.signapse.cloud/
   ```

   Hai locale phải trả `200`; `www` phải redirect về apex; `dev.signapse.cloud`
   phải tiếp tục trỏ đến và phục vụ ứng dụng dev như trước.

## Rollback và lần chuyển production sau này

Nếu DNS, HTTPS, route hoặc asset không đạt sau cutover, khôi phục chính xác apex
và `www` record đã lưu ở bước 1, vẫn giữ preview Vercel để chẩn đoán, rồi xác
nhận lại `signapse.cloud` và `dev.signapse.cloud`. Không sửa countdown để xử lý
sự cố hạ tầng.

Khi sản phẩm chính thức sẵn sàng, thực hiện một cutover riêng. Nếu destination là
một Vercel project khác, không thể thêm cùng domain vào hai project qua Dashboard
theo thứ tự “thêm trước, gỡ sau”. Dùng quy trình zero-downtime chính thức của
[Vercel](https://vercel.com/kb/guide/how-to-move-a-domain-between-vercel-projects-with-zero-downtime):

1. Deploy production và duyệt đầy đủ bằng **Automatic URL** của deployment mới.
   Đồng thời lưu **Automatic URL** hiện tại của project coming-soon để có thể
   chuyển alias ngược lại.
2. Với Vercel CLI đã đăng nhập đúng scope, chuyển alias apex sang deployment đó:

   ```powershell
   vercel alias set <automatic-deployment-url-khong-co-https> signapse.cloud
   ```

3. Xác nhận apex đang phục vụ production. Sau đó gỡ domain khỏi project
   coming-soon, thêm nó vào production project và cấu hình lại `www` redirect.
4. Inspect domain trên production project. Chỉ cập nhật Cloudflare nếu Vercel đưa
   ra record khác; tiếp tục dùng DNS-only, rồi kiểm tra HTTPS, `/`, `/en/` và
   `www`.

Giữ bản ghi đã lưu để rollback trong toàn bộ quy trình. Countdown về 0 chỉ đổi
trạng thái hiển thị; nó không redirect hay tự chuyển domain. Nếu production lỗi
sau bước chuyển alias, rollback traffic trước bằng:

```powershell
vercel alias set <coming-soon-automatic-url-khong-co-https> signapse.cloud
```

Xác nhận apex đã trở lại coming-soon; nếu domain settings đã được chuyển sang
production project, gỡ chúng khỏi production rồi thêm lại vào coming-soon và
khôi phục `www` redirect. Chỉ rollback DNS khi record thực tế đã thay đổi.
