## 1. Promote the Conversation Implementation

- [x] 1.1 Move the demo conversation component, history helpers, and scoped styles into `components/market-conversation-assistant/` and rename the active component to `MarketConversationAssistant` without changing its API, transcript, tracking, or retry behavior.
- [x] 1.2 Update deterministic conversation checks and imports to the promoted production paths, consolidating the route-local assertion only where the existing script already covers it.

## 2. Add the Global Overlay Interaction

- [x] 2.1 Add the localized floating trigger and shared accessible non-modal Popover while keeping conversation state mounted outside overlay visibility.
- [x] 2.2 Change Close, Escape, and supported dismissal to close locally, restore trigger focus, preserve the current route and session, and keep the promoted Card usable within narrow viewport bounds.
- [x] 2.3 Update English and Vietnamese visible copy that still identifies the active surface as a demo, without consolidating the old and new dictionary namespaces.
- [x] 2.4 Verify that the Popover leaves outside page controls operable while preserving local close, Escape, outside dismissal, focus return, and conversation session behavior.

## 3. Switch the Protected Entry Point

- [x] 3.1 Change `ProtectedAiAssistant` to dynamically load the promoted assistant while preserving the existing permission gate, loading trigger, and error boundary.
- [x] 3.2 Resolve and pass the authenticated display name from the protected layout and key the promoted assistant by active workspace identity.
- [x] 3.3 Confirm the active entry point no longer initializes `AssistantRuntime` or `useMarketConversationAssistant`, while leaving their source and dependencies untouched for the follow-up cleanup change.

## 4. Retire the Standalone Demo Surface

- [x] 4.1 Remove the `/demo-conversation` page after promotion so the protected shell cannot mount two independent conversation instances.
- [x] 4.2 Remove the obsolete demo breadcrumb identity and update any remaining active source references to the retired route.

## 5. Verification

- [x] 5.1 Run the deterministic market-conversation assistant check covering helper behavior, create-before-submit ordering, optimistic user feedback, and the promoted source path.
- [x] 5.2 Run targeted lint for the promoted assistant, protected boundary, layout, localization, breadcrumb, and deterministic check files.
- [x] 5.3 Run the repository typecheck.
- [x] 5.4 Run `openspec validate replace-global-assistant-with-demo-conversation --strict`.

User-owned manual QA: verify trigger availability by permission, local close/reopen session preservation, keyboard focus and Escape behavior, workspace reset, responsive overlay sizing, History overlays, tracking rail, and synchronous response reveal in an authenticated browser.
