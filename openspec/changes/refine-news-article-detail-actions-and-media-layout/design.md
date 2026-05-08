## Context

The news article detail page has been refined into a review-first page, but two layout issues remain in the first viewport. The action buttons form an uneven two-row cluster on the right side of the title, and the feature image appears as a detached sidebar without a section label. The page needs a calmer command model and a more balanced summary/media composition while preserving fast access to the primary event derivation task.

## Goals / Non-Goals

**Goals:**

- Keep the primary event derivation action visible and shorten its label to `Suy diễn sự kiện`.
- Move secondary actions into a compact `Hành động` dropdown beside the primary action.
- Preserve current action behavior, pending feedback, permissions, link target behavior, and delete confirmation.
- Give the feature image a `Hình ảnh bài viết` heading that visually matches `Mô tả`.
- Render `Mô tả` and `Hình ảnh bài viết` as balanced desktop columns with equal-height surfaces.
- Keep mobile behavior readable by stacking summary sections.

**Non-Goals:**

- Do not remove the primary event derivation action from the header.
- Do not turn the image into a hero/banner or make it compete with linked event review.
- Do not add new backend actions, routes, permissions, or dependencies.
- Do not modify shadcn primitives in `components/ui`.
- Do not redesign the linked event card or article content section beyond spacing needed for the new top layout.

## Decisions

- Use a two-part header command area: visible primary button plus secondary dropdown. A single dropdown for all actions would make the header very clean but hide the most important workflow. Keeping `Suy diễn sự kiện` visible preserves speed while the dropdown removes visual clutter from less frequent actions.

- Implement the dropdown with shadcn `DropdownMenu`. Menu items must be grouped with `DropdownMenuGroup`; destructive delete should be separated from routine actions, retain destructive styling, and still open the existing `AlertDialog` confirmation before mutation.

- Prefer a local client component for the dropdown if composition with existing client action buttons becomes awkward. The server page can continue rendering the title and summary data while delegating menu interaction to a small client component that receives the article id, title, and url.

- Shorten the primary button's visible text to `Suy diễn sự kiện`; keep clearer accessibility text or tooltip copy such as `Suy diễn sự kiện chính từ bài viết` if needed. Pending text can remain `Đang suy diễn...`.

- Structure the summary/media area as a desktop grid with two named sections. The left column is `Mô tả`, the right column is `Hình ảnh bài viết`; both section bodies should stretch to the same height on desktop. On mobile, `Mô tả` appears first and `Hình ảnh bài viết` follows.

- Keep the image as supporting recognition media. Use aspect-ratio, object-cover, and stable dimensions, but avoid oversized hero treatment. If an article has no image, the description should not reserve an empty image column unless a meaningful empty image state is intentionally added.

- Update the skeleton to mirror the new primary button plus dropdown and the two labeled summary/media sections so loading does not shift into a different structure.

## Risks / Trade-offs

- Hiding reload/open/delete inside a dropdown adds one click for secondary actions. Mitigation: these are less frequent than event derivation and remain discoverable under the clear `Hành động` label.
- Delete inside a dropdown can be easy to trigger accidentally if treated like a normal menu item. Mitigation: separate it visually, use destructive styling, and keep `AlertDialog`.
- Equal-height description and image surfaces can create empty space when the description is very short. Mitigation: this is acceptable for a summary panel, but cap the image/row height to avoid an exaggerated blank area.
- A local client menu component could duplicate action logic. Mitigation: reuse existing server actions and toast patterns where practical; keep the component limited to this detail header.
