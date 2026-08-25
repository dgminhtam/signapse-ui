## Why

Signapse now has a documented feedback contract, but users and reviewers have no frontend surface for composing, tracking, or moderating feedback. Designing and validating the complete interaction model in deterministic fixture mode first will let the product settle navigation, terminology, permissions, states, accessibility, and responsive behavior without exposing synthetic persistence or prematurely encoding unresolved backend lifecycle rules.

## What Changes

- Add a fixture-only feedback compose Dialog that can open from the authenticated user menu while preserving the current page context.
- Add localized personal feedback history and canonical detail surfaces for viewing fixture submissions, review outcomes, screenshots, and capability-gated withdrawal.
- Add a permission-aware moderation queue and canonical detail surface with fixture-backed search, filtering, sorting, pagination, review actions, and administrative deletion.
- Add deterministic in-memory feedback fixture state that survives client navigation, resets on reload, and supplies explicit action capabilities instead of deriving lifecycle rules from status.
- Add P0 browser coverage for the complete user-visible feedback workflow without calling Clerk, the live backend, or other external services.
- Keep feedback navigation and routes unavailable outside P0 fixture mode until backend integration is proposed separately.

## Capabilities

### New Capabilities

- `feedback-submission-ui`: Compose, personal history, personal detail, review-outcome presentation, screenshot presentation, and withdrawal behavior for a feedback sender.
- `feedback-moderation-ui`: Permission-aware moderation navigation, queue, detail, review actions, administrative deletion, and URL-backed list controls.
- `feedback-ui-fixtures`: Fixture-only exposure, deterministic in-memory state, explicit action capabilities, scenario coverage, and the P0 browser verification boundary.

### Modified Capabilities

- None.

## Impact

- Affects the protected application shell, authenticated user menu, settings navigation, localized dictionaries, feedback route surfaces, shared UI composition, and P0 browser fixtures/tests.
- Reuses the existing Financial Command Surface, shadcn/Base UI wrappers, Lucide icon set, localized navigation helpers, permission-provider conventions, shared pagination controls, and deterministic Playwright fixture foundation.
- Introduces no live feedback transport, Server Actions, multipart upload, binary screenshot proxy, backend query serialization, new dependency, persisted mock storage, or production route exposure.
