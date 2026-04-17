"use client"

import { Shield, ShieldAlert, ShieldCheck, SquarePen } from "lucide-react"
import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { updateRolePermissions } from "@/app/api/roles/action"
import {
  groupPermissionsByResource,
  mergePermissionsWithLegacy,
  PermissionResponse,
  RoleResponse,
} from "@/app/lib/roles/definitions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface RoleListPageProps {
  roles: RoleResponse[]
  permissions: PermissionResponse[]
}

export function RoleListPage({ roles, permissions }: RoleListPageProps) {
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null)
  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState<string[]>([])

  const handleEditRole = (role: RoleResponse) => {
    setSelectedRole(role)
    setSelectedPermissionKeys((role.permissions ?? []).map((permission) => permission.key))
  }

  return (
    <>
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-muted">
              <TableHead className="font-semibold text-foreground">Role</TableHead>
              <TableHead className="font-semibold text-foreground">Key</TableHead>
              <TableHead className="font-semibold text-foreground">Description</TableHead>
              <TableHead className="text-center font-semibold text-foreground">
                Permissions
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <TableRow key={role.id} className="border-border transition-colors hover:bg-muted/40">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground">{role.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ID: {role.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      {role.key}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xl text-sm text-muted-foreground">
                    {role.description || "No description provided"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{role.permissions.length}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                      >
                        <SquarePen data-icon="inline-start" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-24">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Shield />
                      </EmptyMedia>
                      <EmptyTitle>No roles available</EmptyTitle>
                      <EmptyDescription>
                        Backend returned an empty role list, so there is nothing to manage yet.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <RolePermissionSheet
        role={selectedRole}
        permissions={permissions}
        selectedPermissionKeys={selectedPermissionKeys}
        onSelectedPermissionKeysChange={setSelectedPermissionKeys}
        open={selectedRole !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRole(null)
            setSelectedPermissionKeys([])
          }
        }}
      />
    </>
  )
}

interface RolePermissionSheetProps {
  role: RoleResponse | null
  permissions: PermissionResponse[]
  selectedPermissionKeys: string[]
  onSelectedPermissionKeysChange: (permissionKeys: string[]) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

function RolePermissionSheet({
  role,
  permissions,
  selectedPermissionKeys,
  onSelectedPermissionKeysChange,
  open,
  onOpenChange,
}: RolePermissionSheetProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const mergedPermissions = useMemo(() => {
    if (!role) {
      return permissions
    }

    return mergePermissionsWithLegacy(permissions, role.permissions ?? [])
  }, [permissions, role])

  const groupedPermissions = useMemo(
    () => groupPermissionsByResource(mergedPermissions),
    [mergedPermissions]
  )

  const legacyPermissionKeys = useMemo(() => {
    const availableKeys = new Set(permissions.map((permission) => permission.key))
    return (role?.permissions ?? [])
      .filter((permission) => !availableKeys.has(permission.key))
      .map((permission) => permission.key)
  }, [permissions, role])

  const hasChanges = useMemo(() => {
    if (!role) return false

    const initialKeys = [...(role.permissions ?? [])]
      .map((permission) => permission.key)
      .sort()
    const currentKeys = [...selectedPermissionKeys].sort()

    return initialKeys.join("|") !== currentKeys.join("|")
  }, [role, selectedPermissionKeys])

  const resetSelection = () => {
    onSelectedPermissionKeysChange(
      (role?.permissions ?? []).map((permission) => permission.key)
    )
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onOpenChange(false)
    }
  }

  const togglePermission = (permissionKey: string, checked: boolean) => {
    const nextKeys = (() => {
      if (checked) {
        return selectedPermissionKeys.includes(permissionKey)
          ? selectedPermissionKeys
          : [...selectedPermissionKeys, permissionKey]
      }

      return selectedPermissionKeys.filter((key) => key !== permissionKey)
    })()

    onSelectedPermissionKeysChange(nextKeys)
  }

  const handleSave = () => {
    if (!role) return

    const submissionKeys = Array.from(
      new Set([...selectedPermissionKeys, ...legacyPermissionKeys])
    ).sort()

    startTransition(async () => {
      const result = await updateRolePermissions(role.key, {
        permissionKeys: submissionKeys,
      })

      if (result.success) {
        toast.success(`Updated permissions for role "${role.name}"`)
        onOpenChange(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  const selectedCount = selectedPermissionKeys.length

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>{role?.name || "Role permissions"}</SheetTitle>
          <SheetDescription>
            {role?.description || "Review and update the permissions assigned to this role."}
          </SheetDescription>
          {role ? (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge variant="secondary" className="font-mono">
                {role.key}
              </Badge>
              <Badge variant="outline">{selectedCount} selected</Badge>
              {legacyPermissionKeys.length > 0 ? (
                <Badge variant="outline" className="gap-1 text-amber-700">
                  <ShieldAlert className="size-3.5" />
                  {legacyPermissionKeys.length} legacy
                </Badge>
              ) : null}
            </div>
          ) : null}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex flex-col gap-6">
            {groupedPermissions.map((group) => (
              <section key={group.key} className="rounded-lg border border-border bg-card">
                <div className="border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    {group.key === "legacy" ? (
                      <ShieldAlert className="size-4 text-amber-600" />
                    ) : (
                      <ShieldCheck className="size-4 text-primary" />
                    )}
                    <h3 className="font-medium text-foreground">{group.title}</h3>
                    <Badge variant="outline">{group.permissions.length}</Badge>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {group.permissions.map((permission) => {
                    const checked = selectedPermissionKeys.includes(permission.key)
                    const isLegacy = group.key === "legacy"

                    return (
                      <label
                        key={permission.key}
                        className="flex items-start justify-between gap-4 px-4 py-3 hover:bg-muted/30"
                      >
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="font-medium text-foreground">
                            {permission.name || permission.key}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {permission.key}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {permission.description ||
                              (isLegacy
                                ? "Permission is not returned by /permissions and will be preserved on submit."
                                : "No description provided")}
                          </span>
                        </div>
                        <Switch
                          checked={checked}
                          disabled={isLegacy}
                          onCheckedChange={(nextChecked) => {
                            if (!isLegacy) {
                              togglePermission(permission.key, nextChecked)
                            }
                          }}
                          aria-label={`Toggle permission ${permission.key}`}
                        />
                      </label>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>

        <SheetFooter className="border-t">
          <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="outline" onClick={resetSelection} disabled={!role || isPending}>
            Reset
          </Button>
          <Button type="button" onClick={handleSave} disabled={!role || !hasChanges || isPending}>
            {isPending ? <Spinner className="size-4" /> : null}
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
