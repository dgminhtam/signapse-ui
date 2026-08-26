## 1. Contract Gates

- [x] 1.1 Sync the dev OpenAPI snapshot and API mapping ledger, record the current feedback documentation gaps, and define the structural no-contradiction gate for activation and archive.
- [x] 1.2 Capture the accepted backend runtime clarification as semantic implementation input and establish separate implementation and activation gates without removing production gates.
- [x] 1.3 Lock the implementation scope to authenticated feedback integration, HTTP fixture parity, permission/navigation activation, legacy fixture removal, and repository-owned verification with no accepted out-of-scope expansion.

## 2. Feedback Transport Model

- [x] 2.1 Add Zod runtime schemas for feedback list pages, personal and moderation detail, distinct Promote and Dismiss requests, conditional sender/review/GitHub/screenshot fields, and the confirmed optional-code error body.
- [x] 2.2 Add narrow transport-to-view mappers that normalize identifiers, timestamps, screenshot metadata, sender data, and technical context without fabricating missing domain values.
- [x] 2.3 Add moderation query parsing and `$filter` serialization for one-based UI pages, zero-based backend pages, explicit pending default, `containsIgnoreCase` title search, exact type/status filters, size up to 100, and repeated stable creation-time plus identifier sorts.
- [x] 2.4 Extend authenticated transport error metadata to preserve optional backend `code`, then normalize `400`, `401`, `403`, `404`, lifecycle `409`, `413`, `502`, timeout, network, and server failures with dictionary-owned messages and no assumed field errors or raw backend copy.
- [x] 2.5 Add deterministic tests for valid, optional, conditional, malformed, and additive response shapes plus query canonicalization and error normalization.

## 3. Authenticated Actions And Screenshot Routes

- [x] 3.1 Implement authenticated personal list, detail, multipart create, and withdrawal actions using the shared transport and runtime schemas.
- [x] 3.2 Implement authenticated moderation list, detail, Promote with required GitHub Issue URL, Dismiss without that field, and `204` administrative deletion actions with canonical permission boundaries and runtime schemas.
- [x] 3.3 Build privacy-bounded technical context with BUG-only reproduction/observation time and validate one manual PNG/JPEG screenshot up to 5 MiB and 25 megapixels before multipart submission.
- [x] 3.4 Implement separate authenticated personal and moderation screenshot route handlers with matching backend scope, normalized PNG/JPEG inline response, private no-store caching, `nosniff`, and `404`/`502` isolation.
- [x] 3.5 Revalidate affected personal and moderation routes after confirmed mutations without optimistic state or cross-user feedback caching.
- [x] 3.6 Add focused action and route-handler tests for distinct review request shapes, multipart parts, authorization scopes, optional lifecycle codes, `204` handling, revalidation, binary constraints, security headers, and isolated screenshot failure.

## 4. HTTP Fixture Parity

- [x] 4.1 Extend the provisional fixture registry with every P0-covered personal and moderation endpoint, method, distinct review request, response invariant, status, lifecycle code, and screenshot constraint from the accepted clarification.
- [x] 4.2 Add test-run-isolated synthetic feedback state and contract-valid list, personal/moderation detail, sender, status/permission action states, review outcomes, promoted moderation GitHub issue numbers, BUG-only context, and pagination variants.
- [x] 4.3 Implement fixture multipart create, withdrawal, promote, dismiss, administrative deletion, and scoped binary screenshot behavior through the production-shaped HTTP routes.
- [x] 4.4 Add fixture-control scenarios for success, `400`, `404`, both lifecycle `409` codes, `413`, `502`, timeout, outage, server failure, malformed responses, and screenshot failures without adding test flags to production requests.
- [x] 4.5 Serve configurable feedback permissions through the fixture server's current-user response so server sidebar composition and direct-route gates share one source.
- [x] 4.6 Extend fixture tests to fail on unmapped feedback requests, external network access, or cross-test state leakage; keep the guard aligned with the accepted BE clarification and structural OpenAPI verification.

## 5. Bind The Accepted Feedback UI

