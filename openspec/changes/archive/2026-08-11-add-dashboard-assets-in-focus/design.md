## Context

The production dashboard resolves the active workspace, loads one authenticated `GET /dashboard/summary` response, validates it with Zod, and distributes its metrics to Trading Snapshot and Event Timeline. Backend has added a required `assetsInFocus` metric to that response. The metric contains at most six ranked watchlist assets and one selected Event or Narrative context per asset; backend ranking and source eligibility are authoritative.

The existing Zod object does not declare `assetsInFocus`, so it strips the field before the page receives it. The reviewed `/dashboard-prototype` already defines the desired Card and Item hierarchy, but its records, context strings, permissions, and review scenarios are intentionally route-local mocks. Production must adapt the presentation without coupling to that prototype implementation.

The backend contract may receive small follow-up adjustments. `docs/api_mapping.json` remains the source of truth, so implementation starts with a contract re-check and mirrors requiredness and nullability rather than preserving looser historical frontend assumptions.

## Goals / Non-Goals

**Goals:**

- Preserve and validate `assetsInFocus` at the existing dashboard API boundary.
- Render a live, localized, permission-aware Assets in Focus section using the accepted prototype composition and existing Signapse UI primitives.
- Preserve backend item ordering, metric states, workspace scope, and context content without additional aggregation requests.
- Provide direct Graph View and asset-specific Market Charts investigation paths only when the user can access those destinations.
- Keep the successful, loading, empty, denied, error, narrow-width, and zoomed layouts truthful and accessible.

**Non-Goals:**

- Changing the backend endpoint, permissions, ranking algorithm, database, or response contents.
- Adding price, 24-hour change, sparkline, direction, catalyst counts, or top-mover data not present in the contract.
- Adding Event or Narrative quick detail without a source discriminator and source identifier.
- Implementing Market Narratives or forcing the prototype's seven-to-five paired layout before that production module exists.
- Reusing prototype mock records, scenario controls, dictionary namespace, or component imports.
- Adding a second tracked-asset management trigger outside Current Workspace.

## Decisions

### Use the existing summary request as the only data source

The page will pass `summary.assetsInFocus` from the existing `getDashboardSummary()` result into a production-local component. No watchlist, Event, Narrative, Graph View, or Market Charts request will be issued to populate the section.

Alternative considered: join existing frontend list endpoints. Rejected because it duplicates backend ranking and permission logic, creates inconsistent snapshot times, and risks N+1 requests.

### Mirror the backend boundary before rendering

Dashboard definitions will add schemas for the metric, item, and context DTOs and make `assetsInFocus` required on the summary. Required nullable fields will use nullable validation rather than optional/nullish validation. Because OpenAPI declares metric `errorCode` as `string | null`, the boundary will accept a required nullable string instead of rejecting future canonical codes through a closed frontend-only enum. The implementation will re-check the latest OpenAPI snapshot before editing in case BE makes a minor contract adjustment.

Alternative considered: make the new metric optional for a compatibility rollout. Rejected because BE already publishes it as required and the user explicitly chose the BE contract as authoritative.

### Keep backend order and content authoritative

The component will render no more than the returned six items in their existing order. It will show `assetSymbol` and `assetName` as identity, a localized neutral label for `assetType`, `context.title` as the primary market context, `context.summary` only when non-null and non-empty, and localized `context.observedAt` metadata. It will not infer the selected context's source type, direction, or trading meaning.

Alternative considered: re-sort by time or asset symbol. Rejected because the endpoint explicitly defines its order as authoritative and ranking semantics are not reproducible from the exposed DTO.

### Adapt presentation into a production-local Server Component

A new route-local component will reuse the prototype's `Card`, `CardHeader`, `CardAction`, `ItemGroup`, `Item`, neutral category Badge, and per-item footer action hierarchy. It remains a Server Component because it only renders validated props and links. A matching exported skeleton will preserve the header action and representative rows.

Alternative considered: export and parameterize the prototype component. Rejected because it would couple live DTOs and permissions to a mock-only review route.

### Render full width until a production sibling exists

Assets in Focus will use the available content width in the current production composition. The prototype's seven-to-five split is a relationship between Assets in Focus and Market Narratives; applying seven columns alone would leave an unexplained empty rail. A later Market Narratives change may wrap both modules in the accepted split.

Alternative considered: retain `lg:col-span-7` without a sibling. Rejected because it wastes content width and weakens responsive hierarchy.

### Treat metric state and destination permission as separate concerns

`AVAILABLE`, `EMPTY`, `DENIED`, and `ERROR` will select the section body. Endpoint-level summary failures remain on the existing summary error path. Graph View visibility will use the existing Graph View permission helper. Market Charts item actions will use the existing workbench capability helper and link to `/market-charts?assetId=<id>&timeframe=1h`. Metric eligibility itself remains a backend decision; the frontend will not recompute it from the current permission list.

Alternative considered: show every action and let destination pages reject access. Rejected because it creates misleading dashboard affordances despite already-available permission helpers.

### Keep tracked-asset management in Current Workspace

The Assets in Focus empty state will explain that no ranked context is available without copying the prototype's no-op `/dashboard` action or adding another watchlist editor trigger. Current Workspace remains the one management surface required by the existing overview spec.

Alternative considered: render a second Manage Assets trigger inside the empty section. Rejected because it duplicates the same workspace mutation action in two primary locations.

## Risks / Trade-offs

- **[Risk] BE adjusts the new field names or nullability before implementation** → Re-run the API mapping comparison at apply time and make the OpenAPI snapshot authoritative over this design's examples.
- **[Risk] Strict required validation exposes previously tolerated malformed dashboard payloads** → Align all dashboard required/nullable fields in one boundary update and keep the existing explicit summary error path instead of fabricating partial values.
- **[Risk] Context summaries make rows too tall** → Keep title prominent, render summary only when meaningful, and clamp supporting copy while allowing accessible reflow at narrow width and 200% zoom.
- **[Risk] A user can see ranked assets but cannot open Graph View or Market Charts** → Continue rendering the useful metric while omitting only inaccessible destination actions.
- **[Trade-off] Full-width layout differs from the paired prototype desktop grid** → Preserve the prototype's internal card hierarchy now and defer the seven-to-five grid until its production sibling exists.

## Migration Plan

1. Re-check `docs/api_mapping.json` and synchronize documentation if BE has changed the contract again.
2. Update dashboard validation/types so the existing action returns the sixth metric.
3. Add localized copy, the production-local component, explicit states, permissions, links, and skeleton.
4. Integrate the component after the current Event Timeline/Latest News row without changing existing requests or prototype files.
5. Run deterministic repository validation and OpenSpec validation before handoff.

Rollback is limited to reverting the frontend section, schema addition, and dictionary keys. The existing endpoint and the other dashboard metrics remain backward-compatible from the frontend's perspective; no data migration is required.

## Open Questions

None. Any minor BE contract change discovered at implementation time is resolved by following the latest `docs/api_mapping.json` snapshot and reporting the resulting artifact drift before code integration.
