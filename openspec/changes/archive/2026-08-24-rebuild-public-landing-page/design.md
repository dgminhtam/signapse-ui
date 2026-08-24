## Context

See `proposal.md` for motivation. The application already routes locale roots outside the protected `(main)` layout, but the Clerk proxy protects every production route except localized sign-in, so an anonymous visitor cannot reach the page in real Clerk mode. The current route is a large Server Component with stale dictionary branches, synthetic chart/query/graph UI, no real mobile navigation or footer, and only title/description metadata.

Route locale is already canonical elsewhere in the application, while the old `product-localization` spec still describes a cookie source of truth. The existing `nextjs-locale-routing` capability already owns root negotiation, route-based language switching, cookie removal, and locale roots as the public entry. This change implements that boundary and removes duplicate stale localization requirements rather than introducing another locale system.

No locale-specific product captures have been approved. Existing brand assets, Geist, semantic tokens, the theme provider, shadcn/Base UI wrappers, locale routing helpers, Clerk, Vitest, Playwright, and axe are available. ADR 0005 requires the rebuilt application landing to be tested publicly at `dev.signapse.cloud` with `noindex`; apex cutover and coming-soon retirement are a separate change.

## Goals / Non-Goals

**Goals:**

- Keep the landing server-first and route-local while making the access, metadata, locale, and content policies independently testable.
- Make public-path matching exact and default-protected so the locale-root exception cannot broaden application or API access.
- Render one canonical eight-part story from dictionary-backed VI/EN copy without synthetic product proof.
- Centralize auth-aware CTA policy so header, Hero, final CTA, and footer cannot drift.
- Make metadata deterministic across preview, unknown, and future indexable deployment states.
- Exercise the highest stable seams: rendered browser behavior, the Next proxy boundary, and small pure policies only where external environments prevent deterministic browser coverage.

**Non-Goals:**

- Do not perform DNS, Vercel alias, `www`, apex indexability, coming-soon retirement, or rollback operations.
- Do not add a shared landing framework, a component file per section, a new UI or motion dependency, or a broad auth architecture migration.
- Do not create product screenshots, a request form, backend storage, analytics, CRM behavior, or new product capabilities.
- Do not repair unrelated API-mapping or annotation-popup documentation drift.

## Decisions

### 1. Keep Clerk middleware and introduce an exact public-path policy

The proxy will continue to run for locale negotiation and Clerk request context. A small pathname policy will classify only the supported locale roots and localized sign-in subtree as public; everything else reaches the existing protection path. Matching will use supported locale values and segment boundaries so a path such as `/vi/sign-in-evil` is not treated as sign-in.

This avoids expanding the deprecated route-matcher helper and preserves default-deny behavior. A broader resource-authorization migration is rejected because it changes security architecture beyond the landing requirement. Bypassing Clerk middleware for the landing is rejected because server `auth()` still needs Clerk context for first-render CTA selection.

### 2. Use one route-local deep module with a single browser-state island

The localized route remains the Server Component orchestration boundary for locale validation, dictionary loading, metadata, `auth()`, and page composition. One route-local Server Component owns the named sections in canonical reading order. A pure access model maps authentication state and locale to the shared CTA contract. A small locale-switch Client Component owns only query/hash preservation; it is placed behind a Suspense boundary when it reads client routing state.

The current monolithic page is rejected because it mixes orchestration, policy, content, and visual detail. One file per section is rejected because the eight tightly coupled story blocks would become shallow modules. A shared landing design system is rejected because there is one route-specific consumer.

### 3. Render auth state on the server and centralize CTA destinations

The route will await Clerk `auth()` and pass an anonymous/authenticated access model into the page composition. Anonymous state uses the locked request-access mail destination as the primary conversion path and localized sign-in in header/footer. Authenticated state replaces app-entry actions with the localized dashboard destination. Both states retain the Hero `#how-it-works` link, and the footer always exposes the plain request-access address.

Server auth makes the landing dynamic, but it avoids a client-side CTA upgrade, layout shift, and transient incorrect destination. A static anonymous page with client enhancement is rejected because first-render CTA correctness is part of the contract.

### 4. Replace the current composition and dictionary branch atomically

The page will render Public Header, Hero Product Proof, Analysis Flow, Product Story, Workspace and Assistant support, Trust Boundary, Final Access CTA, and Public Footer in that order. The product story contains Event-aware Charts, Reaction & Evidence, and Connected Market Graph as the three primary chapters; the AI Assistant remains supporting context.

Both dictionaries will replace the old landing schema in the same change. Locked copy, qualifiers, CTA microcopy, navigation, accessible labels, metadata, and social-card titles stay in parity. Old keys and helpers are removed when no caller remains rather than retained as compatibility data.

Incrementally mixing the old and new composition is rejected because it would retain contradictory claims and make static claim removal unverifiable.

### 5. Treat missing product media as an intentional text-first state

Hero and product chapters will not allocate screenshot frames while no approved locale-specific capture exists. The existing synthetic workspace, fake chart shapes, metrics, evidence counts, Market Query preview, and Theme node are removed without replacement. Layout rhythm comes from typography, spacing, and one decorative page-level relationship treatment shared by Hero and Analysis Flow; the treatment is nonsemantic.

A runtime-faithful illustration is rejected because the canonical media policy forbids generated or synthetic UI presented as proof. Cross-locale image fallback is rejected because visible product copy would contradict the active route locale.

