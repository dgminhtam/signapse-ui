## 1. Inspector Content Model

- [x] 1.1 Replace the generic inspector metadata grid with kind-specific field groups for `event`, `news-article`, `asset`, `theme`, and `narrative`.
- [x] 1.2 Keep the shared inspector header with node type, title, secondary label, close control, and existing visual identity.
- [x] 1.3 Remove `slug`, `canonicalKey`, and other technical identifiers from the primary inspector surface.
- [x] 1.4 Replace prominent raw related-node and related-edge cards with a compact relation summary treatment.

## 2. Kind-Specific Fields

- [x] 2.1 Render event nodes with occurred time, confidence, meaningful status, compact relation summary, and existing event detail action.
- [x] 2.2 Render news article nodes with outlet, published time, confidence when present, compact relation summary, existing article detail action, and source URL action when present.
- [x] 2.3 Render asset nodes with symbol/name, secondary label, asset type, and compact graph relationship summary only.
- [x] 2.4 Render theme nodes with theme identity and compact graph relationship summary only.
- [x] 2.5 Render narrative nodes with thesis, narrative status, confidence, and compact graph relationship summary only.

## 3. Interaction Compatibility

- [x] 3.1 Preserve click-to-select, click-to-close, and canvas-click clearing behavior.
- [x] 3.2 Preserve selected-node and related-edge emphasis while the inspector is open.
- [x] 3.3 Preserve quick detail actions for supported event and news article nodes without adding new backend fetches.
- [x] 3.4 Add or update Vietnamese and English dictionary copy for any new inspector labels.

## 4. Verification

- [x] 4.1 Run `openspec validate simplify-graph-node-inspector-content`.
- [x] 4.2 Run static search confirming `slug` and `canonicalKey` are no longer rendered by the Graph View inspector.
- [x] 4.3 Run `pnpm lint`.
- [x] 4.4 Run `pnpm typecheck`.

User-owned manual QA note: verify one node of each kind in Graph View and confirm the inspector feels concise in both light and dark mode.
