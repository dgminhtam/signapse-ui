## Context

News article Quick detail is a workspace-owned reading surface used from analytical and dashboard contexts. Its presentation has retained an older visual treatment even though the canonical article detail page now establishes the current reader-first baseline for description, provenance, original-source access, feature media, and Markdown.

The Quick detail drawer must remain a local overlay: it preserves the underlying workspace, owns its own loading, error, access, and scroll behavior, and must not embed the canonical page shell. The user has also chosen deliberate divergence over a shared article-content module so that page and drawer can evolve independently after this refresh.

## Goals / Non-Goals

**Goals:**

- Align the current News article Quick detail body with the reader-first hierarchy already visible on the canonical detail page.
- Keep the drawer shell, title, local lifecycle, and focused reading scope intact.
- Ensure absent optional source URLs and media do not leave unusable affordances or empty surfaces.
- Make the documented Quick detail terminology, News article navigation exception, and linked-event mapping status consistent with the implementation.
- Cover the visible drawer path at a component boundary that includes the real article Quick detail presentation.

**Non-Goals:**

- Create a shared page/drawer article presentation component or a permanent parity contract.
- Modify the canonical News article detail page, APIs, DTOs, routes, permissions, or dependencies.
- Add canonical-detail navigation, linked-event content, event links, or event-read permission logic to News article Quick detail.
- Change Event Quick detail behavior or the generic local-overlay lifecycle.

## Decisions

### Use the canonical detail body as a snapshot baseline

The drawer will adopt the current detail page's article-body hierarchy for description, provenance, optional original-source access, feature image, and Markdown. It will not copy page-only identity or navigation chrome. This resolves the current visual inconsistency without redefining Quick detail as a mini full page.

### Keep page and drawer presentation modules separate

The News article drawer remains its own presentation module rather than sharing a content core with the canonical page. A shared module would reduce immediate duplication, but it would force future page and drawer changes to move together. The chosen boundary makes this baseline alignment explicit and permits intentional divergence later.

### Preserve drawer-specific shell and state ownership

The drawer title remains the overlay's accessible identity; the article body does not render a duplicate page-level heading. Existing local fetch, permission, loading, missing/error, close, scroll-containment, and unchanged-URL behavior remain outside the article-body refresh.

### Omit canonical-detail escalation for News article Quick detail

News article Quick detail intentionally does not expose a full-page action because it already provides the focused complete reading content needed in the workspace. Canonical article routes remain available through ordinary navigation, reload, direct URLs, and copied links. This is a narrow News article exception; Event Quick detail keeps its existing escalation behavior.

### Keep linked events outside the reader-first body

Although article responses may contain linked-event data, neither the canonical detail page nor the Quick detail drawer renders it. Adding it would expand the feature into event navigation and permission handling, so this change explicitly preserves its absence and corrects documentation that implied otherwise.

### Test at the local drawer boundary

Component coverage will exercise the local entity Quick detail drawer with article retrieval, localization, and permissions controlled at its dependencies. This is the highest practical seam that verifies the visible article body through the real drawer composition while avoiding implementation-specific class assertions.

## Risks / Trade-offs

- [Page and drawer can drift in the future] → Record that this is a snapshot baseline and keep their presentation modules independent by design.
- [Uncropped media can consume more vertical space] → Retain the drawer's existing scroll containment and omit media entirely when unavailable.
- [Documentation may continue to imply a universal full-detail action] → Update the glossary, quick-detail pattern, design policy, and API mapping ledger together.
- [A test may couple to overlay internals] → Assert user-visible text, links, image alternatives, and absence/presence of controls rather than DOM classes or animation mechanics.

## Migration Plan

1. Update the independent News article Quick detail presentation and its focused component coverage.
2. Update the glossary and relevant policy/mapping documents in the same change.
3. Validate behavior and documentation consistency with targeted tests, lint, typecheck, and static searches.

No data migration, rollout flag, route migration, or API compatibility step is required. Rollback consists of restoring the prior drawer presentation and the matching documentation statements.

## Open Questions

- None. The layout baseline, independent-module boundary, navigation exception, linked-event exclusion, and test seam are all decided.