- [x] 5.1 Replace personal list and detail fixture reads with authenticated server data while preserving bounded layout, one-based pagination, localized missing/error states, and ownership non-disclosure.
- [x] 5.2 Replace compose commands with multipart submission while preserving BUG-only reproduction/observation time, technical-context transparency, PNG/JPEG byte-and-dimension validation, screenshot preview/removal, dirty-close confirmation, pending stability, and recoverable input.
- [x] 5.3 Implement confirmed create and withdrawal navigation so personal history resolves to page `1`, refreshes authoritative data, and never reports false success for stale removal.
- [x] 5.4 Replace moderation queue fixture selection with backend filtering, stable sorting, pagination, URL canonicalization, and preserved Back/Forward behavior.
- [x] 5.5 Replace moderation detail and mutation commands with permission-plus-status actions, required Promote GitHub Issue URL, Dismiss omission, moderation-only issue-number display, stale `404`/`409` recovery, `204` deletion navigation, and nearest-valid-page recovery.
- [x] 5.6 Bind personal and moderation screenshot regions to their scoped internal routes with inline-only display, localized unavailable treatment, and recoverable retry where allowed.
- [x] 5.7 Preserve dictionary-backed copy, keyboard and focus behavior, non-color status cues, responsive layouts, reduced motion, and serious/critical accessibility boundaries across all live-backed states.

## 6. OpenAPI Activation Gate And Legacy Removal

- [x] 6.1 Re-run the live dev OpenAPI and API mapping sync, verify no hard path/method/auth/transport/response/status contradiction, record BE-explained semantic gaps, and approve the fixture contract guard before activation.
- [x] 6.2 Expose personal feedback entries to active users and `Phản hồi người dùng` in Settings only with server-resolved `feedback:read`, while keeping compose route-independent and enforcing moderation permission on direct routes.
- [x] 6.3 Remove the P0-only personal and moderation route gates after activation while retaining active-user, permission, missing, and error boundaries.
- [x] 6.4 Remove the feedback in-memory provider, protected-layout mount, reducer, commands, client seeds, browser globals, and fixture-only adapters after HTTP parity is verified.
- [x] 6.5 Ensure production failures remain localized and recoverable without localStorage, IndexedDB, in-memory queue, synthetic record, or cross-scope screenshot fallback.
- [x] 6.6 Update the API mapping ledger to record integrated frontend ownership and the backend permission, request, response, query, screenshot, and error semantics, including BE-explained documentation gaps.

## 7. Verification

- [x] 7.1 Update P0 personal journeys for authenticated transport, BUG/IDEA conditional payloads, PNG/JPEG byte-and-dimension validation, personal pagination, scoped screenshots, withdrawal, malformed data, missing ownership, and recoverable failures through visible behavior.
- [x] 7.2 Update P0 moderation journeys for server permission navigation, explicit `$filter` queue controls, status/permission affordances, required Promote Issue URL, Dismiss omission, deletion at every status, page recovery, `404`/`409` races, screenshot isolation, and preserved context.
- [x] 7.3 Run feedback parser, mapper, action, route-handler, fixture, contract-guard, and feedback browser tests and confirm failure evidence remains sanitized and diagnosable.
- [x] 7.4 Run lint, typecheck, the focused deterministic feedback gate, the feedback P0 browser gate, OpenSpec validation, and static searches for removed fixture seams and production gates.
- [x] 7.5 Confirm production activation and archive occur only after task 6.1 passes; structural activation completed after task 6.1, and archive remains a separate explicit workflow action.

User-owned manual QA: perform a live authenticated personal and moderation smoke test and confirm backend-first production rollout readiness. This is readiness evidence, not an archive-blocking automated checkbox.

Verification note: focused feedback Vitest suite passes (3 files, 23 tests), fixture contract guard passes for 51 routes, strict OpenSpec validation passes, lint and typecheck pass, and live OpenAPI structural verification passes with BE-explained documentation gaps. The feedback P0 browser suite passes all 5 journeys with one worker. A full repository Vitest run still has two unrelated Telegram test failures (30/32 files pass), and a full parallel browser run cascaded after its fixture server exited; those broader repository issues are retained as residual verification notes, not feedback blockers.
