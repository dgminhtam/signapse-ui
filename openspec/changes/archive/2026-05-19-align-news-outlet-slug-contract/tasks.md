## 1. Documentation Alignment

- [x] 1.1 Update `docs/APIMAPPING.md` so the `PUT /news-outlets/{id}` row no longer reports full implementation while the frontend still sends `slug`.
- [x] 1.2 Update the `GET /news-outlets/{id}` row or nearby notes so detail/edit DTO and UI slug drift is visible until code cleanup is complete.
- [x] 1.3 After code cleanup, update the news outlet drift note so it no longer claims FE form/DTO code renders or sends `slug`.

## 2. DTO and Payload Cleanup

- [x] 2.1 Remove `slug` from `NewsOutletRequest`, `NewsOutletResponse`, and `NewsOutletListResponse`.
- [x] 2.2 Remove `slug` validation, default values, and payload construction from the news outlet form.
- [x] 2.3 Verify create and update submissions only send supported fields: `name`, `description`, `homepageUrl`, `rssUrl`, and `active`.

## 3. Form UI Cleanup

- [x] 3.1 Remove read-only slug metadata from the edit form header/body.
- [x] 3.2 Remove the editable slug field and its helper copy from create/edit form sections.
- [x] 3.3 Adjust form spacing or skeletons only where needed so the focused form shell still mirrors the final layout.

## 4. Verification

- [x] 4.1 Search the news outlet feature for remaining `slug` reads, labels, payload fields, and DTO properties.
- [x] 4.2 Run targeted lint/type validation for touched news outlet and APIMAPPING-related frontend files.
- [x] 4.3 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke check create/edit form rendering when a local authenticated browser session is available.
