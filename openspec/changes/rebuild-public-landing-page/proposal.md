## Why

The current application landing is not a trustworthy public product surface: real Clerk mode protects the locale roots, the page uses synthetic product UI and stale Market Query claims, and its localization and metadata contracts conflict with the current route-locale runtime. Signapse needs a verified, localized landing on the application host before a separate owner-run apex cutover can replace the coming-soon site.

## What Changes

- **BREAKING** Replace the old Chart Annotation / Market Query / Knowledge Graph pillar contract, synthetic workspace preview, internal pipeline story, and illustrative media fallback with the canonical eight-part, evidence-led product story.
- Make `/vi` and `/en` public without rendering the dashboard shell while keeping dashboard, application, and API routes protected.
- Render auth-aware access paths: anonymous users receive the locked request-access and sign-in destinations; authenticated users receive dashboard destinations while retaining the Hero journey link.
- Replace landing copy in both dictionaries with the locked Vietnamese and English content, qualifiers, accessible labels, metadata, and claim boundaries.
- Make the URL locale segment authoritative for landing navigation and locale switching; preserve query and supported hashes without reading or writing a locale cookie.
- Ship a text-first page with no synthetic product mock or empty media placeholder, plus two localized brand-only Open Graph cards.
- Add explicit server-side public-origin and indexability policy: the `dev.signapse.cloud` preview remains public and `noindex`; missing or invalid non-indexable origin omits canonical/alternates; indexable mode fails unless the origin is the approved apex.
- Add responsive, theme-parity, keyboard, screen-reader, reduced-motion, metadata, route-boundary, and claim-removal verification.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `public-landing-page`: Replace the stale public landing narrative, composition, CTA, media, metadata, accessibility, and public-route requirements with the canonical localized application landing contract.
- `product-localization`: Replace the landing-relevant locale-cookie behavior with route-locale links and require complete VI/EN parity for visible, assistive, metadata, and social-card copy.

## Impact

- Affects the localized application landing route, route-local landing components and access policy, locale dictionaries and routing helpers, Clerk proxy public-path matching, metadata configuration, approved brand artwork composition, and targeted unit/browser tests.
- Does not add or change backend APIs, persistence schemas, analytics, request-access forms, CRM integration, or product dependencies.
- Does not change the active coming-soon deployment or contract; apex cutover, `www` redirect, coming-soon retirement, and rollback operations remain a separate OpenSpec change governed by ADR 0005.
