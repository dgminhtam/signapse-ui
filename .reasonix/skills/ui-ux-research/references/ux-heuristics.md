# UX Heuristics

Use this checklist to audit an existing screen or stress-test a proposed direction.

## Orientation And Status

Check:
- Can users tell where they are and what this page is for within a few seconds?
- Are page title, subtitle, and primary action obvious?
- Are loading, empty, success, and error states visible and understandable?

Common fixes:
- strengthen the page heading and supporting description
- make the primary action visually dominant
- replace vague placeholders with explicit state messaging

## Information Hierarchy

Check:
- Does the layout guide attention from most important to least important?
- Is dense information grouped into meaningful chunks?
- Do labels, metadata, and actions compete with the main content?

Common fixes:
- simplify the top section
- reduce visual competition
- move secondary actions out of the primary reading path

## Navigation And Wayfinding

Check:
- Can users move between list, detail, and editing states without confusion?
- Do filters, tabs, and breadcrumbs match the user's mental model?
- Is "back" behavior predictable?

Common fixes:
- clarify parent-child relationships
- reduce tab overlap
- keep navigation terms consistent across list and detail views

## Forms And Input Effort

Check:
- Is the form asking only for required information?
- Are labels clear before the user types?
- Are validation, pending, and success states easy to understand?
- Is cancel or reset safe and obvious?

Common fixes:
- cut unnecessary fields
- group related inputs
- surface helper text before failure happens
- reduce hidden validation surprises

## Tables, Lists, And Search

Check:
- Can users scan the list quickly?
- Are sort, filter, search, and row actions easy to find?
- Is density appropriate for the task and device?

Common fixes:
- improve column priority
- move destructive actions behind clearer affordances
- tighten repetitive metadata
- give search and filters a clearer hierarchy

## Safety And Reversibility

Check:
- Are destructive actions visually distinct and confirmed?
- Does the interface warn clearly when a change cannot be undone?
- Are risky actions separated from routine actions?

Common fixes:
- require confirmation for destructive operations
- separate dangerous actions from everyday actions
- explain consequences in plain language

## Accessibility And Readability

Check:
- Is color the only signal for meaning?
- Is contrast strong enough for dense data?
- Is the reading order clear for keyboard and screen-reader users?
- Are hit targets and spacing usable on smaller screens?

Common fixes:
- add text labels or icons with meaning
- increase contrast and spacing where needed
- improve focus order and semantic grouping

## Responsive Behavior

Check:
- Which information must remain visible on mobile?
- What can collapse, wrap, or move below the fold safely?
- Does the desktop layout still feel intentional at tablet widths?

Common fixes:
- keep the primary task visible first
- collapse low-priority metadata
- replace wide tables with stacked summaries only when scanability stays acceptable
