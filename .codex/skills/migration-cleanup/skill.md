# Migration Cleanup Checklist

## Scope

Áp dụng khi thay thế thư viện, vendor UI hoặc chart engine.

## Yêu cầu

Migration phải xóa sạch **tất cả** source cũ không còn dùng:

- [ ] Dependency trong `package.json` và lockfile
- [ ] Import, type và helper liên quan
- [ ] Adapter / bridge code
- [ ] Attribution / vendor copy
- [ ] OpenSpec / docs reference đang active
- [ ] Dead component tạm thời

## Quy tắc

- Không giữ code legacy bị disable eslint nếu không có compatibility path đang chạy thật
- Attribution của thư viện/vendor có yêu cầu giấy phép không được xóa im lặng; nếu bỏ logo hoặc attribution inline khỏi bề mặt chính, phải thay bằng notice/link ở vị trí người dùng truy cập được
