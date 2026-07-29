## Context

`/[lang]/demo-conversation` is a protected, locale-aware conversation workspace. It now has two modes:

- a deterministic scripted mode used initially, after New chat, and by users without `query:execute`;
- an authorized persisted mode backed by the existing market-conversation actions.

This change owns the route shell and chat presentation. The separate `demo-conversation-history-api` capability owns persisted history, transcript pagination, and follow-up submission behavior.

## Goals / Non-Goals

**Goals:**

- Provide a localized conversation surface independent from the global assistant UI state.
- Preserve deterministic scripted turns for the default and permission-limited experience.
- Support accessible long-transcript reading with live-edge following, turn anchoring, jump-to-latest, and a right-side tracking rail.
- Compose existing radix-nova/shadcn wrappers and keep feature-specific behavior route-local.

**Non-Goals:**

- Reimplement or share the global assistant controller.
- Define backend DTOs or duplicate persisted-conversation requirements.
- Add streaming backend responses, attachments, image generation, research, web search, rename/delete/archive, or sidebar navigation.
- Modify shared MessageScroller or theme tokens.

## Decisions

### Keep the route independent but reuse existing actions

The demo owns its presentation and request state rather than importing the global assistant runtime. Authorized persisted behavior calls the existing market-conversation actions; the detailed request contract remains in `demo-conversation-history-api`.

### Retain one route-local scripted fallback

The localized `createChat()` fixture remains the initial/New chat experience and the complete experience for users without `query:execute`. It provides deterministic submitted/streaming states without a second backend contract. Selecting persisted history replaces the transcript until New chat restores the fixture.

### Compose installed conversation primitives

The transcript uses `MessageScrollerProvider`, `MessageScroller`, `MessageScrollerViewport`, `MessageScrollerContent`, and `MessageScrollerItem`, with `Message` and `Bubble` for rows. The viewport owns scrolling, live-edge following, hidden native scrollbar chrome, user-turn anchoring, and jump-to-latest behavior.

### Keep API behavior out of this UI capability

History search, pagination, selected transcript loading, older-message pagination, stale-response protection, and follow-up submission are specified in `demo-conversation-history-api`. This avoids conflicting requirements in two capabilities.

### Keep long-turn tracking route-local

The rail stays on the right inside the bounded Card and uses route-local native buttons. Every rail is 2px thick and 6px wide at rest, anchored to a fixed right edge. Pointer hover expands the hovered rail leftward to 26px and neighbors at distances one, two, and three to 20px, 14px, and 10px.

Without hover, the current anchor remains emphasized. During hover, active emphasis is suppressed and only the hovered rail uses foreground color; neighboring widths change without inheriting hover color. Keyboard focus preserves the native focus indicator, Hover Card preview, and jump action without applying pointer-only color behavior. Reduced-motion preference disables width animation.

### Preserve accessible localized semantics

All visible and accessible copy comes from the locale dictionaries. Message roles remain available as `sr-only` text, the transcript is labelled and reports busy state, inactive jump controls are not focus stops, and rail controls retain accessible names and keyboard activation.

### Keep the empty state personalized

The server route resolves the authenticated display name using existing auth sources and passes only the display string to the client. The client reuses the theme-aware Signapse logo and localized fallbacks.

## Risks / Trade-offs

- The route maintains scripted and persisted modes in one component. This is accepted while permission-limited fallback remains a requirement; no extra abstraction is added until another consumer exists.
- The tracking rail is feature-specific CSS and state. Keeping it route-local avoids changing the shared scroller for one presentation.
- Persisted request behavior may evolve separately. Cross-capability references keep this UI spec from becoming a stale duplicate.

## Migration Plan

No data migration is required. Archive this reconciled UI change after syncing `demo-conversation`; later API evolution remains under its own changes and capability spec.

## Open Questions

None.
