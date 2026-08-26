# Live OpenAPI structural verification — 2026-08-26

Source: `https://dev-api.signapse.cloud/v3/api-docs`

The authoritative request succeeded and parsed as OpenAPI `3.1.0` with 97 paths and 179 schemas. The feedback surface is present. The live document is intentionally sparse in several semantic areas, and BE has explained those runtime rules in `backend-clarification.md`.

- list operations publish required `specification` and `pageable`, while the accepted runtime query is `$filter`, `page`, `size`, and repeated `sort`;
- Promote and Dismiss both reference the same `FeedbackReviewRequest`, while runtime validation makes `githubIssueUrl` conditional;
- DELETE operations publish `200`, while the accepted runtime success is `204 No Content`;
- feedback response schemas do not publish requiredness or nullability;
- lifecycle conflicts, ownership failures, screenshot MIME/size/dimension rules, and binary response headers are undocumented.

These are recorded as BE-explained documentation/representation gaps, not activation blockers under the accepted policy. The structural check confirms that all 11 feedback operations and their endpoint families are present; no path, method, authorization boundary, multipart field, or response family required by the implementation is missing. A future contradictory path, method, scope, transport field, response shape, or status would reopen the gate.

Result: structural OpenAPI/API mapping verification passes. Fixture contract approval, production feedback activation, legacy fixture removal, and OpenSpec archive may proceed once repository-owned tests and static checks pass.
