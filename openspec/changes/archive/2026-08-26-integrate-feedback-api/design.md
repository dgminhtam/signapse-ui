## Context

The accepted feedback module has complete localized personal and moderation surfaces, but it is intentionally mounted only in the P0 fixture submode and owns its data and mutations in a protected-layout client provider. The live backend exposes separate active-user and permission-gated feedback endpoint families for listing, detail, multipart submission, withdrawal, review outcomes, administrative deletion, and screenshot retrieval. The shared authenticated transport already supports `FormData`, and the browser-test foundation already routes the real application through a deterministic HTTP fixture backend.

The live OpenAPI intentionally under-documents some operation-specific review payloads, query grammar, response requiredness, lifecycle conflicts, and screenshot behavior. An accepted backend clarification supplies those implemented runtime semantics. OpenAPI remains the structural cross-check at completion: production activation, fixture contract approval, and archive are gated on absence of hard path/method/auth/transport/status contradictions, while BE-explained omissions remain recorded documentation gaps.

The design follows the Signapse feedback glossary and the accepted decisions that UI action availability is derived from review state, scope, and permission, backend responses remain authoritative for races, withdrawal is not a persisted status, administrative deletion differs from dismissal, and P0 and live behavior must exercise the same frontend integration boundary.

## Goals / Non-Goals

**Goals:**

- Bind all accepted personal and moderation feedback journeys to authenticated backend operations without changing their visual or information architecture.
- Validate untrusted backend responses at runtime and fail closed when core domain data is malformed.
- Derive action affordances through one deterministic status/scope/permission helper while preserving backend authority for concurrent operations.
- Secure multipart upload and binary screenshot delivery with explicit privacy, MIME, byte-size, decoded-dimension, authorization, and caching boundaries.
- Make list filtering, sorting, pagination, mutation refresh, and concurrent-state recovery deterministic.
- Move P0 feedback state to the existing HTTP fixture backend and remove the feedback-specific client state owner after parity.
- Keep all archive-blocking checks runnable from the repository while identifying live authenticated verification as user-owned readiness work.

**Non-Goals:**

- Implement or deploy backend changes from this frontend repository.
- Redesign feedback surfaces or add personal filters, bulk moderation, editing, comments, assignment, notifications, analytics, automatic capture, offline persistence, or GitHub automation.
- Add a new client state framework, external storage integration, component primitive, visual token, or third-party dependency.
- Prove real Clerk authorization or production backend behavior through the secret-free P0 suite.

## Decisions

### Separate the implementation gate from the activation gate

The accepted backend clarification is checked into the change and is sufficient to begin transport, UI binding, and fixture work behind existing production gates. Before fixture contract approval, production route/navigation activation, or archive, the dev OpenAPI and API mapping must pass a structural no-contradiction check and the fixture contract guard must sync cleanly. Requiredness, nullability, constraints, examples, and lifecycle detail may remain in the BE clarification when the live document is intentionally sparse.

This two-gate model permits parallel frontend work without treating a sparse OpenAPI document as a complete semantic specification. Blocking all coding until documentation catches up was rejected after BE confirmed runtime behavior. Waiving hard contradictions remains rejected; accepting documented omissions with an explicit BE explanation keeps the contract-first quality policy useful without requiring BE to duplicate runtime detail in OpenAPI.

### Use one frontend integration boundary for live and P0

Server-rendered reads, mutations, response parsing, domain mapping, revalidation, and screenshot proxying use the normal authenticated frontend path in both environments. Live operation targets the configured backend; P0 points the same requests at the deterministic fixture HTTP backend. Scenario controls remain on the fixture-control seam keyed by test-run identity and never appear in production requests.

The client in-memory provider, reducer, commands, synthetic browser globals, and protected-layout mount are removed after fixture HTTP parity. Keeping an adapter fallback was rejected because it would preserve two lifecycle implementations and allow P0 to pass without exercising production transport.

### Separate transport schemas from feedback view models

Runtime schemas model backend list pages, detail responses, review responses, error payloads, screenshot metadata, and conditional invariants. Narrow mappers convert backend integer identifiers and structured client context into the existing UI-facing representations. Unknown additive response fields are tolerated, while missing or invalid core fields fail closed.

