## Why

The Hero market-context figure carries visible labels, controls, and a border that compete with the landing message and constrain the animation. The figure should remain explorable, but read as a spacious conceptual visual rather than a miniature product control surface.

## What Changes

- Remove visible Hero-visual copy, figure caption, control chrome, status text, fallback labels, and the persistent canvas border.
- Preserve fine-pointer hover preview and pointer drag rotation while removing undiscoverable click/tap pinning.
- Preserve a nonvisual keyboard and screen-reader contract, including keyboard-only focus feedback, graph/price switching, and localized hidden guidance.
- Make the canvas reclaim the removed visual-copy space on larger Hero layouts without materially increasing the Hero footprint; preserve its mobile minimum footprint.
- Replace continuous auto-rotation with a one-time, brief graph-only intro that settles and does not replay on viewport re-entry; respect reduced-motion preferences.
- Keep a silent dual-view fallback in the same visual footprint when client enhancement or WebGL is unavailable.
- Synchronize localized dictionary use, landing tests, and the public-landing specification with the control-free interactive figure contract.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `public-landing-page`: The text-first Hero's market-context figure becomes a control-free interactive visual with nonvisual accessibility support and a quiet fallback, replacing its visible labels and controls.

## Impact

- Affected runtime: the localized Hero composition, the client-side market-context figure, its visual styles, and localized figure strings.
- Affected verification: public-landing component and browser coverage for localized rendering, pointer/keyboard interaction, reduced motion, fallback, and responsive layout.
- Affected documentation: the public landing specification and existing glossary terminology.
- No API, authentication, backend-data, dependency, or route changes.
