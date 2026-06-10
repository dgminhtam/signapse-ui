---
name: implementation-guardrails
description: Use when implementing, fixing, refactoring, reviewing, applying OpenSpec changes, or doing scope-sensitive cleanup in Signapse to keep changes simple, surgical, and verifiable.
---

# Implementation Guardrails

Use this skill as a lightweight quality gate for non-trivial implementation, bugfix, refactor, review, OpenSpec apply, or cleanup work where scope control matters.

## Authority

- `AGENTS.md`, active OpenSpec instructions, and explicit user requests take precedence over this skill.
- This skill reinforces Signapse workflow rules; it does not replace feature-specific skills such as `next-best-practices`, `shadcn`, `frontend-design`, or API mapping guidance.
- In Default mode, make reasonable assumptions and proceed. Ask only when ambiguity creates meaningful product, data, security, or architectural risk.

## Workflow

1. Lock scope before editing:
- Restate the concrete goal in one or two sentences.
- Name assumptions only when they affect implementation choices.
- Identify non-goals so cleanup and refactor work do not drift.
- Define what "done" means, including expected verification.

2. Prefer the smallest sufficient solution:
- Use existing patterns before adding new abstractions.
- Do not add speculative options, fallback systems, configuration, or generic helpers for a single use case.
- If a simpler approach satisfies the requirement, choose it and mention larger alternatives only when they matter.

3. Make surgical changes:
- Every touched file should trace back to the task.
- Preserve nearby style, naming, layout, and error-handling conventions.
- Clean up imports, types, and local dead code created by the current change.
- Mention unrelated problems instead of fixing them unless the user asks.

4. Verify with intent:
- Run the narrowest useful checks first, then broader checks when the change warrants it.
- Prefer repo commands such as `/lint`, `/typecheck`, or targeted tests when available.
- If verification cannot run, report the blocker and the remaining risk clearly.

5. Communicate outcomes:
- Summarize what changed at the behavior or workflow level, not as a long file-by-file changelog.
- Call out assumptions, skipped checks, and follow-up risks.
- Keep final responses concise unless the user asks for deeper detail.

## Quick Checklist

- Scope is clear and bounded.
- The implementation is no more general than the requirement.
- Changes are limited to files that matter.
- Existing Signapse conventions are preserved.
- Verification is completed or the reason it was skipped is explicit.
