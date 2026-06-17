## 1. Localized Content

- [x] 1.1 Update English and Vietnamese landing hero, problem, trust, and final CTA copy to V2.
- [x] 1.2 Add English and Vietnamese dictionary branches for product pillars, data pipeline, workspace personalization, and hero visual labels.
- [x] 1.3 Remove or leave unused V1 landing dictionary keys only according to what the implementation still references.

## 2. Landing Structure

- [x] 2.1 Rework the hero visual into a CSS product mock with watchlist rail, XAU/USD chart annotation, query answer, and mini knowledge graph.
- [x] 2.2 Replace the current broad feature-card section with three primary product pillar sections: Chart Annotation, Market Query, and Knowledge Graph.
- [x] 2.3 Add the V2 data pipeline section showing raw signals to structured knowledge to personalized workspace surfaces.
- [x] 2.4 Add the workspace personalization section explaining shared knowledge and personal workspace/watchlist experience.
- [x] 2.5 Keep existing route, dashboard, sign-in, request-access, and authenticated CTA behavior unchanged.

## 3. Guardrails

- [x] 3.1 Ensure landing visible and assistive copy comes from `dictionary.landing` except canonical product identifiers, route paths, symbols, and numeric illustrative values.
- [x] 3.2 Ensure landing copy and mock UI do not claim trade signals, entry/stop-loss/take-profit, guaranteed prediction, autonomous trading, or buy/sell advice.
- [x] 3.3 Keep styling scoped to the landing page and do not edit shadcn wrappers or global theme tokens.

## 4. Verification

- [x] 4.1 Run `openspec validate "revise-public-landing-content-v2"`.
- [x] 4.2 Run `pnpm typecheck`.
- [x] 4.3 Run `pnpm build`.
- [x] 4.4 Run targeted static searches for dictionary-backed copy, stale V1 copy, and disallowed trading/prediction claims.
- [x] 4.5 Check `/vi`, `/en`, `/vi/sign-in`, and `/vi/dashboard` route behavior via HTTP or browser.
