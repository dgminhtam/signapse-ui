# Accepted Backend Clarification — Feedback API Integration

**Received:** 2026-08-26
**Status:** Accepted runtime contract input. Live OpenAPI was structurally verified on 2026-08-26; BE-owned semantic documentation gaps are tracked below and do not block frontend activation when they do not contradict the runtime contract.

This clarification unlocks frontend implementation and supplies the semantic detail that the live OpenAPI intentionally does not publish. The final contract gate still requires a successful live OpenAPI/API mapping verification, but that verification checks for hard contradictions in paths, methods, authorization scope, transport shape, and success/error status. Missing requiredness, nullability, constraints, examples, or lifecycle prose may be accepted when BE explains the runtime behavior in this document or the review response.

## Endpoints And Authorization

- Personal `/me/feedback-submissions*` endpoints require an active user and always scope data to the authenticated user; cross-owner detail or screenshot access returns `404`.
- Moderation list, detail, and screenshot require `feedback:read`.
- Promote and dismiss require `feedback:review`.
- Administrative delete requires `feedback:delete`.
- Server-side permissions continue to come from `GET /me`; there is no feedback-specific token.

## Submission And Technical Context

- Create uses multipart with required JSON `submission` and at most one optional binary `screenshot`.
- Feedback type is `BUG` or `IDEA`.
- `reproductionSteps` is permitted only for `BUG`.
- `observedTime` is permitted only for `BUG`.
- Every technical-context field is optional; unknown fields are rejected, strings are trimmed, and blank strings normalize to `null`.
- `pagePath` may include a locale segment but cannot include a query, fragment, or absolute URL.
- Frontend build version is accepted; browser and operating-system versions may be absent.
- `observedTime` accepts ISO-8601 date-time and does not require UTC-only input.
- Backend stores typed normalized context and does not collect raw user-agent, IP, cookies, tokens, logs, or request/response bodies as feedback context.

## Action Availability And Lifecycle

The backend does not expose action capabilities. Frontend affordances are derived as presentation hints:

```text
canWithdraw = personal scope AND status == PENDING_REVIEW
canPromote  = has feedback:review AND status == PENDING_REVIEW
canDismiss  = has feedback:review AND status == PENDING_REVIEW
canDelete   = has feedback:delete
```

Backend remains authoritative for races.

| Status | Withdraw | Promote | Dismiss | Admin delete |
| --- | ---: | ---: | ---: | ---: |
| `PENDING_REVIEW` | Yes | Yes | Yes | Yes |
| `PROMOTED` | No | No | No | Yes |
| `DISMISSED` | No | No | No | Yes |

- Promote and dismiss are mutually exclusive and irreversible.
- Successful withdrawal or administrative deletion makes the record inaccessible.
- Successful DELETE returns `204 No Content`.
- Successful promote or dismiss returns updated moderation detail.
- Reviewing an already reviewed record returns `409` with `FEEDBACK_ALREADY_REVIEWED`.
- Withdrawing an already reviewed record returns `409` with `FEEDBACK_NO_LONGER_WITHDRAWABLE`.
- A request targeting an already deleted record returns `404`.
- A review-versus-withdraw race may return `404` or `409` to the losing request, depending on commit order.

## GitHub Issue Reference

- Promote requires `githubIssueUrl`; dismiss must omit it.
- The URL must identify an Issue in the configured Signapse repository.
- Backend does not call GitHub or create an Issue; it parses and stores the positive Issue number.
- Promoted moderation detail returns `githubIssueNumber`.
- Personal responses expose no GitHub information.
- Frontend may validate GitHub Issue URL structure, while backend validates configured-repository ownership.

## Response Invariants

- `id` remains JSON integer/int64; frontend may normalize it internally.
- List items always include `id`, `type`, `title`, `status`, `createdDate`, and `lastModifiedDate`.
- Detail additionally always includes `description` and `expectedOutcome`.
- `reproductionSteps` is optional for `BUG` and forbidden for `IDEA`.
- `clientContext` and `screenshot` may be `null`.
- `reviewMessage` is `null` while pending and required after promote or dismiss.
- `githubIssueNumber` appears only in promoted moderation detail.
- `reporter` appears only in moderation detail.
- Present screenshot metadata contains integer `id`, normalized `mimeType`, and byte `size`; it contains no URL or object key.

## Filter And Pagination

- Runtime query parameters are `$filter`, `page`, `size`, and repeated `sort`; `specification` and `pageable` are not sent.
- Supported filter fields are `title`, `type`, `status`, `createdDate`, and `id`.
- Title search uses `containsIgnoreCase(title,'value')`; exact enum filters use `eq`; combined controls use `and`.
- Backend page is zero-based, defaults to page `0` and size `20`, and allows size up to `100`.
- Out-of-range pages return `200` with empty content.
- Default ordering is `createdDate DESC, id DESC`; explicit multi-sort repeats `sort`, for example `sort=createdDate,desc&sort=id,desc`.
- Backend does not default moderation status; the UI sends `$filter=status eq PENDING_REVIEW` for its default pending view.

## Screenshot Contract

- Only `image/png` and `image/jpeg` are supported; WebP is not supported.
- Maximum uploaded content is 5 MiB and maximum decoded image area is 25 megapixels.
- Backend verifies bytes, decodes, and re-encodes the image without trusting request MIME or filename.
- Download returns normalized binary bytes with normalized MIME, `Content-Disposition: inline`, `Cache-Control: private, no-store`, and `X-Content-Type-Options: nosniff`.
- There is no public or presigned URL, `ETag`, `Last-Modified`, checksum, idempotency key, or automatic capture contract.
- Invalid image, unsupported MIME, or content above 5 MiB returns `400`.
- Spring transport limits above 10 MB per file or 12 MB per request return `413`.
- Missing screenshot and cross-owner screenshot access return `404`.
- Temporary private-storage failure returns `502`.

## Error Contract

Business errors use an object with `message`, `timestamp`, and an optional `code`. A stable code is currently guaranteed only for lifecycle conflicts. There is no feedback-specific `fieldErrors`, `422`, `415`, or `429` contract.

Backend messages follow `Accept-Language`, but frontend dictionaries remain the owner of visible recovery copy. Frontend maps the two known lifecycle codes and relevant HTTP status to localized behavior and treats backend messages as non-authoritative diagnostics.

## Two-Gate Completion Rule

1. **Implementation gate:** this accepted clarification is sufficient to begin frontend code and HTTP fixture work behind existing production gates.
2. **Activation/archive gate:** live dev OpenAPI and API mapping must be rechecked for hard contract contradictions, and the fixture contract guard plus repository-owned verification must pass. OpenAPI omissions are not blockers when the accepted BE clarification explains the runtime behavior; a contradictory path, method, authorization boundary, multipart field, response shape, or status remains a blocker.
