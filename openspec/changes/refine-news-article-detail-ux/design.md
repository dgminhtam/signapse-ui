## Context

Man hinh `/news-articles/{id}` hien dang la mot surface pha tron giua doc noi dung, kiem tra trang thai xu ly, debug metadata, va chay tac vu thu cong. Header dang hien thi qua nhieu action ngang hang, trong khi `Su kien lien ket` nam sau anh, metadata, mo ta, va noi dung. Dieu nay khong hop voi tac vu chinh cua nguoi dung: nhanh chong xac minh bai viet, trang thai xu ly, va event duoc lien ket.

Workflow `Phan tich AI` khong con duoc chay thu cong tu UI nua. Viec phan tich noi dung se do cronjob xu ly, nen frontend khong nen tiep tuc render nut hoac giu action goi `POST /news-articles/{id}/analyze`.

## Goals / Non-Goals

**Goals:**

- Tinh gon detail page de uu tien thong tin nguoi dung can doc va kiem dinh.
- Xoa nut `Phan tich AI` khoi list/detail va xoa frontend call den endpoint analyze.
- Dua linked events len thanh khu vuc kiem dinh quan trong, khong bi day xuong sau metadata he thong.
- Giam nhiu bang cach an/gom thong tin ky thuat va chi giu metadata can thiet trong luong doc chinh.
- Chuan hoa copy tieng Viet co dau trong feature `news-articles` khi cham vao cac be mat lien quan.

**Non-Goals:**

- Khong thay doi backend API.
- Khong them workflow cronjob moi trong UI.
- Khong refactor toan bo feature `news-articles` ngoai cac be mat lien quan truc tiep den detail UX va nut analyze.
- Khong thay doi permission backend; permission `NEWS_ARTICLE_ANALYZE_PERMISSIONS` co the tiep tuc duoc dung cho crawl/derive neu contract backend van dung key do.

## Decisions

- Detail page se duoc thiet ke nhu surface kiem dinh, khong phai record dump. Phan tren cung chi nen gom title, status, source, published time, short description neu co, va mot nhom action duoc sap thu tu theo tac vu.
- `Suy dien su kien chinh` la action chinh tren detail vi no gan truc tiep voi muc tieu kiem dinh article-event. `Tai lai noi dung`, `Mo lien ket goc`, va `Xoa` la action phu; `Xoa` phai tiep tuc dung confirmation hien co.
- `Phan tich AI` bi xoa khoi UI thay vi disable, vi disable van tao ky vong rang user co the dung action nay sau. Cronjob la workflow moi, nen UI khong nen de lai action cu.
- Metadata he thong nhu `externalKey`, `newsOutletId`, raw URL, created date, va last modified date se chuyen vao khu `Thong tin ky thuat` co do uu tien thap hon, uu tien dung `Collapsible` san co cua shadcn.
- Anh bai viet khong nen day noi dung chinh xuong qua sau. Neu co anh, no nen la preview phu ho tro nhan dien bai viet; layout co the dat sau mo ta hoac trong cot phu tren desktop.
- API mapping se duoc cap nhat de tranh viec sau nay dua lai `analyzeNewsArticle` vao UI do thay endpoint con trong docs.

## Risks / Trade-offs

- Xoa action analyze co the lam mot so operator quen thao tac thu cong mat duong tat cu. Giam rui ro bang cach giu cac tac vu con hop le va ghi ro trong docs rang phan tich chay qua cronjob.
- Gom metadata ky thuat co the lam debug cham hon mot chut. Giam rui ro bang cach van giu metadata trong khu co the mo ra, thay vi xoa het.
- Dua linked events len cao co the lam bai viet dai hon tren first viewport. Giam rui ro bang cach chi hien thi summary event gon, note/evidence chi hien khi co noi dung thuc su.
