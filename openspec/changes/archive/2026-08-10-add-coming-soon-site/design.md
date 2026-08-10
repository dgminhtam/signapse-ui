## Context

The repository currently contains a Next.js 16 application with Clerk, locale-prefixed routes, and an existing public product landing page. That application is deployed at `dev.signapse.cloud`. The apex domain `signapse.cloud` is managed through Cloudflare and needs a temporary public launch surface that remains available without the application runtime, authentication, or backend.

The coming-soon site must launch in Vietnamese and English, count down to the absolute instant `2026-09-01T09:00:00+07:00`, reuse the approved Signapse logo artwork in `public/images`, and stay concise. It must not collect user data or imply trading advice, guaranteed predictions, or product availability before launch.

## Goals / Non-Goals

**Goals:**

- Serve a fast, independently deployable static site for `signapse.cloud`.
- Serve Vietnamese at `/` and equivalent English content at `/en/` with correct document language and reciprocal language navigation.
- Make the launch instant and countdown the primary first-viewport information.
- Introduce Signapse through three evidence-centered product pillars without expanding into a full marketing site.
- Preserve accessibility, responsive behavior, metadata, and useful no-JavaScript behavior.
- Keep `dev.signapse.cloud` and the existing Next.js deployment unchanged.

**Non-Goals:**

- Replacing or modifying the existing localized Next.js landing page.
- Adding authentication, backend calls, analytics, forms, waitlists, early-access requests, email capture, or user-data storage.
- Automatically redirecting users when the countdown reaches zero.
- Presenting fabricated usage metrics, customer logos, testimonials, return claims, trade signals, or investment advice.
- Building a reusable marketing-site framework, CMS, component library, or client-side localization system.

## Decisions

### 1. Use a standalone static site

The site will live in a self-contained `coming-soon/` area and use semantic HTML, shared CSS, and a small vanilla JavaScript countdown. A separate Vercel project will use that directory as its project root with the `Other` framework preset and no build command.

This boundary prevents public apex traffic from inheriting Clerk, proxy routing, backend environment variables, application dependencies, or failures from the dashboard deployment. It also keeps the temporary site easy to remove at launch.

Alternative considered: add a host-aware route to the existing Next.js application. This would reuse application fonts and components, but it would couple the apex domain to authentication middleware and require hostname-specific routing and route-denial behavior. That complexity is not justified for a temporary page.

Alternative considered: create a separate Next.js static-export application. It would still introduce a framework and build pipeline for two documents with no framework-specific runtime needs.

### 2. Render two static locale documents

`coming-soon/index.html` will be the Vietnamese canonical document and `coming-soon/en/index.html` will be the English canonical document. Both documents will share styles, countdown logic, fonts, and visual assets while owning localized visible copy, assistive copy, metadata, and `<html lang>` values. A visible language switch will link directly between `/` and `/en/`.

The root route will not negotiate language or redirect based on browser preferences. Deterministic routes keep caching, canonical URLs, no-JavaScript behavior, and language metadata straightforward. Each page will publish canonical and `hreflang` links for Vietnamese, English, and `x-default`.

Alternative considered: render one HTML document and switch copy client-side. That would make the English page dependent on JavaScript and would weaken document-language and metadata correctness.

### 3. Use the approved dark-background brand direction

The page will use `public/images/signapse_logo_dark.svg` as the source for a site-local SVG asset. The visual system will use a near-black navy background (`#03141D`), dark navy surfaces (`#08232E`), Signapse mint (`#12D6B1`), off-white foreground (`#EAFDF8`), muted text (`#A6C4BF`), and visible boundaries (`#3C6A70`). The selected foreground, muted, accent, and boundary pairs meet their applicable WCAG contrast targets against the background.

The page will use a native system sans-serif stack to avoid an external font request or additional font asset. Countdown numerals will use tabular figures rather than requiring a monospace font.

The desktop hero will use a restrained asymmetric layout with a decorative signal-node illustration derived from the logo's visual language. Mobile will use a single-column flow. Decoration will be hidden from assistive technology and will not resemble a real prediction, return chart, or trading recommendation.

Alternative considered: use a generic finance-dashboard palette and glassmorphism. The approved logo colors provide a more specific identity, and avoiding heavy blur reduces rendering cost and contrast risk.

