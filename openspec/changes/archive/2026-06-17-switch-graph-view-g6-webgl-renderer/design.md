## Context

The current Graph View canvas is client-only and instantiates G6 in `GraphViewCanvas`. It uses `d3-force`, built-in canvas drag, built-in hover activation, a custom bounded drag force, explicit zoom/recenter controls, and selection state updates after render readiness.

The vendored G6 docs state that G6 defaults to Canvas and supports WebGL by installing `@antv/g-webgl` and passing `renderer: () => new WebGLRenderer()` during `Graph` initialization. G6 typings in `@antv/g6@5.1.0` also expose `GraphOptions.renderer` as a callback for the `background`, `main`, `label`, and `transient` layers.

## Decisions

### Use WebGL for all G6 layers

Use a single renderer callback returning a new `WebGLRenderer` for each layer. This follows the upstream docs and keeps the change minimal.

Alternative considered: use WebGL only for the `main` layer and keep labels/transient layers on Canvas or SVG. That may be useful later if text or transient effects regress, but it adds a second renderer dependency or mixed-renderer behavior before evidence requires it.

### Keep G6 and layout behavior unchanged

Do not replace the graph engine, data mapping, layout, or interaction model. The renderer switch should not require backend contract changes, position persistence, new UI controls, or a runtime engine abstraction.

### No runtime fallback in v1

Do not add a Canvas fallback unless verification shows WebGL import or renderer creation failure. A fallback path would add branching and could hide renderer-specific problems during validation.

## Risks

- WebGL may render labels, strokes, halos, or opacity differently than Canvas.
- Browser-only import behavior may fail during Next.js build if `@antv/g-webgl` touches browser APIs at module evaluation time.
- Custom bounded drag behavior relies on the G6 layout instance; renderer should not affect it, but drag must be verified because it is core Graph View behavior.
