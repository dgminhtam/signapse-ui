## 1. Canvas Shell Polish

- [x] 1.1 Update Graph View populated canvas shell to use system-aligned `rounded-xl` radius and restrained border/background treatment.
- [x] 1.2 Remove heavy gradient/glow treatment from the primary Graph View wrapper while preserving graph readability.
- [x] 1.3 Update Suspense skeleton and dynamic canvas fallback to mirror the same radius, surface, and simplified chrome.

## 2. Title And HUD Polish

- [x] 2.1 Render `Biểu đồ tri thức` as larger plain title text without pill, badge, or card wrapper.
- [x] 2.2 Keep node-kind counts visually separate from the plain title and secondary to the graph.
- [x] 2.3 Confirm total and relationship summaries still remain compact in-canvas metadata.

## 3. Viewport Control Group

- [x] 3.1 Replace the custom zoom/recenter wrapper with shadcn `ButtonGroup` and existing `Button` components.
- [x] 3.2 Reorder controls so recenter sits between zoom out and zoom in.
- [x] 3.3 Replace the recenter icon with a locate/focus-position icon while preserving the existing recenter handler and accessible label.

## 4. Verification

- [x] 4.1 Run targeted lint for touched Graph View files.
- [x] 4.2 Run `pnpm typecheck`.
- [x] 4.3 Run OpenSpec validation/status for `polish-graph-view-canvas-chrome`.
- [x] 4.4 Run static search or deterministic review to confirm no `components/ui/*` wrappers or global theme tokens were changed.

User-owned manual QA: reload `/vi/graph-view` in light and dark mode and confirm the surface feels lighter, controls read as a native button group, and recenter communicates spatial locating.