### 6. Make locale links progressive and route-authoritative

Header and footer expose native links for Vietnamese and English with localized group labels, language attributes, visible current state, and `aria-current`. The switch replaces only the locale segment, preserves the query string and the approved anchor allowlist, drops any unsupported hash, and does not mutate `signapse_locale`.

Reusing the authenticated app-shell dropdown unchanged is rejected because its control semantics do not match the public link contract and its current navigation loses the fragment. Server-only switching is rejected because URL fragments are not available in the request sent to the server.

### 7. Use an explicit fail-closed metadata policy

A server-only metadata policy accepts configured public origin and indexability. It normalizes only valid absolute origins and produces localized title, description, robots, canonical, `vi`, `en`, and `x-default` values.

- Valid non-indexable preview origin: render self-canonical dev URLs and language alternates, plus `noindex`.
- Missing or invalid non-indexable origin: render `noindex` and omit canonical/alternates.
- Indexable mode: fail before serving the landing unless the origin is exactly `https://signapse.cloud`.
- Hostname inference: never used to establish public origin or indexability.

This policy is a small pure seam used by `generateMetadata`, allowing deterministic coverage without booting a server for every invalid configuration. A dev-origin fallback is rejected because it could publish incorrect canonicals. Always omitting canonical on preview is rejected because the agreed preview behavior needs verifiable environment-correct metadata.

### 8. Generate two deterministic brand-only social cards

The locale route will use the framework metadata image convention to produce a 1200×630 brand card for each locale from approved Signapse brand assets and the corresponding metadata title. The cards share layout and visual treatment and contain no body copy or product UI.

Generating the cards from locked dictionary input avoids committing two independently editable claims and keeps social output coupled to localized metadata. Product screenshots and AI-generated marketing artwork are rejected because the first release is explicitly text-first.

### 9. Preserve Nova visual ownership and native accessibility semantics

Landing styles use existing semantic tokens, Geist, theme parity, Lucide icons, and default shadcn/Base UI chrome. Feature layout classes may control measure, grid, spacing, and responsive order; default wrapper chrome and global tokens are not modified. Header and main are semantic siblings, with a skip link targeting the main content. Mobile navigation uses native disclosure, section order remains copy-before-media in the DOM, and decorative visuals are hidden from assistive technology.

If adjacent visible brand text would duplicate the shared logo accessible name, the implementation will use a narrow supported decorative-logo composition and verify other logo consumers if the shared API changes. A broad logo redesign is rejected.

### 10. Test external behavior at the highest available seams

Playwright will verify the rendered landing, locale navigation, responsive behavior, keyboard flow, theme parity, and axe results using the existing P0 server. The current P0 auth-disabled fixture represents the authenticated CTA state and cannot prove Clerk authorization. Anonymous CTA policy is therefore covered deterministically through the pure access model, while public/protected behavior is exercised at the Next proxy boundary. Real-Clerk anonymous/authenticated verification remains a cutover-only owner check under ADR 0005.

Metadata policy receives direct deterministic tests for invalid and indexable configurations, while rendered HTML/browser checks verify the selected preview output. Static searches enforce removal of stale claims and mock sources.

## Risks / Trade-offs

- **[Risk] A public preview exposes a real request-access mail destination before apex release** → Keep the locked destination identical across environments, retain `noindex`, explain mail-client behavior, and require mailbox proof only before cutover.
- **[Risk] Server auth makes the locale roots dynamic** → Accept dynamic rendering for correct first-response CTA state and keep all content/data work local with no backend landing fetch.
- **[Risk] Public-route matching accidentally broadens access** → Match exact locale roots and sign-in segment boundaries, keep protection as the default branch, and cover representative application/API paths at the proxy seam.
- **[Risk] Invalid deployment configuration produces duplicate or indexable URLs** → Default to `noindex`, omit unverifiable canonical values, reject non-apex indexable origin, and prohibit hostname inference.
- **[Risk] The locale-switch island causes a Suspense or hydration regression** → Keep it leaf-level, render stable native-link fallback content, and test query/hash behavior in the browser.
- **[Risk] Text-first chapters feel visually sparse** → Use the approved evidence-led editorial rhythm, controlled measure, spacing, dividers, and one nonsemantic relationship treatment without inventing product proof.
- **[Risk] Main specs still contain overlapping stale requirements during implementation** → Delta specs explicitly remove V2/cookie requirements and modify the stable landing/localization contracts before code is archived.

## Migration Plan

1. Introduce the fail-closed metadata configuration and tests with preview/non-indexable defaults.
2. Replace public-path classification while preserving locale negotiation and default route protection.
3. Replace the landing dictionary schema, access model, page composition, locale switch, and localized social artwork atomically.
4. Remove old landing helpers, components, keys, synthetic mock sources, and forbidden claims.
5. Run targeted strict OpenSpec validation, lint, typecheck, unit tests, production build, browser/accessibility coverage, and static claim checks.
6. Deploy the change to `dev.signapse.cloud` with its explicit origin and `noindex`; keep the coming-soon apex unchanged.

Rollback is a normal application rollback to the previous deployment. The coming-soon public apex is unaffected by this change. Promotion to the apex, enabling indexability, `www` redirect, coming-soon source/spec retirement, and the seven-day rollback window are owned by the follow-up cutover change.
