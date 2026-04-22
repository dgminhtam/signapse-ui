## ADDED Requirements

### Requirement: Graph view MUST keep a server-renderable protected shell
The system SHALL keep the protected `/graph-view` route server-renderable for permission gating, page framing, and graph-view shell content even when the interactive graph canvas depends on browser-only WebGL APIs.

#### Scenario: Graph-view route renders on the server without WebGL globals
- **WHEN** the server render path evaluates the `/graph-view` route in a Node.js environment without `WebGL2RenderingContext`
- **THEN** the route MUST complete server rendering without throwing a WebGL global reference error

#### Scenario: Protected route behavior remains intact
- **WHEN** a signed-in user opens `/graph-view`
- **THEN** the page MUST continue to enforce `graph-view:read` before exposing the graph-view shell

### Requirement: Graph view MUST isolate Sigma and WebGL imports from the SSR path
The graph-view implementation MUST isolate Sigma, `@react-sigma/core`, and any module that references browser WebGL globals behind a client-only rendering boundary that is not evaluated during server rendering.

#### Scenario: Server render path does not evaluate Sigma's WebGL bundle
- **WHEN** the server constructs the render tree for `/graph-view`
- **THEN** it MUST NOT directly evaluate a module that references `WebGL2RenderingContext` at module scope

#### Scenario: Client-only canvas is loaded after the shell
- **WHEN** the graph-view page reaches the browser
- **THEN** the interactive graph canvas MUST be loaded through a client-only boundary that hydrates after the protected shell is available

### Requirement: Graph view MUST provide a stable canvas fallback before hydration
The graph-view page SHALL provide a bounded loading placeholder for the graph canvas while the client-only Sigma island is still loading.

#### Scenario: Canvas placeholder preserves layout stability
- **WHEN** the page shell renders before the client-only graph canvas hydrates
- **THEN** the graph-view layout MUST keep a stable canvas region rather than collapsing or leaving an unbounded empty gap

### Requirement: Graph view MUST preserve browse interactions after client hydration
The graph-view page SHALL preserve the existing browse-first interactions after the client-only canvas loads.

#### Scenario: Existing graph browsing behavior remains available
- **WHEN** the client-only graph canvas finishes hydrating
- **THEN** users MUST still be able to pan, zoom, hover, select, and inspect graph items using the same graph-view response data already fetched for the page

#### Scenario: Existing inspector and empty states remain coherent
- **WHEN** the graph-view response is empty or the user selects a graph item after hydration
- **THEN** the page MUST continue to present coherent empty-state and inspector behavior without requiring a second graph fetch
