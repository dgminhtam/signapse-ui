## 1. Rule Clarification

- [x] 1.1 Update `AGENTS.md` focused form shell guidance to note that page-level create/edit forms may left-align footer actions when it improves continuity with fields.
- [x] 1.2 Clarify that URL-heavy CRUD forms can use `max-w-3xl` / `width="lg"` while still staying constrained, and should not become full-width without a stronger layout reason.

## 2. News Outlet Form Layout

- [x] 2.1 Update `NewsOutletCreateForm` to use the large focused form shell width.
- [x] 2.2 Left-align `NewsOutletCreateForm` footer actions without changing submit/cancel order or behavior.
- [x] 2.3 Update `NewsOutletUpdateForm` to use the same large focused form shell width.
- [x] 2.4 Left-align `NewsOutletUpdateForm` footer actions without changing submit/cancel order or reset-to-original behavior.
- [x] 2.5 Preserve validation, submit pending spinner, disabled state, toast copy, redirect to `/news-outlets`, and `router.refresh()` for both forms.

## 3. Fallback and Skeleton Consistency

- [x] 3.1 Inspect news outlet create/edit routes for existing loading fallback or skeleton surfaces.
- [x] 3.2 If a news outlet create/edit fallback or skeleton exists or is introduced, update it to mirror the large shell width and left-aligned footer action layout.
- [x] 3.3 If no dedicated create/edit fallback exists, confirm no skeleton file requires a layout update and report that as a no-op.

## 4. Verification

- [x] 4.1 Search touched news outlet create/edit files to confirm no `width="md"` or right-aligned footer override remains for these forms.
- [x] 4.2 Run targeted lint/type validation for the touched news outlet form/page and rule files.
- [ ] 4.3 Smoke check create/edit form rendering when a local authenticated browser session is available.
