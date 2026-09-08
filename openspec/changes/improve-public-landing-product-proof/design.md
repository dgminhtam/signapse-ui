## Context

The public landing is a route-local, server-rendered composition with localized dictionaries, an auth-aware access model, a client-only Hero market-context figure, and existing component and Playwright coverage. The preceding `refocus-public-landing-features` change established the four-feature story and must be applied before this refinement. Its current implementation renders four repeated two-column chapters and always-visible text-only media slots; no approved product capture exists under the public asset tree. The Hero is restored separately to the historical `8ae5336` baseline so this refinement does not alter that section while the product-proof chapters evolve.

This change follows the Evidence-Led Editorial direction in the landing design contract and preserves the accepted progressive-WebGL and staged-cutover ADRs. Product captures are public evidence: their demo source and final localized image require Product Owner approval, while their layout, fallback, loading, accessibility, and tests remain implementation-owned.

## Goals / Non-Goals

**Goals:**

- Restore the Hero to the approved historical baseline from `8ae5336`, including its two proof points, `#how-it-works` secondary CTA, and `lg` layout breakpoint.
- Give each primary feature a composition suited to its product evidence while preserving the approved story order and copy.
- Make outcome copy the semantic chapter heading and keep the feature name as a compact label.
- Replace text-only media placeholders with optional, approval-gated localized captures.
- Provide an accessible, localized way to inspect approved captures at a useful size.
- Keep text-first chapters complete when an approved asset is unavailable for the active locale.
- Record enough non-sensitive capture provenance and approval state to prevent drafts or cross-locale fallbacks from shipping as product proof.

**Non-Goals:**

- Changing ProductStory, AnalysisFlow, trust, CTA, footer, product claims, or approved media outside the Hero restoration.
- Changing Graph View, Market Charts, AI Assistant, Telegram, authentication, permissions, APIs, or delivery behavior.
- Rebuilding the Hero figure, or adding an interactive product demo, carousel, autoplay, hotspot, zoom, or pan behavior.
- Adding pricing, comparisons, testimonials, customer logos, metrics, analytics, deployment, or apex cutover work.

## Decisions

### 1. Use feature-specific chapter composition with one semantic reading order

The Knowledge Graph chapter uses copy followed by a wide capture. Live Charts and Telegram use copy-left/capture-right at or above 1200 CSS pixels. AI Assistant visually places the capture left and copy right at that breakpoint. Every chapter keeps feature label, outcome `h3`, body, supporting detail, caption/annotations, and media trigger in logical copy-before-media DOM order; CSS changes only wide visual placement. Below 1200 pixels and at reflow caused by 200% zoom, every chapter is a single copy-before-media column.

The Knowledge Graph capture may have two or three adjacent annotation items naming the event, related asset, and source context shown in the approved image. These are ordinary text outside the image, not positioned hotspots.

Alternatives considered:

- Keep one alternating two-column component for all four features: rejected because it erases the product-specific evidence hierarchy.
- Build four unrelated components: rejected because shared semantics, fallback, and media behavior would drift.
- Use image hotspots like Graphify: rejected because static screenshots must not resemble interactive product controls and essential meaning cannot depend on image coordinates.

### 2. Treat approved captures as optional build-time content

A route-local typed capture catalog maps feature and locale to an optional approved asset descriptor. A descriptor contains the public asset reference, intrinsic dimensions, localized caption/alternative-text dictionary keys, optional Knowledge Graph annotation keys, a non-sensitive source/demo identifier, and an explicit approved status. Rendering code consumes only approved descriptors. Draft assets or records remain absent from the public catalog and cannot produce a media surface.

When no approved descriptor exists for the active locale, the chapter renders complete text without a media container, reserved media height, caption, or enlargement trigger. An approved image for the other locale is not a fallback. Product Owner approval is an input to the catalog update, not a runtime workflow or an approval UI.

Alternatives considered:

- Infer approval from a file existing under `public/`: rejected because a draft copy could accidentally ship.
- Fetch an approval manifest at runtime: rejected because approval is release content, not mutable user data, and runtime fetching adds failure states without value.
- Always render a placeholder frame: rejected because it repeats copy and visually claims evidence that does not exist.

