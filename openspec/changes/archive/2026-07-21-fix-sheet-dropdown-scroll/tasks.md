## 1. Portal Container Composition

- [x] 1.1 Add a nullable overlay portal-container context with provider and consumer access.
- [x] 1.2 Make `SheetContent` provide its mounted content element while preserving any caller-provided ref and existing modal behavior.
- [x] 1.3 Make `DropdownMenuContent` portal into the nearest provided container and fall back to Radix's default portal when none exists.

## 2. Verification

- [x] 2.1 Run focused lint and repository typecheck for the shared UI changes.
- [x] 2.2 Run strict OpenSpec validation and static checks confirming the Insert menu retains its existing maximum height/native overflow and no `ScrollArea` or non-modal workaround was added.
