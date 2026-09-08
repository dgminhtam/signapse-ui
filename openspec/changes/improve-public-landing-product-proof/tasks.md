## 1. Capture Contract And Localization

- [x] 1.1 Add a route-local typed catalog for locale-specific approved product captures, including feature identity, public asset source, intrinsic dimensions, localized content references, non-sensitive demo-source reference, and approval state.
- [x] 1.2 Make the public renderer consume only approved locale descriptors and add deterministic missing, partial-locale, and approved catalog fixtures for automated tests.
- [x] 1.3 Add matching Vietnamese and English dictionary entries for capture captions, alternative text, Knowledge Graph annotations, `Xem ảnh lớn` / `View larger image`, dialog titles, Close, loading, and failure feedback.

## 2. Feature-Specific Product Story

- [x] 2.1 Refactor chapter semantics so each approved outcome is the `h3`, the feature name is a supporting label, and essential text remains outside media.
- [x] 2.2 Implement the Knowledge Graph copy-above-wide-capture composition with two or three adjacent annotation slots populated only from approved image-specific localized content.
- [x] 2.3 Implement wide desktop copy-left/capture-right compositions for Live Charts and Telegram while preserving the Telegram message aspect ratio.
- [x] 2.4 Implement the wide desktop AI capture-left/copy-right visual composition while keeping copy before media in DOM order.
- [x] 2.5 Implement the single-column copy-before-media composition below 1200 CSS pixels and under 200% zoom reflow without page-level overflow.
- [x] 2.6 Remove the repeated text-only media frames; omit the complete media surface, caption, reserved height, and enlargement trigger whenever the active locale lacks an approved descriptor.

## 3. Product Capture Enlargement

- [x] 3.1 Add one route-local client island that uses the existing Dialog wrapper to enlarge an approved static product capture without changing the URL.
- [x] 3.2 Render localized visible dialog title and Close controls, focus Close on open, contain focus, support Escape, and restore focus to the exact trigger on close.
- [x] 3.3 Preserve image aspect ratio and confine required scrolling to dialog/image content while keeping title and Close reachable on mobile and at 200% zoom.
- [x] 3.4 Mount the larger optimized image rendition only while the dialog is open and keep localized loading and failure states dismissible.
- [x] 3.5 Keep the enlargement interaction static and remove any carousel, autoplay, hotspot, product-control, custom zoom, or pan behavior.

## 4. Approved Product Captures

- [x] 4.1 Prepare a non-sensitive capture plan and approval record for Knowledge Graph, Live Charts, AI Assistant, and Telegram in Vietnamese and English, including source/demo scenario, intended crop, dimensions, caption/alt draft, and current approval status.
- [ ] 4.2 Capture and optimize the authorized Knowledge Graph assets for both locales, showing one readable event–asset–source cluster and no unsupported causality or demo-surface claim.
- [ ] 4.3 Capture and optimize the authorized Live Charts assets for both locales, preserving price, event/economic-calendar context, and applicable stream/data status without presenting the image as currently live.
- [ ] 4.4 Capture and optimize the authorized AI Assistant assets for both locales from a permitted demo conversation without fabricating an answer or implying graph-node or automatic chart-context chat.
- [ ] 4.5 Capture and optimize the authorized Telegram assets for both locales from permitted real Signapse messages without independently sending messages, enabling routing, or creating schedules.
- [ ] 4.6 Integrate only captures whose final locale-specific image has Product Owner approval, and leave every unavailable or awaiting-approval entry text-first and explicitly incomplete in the handoff record.

## 5. Automated Verification

- [x] 5.1 Update server-rendered landing component tests for semantic heading hierarchy, feature order, complete text-first fallback, approved/partial-locale catalog behavior, and absence of repeated media placeholders.
- [ ] 5.2 Update Playwright coverage for feature-specific desktop geometry and single-column copy-before-media order at 375, 768, 1024, and 1440 CSS pixels and 200% zoom.
- [ ] 5.3 Add browser coverage for the localized enlargement trigger, matching image and locale, dialog title/Close, Escape dismissal, focus containment/return, URL stability, aspect ratio, and no page-level overflow.
- [x] 5.4 Add deterministic loading and broken-image coverage confirming localized feedback, dismissibility, and continued availability of adjacent chapter content.
- [x] 5.5 Retain and run landing regression coverage for public routing, auth-aware CTA destinations, locale/hash preservation, Hero figure behavior, reduced motion, light/dark themes, and automated accessibility checks.
- [ ] 5.6 Run dictionary parity and forbidden-copy/media static searches, targeted tests, lint, typecheck, production build, and strict OpenSpec validation; report any unrelated pre-existing warnings separately.

User-owned manual QA: the Product Owner confirms that each demo source may be public and approves each final locale-specific capture. Real Telegram delivery, final visual quality, and release/cutover approval remain manual evidence and are not represented as automated or archive-blocking checkboxes.
