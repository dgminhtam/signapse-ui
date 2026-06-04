## Context

The public landing page already exists at the localized root and keeps authenticated dashboard access at `/{lang}/dashboard`. The product copy has since been revised to V2, which makes the landing page more specific to Signapse's strongest product surfaces: Chart Annotation, Market Query, and Knowledge Graph.

## Goals / Non-Goals

**Goals:**
- Update the landing content and section structure to match V2 positioning.
- Keep the current route, auth CTA behavior, request-access fallback, and dashboard route unchanged.
- Replace broad feature-card emphasis with three product pillar sections.
- Rework the hero mock into a product-accurate composition centered on chart annotation, scoped query, watchlist, and knowledge graph.
- Keep all user-facing copy dictionary-backed in English and Vietnamese.

**Non-Goals:**
- Do not add screenshots, image assets, canvas, or third-party visual libraries.
- Do not change backend APIs, route contracts, auth behavior, or dashboard implementation.
- Do not claim trade signals, entry/stop-loss/take-profit, guaranteed prediction, autonomous trading, or buy/sell advice.
- Do not custom-edit shadcn wrappers or global theme tokens.

## Decisions

### Use V2 Product-Led Structure

Replace the current workflow-plus-feature-card structure with a landing sequence:

1. Hero with V2 headline and product mock.
2. Problem section.
3. Product pillars: Chart Annotation, Market Query, Knowledge Graph.
4. Data pipeline section.
5. Workspace personalization section.
6. Trust section.
7. Final CTA.

Rationale: V2 makes the landing memorable by naming the three product surfaces a user can understand quickly.

### Keep CSS Product Mock

Build the hero visual as semantic HTML/CSS mock panels, not screenshots or canvas.

Rationale: the user asked not to wait for screenshots, and the copy warns against stock finance imagery or abstract AI visuals as the primary signal.

### Keep CTA Contract Stable

Leave request access, sign in, and authenticated open-dashboard behavior unchanged.

Rationale: this change is content and visual hierarchy only; route/auth behavior was already implemented by `add-public-landing-page`.

## Risks / Trade-offs

- V2 copy is more specific and can accidentally overclaim runtime behavior -> use the "Current Runtime" and "Do Not Claim" guidance from the source document as copy guardrails.
- Product mock can look like a real screenshot -> keep it clearly illustrative and avoid fake trade signals, entries, stops, targets, or performance claims.
- Dictionary branch can grow unwieldy -> group V2 keys by landing section and keep English/Vietnamese parity enforced by typecheck.

## Migration Plan

1. Add V2 dictionary keys and remove landing V1 keys that are no longer used.
2. Rework landing page sections using existing Button/Badge wrappers and scoped semantic Tailwind classes.
3. Run OpenSpec validation, typecheck/build, static copy searches, and route checks.

Rollback: restore the previous `landing` dictionary branch and previous landing section composition.

