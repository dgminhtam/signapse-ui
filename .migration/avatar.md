# avatar

2026-08-18 — official Base Nova registry wrapper via shadcn CLI dry-run/diff; verdict: migrated and typechecked.

## Changed

- Replaced the Radix Avatar primitive with the official Base Nova `@base-ui/react/avatar` parts.
- Updated root, image, and fallback props to the Base UI component contracts.
- Preserved the app-specific `AvatarBadge`, `AvatarGroup`, and `AvatarGroupCount` composition helpers.
- Leftover Radix import scan: no direct Radix import remains in `components/ui/avatar.tsx`.

## Left alone

- Nova sizing, fallback, image, badge, and avatar-group classes.
- Sidebar, user-list, and account-profile consumers.

## Behavior changes

- None intended. Base UI supplies the same root/image/fallback composition with the existing visual extension retained.

## Verify by hand

- Confirm loaded and fallback avatars render in the sidebar, user list, and account form.
- Confirm custom sizes, rounded overrides, and avatar group/badge composition remain intact.
