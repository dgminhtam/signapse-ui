## Why

The accepted feedback experience is currently available only through P0 HTTP fixtures, so active users cannot submit or track feedback and authorized reviewers cannot moderate it against the live backend. Backend review has now confirmed the runtime lifecycle, operation-specific review payloads, filtering, response invariants, screenshot behavior, and errors needed to integrate. Live OpenAPI remains a structural verification gate; BE-explained documentation gaps do not block activation.

## What Changes

- Connect personal feedback compose, history, detail, screenshot, and withdrawal behavior to authenticated backend operations.
- Connect the permission-gated moderation queue, detail, screenshot, promote, dismiss, and administrative deletion behavior to authenticated backend operations.
- Derive feedback action affordances from status, action scope, and canonical permissions while treating backend `404` and lifecycle `409` responses as authoritative for races.
- Define response invariants, operation-specific promote/dismiss payloads, lifecycle behavior, `$filter` queries, stable sorting, confirmed error handling, technical-context privacy, and PNG/JPEG screenshot constraints.
- Add a required configured-repository GitHub Issue URL field to Promote only, persist and display the returned positive issue number only on moderation detail, and keep Dismiss and personal responses free of GitHub data.
- Allow implementation and HTTP fixture work from the accepted backend clarification, then expose production feedback entries after live OpenAPI/API mapping verify there is no hard contract contradiction; retain BE explanations for intentionally undocumented detail.
- Replace the feedback-specific in-memory provider and commands with the existing deterministic HTTP fixture backend so P0 and live operation exercise the same frontend integration boundary.
- Keep live authenticated smoke verification as user-owned readiness evidence while retaining repository-runnable automated checks as the archive gate.

## Capabilities

### New Capabilities

- `feedback-api-integration`: Defines authenticated transport, runtime response invariants, status/permission action derivation, operation-specific review requests, filtering, screenshot security, error normalization, cache consistency, and the separate implementation and activation gates.

### Modified Capabilities

- `feedback-submission-ui`: Replaces fixture-only personal submission, history, detail, screenshot, and withdrawal behavior with authenticated API-backed behavior while preserving the accepted UI contract.
- `feedback-moderation-ui`: Replaces fixture-only moderation reads and mutations with permission- and status-gated API-backed behavior, required GitHub Issue URL capture for Promote, and production navigation.
- `feedback-ui-fixtures`: Moves deterministic feedback state and scenarios from a client in-memory owner to the shared HTTP fixture boundary used by Server Components, Server Actions, and screenshot handlers.

## Impact

- Affects the protected application shell, feedback route gates, personal user-menu composition, permission-aware Settings navigation, feedback list/detail/compose/review/delete surfaces, authenticated actions, response validation and mapping, and internal screenshot delivery routes.
- Extends the deterministic fixture HTTP backend, fixture permission source, contract registry, and P0 feedback journeys; removes the feedback-specific client provider, reducer, commands, seeds, and browser globals after parity is reached.
- Uses the accepted backend clarification as the semantic runtime contract; live OpenAPI remains a structural cross-check, while requiredness/nullability, query examples, screenshot constraints, and error examples may remain documented in the BE clarification.
- Adds no third-party dependency and does not add new visual primitives, routes, automatic GitHub issue creation, notifications, analytics, or offline persistence.
