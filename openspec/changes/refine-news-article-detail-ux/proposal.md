## Why

Man hinh chi tiet news article hien dang hien thi qua nhieu du lieu van hanh va metadata he thong cung cap voi noi dung chinh, lam nguoi dung kho xac dinh bai viet da noi gi, da duoc xu ly toi dau, va dang lien ket voi su kien nao. Dong thoi nut `Phan tich AI` khong con phu hop vi workflow phan tich se chuyen sang cronjob thay vi goi API thu cong tu UI.

## What Changes

- Tinh gon man hinh `/news-articles/{id}` thanh surface kiem dinh bai viet va su kien, uu tien thong tin can doc nhanh: tieu de, trang thai, nguon tin, thoi gian xuat ban, mo ta/noi dung, va su kien lien ket.
- Xoa nut `Phan tich AI` khoi danh sach va man hinh chi tiet news article.
- Xoa client component va server action goi `POST /news-articles/{id}/analyze` khoi frontend neu khong con duoc su dung.
- Giu cac tac vu con hop le: tai lai noi dung, suy dien su kien chinh, suy dien lo bai viet dang cho, mo lien ket goc, va xoa.
- Ha thap do uu tien cua metadata he thong nhu `externalKey`, `newsOutletId`, `url`, `createdDate`, `lastModifiedDate` bang cach gom vao khu thong tin ky thuat phu hoac an khoi luong doc chinh.
- Dua `Su kien lien ket` len gan noi dung bai viet hon de nguoi dung nhanh chong kiem tra ket qua mapping article-event.
- Chuan hoa copy tieng Viet co dau cho cac label, empty state, toast, va action con lai trong feature `news-articles`.
- Cap nhat `docs/APIMAPPING.md` de ghi ro endpoint analyze khong con duoc dung trong UI va workflow phan tich chay qua cronjob.

## Capabilities

### New Capabilities
- `news-article-detail-review-ux`: Trai nghiem chi tiet news article duoc toi uu cho viec doc, kiem dinh trang thai xu ly, va xac nhan su kien lien ket.

### Modified Capabilities
- None.

## Impact

- Anh huong den UI list/detail cua `app/(main)/news-articles`.
- Anh huong den frontend action `app/api/news-articles/action.ts` neu xoa `analyzeNewsArticle`.
- Anh huong den docs API mapping cho `POST /news-articles/{id}/analyze`.
- Khong yeu cau thay doi backend vi workflow phan tich chuyen sang cronjob ngoai UI.
