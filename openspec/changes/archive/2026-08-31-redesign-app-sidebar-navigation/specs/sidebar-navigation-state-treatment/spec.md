## REMOVED Requirements

### Requirement: Sidebar active item uses accent-based treatment

**Reason**: Superseded by the accepted neutral selected-surface contract in `sidebar-selected-surface-treatment`.
**Migration**: Direct and child current-page items use `sidebar-primary` and `sidebar-primary-foreground` with normal text weight.

### Requirement: Sidebar hover remains lightweight

**Reason**: The authoritative hover and selected-state behavior is consolidated into `sidebar-navigation-hierarchy` and `sidebar-selected-surface-treatment`.
**Migration**: Inactive hover continues to use `sidebar-accent`; no runtime compatibility path is required.

### Requirement: Sidebar expanded parent has no background state

**Reason**: The parent disclosure contract is consolidated into `sidebar-navigation-hierarchy` alongside the new expanded and collapsed grouped-navigation behavior.
**Migration**: Expanded parents continue using chevron-only disclosure without background state.

### Requirement: Parent with active child remains contextual

**Reason**: The parent-versus-current-child contract is consolidated into the hierarchy and selected-surface capabilities.
**Migration**: Parents stay visually quiet while the current child uses the selected surface.

### Requirement: Sidebar active treatment avoids global token changes

**Reason**: Token constraints are already authoritative in `sidebar-selected-surface-treatment` and no longer need a competing accent-only capability.
**Migration**: Keep existing sidebar namespace tokens and do not introduce custom active tokens.
