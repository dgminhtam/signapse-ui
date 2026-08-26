---
status: accepted
---

# Derive feedback actions from status and permission

The feedback backend does not expose record capability flags. The frontend will derive withdrawal and review affordances from `PENDING_REVIEW` plus action scope and canonical permissions, while administrative deletion depends only on `feedback:delete`; these values control presentation only, and the backend remains authoritative for concurrent `404` or lifecycle `409` outcomes. This supersedes ADR-0006 and accepts a small duplicated lifecycle rule because it matches the confirmed runtime contract without requiring a backend schema change.
