## Context

The promoted market conversation renders persisted `MarketChatMessageResponse` objects through the local `DemoMessage` component. The response already contains `role`, raw `content`, `status`, and `createdDate`; assistant Markdown is transformed only for presentation. The repo also already provides `MessageFooter`, icon-only Button variants, Tooltip, `AppTimeMetadata`, locale-bound date formatting, Sonner feedback, and a proven Clipboard API pattern.

The message footer must remain visually quiet in a dense transcript without becoming hover-only functionality. It must also preserve the raw assistant source requested by users rather than reconstructing content from rendered Markdown.

## Goals / Non-Goals

**Goals:**

- Add compact, role-specific actions and created-time metadata to persisted messages.
- Copy the exact backend message content, including raw assistant Markdown syntax.
- Keep the controls reachable by pointer, keyboard, screen reader, and touch users.
- Reuse current conversation and shared UI primitives without changing their contracts.

**Non-Goals:**

- Sending content to Telegram or adding Telegram API/server-action integration.
- Adding reactions, ratings, retry, edit, regenerate, share, or overflow actions from the reference images.
- Changing message DTOs, Markdown rendering, response reveal, scrolling, routing, or permissions.
- Creating a generic message-action abstraction or adding a dependency.

## Decisions

### Compose the footer inside the existing message row

`DemoMessage` will render the role-aware metadata through the existing `MessageFooter` beneath its Bubble or failed Marker. This keeps alignment owned by the message primitive: user footers align to the end and assistant footers align to the start. Shared `Message`, `Bubble`, and `MessageFooter` implementations remain unchanged.

Alternative considered: add a new shared `MessageActions` primitive. Rejected because this is one feature with three fixed controls and no second consumer.

### Use CSS interaction states instead of hover state in React

On hover-capable pointers, the footer remains in normal flow but is visually quiet until the message is hovered or contains keyboard focus. Devices without hover show the footer persistently. Opacity and pointer-state transitions may be used, with reduced-motion respected; the footer is not conditionally mounted on pointer entry.

Keeping the footer footprint stable avoids transcript reflow when controls appear. `group-focus-within` ensures a keyboard user does not encounter an invisible action, and the no-hover media behavior prevents touch users from losing access.

Alternative considered: `onMouseEnter`/`onMouseLeave` state. Rejected because CSS covers the interaction without component state and avoids hover-only behavior.

### Copy the message source string directly

Copy uses the existing `getMessageText(message)` value and passes that exact string to `navigator.clipboard.writeText`. It MUST NOT trim the value or read `innerText`, `textContent`, or rendered Markdown DOM. The existing try/catch plus localized Sonner success/error pattern handles clipboard permission or platform failures.

Assistant copy and Telegram controls are available only after a completed non-empty response finishes its progressive reveal. Persisted user messages with non-empty content can expose Copy immediately. Failed or empty assistant messages expose their created-time metadata but no content actions.

Alternative considered: serialize the rendered assistant DOM back to text or Markdown. Rejected because it loses source fidelity and adds unnecessary transformation logic.

### Keep Telegram as an explicit local placeholder

The assistant footer includes a localized icon-only Send to Telegram control. Activating it only produces localized informational feedback that the feature is not yet available; it performs no request, navigation, or mutation. This provides honest feedback instead of a silent no-op while preserving the agreed visual placeholder.

Alternative considered: render a disabled button. Rejected because a disabled icon-only control is not keyboard focusable and cannot reliably expose its explanatory tooltip.

### Reuse localization and time metadata conventions

All tooltips, accessible names, and toast messages are added with matching Vietnamese and English `demoConversation` keys. The parent conversation uses its existing locale-bound `formatDateTime` function with compact weekday/hour/minute options, producing output such as `21:28 Thứ Tư` in Vietnamese.

The visible timestamp uses semantic `<time dateTime={message.createdDate}>` content within `AppTimeMetadata` and a compact Lucide clock icon, preserving the repo-wide muted, tabular time treatment. No new formatter is introduced.

### Extend the existing deterministic conversation check

The existing conversation check will cover the stable structural contract: source-string clipboard usage, assistant-only Telegram placeholder gating, and localized footer wiring. Typecheck and lint remain the implementation-level verification commands. No new test framework or fixture layer is added.

## Risks / Trade-offs

- [Risk] Hover-driven disclosure can hide controls from keyboard or touch users. → Mitigation: show on message focus-within and persistently when hover is unavailable.
- [Risk] Clipboard access can fail outside a permitted browser context. → Mitigation: catch the failure and show localized error feedback; do not add deprecated clipboard fallbacks.
- [Risk] Copying raw Markdown can differ from what the rendered assistant response looks like. → Mitigation: this is intentional source-preserving behavior and the action remains explicitly labeled as Copy.
- [Risk] Reserving footer space slightly increases transcript density. → Mitigation: keep only the agreed role-specific controls and reuse compact shared variants rather than adding an action toolbar surface.

## Migration Plan

No data, API, or dependency migration is required. The UI can be deployed as a normal frontend change and rolled back by reverting the message footer and dictionary additions.

## Open Questions

None. The approved scope fixes the action set, visibility rules, copy source, timestamp format, and placeholder behavior.
