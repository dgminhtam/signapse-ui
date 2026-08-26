## Context

The public landing is a localized Server Component with an auth-aware access model, dictionary-owned copy, server-generated metadata, and a text-first media policy. Its current Hero communicates event-aware market context but does not make the AI-assisted analysis value legible, while the right-hand relationship treatment is unlabeled and visually reads as a placeholder. At small widths the header keeps brand, locale controls, access actions, and the disclosure trigger in one row; clipping at the page root can hide the resulting overflow instead of resolving it.

The change must preserve the existing public-route and authentication boundary, locked CTA destinations, canonical product-story sequence, light/dark parity, Geist typography, semantic tokens, and claim boundaries. The primary conversation surface supports persisted workspace-scoped text turns, but it does not expose structured evidence, reasoning chains, source sheets, streaming tokens, trading signals, or execution. Price, event, reaction, source, chart, and graph capabilities therefore remain Signapse product surfaces rather than claims about a single Assistant response.

## Goals / Non-Goals

**Goals:**

- Make AI-assisted market analysis explicit and immediately relevant to active and research-oriented traders.
- Keep the Hero promise grounded in inspectable market context and user-owned trading decisions.
- Replace the unlabeled relationship decoration with a localized conceptual figure that communicates the product model without impersonating product UI.
- Add restrained, meaningful one-shot motion without increasing the client boundary or adding a dependency.
- Preserve brand, primary access, locale switching, and secondary access on small viewports without clipping.
- Keep localized Hero copy, metadata, social-card text, documentation, specifications, and behavior tests aligned.

**Non-Goals:**

- Changing backend APIs, permissions, conversation response contracts, or authentication behavior.
- Adding prediction, trading advice, signals, P&L, forecast-performance, or automated-execution capabilities or claims.
- Adding a product screenshot, synthetic dashboard, interactive demo, autoplay media, or fake market data.
- Redesigning the complete landing page, global theme tokens, fonts, or shared UI primitive chrome.
- Adding an animation framework, a page-wide Client Component, analytics, A/B testing, or an access form.

## Decisions

### 1. Use AI-assisted market analysis as the public Hero frame

The Hero will lead with AI-assisted market analysis, while the primary promise remains turning market data into trading context that a user can verify. Copy will distinguish between the Assistant's supported natural-language text conversation and the broader Signapse surfaces that expose charts, events, reactions, sources, and relationships.

This hybrid frame was chosen over making Signapse an AI-first context engine because the latter would imply that the Assistant directly produces or exposes every evidence surface. Keeping the existing event-aware wording as the lead was also rejected because it does not satisfy the requested AI-for-trading differentiation.

### 2. Keep capability claims owned by their real product surfaces

Hero proof will make three scoped claims: users can ask market questions in natural language, read chart movement with event/calendar context when available, and inspect related events, reactions, sources, and relationships. The product as a whole connects those surfaces; the Hero will not state that an Assistant answer contains structured evidence or that AI automatically enriches every input.

The trust note will keep responsibility with the user and retain the existing analysis-not-prediction boundary. Optional data qualifications remain near proof/detail copy instead of weakening the headline.

### 3. Render a semantic conceptual figure, not synthetic product UI

The current unlabeled relationship treatment will be replaced by a route-local conceptual figure. Localized input labels for price, events, reactions, and related sources feed a Signapse context layer and resolve into the supported actions ask, explore, and verify. The figure will use text, simple lines, nodes, and restrained semantic-token emphasis; it will not include values, tickers, confidence, charts, buttons, form controls, or other chrome that could be mistaken for a live product capture.

Because the labels add meaning, the figure will expose a concise accessible caption or equivalent text summary. Decorative grid, connector, and node geometry will be hidden from assistive technology. A purely decorative replacement was rejected because it would repeat the current failure to communicate product value. A synthetic Assistant or dashboard preview was rejected because no locale-approved capture exists and the runtime does not support every implied evidence interaction.

### 4. Keep the landing server-rendered and isolate motion in route-local CSS