List items require identifier, type, title, status, creation time, and last-modified time. Detail additionally requires description and expected outcome. Screenshot metadata is atomic when present; moderation detail requires a sender; promoted and dismissed detail requires a feedback review message; only promoted moderation detail may contain a positive GitHub issue number.

Using backend responses directly in components was rejected because optionality drift would spread defensive parsing throughout the UI. Fabricating defaults was rejected because it would misrepresent domain state.

### Derive affordances from status, scope, and permission

The backend does not return capability flags. A single deterministic frontend helper exposes withdrawal only for personal pending feedback, Promote and Dismiss only for pending feedback with `feedback:review`, and administrative Delete for any moderation detail with `feedback:delete`. These booleans are presentation hints only; the backend remains the final authorization and concurrency authority.

Pending feedback may be withdrawn, promoted, dismissed, or administratively deleted. Promoted and dismissed feedback cannot be withdrawn or reviewed again but may still be administratively deleted. Promote and Dismiss are mutually exclusive and irreversible. The losing side of a review-versus-withdraw race may receive `404` or lifecycle `409`, and the UI refreshes or navigates from that authoritative outcome.

### Use distinct Promote and Dismiss request contracts

Both review actions require a user-visible message of 10 through 1000 characters. Promote additionally requires a GitHub Issue URL; the client validates Issue URL structure while the backend validates that it belongs to the configured Signapse repository and stores only its positive issue number. Dismiss omits the URL entirely. Personal responses expose no GitHub information, and moderation detail displays only the returned issue number without inventing a canonical link.

One shared UI request schema was rejected because the runtime applies incompatible conditional rules that are not yet expressed by the shared OpenAPI request schema. Automatic GitHub issue creation and frontend repository ownership inference remain out of scope.

### Serialize only the accepted queue grammar

Moderation URL state remains the stable user-facing contract. The server serializer emits only `$filter`, zero-based `page`, bounded `size`, and repeated `sort`. It supports `containsIgnoreCase` for title, exact type/status filters, `and` composition, size up to 100, and creation-time ordering with identifier as the same-direction stable tie-breaker. The moderation default explicitly sends `status eq PENDING_REVIEW`; backend does not inject that filter. UI pages remain one-based and are converted to backend pages. Out-of-range backend pages return an empty `200` page and are canonicalized by the UI when necessary.

Malformed URL values are canonicalized to safe defaults. Personal history remains fixed at ten newest-first items per page with no search or filter grammar.

### Build multipart submission from privacy-bounded inputs

Create sends a JSON submission part and at most one optional binary screenshot without forcing a JSON content type on the multipart envelope. Reproduction steps and observation time are omitted for IDEA. Technical context remains enabled by default and inspectable, but page paths exclude query, fragment, and absolute URLs, blank strings normalize away, unknown fields are not sent, and the payload excludes page content, form values, raw user-agent, IP address, and device identifiers. Screenshot selection is manual and restricted to PNG or JPEG up to 5 MiB and 25 megapixels.

The browser checks MIME, byte size, and decoded dimensions for early feedback; the backend still verifies bytes, decodes, and re-encodes. No upload-progress subsystem is added because the accepted stable pending treatment is sufficient for the bounded file size.

### Proxy screenshots through scope-specific authenticated routes

Personal and moderation screenshot requests use separate internal route scopes that call the corresponding backend endpoint. The proxy accepts only normalized PNG/JPEG binary content and preserves or enforces `Content-Disposition: inline`, `Cache-Control: private, no-store`, and `X-Content-Type-Options: nosniff`. It does not expose backend storage URLs or fall back between personal and moderation authorization scopes.

Screenshot loading is isolated from detail loading. Missing or cross-owner content resolves unavailable without an unbounded retry, while temporary storage `502`, network, and server failures expose a local retry. Invalid upload responses use `400`; Spring transport overflow may use `413`.

### Normalize errors and refresh authoritative state

Backend error bodies may include localized `message`, `timestamp`, and optional `code`, but only `FEEDBACK_ALREADY_REVIEWED` and `FEEDBACK_NO_LONGER_WITHDRAWABLE` are stable business codes. The shared authenticated transport preserves HTTP status and optional code. Frontend dictionaries own visible recovery copy; backend messages remain diagnostic rather than direct UI content. Personal cross-owner access already returns `404` and uses the normal missing experience.

