## 1. Hero visual composition

- [x] 1.1 Remove the Hero visual section label, proof heading, and visible figure caption while preserving the headline, supporting copy, CTA behavior, trust note, and three proof points in both locales.
- [x] 1.2 Remove visible figure overlays, fallback labels/status, and the persistent canvas border; reclaim the removed visual-copy space on desktop while preserving the mobile footprint and keyboard-only focus indication.
- [x] 1.3 Remove or narrow localized figure strings and label types that no longer have a visible or nonvisual consumer.

## 2. Control-free figure behavior

- [x] 2.1 Preserve fine-pointer hover preview and pointer drag rotation while removing click/tap pinning and preventing coarse-pointer mode changes from a tap.
- [x] 2.2 Preserve nonvisual localized name, description, live mode feedback, Arrow-key rotation, and Enter/Space mode switching without visible control chrome.
- [x] 2.3 Replace continuous auto-rotation with a one-time graph-only intro that settles within four seconds, does not replay after viewport re-entry, and suppresses introductory motion for reduced-motion users.
- [x] 2.4 Keep a silent dual-view fallback with the same layout footprint and localized nonvisual description when client enhancement or WebGL is unavailable.

## 3. Contract and verification

- [x] 3.1 Update the public-landing specification and glossary-aligned assertions for the control-free interactive figure contract.
- [x] 3.2 Update localized component coverage to assert retired visible Hero/figure copy is absent while the required Hero content and nonvisual figure contract remain present.
- [x] 3.3 Update public-landing browser coverage for control-free chrome, fine/coarse pointer behavior, keyboard interaction, focus indication, bounded/reduced motion, fallback behavior, and responsive no-overflow states.
- [x] 3.4 Run targeted landing tests, browser coverage, lint, typecheck, and strict OpenSpec validation for `streamline-hero-context-figure`.
