## Context

The localized public landing is a route-local server-rendered composition inside the same Next.js application and theme provider as the protected dashboard. It currently consumes the global Nova semantic tokens, so its colors switch with the application light/dark theme and visually resemble the neutral dashboard. The landing already has an accepted editorial section order, approved Graph View and Live Charts captures, an accessible interactive Hero market-context figure with a static fallback, and component plus Playwright coverage.

Signapse also has an approved navy-and-mint palette from the earlier public coming-soon surface: `#03141D`, `#08232E`, `#12D6B1`, `#EAFDF8`, `#A6C4BF`, and `#3C6A70`. This change adopts those colors as landing anchors instead of copying Graphify values. The Graphify reference informs mood and contrast only.

The landing design contract currently requires shared semantic tokens and light/dark parity, while the accepted Hero ADR says the prior demo's exact fixed-dark palette was not adopted. This design deliberately changes the landing color policy while preserving the dashboard theme model and every non-color Hero contract.

## Goals / Non-Goals

**Goals:**

- Give the full public landing a distinct, fixed Signapse marketing identity.
- Keep the landing visually invariant under global light and dark theme changes without reading, mutating, or resetting the visitor's stored theme preference.
- Use dark navy surfaces for the header, Hero, final access CTA, and footer, with off-white content sections and mint emphasis.
- Give the WebGL renderer and server-rendered fallback one route-scoped palette source.
- Preserve approved product captures without filters, overlays, tinting, opacity changes, or cross-locale substitution.
- Retain the accepted copy, topology, CTA destinations, typography, spacing, responsive behavior, accessibility, and Hero interaction/motion contracts.
- Keep global tokens, dashboard appearance, and shared shadcn wrapper chrome unchanged.

**Non-Goals:**

- Rebranding the protected application or changing its light/dark behavior.
- Cloning Graphify colors, assets, layout, typography, or decorative system.
- Adding mathematical glyphs, noise textures, connector fields, new motion, or a new Hero composition.
- Recoloring or replacing approved product captures.
- Changing localization copy, product claims, routing, authentication, metadata, deployment, or apex cutover policy.
- Adding a dependency or a new visual-test harness.

## Decisions

### 1. Scope a semantic marketing palette to the landing composition

The landing root will own semantic variables for its dark background, dark surface, light background, light foreground, dark foreground, muted text, boundary, focus, and mint accent. Landing sections and route-local components will consume these semantics. Shared `:root` and `.dark` values, the Nova preset, and shared primitive chrome remain unchanged.

Where existing semantic utility classes are useful, the landing root may map their underlying variables to landing values for descendants. Named landing surfaces still express their intended role so that a dark Hero and a light content chapter do not depend on the global theme class.

Alternatives considered:

- Change global primary/background/accent tokens: rejected because it would recolor the dashboard and shared wrappers.
- Scatter raw palette utilities through each section: rejected because it would obscure surface roles and make contrast maintenance brittle.
- Build a second theme provider: rejected because the landing needs a fixed composition, not another persisted user theme.

### 2. Render one fixed dark-light composition while preserving theme preference

Header, Hero, final access CTA, and footer use the navy surface family. Product Story, Analysis Flow, and Trust Boundary use the off-white family. The same mapping renders when the document theme is light or dark. Landing rendering does not write theme storage or alter the global theme class; navigation into the protected application therefore continues with the visitor's saved preference.

The landing logo is selected explicitly for the surface contrast rather than through a global `.dark` selector. A global theme change must not remount the page, reset the market-context figure, or change the landing palette.

Alternatives considered:

- Provide separate branded light and dark palettes: rejected because the approved marketing direction calls for one stable composition.
- Make every landing section dark: rejected because long-form product content and approved captures need a quieter light reading surface.
- Force the stored application preference to dark: rejected because a public marketing route must not modify a user's dashboard setting.

### 3. Treat the approved Signapse palette as the authority

The existing colors are palette anchors: near-black navy `#03141D`, navy surface `#08232E`, mint `#12D6B1`, off-white `#EAFDF8`, muted `#A6C4BF`, and boundary `#3C6A70`. Implementers may derive nearby shades within the same hue families when needed for readable light-surface ink, hover states, focus indicators, subtle grids, and WCAG contrast. Mint remains the single decorative brand accent; state semantics inside product captures are not reinterpreted.

