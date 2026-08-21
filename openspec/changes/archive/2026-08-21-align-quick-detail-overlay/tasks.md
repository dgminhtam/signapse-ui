## 1. Local quick-detail policy and session lifecycle

- [x] 1.1 Add a deterministic local presentation resolver for the approved owner, entity-profile, and CSS-viewport matrix, including desktop right-sheet and bottom-sheet geometry, swipe affordance, stable resize behavior, and reduced-motion handling.
- [x] 1.2 Refactor the local quick-detail composition to create one opening request session with an immutable fetched snapshot, top-of-body-scroll reset, stale-response protection, classified loading/error/missing/access-denied states, and explicit Retry semantics.
- [x] 1.3 Implement the localized sticky modal header and single body scroll region with profile-plus-entity title, state-aware description, visible Close control, conditional canonical full-detail action, controlled initial/final focus, and one shared close path for Escape, backdrop, and swipe dismissal.
- [x] 1.4 Preserve focused Event inspection and Article reader content contracts: four-item Event evidence/assets limits, a centered bottom-sheet structured-content width, `72ch` Article prose measure, local wide-content scrolling, canonical evidence navigation, and optional article-region omission.

## 2. Owner integrations and localization

- [x] 2.1 Update Dashboard and Graph View quick-detail adapters to pass only their approved entity profiles and the exact activating trigger as the focus-return target, without adding URL or history state.
- [x] 2.2 Update the Market Charts annotation-to-Event-inspection flow to capture the annotation context and title trigger, dismiss the annotation surface while the modal is open, restore that context before final focus on close, and preserve nearest-overlay portal containment in and out of fullscreen.
- [x] 2.3 Add localized copy for profile-aware modal titles, concise state descriptions, Close, Retry, and canonical full-detail actions in every supported dictionary without introducing hardcoded user-visible strings.

## 3. Automated behavior coverage

- [x] 3.1 Extend the quick-detail component tests with the placement resolver matrix, stable open-session snapshot/retry behavior, scroll reset, localized accessible header, conditional canonical actions, and keyboard/pointer/touch dismissal focus behavior.
- [ ] 3.2 Add owner-flow coverage for Dashboard, Graph View, and Market Charts: allowed profile scope, no quick-detail Back/history restoration, Market annotation-context restoration, and preservation of chart state and fullscreen overlay containment.
- [ ] 3.3 Add responsive browser coverage for Dashboard's large, medium, and narrow placements; Graph View and Market Charts bottom placement; and an open-session viewport transition without remounting the modal.

## 4. Verification

- [x] 4.1 Run the focused Vitest quick-detail and Market Charts tests.
- [ ] 4.2 Run `pnpm lint` and `pnpm typecheck`.
- [ ] 4.3 Run the relevant Playwright browser coverage and `openspec.cmd validate align-quick-detail-overlay --type change --strict`.

Verification notes:

- Focused Vitest: 3 files, 23 tests passed; `pnpm typecheck` passed; scoped ESLint passed with two warnings.
- Full `pnpm lint` remains blocked by seven pre-existing `react-hooks/set-state-in-effect` errors outside this change.
- Dashboard Chromium E2E passed for the implemented large/medium/narrow Event flow and focus handoff; Graph View and Market Charts browser owner-flow coverage remains to be added.
- OpenSpec strict validation and the fixture contract guard both passed.

User-owned manual QA (non-blocking): confirm the finalized overlay in light and dark themes, at actual browser zoom levels, and while Market Charts is fullscreen with production-like chart data.
