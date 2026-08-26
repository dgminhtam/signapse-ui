---
status: superseded by ADR-0008
---

# Use record capabilities for feedback actions

Feedback permissions establish whether an account may perform a class of moderation operation, but they do not establish whether a particular submission is currently eligible for that operation. The feedback contract will expose record-specific capabilities for withdraw, promote, dismiss, and administrative deletion; the frontend will require both the relevant permission and capability and will not infer lifecycle transitions from status. This adds fields to the backend contract, but avoids duplicating undocumented lifecycle rules in the UI and lets those rules evolve without a frontend release.
