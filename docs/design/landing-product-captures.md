# Signapse Landing Product Captures

> Trạng thái: Hoàn tất; Graph và Chart đã tích hợp, AI và Telegram dùng text-only
> Phạm vi: `/vi` và `/en` public landing  
> Cập nhật: 2026-09-09

Tài liệu này theo dõi ảnh sản phẩm cho hai chapter có media: Đồ thị Tri thức và Biểu đồ trực tiếp. AI Assistant và Telegram là text-only theo thiết kế, không phải các slot đang chờ ảnh.

## Capture plan

| Feature           | Kịch bản cần capture                  | Nội dung bắt buộc thấy được                                        | Crop / kích thước dự kiến | Locale     | Trạng thái           |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------ | ------------------------- | ---------- | -------------------- |
| Đồ thị Tri thức   | Graph View với một cụm quan hệ dễ đọc | Sự kiện, tài sản liên quan, nguồn tin; 2–3 chú thích ngoài ảnh     | Landscape, `1600×1000`    | `vi`, `en` | Đã duyệt và tích hợp |
| Biểu đồ trực tiếp | Chart của tài sản theo dõi            | Diễn biến giá, dấu mốc sự kiện, lịch kinh tế và trạng thái dữ liệu | Landscape, `1600×1000`    | `vi`, `en` | Đã duyệt và tích hợp |

## Approval record

Graph và Chart đã được tích hợp vào `public/images/landing/{lang}/` theo crop review. Mỗi bản ghi media giữ các trường sau:

- Feature và locale.
- Demo/source reference không chứa credential, private identifier hoặc token.
- Người xác nhận nguồn demo được phép công khai và ngày xác nhận.
- File path, intrinsic dimensions, crop và format.
- Caption, alternative text và annotation đã bản địa hóa.
- Caption/alt draft phải mô tả insight thực sự nhìn thấy trong ảnh; không dùng copy draft để chứng minh ảnh đã tồn tại.
- Trạng thái: `awaiting-source`, `captured`, `awaiting-owner-approval`, hoặc `approved`.
- Người duyệt ảnh cuối và ngày duyệt.

Không lưu workspace riêng, hội thoại riêng, điểm nhận Telegram riêng, bot token, email cá nhân hoặc dữ liệu xác thực trong hồ sơ này.

## Capture boundaries

- Không dùng Sigma demo làm ảnh Graph View.
- Không dựng phản hồi AI, số liệu chart hoặc tin nhắn Telegram giả để làm product proof.
- Không thêm ảnh AI Assistant hoặc Telegram nếu chưa có một requirement mới thay đổi quyết định text-only.
- Không diễn đạt quan hệ graph như bằng chứng nhân quả.
- Không dùng ảnh của locale còn lại làm fallback.
