## Context

The live backend contract now contains separate active-user and permission-gated feedback operations, but the frontend has no feedback module. The accepted product brief deliberately sequences UI design before transport integration so navigation, terminology, information hierarchy, fixture workflows, and accessibility can be validated without exposing synthetic persistence to production users or treating undocumented backend behavior as authoritative.

The protected app already supplies a localized application shell, permission collection, P0 fixture submode, shared list pagination, Base UI-backed Dialog and AlertDialog wrappers, deterministic browser fixtures, and the Financial Command Surface design system. The feedback UI must compose those seams rather than add a second shell, component library, navigation model, or test harness.

The backend contract leaves response requiredness/nullability, feedback filters, screenshot transport constraints, review lifecycle rules, and `githubIssueUrl` semantics incomplete. These unknowns must remain visible integration follow-ups, not hidden assumptions in the UI state model.

## Goals / Non-Goals

**Goals:**

- Deliver complete fixture-only personal and moderation feedback surfaces that reflect the accepted contract vocabulary and field constraints.
- Keep compose available from the current application context while retaining canonical personal and moderation list/detail routes.
- Exercise successful, empty, invalid, permission, screenshot, and recoverable mutation states deterministically.
- Preserve a clean replacement seam for later authenticated API integration.
- Verify externally observable behavior through one Playwright P0 browser seam.
- Meet existing localization, responsive, accessibility, and Financial Command Surface requirements.

**Non-Goals:**

- Integrate any live feedback endpoint, multipart upload, binary screenshot response, or backend query contract.
- Prove real Clerk authorization, backend ownership, persistence, or lifecycle enforcement.
- Persist fixture data across reloads or expose the feature outside P0 fixture mode.
- Add automatic screenshot capture, redaction, GitHub issue creation/linking, notifications, unread counts, internal notes, bulk moderation, assignment, comments, or editing.
- Introduce Quick Detail, intercepted routes, URL-backed compose state, new shared primitives, new dependencies, or feature-specific visual tokens.

## Decisions

### Use one fixture-only state owner at the protected-app boundary

The protected app will conditionally mount one feedback fixture state owner only in P0 fixture submode. It will receive a deterministic synthetic seed and expose query selectors plus compose, withdraw, promote, dismiss, and erase commands. Client-side navigation will preserve this state because the owner lives above feedback routes; a full reload will reconstruct the seed.

The state shape will contain contract-relevant feedback data plus fixture-only action capabilities and scenario controls. Optional response fields will remain optional. The action capabilities will be independent of status and will be consumed alongside the current permission collection.

Alternatives considered:

- Route-local fixture arrays were rejected because compose or review mutations would disappear when moving between list and detail.
- `localStorage`, IndexedDB, cookies, or a fixture database were rejected because the accepted UI-only contract requires deterministic reset on reload and no synthetic persistence.
- A second general-purpose application store was rejected because feedback is the only consumer and the repository does not need another state framework.

### Keep server route gates and client fixture behavior separate

Each feedback page will retain a Server Component boundary that checks the supported P0 fixture submode before rendering feature UI. Outside fixture mode it will resolve as not found. Inside fixture mode it will render focused client components that consume the feedback fixture owner. Moderation pages will additionally respect the existing permission collection, failing closed for direct access without `feedback:read`.

The application shell will pass the existing fixture-mode fact to user-menu composition and filter the moderation navigation through the existing permission-aware site configuration. Synthetic feedback data will never be selected merely because a URL is known.

Alternatives considered:

- Rendering a production coming-soon or disabled surface was rejected because it would expose an incomplete workflow and create a product promise.
- A client-only gate was rejected because it could briefly render fixture UI before hiding it and would not provide a reliable direct-route boundary.

### Compose is a controlled local Dialog, not navigation

`Gửi phản hồi` in the user menu and the personal page primary action will each control the same route-independent compose component contract. Opening and closing compose will not change URL state. The component will capture the current localized page path at open time for optional technical context.

