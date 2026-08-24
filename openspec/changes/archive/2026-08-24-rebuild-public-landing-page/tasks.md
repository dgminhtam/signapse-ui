## 1. Route, Access, And Metadata Policies

- [x] 1.1 Add a server-only public-origin/indexability policy that emits preview `noindex`, omits canonical/alternates for invalid non-indexable origin, and rejects non-apex indexable origin; verify the focused metadata-policy Vitest suite covers every configuration branch.
- [x] 1.2 Replace deprecated public route matching with an exact supported-locale pathname policy for locale roots and sign-in subtrees while keeping all other routes default-protected; verify focused proxy tests cover `/vi`, `/en`, sign-in descendants, sign-in-like false positives, dashboard/application routes, API routes, root negotiation, and Vietnamese fallback.
- [x] 1.3 Add the route-local pure landing access model for anonymous and authenticated CTA labels/destinations; verify focused unit tests cover header, Hero primary/secondary, final CTA, footer app entry, locked mail destination, and localized sign-in/dashboard routes.

## 2. Localized Landing Module

- [x] 2.1 Replace the Vietnamese and English landing dictionary schema with the locked eight-part story, trust qualifiers, CTA/email behavior, locale labels, accessibility labels, metadata, and social-card titles; verify `pnpm typecheck` proves dictionary parity and focused static assertions find no obsolete V2 landing keys.
- [x] 2.2 Refactor the localized route into server orchestration plus one route-local Server Component containing the canonical section order and three product chapters; verify focused render tests assert one H1, the eight roles in order, locked VI/EN content, supporting AI placement, and no dashboard shell.
- [x] 2.3 Implement the route-local locale-link client island with native link semantics, current-locale state, query preservation, supported-hash preservation, unsupported-hash removal, and no cookie mutation; verify focused component/browser tests cover VI-to-EN and EN-to-VI navigation states.

## 3. Public Experience And Social Metadata

- [x] 3.1 Implement the public header, native mobile disclosure, skip link, auth-aware access actions, final CTA, and footer with only real destinations; verify keyboard tests cover disclosure, focus order, focus visibility, `#how-it-works`, localized sign-in/dashboard links, and the copyable request-access address.
- [x] 3.2 Implement the text-first evidence-led editorial layout using existing Geist, semantic tokens, Nova/shadcn chrome, Lucide icons, and one decorative relationship treatment; verify rendered source and static search contain no product-media placeholder, synthetic dashboard, fake metric/control, Market Query preview, Theme node, or unapproved landing image.
- [x] 3.3 Integrate localized `generateMetadata` output with the fail-closed policy and generate two deterministic 1200×630 brand-only social cards from approved brand assets and localized metadata titles; verify focused metadata/image tests cover VI/EN preview URLs, robots, canonical, alternates, `x-default`, invalid config, simulated apex config, dimensions, and prohibited social-card content.
- [x] 3.4 Resolve adjacent-logo accessible-name duplication through the narrowest supported composition and keep theme variants correct; if the shared Logo API changes, verify focused tests or deterministic inspection cover the sidebar and AI Assistant consumers as well as the landing header/footer.

## 4. Browser And Accessibility Coverage

- [x] 4.1 Add a P0 Playwright landing journey for `/vi` and `/en` covering section order, locked chapter copy, authenticated fixture CTAs, real anchors, footer destinations, locale switching with query/supported hash, and unsupported-hash removal; verify the targeted Chromium landing project passes.
- [x] 4.2 Extend Playwright accessibility and responsive coverage for the landing with axe, keyboard-only navigation, reduced motion, light/dark themes, 375/768/1024/1440 widths, 200% zoom, practical mobile targets, and no page-level horizontal overflow; verify the targeted accessibility/browser suite passes without serious or critical axe findings.
- [x] 4.3 Add rendered-response assertions for localized title, description, preview `noindex`, canonical, VI/EN alternates, `x-default`, and social image references; verify the targeted server/browser metadata suite passes under explicit `dev.signapse.cloud` preview configuration.

## 5. Cleanup And Automated Gates

- [x] 5.1 Remove old landing components, helpers, dictionary keys, synthetic mock sources, and forbidden copy when no caller remains; verify `rg` finds no active landing references to Problem/Pillars/Pipeline/Personalization/ProductPreview/MiniGraph, fake `82%` or evidence `8`, Market Query evidence, workspace graph slicing, Theme nodes, watchlist evidence boundaries, or team/shared-workspace positioning.
- [x] 5.2 Run `openspec validate "rebuild-public-landing-page" --strict --no-interactive`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and the targeted landing Playwright suite; verify every command completes successfully and report the two unrelated repo-wide OpenSpec baseline failures separately rather than treating them as change failures. The repository uses Vitest, so Jest's unsupported `--runInBand` flag is intentionally omitted.

User-owned preview/cutover QA (non-checkbox): deploy the completed application change to `dev.signapse.cloud` with explicit preview origin and `noindex`; verify anonymous and authenticated behavior in real Clerk, external mailbox delivery and monitoring ownership, localized visual/accessibility approval, and live social previews. These checks gate the later apex-cutover change and do not block completion or archive of this landing implementation change.
