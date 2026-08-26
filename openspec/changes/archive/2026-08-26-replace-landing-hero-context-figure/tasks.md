## 1. Align the landing contract and dependencies

- [x] 1.1 Update `docs/design/LANDING.md`, `CONTEXT.md`, and ADR-0010 so they consistently define the two complementary market-context views, progressive WebGL boundary, claim limits, fallback behavior, and separate apex-cutover scope; verify the three documents use the approved VI/EN terminology and contain no graph-to-price-generation claim.
- [x] 1.2 Add exact `three@0.180.0` and `@types/three@0.180.0` entries with the updated lockfile; verify `pnpm install --lockfile-only` succeeds and the resolved versions remain pinned.

## 2. Build the progressive figure shell

- [x] 2.1 Replace the obsolete figure dictionary entries with the approved VI/EN title, mode labels, capability-aware hints, Pause/Resume labels, fallback message, accessible instructions, and status announcements; verify dictionary tests or a targeted static assertion cover both locales and `01 / 03` is absent.
- [x] 2.2 Build a route-local server-rendered figure shell with localized semantic copy, recognizable graph and price-action fallback geometry, and a stable responsive footprint; verify `tests/components/public-landing.component.test.tsx` observes both views in the initial HTML without requiring WebGL.
- [x] 2.3 Integrate the new shell into the existing Hero in place of only the prior conceptual figure, then remove its obsolete markup, styles, helpers, and dictionary keys; verify the Hero headline, supporting copy, CTA, trust note, proof label, proof points, section order, and all later sections remain unchanged.

## 3. Adapt the approved v9 interactive visual

- [x] 3.1 Add a narrow route-local client island that dynamically loads Three.js and adapts the v9 deterministic graph positions, large node texture, uniform edges, candle-like price-action geometry, morph interpolation, drag rotation, and auto-rotation; verify the production build keeps Three.js out of the server-rendered Hero path and record the resulting route bundle impact.
- [x] 3.2 Implement the approved local state precedence for hover preview, click/tap/Enter/Space pinning, drag-threshold mode locking, arrow-key rotation, pause/resume, resize, theme changes, and remount reset; verify targeted browser tests cover pointer, touch, and keyboard behavior without asserting renderer internals or GPU pixels.
- [x] 3.3 Add a labelled focusable group, visible focus treatment, native auto-rotation button, capability-aware hint, current-mode label, polite live status, and accessibility-hidden canvas; verify automated accessibility coverage confirms logical keyboard operation and the absence of `role="application"`.
- [x] 3.4 Apply semantic light/dark scene colors, the shared approximately 288–352px footprint, capped pixel ratio, and reduced-motion behavior; verify browser tests cover both themes, reduced-motion defaults and opt-in, 375/768/1024/1440 CSS-pixel layouts, 200% zoom, touch target sizing, and no page-level overflow.
- [x] 3.5 Suspend frame work while idle, paused, offscreen, or document-hidden; dispose renderer resources and listeners on teardown; and restore the static shell on WebGL initialization failure or context loss; verify browser tests observe suspension/resumption state and the non-blocking localized fallback without a technical error panel.

## 4. Verify the completed change

- [x] 4.1 Update `tests/components/public-landing.component.test.tsx` for localized server fallback semantics and unchanged surrounding Hero content, then verify it passes with `pnpm vitest run tests/components/public-landing.component.test.tsx`.
- [x] 4.2 Update `tests/e2e/landing.spec.ts` for localized identity, interaction equivalence, motion controls, accessibility, responsive layout, theme continuity, and renderer fallback, then verify it passes with `pnpm playwright test tests/e2e/landing.spec.ts`.
- [x] 4.3 Run static cleanup searches for `01 / 03`, obsolete conceptual-figure keys/helpers, v9 demo shell copy, fixed demo colors, unbounded animation loops, and forbidden price-generation claims; verify only intentional historical or specification references remain.
- [x] 4.4 Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `openspec validate replace-landing-hero-context-figure --strict --no-interactive`; resolve every change-owned failure and record any unrelated pre-existing failure with evidence.

User-owned release QA: visually compare the adapted figure with `/home/dgminhtam/Downloads/knowledge-graph-trading-hero-v9` in VI/EN, light/dark themes, and the approved responsive matrix before apex release. This sign-off is not an OpenSpec archive-blocking checkbox.
