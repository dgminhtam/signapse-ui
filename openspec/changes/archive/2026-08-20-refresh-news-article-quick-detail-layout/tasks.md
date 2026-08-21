## 1. News article Quick detail presentation

- [x] 1.1 Update the independent News article Quick detail body to match the approved current detail-page baseline for description, provenance, optional original-source access, feature media, and Markdown.
- [x] 1.2 Preserve drawer-specific title, scrolling, local loading/error/access lifecycle, unchanged URL behavior, and the absence of page shell, canonical-detail action, linked events, and event navigation.

## 2. Component coverage

- [x] 2.1 Add a focused component test at the local entity Quick detail drawer seam with mocked article retrieval, localization, and permissions.
- [x] 2.2 Cover visible article content, localized provenance, optional original-source link behavior, optional media, Markdown rendering, and the absence of News article full-page and linked-event actions.

## 3. Documentation alignment

- [x] 3.1 Add `Quick detail drawer` to the domain glossary as the canonical analytical-workspace overlay term.
- [x] 3.2 Update the quick-detail pattern and UI design policy with the News article-specific exception to canonical-detail escalation while retaining the focused-reading boundary.
- [x] 3.3 Use the API-mapping synchronization workflow to correct the documented News article `linkedEvents` rendering status without changing the backend contract.

## 4. Verification

- [x] 4.1 Run the targeted component test for the local entity Quick detail drawer.
- [x] 4.2 Run lint and typecheck (typecheck and changed-file lint pass; repository-wide lint still reports pre-existing errors outside this change).
- [x] 4.3 Validate the OpenSpec change in strict mode and statically check that documentation and active News article Quick detail code do not claim a full-page action or linked-event UI.