### 4. Keep product copy concise and evidence-centered

The hero will communicate the localized equivalent of “See the move. Understand why.” A single supporting sentence will explain that Signapse connects prices, events, and evidence to provide market context.

Three short product pillars will cover:

1. Understanding price moves through chart events, reactions, and evidence.
2. Asking grounded AI within watchlist or workspace context.
3. Exploring connected context across events, assets, themes, narratives, and news evidence.

The page will not include request-access controls, email fields, sticky conversion controls, or unverifiable social proof. This is an informational launch surface rather than a lead-capture funnel.

### 5. Treat the launch timestamp as one absolute instant

The countdown target will be the explicit ISO value `2026-09-01T09:00:00+07:00`, equivalent to `2026-09-01T02:00:00Z`. JavaScript will calculate remaining time from the target instant and `Date.now()`, update visible day/hour/minute/second values once per second, and clamp all values at zero.

Before launch, the page will show localized units and the absolute launch date with the `UTC+7` timezone. At and after launch, the countdown will be replaced by a localized “Signapse has launched” state without an automatic redirect. A `<noscript>` fallback will show the localized absolute launch date.

Per-second visual values will not use a live region because repeated announcements would overwhelm screen-reader users. Assistive text will provide the fixed launch date, while only the transition to the launched state will be announced politely.

Alternative considered: synchronize against a remote time service. Device-clock drift is acceptable for this informational countdown and does not justify a backend or external runtime dependency.

### 6. Share assets without sharing runtime dependencies

The static project will contain every asset it serves. The approved logo SVG will be copied from `public/images` and documented as its source; the original asset will remain untouched. Both locale documents will share one stylesheet and one countdown script. This small amount of localized HTML duplication is accepted to preserve correct metadata and no-JavaScript content.

### 7. Deploy and cut over domains independently

The static site will first be verified on its Vercel preview URL. `signapse.cloud` will then be assigned to the new Vercel project, and Cloudflare DNS will be updated to the exact record returned by Vercel with proxying disabled. `www.signapse.cloud` will redirect to the apex domain. The current `dev.signapse.cloud` CNAME and application project will not change.

At product launch, the apex domain will be deliberately reassigned to the production application or another approved launch destination. Countdown completion alone will not make that infrastructure decision.

## Risks / Trade-offs

- [Client device time is incorrect] → Display the absolute `UTC+7` launch time alongside the countdown and accept minor client-clock drift instead of adding a time API.
- [Vietnamese and English documents drift apart] → Keep their DOM structure parallel, share CSS and JavaScript, and include locale-parity checks in verification.
- [Copied logo diverges from its source] → Copy it without modification, retain the source path in project documentation, and compare hashes during implementation verification.
- [DNS or certificate cutover causes downtime] → Verify the Vercel preview first, add and validate the domain before changing traffic, use the exact inspected DNS record, and preserve the prior apex record for rollback.
- [Cloudflare proxying interferes with Vercel] → Configure the Vercel apex record as DNS-only and verify headers and certificate behavior after propagation.
- [The temporary page remains after launch] → Treat apex reassignment as an explicit launch runbook step; the page's post-launch state remains safe if reassignment is delayed.
- [Ambient visuals reduce readability or motion comfort] → Keep decoration low-contrast and non-semantic, animate at most one subtle element, and disable decorative motion under `prefers-reduced-motion`.

## Migration Plan

1. Implement and verify both static locale documents locally, including countdown boundary states and no-JavaScript fallback.
2. Create the independent Vercel project rooted at `coming-soon/` and verify `/`, `/en/`, metadata, assets, and unknown-route behavior on its preview URL.
3. Add `signapse.cloud` and `www.signapse.cloud` to the static project, complete domain ownership and certificate validation, and configure the `www` redirect.
4. Update the Cloudflare apex record to Vercel's inspected value with proxying disabled, then verify HTTPS and both locales without changing `dev.signapse.cloud`.
5. If cutover verification fails, restore the previous apex DNS record and keep the preview deployment available for diagnosis.
6. At product launch, reassign the apex domain through a separate controlled production cutover; do not rely on countdown JavaScript for routing.

## Open Questions

None. The launch instant, locale routes, content scope, absence of lead capture, domain boundary, and launch behavior are resolved.