The form will use the existing React Hook Form and Zod v4 conventions for contract-derived field constraints. Screenshot File state and preview URL lifecycle will remain local to the Dialog. A supported image will use an object URL that is revoked on removal, reset, or unmount; unsupported preview types will render metadata and fallback copy.

When the form is dirty, a sibling application confirmation flow will intercept close intent. The feature will compose a localized visible close action at the usage site when necessary instead of changing default shadcn wrapper chrome.

Alternatives considered:

- `/feedback/new`, intercepted routing, and `?compose=1` were rejected because compose is a short contextual action and does not need a canonical navigation destination.
- A Sheet was rejected because the accepted flow is a bounded, cancel-safe form rather than a persistent workspace.
- Automatic page capture was rejected because it introduces privacy, redaction, browser capability, and performance concerns not represented in the contract.

### Separate personal and moderation information architecture

The user menu will expose `Gửi phản hồi` and `Phản hồi của tôi`. Personal history and detail will use bounded content. Personal history will remain newest-first with 10 items per page, no search or filters, and a first-use Empty action.

The settings group will expose `Phản hồi người dùng` only for `feedback:read`. The moderation queue and detail will use fluid content. The queue will default to `PENDING_REVIEW`, use URL-backed title search, type/status filters, sort, page, and size, and reuse shared pagination. It will not show sender data, aggregate counts, metric cards, or whole-row click behavior. Detail will use a main evidence region plus secondary metadata/action rail on wide screens and a single logical column on narrow screens.

Alternatives considered:

- A combined role-switching page was rejected because personal tracking and moderation have different permissions, density, and decision paths.
- Status tabs were rejected because the list contract does not provide facet counts and tabs would encourage fabricated totals.
- Quick Detail was rejected because the authoritative design policy restricts that pattern to Event inspection and Article reader owners.

### Treat review outcomes as user-visible domain content

The fixture state will use the accepted labels `Chờ xem xét`, `Đã chuyển xử lý`, and `Không tiếp nhận`. Promote and Dismiss will open form Dialogs requiring `Nội dung gửi tới người dùng` between 10 and 1000 characters. Successful review will update the selected record in memory, close the Dialog, keep the reviewer on canonical detail, update the action rail, and show a localized toast.

`githubIssueUrl` will not be editable. A read-only GitHub issue reference may appear when fixture data contains one. Sender identity will be labeled `Người gửi` and will appear only on moderation detail because the list contract does not include it.

Alternatives considered:

- Treating `reviewMessage` as an internal note was rejected because the accepted product model defines it as `Kết quả xem xét` visible to the feedback sender.
- Labeling `PROMOTED` as accepted or guaranteed work was rejected because the state only means selected for follow-up handling.

### Combine permissions with explicit record capabilities

Moderation navigation and readable detail require `feedback:read`. Review controls require `feedback:review`; erase requires `feedback:delete`. In addition, each fixture record declares whether withdraw, promote, dismiss, or erase is currently available. Components require both the relevant permission and explicit record capability and never infer availability from status alone.

Alternatives considered:

- Hard-coded pending-only action rules were rejected because the backend does not publish lifecycle transitions.
- Permission-only action visibility was rejected because authorization does not establish whether a particular record is eligible for a transition.

### Use existing surfaces and semantic behavior

All visible and assistive copy will come from matching Vietnamese and English dictionaries. The feature will use existing semantic tokens, Geist typography, Lucide icons, Field composition, shared Spinner, Empty, Badge, table, pagination, Dialog, AlertDialog, toast, skeleton, and localized navigation helpers. Feature code will not modify default shadcn wrapper internals.

Status presentation will pair localized text with non-color cues. Titles will be semantic links rather than custom clickable rows. Dialog forms will keep visible labels, field-local errors, announced dynamic feedback, first-invalid-field focus, pending control stability, and trigger focus restoration. Destructive failures will leave confirmation surfaces recoverable.

### Verify through one browser seam

One feedback Playwright P0 suite will exercise the real localized application in supported fixture submode. It will enter through the user menu or canonical routes and assert only observable copy, URL state, focus, accessibility, responsive layout, permission visibility, and in-memory mutation outcomes. Existing fixture controls will select deterministic user/permission and outcome scenarios; network-violation detection will prove that no Clerk, live backend, GitHub, or external media request occurs.

