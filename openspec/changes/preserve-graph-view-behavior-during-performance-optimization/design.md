## Context

Graph View uses G6 with a d3-force team-clustering layout. The target experience is interactive: users can drag nodes, connected nodes react through force behavior, hover emphasizes related context while dimming unrelated context, and the graph has visible settle/motion.

The previous performance change optimized too aggressively by using dense-graph branches to disable animation, skip hover activation, and reduce force-layout work. That reduced cost, but it changed the interaction model. This change redefines performance work as behavior-preserving only.

## Goals / Non-Goals

**Goals:**

- Restore the pre-performance behavior for node drag, linked force reaction, hover dim/focus, canvas animation, click selection, inspector, and quick detail.
- Keep behavior-safe optimizations that do not change the interaction model.
- Make the contract explicit so future performance changes cannot silently disable core Graph View behavior.

**Non-Goals:**

- Do not change the backend graph contract.
- Do not replace G6 or the d3-force team-clustering layout.
- Do not add new graph controls, filters, pagination, minimap, or clustering UI.
- Do not implement visual QA automation in this change.

## Decisions

### Restore behavior-affecting G6 configuration

The implementation should restore old interaction semantics first:

- Keep graph-level animation enabled.
- Keep auto-fit animation behavior unless reduced-motion handling explicitly says otherwise.
- Keep `hover-activate` attached for all graph sizes.
- Keep `BoundedDragElementForce` attached for all graph sizes.
- Keep force-layout alpha, decay, collide/link iterations, and velocity behavior equivalent to the previous working graph unless a measured change is proven not to affect drag/force interaction.

Alternative considered: keep dense-graph branches and tune thresholds. This is not acceptable because graph payload size should not decide whether core behavior exists.

### Keep only behavior-safe optimizations

Allowed optimizations:

- Reduce default label text budget where it does not remove hover/selected full-title reveal.
- Reduce default non-focused shadow/stroke cost if focused states remain visually clear.
- Optimize cluster inference from repeated edge scans to adjacency lookup.
- Batch or diff selection state if hover dim/focus, drag, animation, and force layout remain unchanged.

Disallowed optimizations:

- Disabling animation because the graph is dense.
- Disabling hover dim/focus because the graph is dense.
- Weakening force layout enough that node drag no longer produces linked force reaction.
- Removing drag behavior or replacing it with static position-only updates.

## Risks / Trade-offs

- Restoring behavior may bring back some performance cost. Mitigation: keep optimization focused on label and calculation paths rather than disabling interactions.
- Selection diffing can be safe but may not reproduce old selected-inactive dimming exactly. Mitigation: either preserve old batched selection behavior or verify diffing only changes performance, not visible behavior.
- Dense graphs may still lag after behavior-safe optimization. Mitigation: propose a separate UX-level change, such as label density controls or progressive rendering, instead of silently reducing core interaction behavior.
