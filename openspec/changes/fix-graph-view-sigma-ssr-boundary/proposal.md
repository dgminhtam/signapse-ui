## Why

The `/graph-view` route currently imports Sigma's WebGL runtime on the server render path, which causes server-side module evaluation to fail with `WebGL2RenderingContext is not defined` under Next.js 16 and Turbopack. This bug downgrades the route to recoverable client rendering and makes the protected graph view less reliable than the rest of the application shell.

## What Changes

- Preserve server rendering for the protected `/graph-view` page shell, permission gating, and supporting inspector layout.
- Isolate all Sigma and WebGL-dependent imports behind a client-only rendering island so the server path never evaluates modules that reference `WebGL2RenderingContext`.
- Provide a bounded loading placeholder for the client-only graph canvas so the page remains stable while the interactive canvas hydrates.
- Keep the existing graph browse interactions and API contract unchanged after client hydration.

## Capabilities

### New Capabilities
- `graph-view-ssr-boundary`: Defines an SSR-safe rendering boundary for the graph-view route while preserving the existing client-side Sigma browsing experience.

### Modified Capabilities

## Impact

- Affected code: `app/(main)/graph-view/page.tsx`, `app/(main)/graph-view/graph-view-workbench.tsx`, and new graph-view client-only canvas modules introduced to isolate Sigma imports.
- Affected systems: Next.js App Router server rendering boundary, client hydration path, and the graph-view browsing surface.
- Dependencies: continues using `sigma`, `@react-sigma/core`, and `graphology`, but constrains them to the client-only canvas import path.
