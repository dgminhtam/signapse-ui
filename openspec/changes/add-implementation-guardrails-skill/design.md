## Context

The repository already uses `AGENTS.md` as the active repo-wide instruction source and keeps reusable task knowledge in `.codex/skills`. The analyzed `andrej-karpathy-skills-main` folder provides useful behavioral guidance, but it is packaged for Claude/Cursor and overlaps with existing Codex and Signapse rules.

This change should improve day-to-day implementation quality without introducing another broad always-on rule set. The key constraints are to keep `AGENTS.md` concise, preserve Signapse-specific rules as the source of truth, and make the detailed guardrail callable only when helpful.

## Goals / Non-Goals

**Goals:**

- Add a compact implementation guardrail reminder to `AGENTS.md`.
- Add a dedicated Codex skill that can be invoked for non-trivial implementation, bugfix, refactor, and review work.
- Adapt the useful principles from `andrej-karpathy-skills-main` into Signapse wording and workflows.
- Make the skill reinforce existing rules instead of replacing them.

**Non-Goals:**

- Do not import Claude plugin, Cursor rule, marketplace metadata, or the full examples document.
- Do not add a new runtime dependency or application feature.
- Do not make the new guardrail an always-on Cursor rule.
- Do not broaden the scope into unrelated skill cleanup.

## Decisions

- Use `implementation-guardrails` as the skill name.
  - Rationale: The name describes the behavior directly and avoids tying the workflow to a vendor/personality-specific source.
  - Alternative considered: `karpathy-guidelines`, rejected because it is less Signapse-specific and implies a direct copy of the external folder.

- Keep `AGENTS.md` changes short and high-signal.
  - Rationale: `AGENTS.md` is already long and repo-wide; adding a compact reminder is safer than duplicating the full guideline.
  - Alternative considered: Moving the full guidance into `AGENTS.md`, rejected because it would increase instruction noise.

- Put the detailed workflow in `.codex/skills/implementation-guardrails/SKILL.md`.
  - Rationale: Skills are the repo convention for reusable task workflows and can be called explicitly at any time.
  - Alternative considered: Modifying `openspec-apply-change`, rejected because the guardrail is useful outside OpenSpec implementation.

- Phrase the skill as subordinate to `AGENTS.md`, OpenSpec instructions, and explicit user requests.
  - Rationale: The new guidance should reduce mistakes without overriding active project constraints.
  - Alternative considered: Making the skill prescriptive in all cases, rejected because it could slow down simple tasks.

## Risks / Trade-offs

- Duplicated guidance could make agent behavior noisy -> Keep `AGENTS.md` additions brief and place detailed guidance only in the skill.
- The skill could become too cautious -> Explicitly instruct it to make reasonable assumptions and ask only for risky ambiguity.
- The skill may be forgotten unless invoked -> Add a clear `description` in skill frontmatter so Codex can select it for coding, refactor, and review tasks.
- Imported external wording could conflict with Signapse rules -> Rewrite the guidance in repo-specific terms instead of copying wholesale.
