---
name: ui-ux-research
description: Research product context, benchmark UI and UX patterns, analyze recent design trends, and turn findings into a grounded interface direction. Use when Codex needs to plan or review a screen, dashboard, workflow, or component before implementation; diagnose UX issues; compare competitors or references; synthesize current UI trends; or explain why a proposed design fits a specific audience, task, and constraint set.
---

# UI/UX Research

## Overview

Use this skill to avoid jumping straight from vague requirements to polished visuals. Start with the user task, product risk, data density, and interaction constraints, then use research to justify the design direction.

## Quick Start

1. Identify the job:
   - plan a new screen or flow
   - redesign an existing screen
   - audit an experience that feels confusing or weak
   - benchmark current patterns or trends before designing
2. Read [references/research-playbook.md](references/research-playbook.md) to choose research depth and source quality.
3. Read [references/ux-heuristics.md](references/ux-heuristics.md) when evaluating usability, hierarchy, workflows, forms, lists, tables, or dense dashboards.
4. Read [references/output-blueprints.md](references/output-blueprints.md) before writing the recommendation so the output stays concrete and implementation-friendly.

## Follow These Rules

- Separate timeless UX principles from temporary visual trends.
- Treat trends as signals, not instructions. Explain what to borrow, adapt, or avoid.
- Browse the web when the request depends on current trends, recent launches, competitor research, or "latest" references. Cite concrete sources and dates.
- Prefer first-party products, official design systems, public product pages, launch posts, and reputable case studies over vague inspiration galleries.
- Infer the minimum missing context when needed: audience, task frequency, information density, error cost, trust requirements, and device context.
- Optimize Signapse-style admin surfaces for clarity, scanability, fast decision-making, and professional Vietnamese UI copy. Novelty must never reduce comprehension.
- Pair this skill with `$frontend-design` when moving from research into implementation, and with `$accessibility` when the request involves audits or interaction quality.

## Run The Workflow

### 1. Frame The Design Problem

Gather or infer:
- business goal
- primary users
- core tasks
- success signals
- high-risk actions
- constraints from brand, stack, existing patterns, device mix, or deadlines

Write assumptions explicitly when information is missing, then continue unless a missing answer would meaningfully change the direction.

### 2. Choose Research Depth

Use a quick scan for small UI decisions, a benchmark review for screen or flow redesign, and a deep audit for complex workflows or failing experiences. Use [references/research-playbook.md](references/research-playbook.md) to decide what each depth should produce.

### 3. Gather Evidence

Collect 3-5 relevant references instead of a random gallery. For each one, capture:
- what problem the screen or product is solving
- the pattern, interaction, or treatment worth noting
- why it fits or does not fit this case
- what to adapt instead of copying verbatim

When browsing for current trends, call out exact dates so freshness is obvious.

### 4. Evaluate UX Quality

Use [references/ux-heuristics.md](references/ux-heuristics.md) to stress-test:
- information hierarchy
- navigation and wayfinding
- form effort and validation
- table and list scanability
- state handling for empty, loading, error, and success states
- safety around destructive or irreversible actions
- accessibility and readability

### 5. Recommend A Direction

Produce one recommended direction and add one alternative only when the trade-offs are meaningful. Include:
- a design thesis in 1-2 sentences
- layout structure
- visual tone
- key interaction patterns
- rationale tied to user tasks
- risks and mitigation
- implementation notes when the repo or stack matters

## Shape The Output

Default to a compact, decision-ready artifact rather than an essay. Use [references/output-blueprints.md](references/output-blueprints.md).

Unless the user asks for something else, structure the response as:
- context snapshot
- research signals
- UX findings
- recommended direction
- wireframe notes
- implementation guardrails

## Avoid

- Jumping straight to colors and typography without understanding the task.
- Using trend names as a substitute for reasoning.
- Copying a competitor layout without adapting it to the product's information model.
- Recommending motion, density, or novelty that harms speed, trust, or readability.
- Giving generic advice like "clean it up" or "improve hierarchy" without specific changes.
