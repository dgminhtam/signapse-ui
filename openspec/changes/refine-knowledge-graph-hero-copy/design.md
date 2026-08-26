## Context

The first Hero proof currently describes a generic text conversation with the AI Assistant. The product owner clarified that the Assistant receives market context from Signapse's Knowledge Graph, which is built from multi-source market data through aggregation, evaluation, and analysis. That public distinction is not recorded in the current landing contract or domain glossary.

## Goals / Non-Goals

**Goals:**

- Replace only the first localized Hero proof title and body with the approved specialized-AI and Knowledge-Graph message.
- Define the public term and scope for the Market Knowledge Graph so the landing, specification, and glossary describe the same capability.
- Preserve the analysis-support, source-inspection, and user-decision boundaries of the existing landing.

**Non-Goals:**

- Changing AI inference, Knowledge Graph construction, APIs, page structure, animation, or the remaining Hero proof points.
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

## Risks / Trade-offs

- [“Evaluated” is mistaken for guaranteed trading performance] → Scope it to Market Knowledge Graph data preparation and retain the landing trust boundary that users verify sources and make the decision.
- [Knowledge Graph is mistaken for model training] → Use “operates on”/“powered by” wording rather than “trained on” or “fine-tuned on.”
- [The technical distinction makes the Hero too dense] → Keep the copy to a title plus one concise sentence and leave the detailed canonical definition in documentation.