Hero entrance and conceptual-flow choreography will use route-local CSS keyframes based only on opacity and transform. The base DOM contains all final content, and animation is enabled only for users without a reduced-motion preference. The sequence runs once; it does not replay on scroll, theme changes, or unrelated interaction.

This avoids a new Client Component, hydration state, observer logic, GSAP dependency, and bundle cost. Stateful or scroll-triggered motion was rejected because it adds implementation and testing complexity without improving the small amount of requested technology character.

### 5. Recompose the small-viewport header around three visible priorities

At small widths the primary row will contain brand, the auth-aware primary CTA, and the disclosure trigger. Locale links and the anonymous secondary sign-in action remain available inside the disclosure alongside section navigation. At wider breakpoints the existing visible locale and navigation treatment remains.

Responsive visibility will remove hidden duplicate controls from the accessibility tree at each breakpoint. The page-level overflow clip remains a containment safeguard, not the mechanism used to make the header pass responsive checks.

This content-priority approach was chosen over shrinking typography or touch targets, hiding the primary CTA, or allowing horizontal scrolling.

### 6. Preserve the existing access model and destinations

The Hero and header will continue to consume the shared auth-aware access model. Anonymous primary actions retain the locked request-access mail destination, authenticated primary actions retain the localized dashboard destination, and the Hero secondary action retains the analysis-flow anchor. Only localized labels and responsive placement change.

### 7. Update metadata through the existing server policy

Vietnamese and English dictionary metadata will adopt the agreed AI-assisted titles and descriptions. Canonical URLs, language alternates, indexability, fail-closed origin handling, and brand-only social-card layout remain unchanged. Social artwork continues to use only the localized metadata title, so the positioning changes without introducing a second visual claim system.

### 8. Test through the public route as the primary seam

Behavior will be verified primarily by opening the localized public landing routes and observing copy, semantics, CTA behavior, header reflow, themes, zoom, reduced motion, and metadata. Existing policy and composition tests will be updated only where they own locked destinations, metadata literals, or semantic structure. Tests will not bind to utility classes, keyframe names, animation delays, or individual decorative nodes.

## Risks / Trade-offs

- [AI-forward copy is interpreted as prediction or a trading signal] → Keep the product/Assistant claim split explicit, retain the trust note before conversion, and statically search for forbidden prediction, advice, signal, performance, and execution language.
- [The conceptual figure is mistaken for live product UI] → Use non-interactive nouns and relationship geometry only; exclude values, controls, product chrome, and fake market states; describe it as a conceptual figure in semantics and documentation.
- [One-shot entrance motion temporarily harms readability or browser-test stability] → Keep final content in the initial DOM, animate only opacity/transform under no-preference, provide a static reduced-motion state, and run semantic assertions independently of animation timing.
- [Duplicated desktop/mobile locale render paths create redundant accessibility content] → Ensure only the breakpoint-appropriate instance participates in layout and the accessibility tree, and verify keyboard order at small and large widths.
- [Long localized labels recreate mobile overflow] → Keep proof and figure labels concise, test Vietnamese as the longer-string case, and verify at 375px and 200% zoom rather than relying only on scroll-width checks.
- [Hero positioning drifts from the rest of the landing story] → Update the canonical landing brief and specification together while retaining the existing supporting-capability treatment in the Workspace and Assistant section.

## Migration Plan

1. Update canonical landing documentation and localized content contracts.
2. Implement the Hero composition, conceptual figure, route-local motion, and small-viewport header reflow without changing the access model.
3. Update localized metadata and brand-only social-card text.
4. Update behavior-focused component, policy, metadata, and browser coverage.
5. Run targeted static checks, OpenSpec validation, lint, typecheck, production build, and landing browser tests.

The change has no data or API migration and can be rolled back by reverting the localized copy, Hero/header composition, route-local styles, metadata literals, and their tests as one unit.

## Open Questions

None. Product positioning, audience, scope, claim boundaries, visual treatment, motion approach, responsive header behavior, metadata alignment, and the primary test seam were confirmed before proposal creation.
