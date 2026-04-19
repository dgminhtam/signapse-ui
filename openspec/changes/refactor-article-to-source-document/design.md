## Context

The current frontend still models backend-ingested content through two legacy domains: `articles` and `economic-calendar`. That assumption is now stale. The current backend OpenAPI snapshot exposes canonical content ingestion under `/source-documents`.

This mismatch shows up in multiple layers of the repo:
- `app/api/articles`, `app/lib/articles`, and `app/(main)/articles` still call removed backend endpoints.
- `app/api/economic-calendar`, `app/lib/economic-calendar`, and `app/(main)/economic-calendar` still depend on a backend domain that no longer exists in the current spec.
- `app/api/sources` and `app/lib/sources` no longer cover the full backend `SourceResponse` and `UpdateSourceRequest` schema.

The repo also has implementation constraints that matter for this refactor:
- Next.js 16 App Router with feature-local routes and server actions.
- Protected requests go through `fetchAuthenticated()`.
- URL-driven filtering and pagination are standardized through `page`, `size`, and serialized filter/sort params.
- User-facing copy is expected to be Vietnamese, with loading feedback and destructive confirmation flows aligned to the repo's UX rules.

## Goals / Non-Goals

**Goals:**
- Establish `source-documents` as the canonical frontend content domain.
- Replace broken backend mappings for article and economic-calendar screens with source-document-aligned behavior.
- Expand source configuration screens so frontend DTOs and forms cover the backend source schema that now controls crawl and ingest behavior.
- Provide a migration path that reduces broken navigation and preserves user intent while the domain name changes.

**Non-Goals:**
- Changing backend APIs, permission payloads, or the OpenAPI schema.
- Implementing `system-prompts`, `media`, or any revived wiki surface as part of this active change.
- Designing a custom structured editor for arbitrary source `configuration`; this change only needs a workable frontend mapping.
- Reworking shared auth, pagination primitives, or unrelated feature copy outside the impacted content and wiki flows.

## Decisions

### 1. `source-documents` becomes the only canonical content domain in the frontend
New frontend actions, definitions, and pages will model content ingestion through `source-document` DTOs and endpoints. The `articles` module will no longer be treated as a canonical backend integration.

Why:
- The current backend spec no longer exposes `/articles`.
- Continuing to build on article-centric DTOs would preserve a broken abstraction and keep wiki integration stale.

Alternatives considered:
- Keep the `articles` module name and silently swap the underlying endpoint implementation.
- Rejected because the stale naming would continue to mislead future work and make the wiki/source-document contract harder to understand.

### 2. The canonical management route will be `/source-documents`, with legacy route handling as a migration aid
The frontend should expose a new canonical content route under `/source-documents`. Existing `/articles` and `/economic-calendar` entry points should be retired or redirected to preserve intent during migration.

Why:
- The backend domain is now explicitly named `source-documents`.
- A canonical route rename makes the refactor visible and prevents long-term drift between UI language and backend terminology.

Alternatives considered:
- Keep `/articles` as the public route and only change data bindings underneath.
- Rejected because it hides the domain change and leaves `economic-calendar` without a clean long-term home.

### 3. Economic calendar behavior will be absorbed into source-document presentation through `documentType`
The separate economic calendar feature will not remain backed by a dedicated API module. Instead, source-document list and detail screens will support document-type-aware rendering, including the extra fields present on economic-calendar-like source documents.

Why:
- The backend has flattened this content into one source-document model.
- A unified content surface reduces duplicate list/detail infrastructure and keeps filtering consistent.

Alternatives considered:
- Preserve a dedicated `/economic-calendar` page backed by frontend-only transformations.
- Rejected because it would keep a fake domain boundary alive after the backend removed it.

### 4. Source configuration forms will map the full backend schema, but advanced source configuration will remain text-based
The frontend source form will expand to include source `type`, provider information, crawl timing, exclusion tags, default fetch limit, and raw `configuration` text. Ingest status fields remain read-only presentation data.

Why:
- These fields are now part of the backend contract and affect ingest behavior.
- A raw text field for `configuration` is sufficient for this phase and avoids speculative subforms for provider-specific shapes.

Alternatives considered:
- Delay source schema alignment to a later change.
- Rejected because source-document behavior depends on source configuration, and keeping the form incomplete would preserve another contract mismatch.

### 5. Permission handling will use a compatibility layer until backend permission naming is clarified
The refactor will not assume a brand-new permission model without evidence from the current runtime. Frontend route access and actions should keep working through a compatibility strategy that maps source-document screens onto the currently available permission set until backend permission keys are confirmed.

Why:
- The API snapshot does not define frontend permission naming for source documents.
- Blocking the refactor on speculative permission changes would stall a needed domain migration.

Alternatives considered:
- Rename all permission checks immediately to hypothetical `source-document:*` keys.
- Rejected because that would likely break access control before backend auth confirms the change.

## Risks / Trade-offs

- [Canonical route rename may break bookmarks or user habits] -> Provide legacy route redirects or equivalent navigation handoff during migration.
- [Source-document detail is broader than article detail] -> Use document-type-aware sections so the shared detail surface stays readable without hiding important economic fields.
- [Permission names may lag behind the domain rename] -> Isolate permission checks behind a small compatibility decision instead of scattering assumptions throughout new screens.
- [Expanding source configuration UI can increase perceived complexity] -> Keep advanced fields grouped and use raw text only where backend structure is opaque.
## Migration Plan

1. Introduce canonical source-document types and actions for list, detail, delete, analyze, and feature-image-related behavior.
2. Build source-document screens and migrate article-facing UI to the new domain.
3. Retire or redirect legacy `/articles` and `/economic-calendar` routes to canonical source-document flows.
4. Expand source DTOs and forms to cover backend source schema additions and expose ingest metadata in read-oriented views.
5. Verify navigation, permission-gated entry points, and URL-driven filtering after the domain rename.

## Open Questions

- Which concrete permission keys should gate source-document read, analyze, and delete actions once backend auth naming is confirmed?
- Should legacy `/articles` and `/economic-calendar` routes remain as redirects for one release cycle, or be removed immediately after the canonical `/source-documents` route ships?
- How much of the standalone economic calendar UX should survive as saved filters or sub-navigation inside source-document management?