Alternatives considered:

- Sample Graphify and adopt its exact values: rejected because the reference is not the Signapse brand source.
- Retain the current blue brand token as the landing accent: rejected because it would weaken the approved navy/mint direction; existing product UI may still show its native blue within captures.
- Add a copper or rust accent from the reference: rejected to keep the landing palette focused and avoid a decorative color that could resemble a market-loss state.

### 4. Resolve Hero renderer colors from the landing root

The interactive market-context figure will read its computed CSS variables from the nearest landing palette owner. Its server-rendered fallback will consume the same variables through inherited CSS. Palette observation may react to changes in landing variables, but document light/dark class changes alone will not produce a different resolved palette.

Only color plumbing and material colors change. Geometry, graph/price modes, hover and drag behavior, keyboard controls, renderer lifecycle, context-loss fallback, reduced-motion behavior, bounded rendering, and accessibility semantics remain intact.

Alternatives considered:

- Continue probing `document.body`: rejected because body-scoped global variables do not represent the fixed route palette.
- Duplicate color literals in renderer code and fallback CSS: rejected because the two paths could drift.
- Add GPU pixel snapshots: rejected because the accepted Hero verification policy excludes environment-sensitive pixel gates.

### 5. Preserve product evidence pixels

Approved Graph View and Live Charts captures retain their sources, intrinsic dimensions, localized alternative text/captions, approval status, and native pixels. Their outer frame, caption, loading surface, and localized failure treatment may use landing tokens. The image element receives no filter, overlay, blend mode, tint, or decorative opacity.

Alternatives considered:

- Tint captures to match the landing: rejected because a product capture is evidence of an actual product state.
- Replace captures with stylized illustrations: rejected by the existing media approval contract.

### 6. Update the durable color-policy record without rewriting history

The landing design contract will explicitly describe the fixed route-scoped composition and its exception from application theme parity. A concise ADR will record why the public landing ignores theme changes while preserving theme preference, and will clarify that the color-policy portion of the earlier Hero decision has evolved while its interaction and performance consequences remain accepted. Completed OpenSpec changes remain unchanged as historical records.

Alternatives considered:

- Edit completed change artifacts: rejected because they document the decisions and implementation state at the time they were completed.
- Leave the current design prohibition in place: rejected because future implementation and review would receive contradictory instructions.

## Risks / Trade-offs

- [Risk] Landing-scoped overrides accidentally leak into the protected application → Keep the palette owner inside the public landing composition and add a dashboard preference/navigation regression check.
- [Risk] A fixed landing surprises maintainers accustomed to app-wide theme parity → Document the exception in the landing contract and ADR, and test both global theme settings.
- [Risk] Dark/light surface boundaries lose contrast after derived shades are introduced → Validate representative text, controls, focus indicators, borders, and muted copy against WCAG 2.2 AA.
- [Risk] WebGL and fallback colors drift → Resolve both from the same landing variables and cover fallback plus renderer palette resolution without GPU snapshots.
- [Risk] Product evidence is visually altered by inherited styles → Assert original sources and the absence of image filters, overlays, blend modes, and opacity treatments.
- [Risk] Existing section or interaction behavior changes during styling → Make route-local surgical edits and keep the existing component and Playwright seams as regression gates.

## Migration Plan

1. Update the durable landing design contract and add the focused fixed-theme ADR.
2. Introduce the route-scoped semantic palette and explicit surface roles without changing global tokens.
3. Apply the approved dark/light surface mapping, logo variants, grid, border, focus, CTA, and capture-frame treatments.
4. Move the Hero renderer's palette resolution to the landing root and align the static fallback.
5. Extend existing component and Playwright coverage for theme invariance, preference preservation, surface contrast, renderer/fallback palette resolution, and unmodified product captures.
6. Run targeted tests, accessibility/responsive checks, lint, typecheck, build, and OpenSpec validation, followed by user-owned visual review of both locales.

Rollback removes the landing-scoped palette and restores inherited global semantic colors. It requires no data or API migration and does not alter the visitor's stored theme preference.

## Open Questions

None for implementation.
