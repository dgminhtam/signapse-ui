## Why

The new Financial Command Surface quick-detail rules define a consistent local reading experience, but the current entity overlay still uses one generic bottom drawer with incomplete geometry, focus, recovery, and session behavior. Aligning the implementation now makes Dashboard, Graph View, and Market Charts conform to the same approved policy without changing canonical detail routes or shared wrapper chrome.

## What Changes

- Resolve Signapse entity quick detail from owner, entity profile, and effective CSS viewport so each approved surface receives the documented side-sheet or bottom-sheet geometry.
- Complete the local modal contract: a localized sticky header, visible Close control, canonical escalation action, one scroll region, controlled focus entry/return, reduced-motion behavior, and stable placement during resize or zoom.
- Model one immutable detail snapshot per opening with profile-matched loading, missing, error, denied, and retry states.
- Preserve Event inspection limits and Article reader readability while retaining canonical cross-entity navigation and original-source provenance.
- Restore the originating Market Charts annotation context before focus returns when its Event inspection drawer closes.
- Add localization and behavior-focused automated coverage for the resolver, lifecycle, responsive geometry, and fullscreen containment.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `workspace-local-quick-detail-overlays`: Clarify approved owner/profile availability, canonical-action recovery states, opening-session lifecycle, and canonical Back behavior for the shared local quick-detail policy.
- `market-chart-event-drawer-linking`: Replace the terminal annotation-popup close behavior with restoration of the originating annotation context and trigger focus after Market Charts Event inspection closes.

## Impact

- Affected UI: the local entity quick-detail composition; Dashboard, Graph View, and Market Charts owner adapters; Event inspection and Article reader content; localized dictionaries.
- Affected behavior: responsive placement, modal accessibility, loading/recovery semantics, fullscreen Market Charts containment, and focus restoration.
- APIs, backend contracts, canonical routes, dependencies, and shared Base UI wrapper contracts remain unchanged.