This is intentionally UI-only browser coverage. It does not invoke the future feedback Server Action or backend fixture routes and must not be reported as API-boundary coverage. A later integration change will replace the in-memory command seam with authenticated actions and extend the existing contract-aligned fixture backend.

Alternatives considered:

- Component tests as the primary seam were rejected because they would miss shell navigation, localized routes, Back/Forward, focus restoration, and responsive composition.
- Real backend or Clerk integration tests were rejected because they require credentials and contradict the UI-only scope.

## Risks / Trade-offs

- [Risk] The in-memory command seam differs from the later authenticated transport path. → Mitigation: keep all screens dependent on a narrow feature state/command interface and explicitly replace that adapter in the API-integration change.
- [Risk] Fixture-only route gating could accidentally leak synthetic UI outside P0 mode. → Mitigation: enforce the gate at Server Component route boundaries, hide both navigation branches, and add a browser/static verification for non-fixture composition where feasible.
- [Risk] A global feature provider adds client code to the protected shell. → Mitigation: mount it only in P0 fixture submode and keep its seed, reducer, and public interface feature-scoped.
- [Risk] URL-backed fixture filters could diverge from the future backend query grammar. → Mitigation: treat URL state as the stable UX contract while isolating client-side fixture selection behind one adapter; define backend serialization only in the integration change.
- [Risk] Unsupported screenshot fixture behavior may differ from the eventual binary response. → Mitigation: limit UI-only behavior to previewable image, metadata, remove, and localized fallback states; defer MIME limits, download, caching, and proxy behavior.
- [Risk] Review and withdrawal actions could imply undocumented lifecycle rules. → Mitigation: drive every action from explicit fixture capabilities rather than status and keep backend lifecycle enforcement out of this change.
- [Risk] User-visible review messages may expose inappropriate internal text if later reused carelessly. → Mitigation: label the field `Nội dung gửi tới người dùng`, document it as `Kết quả xem xét`, and exclude internal-note UI.
- [Risk] Long fixture content can make Dialog and detail layouts unstable. → Mitigation: include long Vietnamese and English fixtures, bounded internal scrolling, readable measures, wrapping, and narrow/zoom browser coverage.
- [Trade-off] Personal history omits search/filter controls. → Benefit: a simpler self-service surface now; these controls can be proposed later if real usage volume justifies them.

## Migration Plan

1. Add contract-aligned fixture view types, deterministic seeds, scenario controls, and the conditional in-memory state owner.
2. Add dictionary keys and fixture-only navigation composition.
3. Add compose, personal history, and personal detail surfaces.
4. Add moderation queue, detail, review Dialogs, and deletion confirmation.
5. Add P0 browser scenarios and run deterministic quality checks.
6. Keep all feedback navigation and routes gated to fixture submode when the UI-only change lands.

Rollback is recoverable: remove the fixture-only provider, route surfaces, navigation composition, dictionaries, and browser suite. No persisted data, production route, backend contract, dependency, or external system requires migration.

The later API-integration change will retain accepted UI and routes, replace the in-memory query/command adapter with authenticated read/mutation actions, add multipart and binary transport seams, extend the fixture backend and contract guard, and remove the production route gate only after live behavior is validated.

## Open Questions

These questions do not block the UI-only change and remain explicit inputs to the later integration proposal:

- Which fields and operators does `SpecificationFeedbackSubmission` support at runtime?
- Which feedback response fields are required, nullable, or conditionally omitted?
- What screenshot MIME types, size limits, response headers, caching rules, and authorization failures are authoritative?
- Which statuses permit withdraw, promote, dismiss, or erase, and are any transitions idempotent or reversible?
- Does `githubIssueUrl` link an existing issue, instruct backend issue creation, or serve another purpose, and how does it relate to `githubIssueNumber`?
- Which backend error statuses and localized messages apply to ownership, invalid transitions, missing feedback, validation, timeout, and authorization failures?