The feature does not optimistically mutate feedback. Confirmed mutations revalidate affected list and detail routes and refresh server-rendered data. Validation `400`, transport `413`, missing `404`, lifecycle `409`, storage `502`, timeout, network, and other server failures map to action-specific localized recovery. A lifecycle conflict closes the stale action surface and refreshes detail; an already missing destructive target returns to the relevant list with informational rather than false-success messaging. There is no feedback-specific `fieldErrors`, `422`, `415`, or `429` assumption.

### Preserve accepted navigation while handling live pagination edges

Create from personal history canonicalizes to page one so the new record is visible. Withdrawal returns to personal page one. Administrative deletion restores the prior moderation query context and moves to the nearest valid page when deletion makes the requested page out of range. Promote and dismiss remain on canonical detail with refreshed status, review message, and moderation-only issue number where applicable.

After the activation gate, personal entries are available to active users. The moderation Settings item and direct route require `feedback:read`; Promote and Dismiss additionally require `feedback:review` plus pending status, and Delete requires `feedback:delete` regardless of status.

### Minimize sensitive observability

Logs may include operation name, status, duration, correlation identifier, and an existing feedback identifier. They exclude submission content, reproduction steps, expected outcome, review message, screenshot bytes or metadata, and technical-context payload. Client telemetry does not record feedback form values.

## Risks / Trade-offs

- [Risk] Clarification and OpenAPI may drift during implementation. → Keep production gates and fixture approval blocked until the final live sync rules out hard contradictions; record sparse-document explanations instead of treating missing detail as a false mismatch.
- [Risk] Runtime validation may reject additive or partially migrated responses. → Tolerate unknown fields, require only accepted invariants, and deploy backend-compatible changes first.
- [Risk] Status-derived affordances may become stale between render and mutation. → Treat `404` and lifecycle `409` as authoritative, refresh detail, and avoid optimistic state.
- [Risk] Binary proxying and browser dimension checks add latency. → Limit uploads to one 5 MiB, 25-megapixel PNG/JPEG, validate before submission, preserve backend security headers, and avoid a second storage abstraction.
- [Risk] Moving fixtures to HTTP increases fixture-server complexity. → Emulate only P0-covered endpoints, share contract guards, isolate state per test run, and delete the duplicate client lifecycle seam.
- [Risk] Deleting the last row can invalidate a restored moderation page. → Resolve the nearest valid page after mutation while preserving other queue controls.
- [Trade-off] Live reads fail when the backend is unavailable instead of falling back locally. → The UI remains truthful, retains recoverable inputs, and isolates the failure from the application shell.

## Migration Plan

1. Capture and accept the backend runtime clarification while recording current OpenAPI documentation drift.
2. Add transport schemas, operation-specific review schemas, domain mappers, query serialization, error-code preservation, authenticated actions, and screenshot proxy routes behind existing production gates.
3. Extend the HTTP fixture backend, permission source, contract registry, synthetic records, binary behavior, and deterministic scenarios.
4. Bind existing personal and moderation surfaces to the API-backed boundary, including required Promote Issue URL input, and add focused and P0 coverage.
5. Remove the in-memory feedback provider, commands, protected-layout mount, browser globals, and fixture-only UI adapters after parity.
6. Sync the live OpenAPI and API mapping ledger, verify no hard contract contradiction, approve the fixture contract guard, and record BE explanations for remaining documentation gaps.
7. Remove production route and navigation gates, leaving active-user and permission/status checks as the authoritative visibility rules.
8. Run repository-owned validation and record live authenticated smoke verification as user-owned manual readiness.

Rollback keeps backend additions in place, restores the frontend production gates, and redeploys the previous frontend. It does not reintroduce an in-memory production fallback or require persisted-data migration.

## Open Questions

There are no unresolved frontend product decisions. Implementation and activation may proceed from the accepted clarification after the live OpenAPI/API mapping structural cross-check and repository verification pass; only a hard contract contradiction returns to exploration.
