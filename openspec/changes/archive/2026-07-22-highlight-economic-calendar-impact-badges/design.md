## Context

The economic calendar list already classifies impact values case-insensitively, but its built-in badge variants remain too close visually in the dense table. The shared label helper returns raw backend text, so values such as `High`, `Medium`, and `Low` are neither localized nor consistently uppercase. Repository policy permits categorical color classes only on `Badge`, using a fixed set of palettes.

## Goals / Non-Goals

**Goals:**

- Make high, medium, and low impact immediately distinguishable in the list.
- Translate normalized impact values through the existing dictionaries and render uppercase labels.
- Preserve neutral handling for missing and unknown values.
- Reuse the existing Badge component and approved palettes.
- Remove the low-value status column from the list and skeleton.

**Non-Goals:**

- No backend, DTO, filtering, sorting, table-layout, or global theme changes.
- No new component, dependency, generic color system, or impact-level abstraction.
- No change to status data, status presentation on the detail page, or economic calendar detail-page chrome.

## Decisions

### Use approved categorical Badge palettes

The list maps high impact to the allowed red palette, medium to purple, and low to sky. Missing or unknown impact keeps the built-in `outline` variant. These three palettes are visually distinct in light and dark themes and comply with the repository's Badge-only color exception.

Alternative considered: keep `destructive`, `default`, and `secondary`. That is the current direction and does not provide enough category separation in this table.

### Localize in the shared label helper

The existing shared impact-label helper will normalize the backend value with trimming and case-insensitive matching, then return an uppercase dictionary label for high, medium, low, unknown, or missing impact. This keeps list and detail labels consistent without duplicating translation logic in components.

Alternative considered: apply CSS `uppercase` in the list. That would change presentation without translating raw backend values and would leave the detail page inconsistent.

### Keep styling local to the list

Only the list badge needs the stronger category colors requested here. The detail page continues using its existing badge variant while receiving the corrected shared localized label.

Alternative considered: apply the same categorical classes everywhere. That expands the visual change beyond the reported list problem without a demonstrated need.

### Remove status from the list only

The list removes the status header, row badge, local status-variant helper, and matching skeleton cells. All table-wide and expanded-row column spans shrink by one. Status remains in the DTO and detail page because only the list column is out of scope.

Alternative considered: keep the column with weaker styling. The user does not need this field while scanning the list, so retaining it still spends horizontal space without adding decision value.

## Risks / Trade-offs

- [Unexpected backend impact text maps to unknown] → Keep the current case-insensitive `HIGH`, `MEDIUM`, and `LOW` substring recognition; use the localized unknown label otherwise.
- [Uppercase Vietnamese labels become wider] → Keep the existing badge and impact-column layout and verify the affected files with lint and typecheck.
- [Raw palette drift] → Use only the exact red, purple, and sky Badge palettes permitted by repository policy.
- [Removed cells leave table rows misaligned] → Update live, empty, current-time, expanded-detail, and skeleton column spans together.
