## Context

The Telegram workspace currently mixes four concerns in one large client module: Bot Telegram management, Điểm nhận management, feature routing, and scheduled market analysis. The first two concerns still call three endpoints that the live backend contract removed, allow operators to submit a backend-owned display label, and render configuration records through fixed-width tables and Sheet-based forms. The result is contract drift, misleading edit/test affordances, duplicated form chrome, and layout overflow at narrow widths.

The backend still supports listing, creating, disabling, and deleting Bot Telegram records; listing, link-token creation, disabling, and deleting Điểm nhận records; and it still returns display labels and lifecycle metadata. The repository requires localized copy, Zod validation, authenticated server actions, shadcn wrappers, default Dialog/AlertDialog composition, responsive surfaces, and explicit permission/error states.

## Goals / Non-Goals

**Goals:**

- Remove all active frontend behavior tied to the three removed backend endpoints.
- Make the create request contract exact and keep bot tokens within a short-lived dialog lifecycle.
- Present Bot Telegram and Điểm nhận as responsive, readable infrastructure surfaces with truthful lifecycle and permission semantics.
- Make the external Telegram handoff explicit without optimistic linking or false success feedback.
- Isolate the two changed areas behind feature-local component boundaries while preserving the existing route orchestration and data-fetching model.
- Leave the change verifiable through existing repository checks without introducing new tooling.

**Non-Goals:**

- Backend contract changes, reactivation, token rotation, automatic migration, or dependency-cascade behavior.
- Channel creation/linking, automatic polling, or delivery test messages.
- Changes to feature-setting output language, feature-routing layout, schedule behavior, or the schedule Sheet.
- New runtime dependencies, test frameworks, global component abstractions, or edits to archived OpenSpec changes.

## Decisions

### Use the live contract as the only mutation boundary

The Telegram server-action module will expose only the operations still present in the live contract. Bot creation validates and sends `botToken` only. Response `displayLabel` fields remain in response types and become read-only identity data; update schemas, update request types, and removed mutation functions are deleted.

Alternative considered: retain dormant actions or hide their UI for potential backend restoration. Rejected because it preserves dead contract surface and lets future callers accidentally invoke unsupported endpoints.

### Treat disable as a terminal UI lifecycle action

The UI names the action `Vô hiệu hóa`, not `Tạm dừng`, because the contract exposes no enable/reactivate operation. `INVALID`, `ACTIVE`, and `DISABLED` records remain visible in operational priority order, while `REMOVED` records are filtered out. Active records may be disabled or deleted; invalid/disabled records may be deleted. Lightweight copy explains that replacing a token requires connecting a new bot and relinking dependent destinations; no migration workflow is built.

Alternative considered: keep reversible language in anticipation of a future endpoint. Rejected because it makes the current product promise behavior it cannot deliver.

### Use Card boundaries with Item rows instead of configuration tables

The cardless workspace remains the page shell. Within the shared Telegram infrastructure area, Bot Telegram and Điểm nhận each use one semantic Card as a genuine configuration boundary. Card headers own the title, description, and single primary action; Card content uses ItemGroup/Item for compact records and contextual overflow actions. The two Cards form a wide-screen grid and stack at narrower widths. Empty and skeleton states preserve the same footprint.

Alternative considered: keep tables with responsive column hiding or horizontal scrolling. Rejected because these are low-cardinality configuration collections whose identity, status, and two-line metadata fit Item composition better than fixed columns.

### Use focused Dialogs for create and link flows

`ConnectBotDialog` contains one visible, labelled password field and uses default Dialog form chrome. Client validation is field-local and moves focus to the token field; backend errors remain visible in the dialog. A failed request keeps the token only while the dialog remains open so the operator can retry; success or close clears it and the token is never logged, cached, persisted, or rendered in the resulting record.

`DestinationLinkDialog` starts with Bot Telegram selection and progressively reveals the backend-generated command, expiry metadata, copy action, and private/group handoff actions. Exactly one active bot is preselected; multiple active bots require an explicit choice. Changing the bot clears the generated command.

Alternative considered: continue using Sheets. Rejected because both flows are short, focused tasks and the existing Sheet implementations duplicate or reset standard form chrome.

### Keep external linking manual and truthful

Opening Telegram does not refresh the workspace or imply success. The result state retains an explicit `Đã liên kết, làm mới` action; activating it closes the dialog and refreshes server data while reporting only that the list was refreshed. When `expiresAt` is known to be past, open/copy controls are unavailable and the operator can generate a new command. No countdown or polling loop is introduced.

The frontend exposes private `start` and group `startgroup` handoffs only. Existing `CHANNEL` records returned by the backend remain displayable, but creating a channel destination is outside this contract because the current link token cannot be carried by Telegram's channel-add link.

Alternative considered: refresh immediately on outbound-link activation or poll until a destination appears. Rejected because either approach adds false success semantics or hidden background state without a backend completion contract.

### Make permission and destructive states explicit

A user with read but not manage permission sees the records and a localized read-only explanation, while create and mutation controls are omitted. A linking action that cannot proceed remains visible but unavailable when no active bot exists; its explanation distinguishes missing bot-read permission from an empty active-bot set.

Disable and delete remain authenticated server mutations inside controlled AlertDialogs. Dialogs remain open while pending and after errors, expose retry/cancel recovery, and close only after confirmed success. Known dependencies may enrich confirmation copy, but the frontend does not block deletion from partial page data; backend responses remain authoritative.

Alternative considered: disable every mutation control for read-only users or pre-block delete from loaded relationships. Rejected because disabled controls add noise and loaded relationships may be incomplete under section permissions.

### Extract two feature-local modules and keep route orchestration stable

Bot Telegram list/dialog behavior and Điểm nhận list/dialog behavior move into separate feature-local modules. The existing Telegram configuration module retains readiness, feature routing, schedules, shared orchestration, and any small helpers that are genuinely shared. The standalone test-message component is deleted.

Alternative considered: refactor the entire Telegram workspace or keep adding to the existing large module. The former exceeds scope; the latter leaves the changed boundaries difficult to reason about and verify.

## Risks / Trade-offs

- [The backend may return `REMOVED` records for audit purposes] → Filter them only from the operational UI and keep response typing intact.
- [Display labels and Telegram metadata are optional] → Apply deterministic identity fallbacks and wrap or truncate secondary metadata without losing an accessible full value.
- [Dependency information may be incomplete because of permissions] → Use it only to improve confirmation copy and rely on backend errors for enforcement.
- [Retaining a failed token in the open dialog extends its in-memory lifetime] → Clear it on close/success and prohibit persistence, logging, or post-success rendering.
- [Manual refresh cannot prove the user completed Telegram linking] → Use neutral refresh copy and never create an optimistic destination.
- [No automated UI test runner exists] → Validate the route/action boundary with lint, typecheck, OpenSpec validation, static contract searches, and non-blocking authenticated manual QA.

## Migration Plan

1. Remove unsupported action/schema/type/copy surfaces and narrow bot creation to the live request contract.
2. Introduce the two feature-local UI modules and replace the existing table/Sheet/test/edit surfaces.
3. Update the route skeleton, localized states, active OpenSpec requirements, domain glossary, and API-mapping status.
4. Run repository verification and confirm no active references to removed endpoints, symbols, or copy remain.

No data migration or deployment ordering is required because the backend contract is already live. A rollback may restore the previous presentation only; it MUST NOT restore calls to endpoints the backend no longer exposes.

## Open Questions

None. The contract, lifecycle, permission, linking, error, scope, and verification decisions were confirmed before proposal creation.
