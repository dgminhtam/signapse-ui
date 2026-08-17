"use client"

import {
  ChevronDown,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  useCallback,
  useDeferredValue,
  useMemo,
  useState,
  useTransition,
} from "react"
import { toast } from "sonner"

import { updateRolePermissions } from "@/app/api/roles/action"
import { useLocalization } from "@/app/lib/i18n/provider"
import {
  groupPermissionsByResource,
  mergePermissionsWithLegacy,
  PermissionResponse,
  RoleResponse,
} from "@/app/lib/roles/definitions"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"

interface RolePermissionDialogProps {
  role: RoleResponse | null
  permissions: PermissionResponse[]
  selectedPermissionKeys: string[]
  onSelectedPermissionKeysChange: (permissionKeys: string[]) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RolePermissionDialog({
  role,
  permissions,
  selectedPermissionKeys,
  onSelectedPermissionKeysChange,
  open,
  onOpenChange,
}: RolePermissionDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState("")
  const [legacyOpen, setLegacyOpen] = useState(false)
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const { dictionary, formatMessage, formatNumber } = useLocalization()
  const t = dictionary.roles
  const formatCount = useCallback(
    (value: number) => formatNumber(value),
    [formatNumber]
  )

  const mergedPermissions = useMemo(() => {
    if (!role) {
      return permissions
    }

    return mergePermissionsWithLegacy(permissions, role.permissions ?? [])
  }, [permissions, role])

  const groupedPermissions = useMemo(
    () => groupPermissionsByResource(mergedPermissions, dictionary),
    [dictionary, mergedPermissions]
  )

  const legacyPermissionKeys = useMemo(() => {
    const availableKeys = new Set(
      permissions.map((permission) => permission.key)
    )

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

  const normalizedQuery = deferredSearchQuery.trim().toLowerCase()

  const matchesPermission = useCallback(
    (permission: PermissionResponse) => {
      if (!normalizedQuery) return true

      const haystack = [
        permission.name || "",
        permission.key,
        permission.description || "",
      ]
        .join(" ")
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    },
    [normalizedQuery]
  )

  const legacyPermissions = useMemo(
    () =>
      groupedPermissions.find((group) => group.key === "legacy")?.permissions ??
      [],
    [groupedPermissions]
  )

  const standardGroups = useMemo(() => {
    return groupedPermissions
      .filter((group) => group.key !== "legacy")
      .map((group) => ({
        ...group,
        permissions: group.permissions.filter(matchesPermission),
      }))
      .filter((group) => group.permissions.length > 0)
  }, [groupedPermissions, matchesPermission])

  const visibleLegacyPermissions = useMemo(
    () => legacyPermissions.filter(matchesPermission),
    [legacyPermissions, matchesPermission]
  )

  const selectedCount = useMemo(
    () => new Set(selectedPermissionKeys).size,
    [selectedPermissionKeys]
  )

  const standardPermissionCount = permissions.length
  const hasVisibleStandardPermissions = standardGroups.length > 0
  const hasVisibleLegacyPermissions = visibleLegacyPermissions.length > 0
  const shouldShowEmptyState =
    !hasVisibleStandardPermissions && !hasVisibleLegacyPermissions

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSearchQuery("")
      setLegacyOpen(false)
      onOpenChange(false)
    }
  }

  const resetSelection = () => {
    onSelectedPermissionKeysChange(
      (role?.permissions ?? []).map((permission) => permission.key)
    )
  }

  const updateSelection = (permissionKeys: string[], checked: boolean) => {
    const nextKeys = new Set(selectedPermissionKeys)

    for (const permissionKey of permissionKeys) {
      if (checked) {
        nextKeys.add(permissionKey)
      } else {
        nextKeys.delete(permissionKey)
      }
    }

    onSelectedPermissionKeysChange(Array.from(nextKeys))
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
        toast.success(formatMessage(t.updateSuccess, { role: role.name }))
        onOpenChange(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden sm:max-w-[960px]">
        <DialogHeader>
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                {role?.key || t.defaultRoleKey}
              </Badge>
              <Badge variant="outline">
                {formatMessage(t.selectedPermissions, {
                  count: formatCount(selectedCount),
                })}
              </Badge>
              {legacyPermissionKeys.length > 0 ? (
                <Badge variant="outline" className="gap-1">
                  <ShieldAlert data-icon="inline-start" />
                  {formatMessage(t.legacyPermissions, {
                    count: formatCount(legacyPermissionKeys.length),
                  })}
                </Badge>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <DialogTitle>{role?.name || t.dialogTitle}</DialogTitle>
              <DialogDescription className="max-w-3xl">
                {role?.description || t.dialogDescription}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label={t.searchLabel}
                placeholder={t.searchPlaceholder}
                className="pl-9"
                autoFocus
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <Badge variant="outline">
                {formatMessage(t.catalogCount, {
                  count: formatCount(standardPermissionCount),
                })}
              </Badge>
              <Badge variant="outline">
                {formatMessage(t.visibleGroupCount, {
                  count: formatCount(
                    hasVisibleStandardPermissions ? standardGroups.length : 0
                  ),
                })}
              </Badge>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5">
            {hasVisibleStandardPermissions
              ? standardGroups.map((group) => {
                  const visiblePermissionKeys = group.permissions.map(
                    (permission) => permission.key
                  )
                  const selectedInGroup = visiblePermissionKeys.filter(
                    (permissionKey) =>
                      selectedPermissionKeys.includes(permissionKey)
                  ).length
                  const allSelected =
                    visiblePermissionKeys.length > 0 &&
                    selectedInGroup === visiblePermissionKeys.length

                  return (
                    <section
                      key={group.key}
                      className="overflow-hidden rounded-xl border bg-card shadow-xs"
                    >
                      <div className="flex flex-col gap-3 border-b bg-muted/30 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="rounded-md bg-primary/10 p-2 text-primary">
                              <ShieldCheck />
                            </div>
                            <div className="flex flex-col gap-1">
                              <h3 className="font-medium text-foreground">
                                {group.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {formatMessage(t.selectedInGroup, {
                                  selected: formatCount(selectedInGroup),
                                  total: formatCount(group.permissions.length),
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">
                            {formatMessage(t.permissionCount, {
                              count: formatCount(group.permissions.length),
                            })}
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={isPending || allSelected}
                            onClick={() =>
                              updateSelection(visiblePermissionKeys, true)
                            }
                          >
                            {t.selectAll}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isPending || selectedInGroup === 0}
                            onClick={() =>
                              updateSelection(visiblePermissionKeys, false)
                            }
                          >
                            {t.deselectAll}
                          </Button>
                        </div>
                      </div>

                      <div className="divide-y">
                        {group.permissions.map((permission) => {
                          const checked = selectedPermissionKeys.includes(
                            permission.key
                          )

                          return (
                            <label
                              key={permission.key}
                              className={cn(
                                "flex items-start justify-between gap-4 px-4 py-4 transition-colors hover:bg-muted/20",
                                checked && "bg-accent/35"
                              )}
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
                                    t.permissionNoDescription}
                                </span>
                              </div>

                              <Switch
                                checked={checked}
                                disabled={isPending}
                                onCheckedChange={(nextChecked) =>
                                  updateSelection([permission.key], nextChecked)
                                }
                                aria-label={formatMessage(t.togglePermission, {
                                  permission: permission.key,
                                })}
                              />
                            </label>
                          )
                        })}
                      </div>
                    </section>
                  )
                })
              : null}

            {shouldShowEmptyState ? (
              <Empty className="min-h-[280px] border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Search />
                  </EmptyMedia>
                  <EmptyTitle>
                    {normalizedQuery
                      ? t.noMatchesTitle
                      : t.emptyPermissionsTitle}
                  </EmptyTitle>
                  <EmptyDescription>
                    {normalizedQuery
                      ? t.noMatchesDescription
                      : t.emptyPermissionsDescription}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : null}

            {legacyPermissionKeys.length > 0 && hasVisibleLegacyPermissions ? (
              <Collapsible
                open={normalizedQuery ? true : legacyOpen}
                onOpenChange={setLegacyOpen}
              >
                <div className="overflow-hidden rounded-xl border border-amber-200/70 bg-amber-50/40">
                  <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="rounded-md bg-amber-100 p-2 text-amber-700">
                        <ShieldAlert />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="font-medium text-foreground">
                          {t.legacyTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t.legacyDescription}
                        </p>
                      </div>
                    </div>

                    <CollapsibleTrigger
                      render={
                        <Button type="button" variant="ghost" size="sm">
                          <ChevronDown
                            data-icon="inline-end"
                            className={cn(
                              "transition-transform",
                              (normalizedQuery ? true : legacyOpen) &&
                                "rotate-180"
                            )}
                          />
                          {normalizedQuery ? t.legacySearchOpen : t.viewDetails}
                        </Button>
                      }
                    />
                  </div>

                  <CollapsibleContent>
                    <Separator />
                    <div className="divide-y">
                      {visibleLegacyPermissions.map((permission) => (
                        <div
                          key={permission.key}
                          className="flex items-start justify-between gap-4 px-4 py-4"
                        >
                          <div className="flex min-w-0 flex-col gap-1">
                            <span className="font-medium text-foreground">
                              {permission.name || permission.key}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {permission.key}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {permission.description || t.legacyPreserved}
                            </span>
                          </div>
                          <Badge variant="outline">{t.readOnly}</Badge>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ) : null}

            {hasVisibleStandardPermissions &&
            legacyPermissionKeys.length === 0 ? (
              <div className="rounded-xl border border-dashed bg-muted/15 px-4 py-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 shrink-0 text-primary" />
                  <span>{t.tip}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {hasChanges ? t.unsavedChanges : t.noChanges}
        </p>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="ghost" />}>
            {dictionary.common.cancel}
          </DialogClose>
          <Button
            type="button"
            variant="outline"
            onClick={resetSelection}
            disabled={!role || isPending}
          >
            {t.reset}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!role || !hasChanges || isPending}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            {t.saveChanges}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