### 3. Use one narrow client island for static-image enlargement

Each rendered capture includes a localized `View larger image` button. A route-local client component composes the existing Dialog wrapper and receives the approved image descriptor and localized strings from the server composition. It opens the same approved source at a larger responsive size, keeps its aspect ratio, provides a visible localized title and Close button, and does not change the URL.

The dialog uses the wrapper's focus containment and Escape behavior, initially focuses the visible Close control, and returns focus to the exact trigger after closing. Only the image viewport scrolls when necessary; dialog identity and Close remain available on mobile and at 200% zoom. The large optimized image request is mounted only while open, so the larger rendition is not fetched before activation.

Alternatives considered:

- Link directly to the raw asset: rejected because it loses landing reading position and offers weaker focus/navigation behavior.
- Add a lightbox package: rejected because the existing Dialog primitive covers the required behavior.
- Add custom zoom/pan: rejected because it expands interaction and accessibility complexity beyond the agreed need.

### 4. Keep loading and failure subordinate to the chapter copy

The inline capture reserves intrinsic aspect-ratio space to avoid layout shift. The enlargement dialog exposes localized loading and failure feedback while remaining dismissible. A failed inline or enlarged image never removes or contradicts the adjacent chapter explanation. No retry workflow is required for immutable build assets; re-opening may request the asset again through normal browser behavior.

Alternatives considered:

- Hide the complete chapter when media fails: rejected because media is supporting evidence, not the only source of meaning.
- Add a custom retry state machine: rejected because static versioned assets do not justify additional state complexity.

### 5. Reuse the existing test seams

Server-rendered component tests cover semantic heading order, exact localized copy, catalog-driven presence/absence, and no cross-locale fallback. Existing Playwright landing tests cover actual responsive order and geometry, dialog behavior, URL stability, loading/failure fixtures, keyboard focus, zoom, themes, reduced motion, and axe checks. Tests observe headings, roles, labels, image source/locale, focus, and computed visual order rather than helper names or Tailwind class strings.

Capture approval itself and real Telegram delivery remain Product Owner/manual evidence. Fixture images validate rendering behavior only and MUST NOT be reported as approved captures or successful delivery.

## Risks / Trade-offs

- [Risk] The full media set cannot be completed until an authorized demo source is identified → Keep capture tasks and approval state explicit; text-first is a valid runtime fallback but not evidence that media preparation is complete.
- [Risk] Screenshots become stale as product UI changes → Store source/demo context with each approved descriptor and review captures as release content when affected surfaces change.
- [Risk] A dense screenshot is still unreadable on mobile → Provide enlargement, preserve intrinsic ratio, and put essential meaning in adjacent text rather than adding custom zoom controls.
- [Risk] Visual CSS ordering diverges from semantic order → Keep copy before media in DOM and assert both DOM and computed visual order at supported breakpoints.
- [Risk] Draft or wrong-locale media is exposed → Render only explicit approved locale descriptors and test partial locale catalogs.
- [Risk] Dialog client code increases the landing bundle → Use one route-local client island and the existing dialog/image stack; do not add a lightbox dependency.

## Migration Plan

1. Apply or otherwise preserve the effective four-feature landing contract from `refocus-public-landing-features`, and restore the Hero-only `8ae5336` baseline before implementing this refinement.
2. Introduce the optional approved-capture descriptor/catalog and localized media/dialog strings.
3. Refactor ProductStory hierarchy and feature-specific responsive composition; remove text-only media placeholders.
4. Add the route-local capture renderer and enlargement dialog with text-first behavior when no descriptor is approved.
5. Prepare authorized localized captures and provenance records as approval becomes available; integrate only the approved entries.
6. Update component and browser coverage, then run localization, static policy, accessibility, lint, typecheck, build, and OpenSpec validation.

Rollback removes approved catalog entries and returns affected chapters to text-first without changing feature copy, routing, or backend state. The broader layout change can be reverted independently because it has no data migration.

## Open Questions

None for implementation. The exact demo workspace/destination, captured values, crops, captions, and Product Owner approvals are release-content inputs governed by the approved-capture checklist rather than unresolved product requirements.
