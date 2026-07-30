## REMOVED Requirements

### Requirement: Expanded row alignment
**Reason**: Economic Calendar list rows no longer expand supporting-content rows after `contentAvailable` and detail `content` were removed from the backend contract.

**Migration**: Calculate merged time and currency/region row spans from event rows only; remove expansion-aware visible-row helpers and support-row layout.
