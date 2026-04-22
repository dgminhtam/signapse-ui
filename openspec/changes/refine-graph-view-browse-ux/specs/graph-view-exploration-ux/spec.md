## ADDED Requirements

### Requirement: Graph view MUST prioritize the canvas as the primary exploration surface
The graph-view route SHALL present the graph canvas as the dominant visual region, and supporting information such as metrics, legend content, and helper copy MUST be visually secondary or progressively revealed.

#### Scenario: Graph canvas remains the primary focal area on first load
- **WHEN** an authorized user opens `/graph-view` with a non-empty graph payload
- **THEN** the page MUST make the graph canvas the primary above-the-fold focus rather than presenting the canvas as one card among many equally weighted panels

#### Scenario: Supporting guidance becomes secondary once the graph is available
- **WHEN** the graph-view page has data to render
- **THEN** helper content, legend content, and graph metrics MUST NOT compete equally with the main canvas for attention

### Requirement: Graph view MUST use purposeful motion to improve orientation
The graph-view surface SHALL use bounded motion to help users orient themselves during graph entry, focus changes, and camera actions, without leaving the graph in a continuously unstable animated state.

#### Scenario: Graph settles into a stable browsing state after load
- **WHEN** the graph-view page first renders a populated graph
- **THEN** the surface MUST provide a brief settle or orientation animation and then stabilize into an interactive browsing state

#### Scenario: Focus and reset actions feel spatially guided
- **WHEN** a user triggers reset, focus, or comparable viewport-changing actions
- **THEN** the graph-view camera MUST transition smoothly enough to preserve spatial context

### Requirement: Graph view MUST support local focus controls for dense exploration
The graph-view surface SHALL support a client-side focus mode that narrows attention around a selected node or cluster without requiring a new backend endpoint.

#### Scenario: Users can focus around a selected node
- **WHEN** a user selects a node and enables a focus or neighborhood mode
- **THEN** the page MUST provide a graph view centered on that node's local relationships while preserving a way to return to the broader graph

#### Scenario: Users can adjust neighborhood depth
- **WHEN** a focus or local-neighborhood mode is active
- **THEN** the page MUST offer a compact way to adjust how many relationship hops are included in that local view

### Requirement: Graph view MUST reduce clutter through contextual disclosure
The graph-view surface SHALL keep dense graph detail readable by revealing some labels, metadata, and controls contextually rather than keeping all of them permanently visible.

#### Scenario: Edge labels are contextual rather than always-on
- **WHEN** a user is browsing the graph at rest
- **THEN** edge labels MUST appear only when the interaction state or readability state calls for them, such as selection, hover, or a comparable explicit reveal condition

#### Scenario: Secondary metadata does not crowd the primary graph reading path
- **WHEN** a user has not selected a node or edge
- **THEN** secondary metadata and support content MUST stay out of the primary graph reading path until requested or made relevant by interaction

### Requirement: Graph view MUST provide an inspector-style companion panel
The graph-view side panel SHALL behave as a stateful inspector that adapts to browse overview, node selection, edge selection, and focus-management needs rather than reading as a fixed stack of unrelated cards.

#### Scenario: Side panel shifts into node inspection when a node is selected
- **WHEN** a user selects a node
- **THEN** the side panel MUST foreground that node's details and related actions as the dominant panel state

#### Scenario: Side panel supports graph management without overwhelming detail mode
- **WHEN** no node or edge is selected
- **THEN** the side panel MUST provide overview and exploration controls in a compact way that does not feel like a secondary dashboard competing with the canvas
