## Context

The first Hero proof currently describes a generic text conversation with the AI Assistant. The product owner clarified that the Assistant receives market context from Signapse's Knowledge Graph, which is built from multi-source market data through aggregation, evaluation, and analysis. The owner also finalized the Hero as two proof points: specialized AI and chart context. The former relationship-inspection proof duplicates the deeper product story and must be removed without changing the conceptual figure or product chapters. The Hero's primary message now needs to lead with the approved Market Intelligence Platform category and the Knowledge-Graph product thesis rather than the older AI-assisted-analysis frame.

## Goals / Non-Goals

**Goals:**

- Replace only the first localized Hero proof title and body with the approved specialized-AI and Knowledge-Graph message.
- Replace the second localized Hero proof title and body with the approved concise chart-context message.
- Render exactly two Hero proof points and remove the former relationship-inspection proof from both locale dictionaries.
- Define the public term and scope for the Market Knowledge Graph so the landing, specification, and glossary describe the same capability.
- Preserve the analysis-support, source-inspection, and user-decision boundaries of the existing landing.
- Lead the Hero and localized browser/social title with the approved `Market Intelligence Platform` category and the corresponding Knowledge-Graph message.

**Non-Goals:**

- Changing AI inference, Knowledge Graph construction, APIs, page structure, or animation.
- Claiming model training or fine-tuning, complete data coverage, prediction accuracy, trading signals, or automated trading.
- Adding a visible technical diagram, evidence sheet, or source citation to Assistant responses.

## Decisions

### 1. Describe Knowledge-Graph context, not model training

The Hero will state that the specialized Assistant operates on a Knowledge Graph built from multi-source market data that is aggregated, evaluated, and analyzed. It will not state that the model was trained or fine-tuned on that data, because the approved product fact is response-time context, not a claim about model weights.

### 2. Keep the change inside the existing localized proof-point seam

The copy will replace the existing `proofOneTitle` and `proofOneBody` dictionary values in Vietnamese and English. The existing server-rendered `HeroSection` and `ProofPoint` composition will render the result without a new component, prop, client boundary, or layout adjustment.

### 3. Record a narrow canonical term and claim boundary

The glossary and landing claim matrix will define the Market Knowledge Graph as the structured market context used by the Assistant. The term will explicitly exclude a prediction engine, trading-signal source, outcome guarantee, and a claim that every Assistant response exposes its complete supporting graph or evidence.

### 4. Verify user-visible localized output

Existing public-landing component coverage will assert the first Hero proof title and body in both locales. Browser coverage remains behavior-focused and will continue to verify that the Hero renders accessibly without binding to layout internals.

### 5. Keep the chart-context proof concise while qualifying detailed data claims elsewhere

The second Hero proof will use the approved concise copy: it describes reading price action alongside reactions, events, and economic-calendar context without repeating a data-availability clause. The chart and product-story descriptions remain the authoritative place for availability qualifiers, so the Hero avoids duplicating caveat text while the page still does not present optional data as guaranteed.

### 6. Keep the Hero proof surface to two points

The existing route-local proof list will render only the specialized-AI and chart-context entries. Their tablet layout will change from three to two columns, preventing an empty third slot. The relationship-inspection proof fields will be removed from both dictionaries instead of being left as unused copy. This does not remove relationship inspection from the product-story chapters or change the separate conceptual figure's controls and semantics.

### 7. Lead with Market Intelligence and ground it in the Knowledge Graph

Both locales will use the exact `MARKET INTELLIGENCE PLATFORM` eyebrow so the public category is consistent. The localized H1 and supporting copy will explain that Signapse turns market data into a Knowledge Graph and gives the AI Assistant inspectable market relationships as context for questions and market moves. Browser, Open Graph, Twitter, and social-card titles will use the exact `Signapse | Market Intelligence Platform` value in both locales. The existing localized metadata descriptions remain unchanged because the approved scope changes the category and title, not the SEO description.

## Risks / Trade-offs

- [“Evaluated” is mistaken for guaranteed trading performance] → Scope it to Market Knowledge Graph data preparation and retain the landing trust boundary that users verify sources and make the decision.
- [Knowledge Graph is mistaken for model training] → Use “operates on”/“powered by” wording rather than “trained on” or “fine-tuned on.”
- [The technical distinction makes the Hero too dense] → Keep the copy to a title plus one concise sentence and leave the detailed canonical definition in documentation.
- [The compact chart proof is mistaken for guaranteed data coverage] → Keep availability qualifiers in detailed chart and product-story copy, and retain the landing's analysis-not-prediction trust boundary.
- [Removing the relationship proof hides a product capability] → Keep relationship inspection in the dedicated Connected Market Graph and Reaction & Evidence chapters, where it has space for accurate scope and qualifiers.
- [The category feels abstract in a Vietnamese Hero] → Keep the English category as the approved product label, then immediately ground it in a localized Knowledge-Graph H1 and supporting sentence.
