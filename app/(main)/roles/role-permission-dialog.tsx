"use client"

import { Dialog as DialogPrimitive } from "radix-ui"
import {
  ChevronDown,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  XIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

import { updateRolePermissions } from "@/app/api/roles/action"
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

  useEffect(() => {
    if (!open) return

    setSearchQuery("")
    setLegacyOpen(false)
  }, [open, role?.id])

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

  const normalizedQuery = deferredSearchQuery.trim().toLowerCase()

  const matchesPermission = (permission: PermissionResponse) => {
    if (!normalizedQuery) return true

    const haystack = [permission.name || "", permission.key, permission.description || ""]
      .join(" ")
      .toLowerCase()

    return haystack.includes(normalizedQuery)
  }

  const legacyPermissions =
    groupedPermissions.find((group) => group.key === "legacy")?.permissions ?? []

  const standardGroups = useMemo(() => {
    return groupedPermissions
      .filter((group) => group.key !== "legacy")
      .map((group) => ({
        ...group,
        permissions: group.permissions.filter(matchesPermission),
      }))
      .filter((group) => group.permissions.length > 0)
  }, [groupedPermissions, normalizedQuery])

  const visibleLegacyPermissions = useMemo(
    () => legacyPermissions.filter(matchesPermission),
    [legacyPermissions, normalizedQuery]
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
      onOpenChange(false)
    }
  }

  const resetSelection = () => {
    onSelectedPermissionKeysChange((role?.permissions ?? []).map((permission) => permission.key))
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
        toast.success(`Đã cập nhật quyền cho vai trò "${role.name}"`)
        onOpenChange(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleDialogOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/15 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 flex w-[min(960px,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border bg-background shadow-2xl data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
          <div className="flex items-start justify-between gap-4 border-b bg-muted/30 px-6 py-5">
            <div className="flex min-w-0 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-mono">
                  {role?.key || "role"}
                </Badge>
                <Badge variant="outline">{selectedCount} quyền đang chọn</Badge>
                {legacyPermissionKeys.length > 0 ? (
                  <Badge variant="outline" className="gap-1">
                    <ShieldAlert data-icon="inline-start" />
                    {legacyPermissionKeys.length} quyền kế thừa
                  </Badge>
                ) : null}
              </div>

              <div className="flex flex-col gap-1">
                <DialogPrimitive.Title className="font-heading text-xl font-semibold text-foreground">
                  {role?.name || "Cập nhật quyền vai trò"}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="max-w-3xl text-sm text-muted-foreground">
                  {role?.description ||
                    "Rà soát, tìm kiếm và cập nhật quyền truy cập được gán cho vai trò này."}
                </DialogPrimitive.Description>
              </div>
            </div>

            <DialogPrimitive.Close asChild>
              <Button type="button" variant="ghost" size="icon-sm">
                <XIcon />
                <span className="sr-only">Đóng hộp thoại</span>
              </Button>
            </DialogPrimitive.Close>
          </div>

          <div className="border-b px-6 py-4">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Tìm theo tên quyền, key hoặc mô tả..."
                  className="pl-9"
                  autoFocus
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <Badge variant="outline">{standardPermissionCount} quyền trong catalog</Badge>
                <Badge variant="outline">
                  {hasVisibleStandardPermissions
                    ? `${standardGroups.length} nhóm hiển thị`
                    : "0 nhóm hiển thị"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-5">
              {hasVisibleStandardPermissions
                ? standardGroups.map((group) => {
                    const visiblePermissionKeys = group.permissions.map(
                      (permission) => permission.key
                    )
                    const selectedInGroup = visiblePermissionKeys.filter((permissionKey) =>
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
                                <h3 className="font-medium text-foreground">{group.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {selectedInGroup}/{group.permissions.length} quyền đang được chọn
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">{group.permissions.length} quyền</Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={isPending || allSelected}
                              onClick={() => updateSelection(visiblePermissionKeys, true)}
                            >
                              Chọn tất cả
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={isPending || selectedInGroup === 0}
                              onClick={() => updateSelection(visiblePermissionKeys, false)}
                            >
                              Bỏ chọn tất cả
                            </Button>
                          </div>
                        </div>

                        <div className="divide-y">
                          {group.permissions.map((permission) => {
                            const checked = selectedPermissionKeys.includes(permission.key)

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
                                    {permission.description || "Chưa có mô tả cho quyền này."}
                                  </span>
                                </div>

                                <Switch
                                  checked={checked}
                                  disabled={isPending}
                                  onCheckedChange={(nextChecked) =>
                                    updateSelection([permission.key], nextChecked)
                                  }
                                  aria-label={`Bật hoặc tắt quyền ${permission.key}`}
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
                <Empty className="min-h-[280px] rounded-xl border border-dashed">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Search />
                    </EmptyMedia>
                    <EmptyTitle>
                      {normalizedQuery
                        ? "Không tìm thấy quyền phù hợp"
                        : "Chưa có quyền nào để hiển thị"}
                    </EmptyTitle>
                    <EmptyDescription>
                      {normalizedQuery
                        ? "Hãy thử từ khóa khác để tìm quyền theo tên, key hoặc mô tả."
                        : "Catalog quyền hiện chưa có dữ liệu để bạn chỉnh sửa."}
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
                          <h3 className="font-medium text-foreground">Quyền kế thừa</h3>
                          <p className="text-sm text-muted-foreground">
                            Những quyền này không còn xuất hiện trong catalog hiện tại nhưng vẫn sẽ
                            được giữ nguyên khi bạn lưu thay đổi.
                          </p>
                        </div>
                      </div>

                      <CollapsibleTrigger asChild>
                        <Button type="button" variant="ghost" size="sm">
                          <ChevronDown
                            data-icon="inline-end"
                            className={cn(
                              "transition-transform",
                              (normalizedQuery ? true : legacyOpen) && "rotate-180"
                            )}
                          />
                          {normalizedQuery ? "Đang mở vì có kết quả tìm kiếm" : "Xem chi tiết"}
                        </Button>
                      </CollapsibleTrigger>
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
                                {permission.description ||
                                  "Quyền kế thừa sẽ được bảo toàn khi gửi cập nhật."}
                              </span>
                            </div>
                            <Badge variant="outline">Chỉ đọc</Badge>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ) : null}

              {hasVisibleStandardPermissions && legacyPermissionKeys.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-muted/15 px-4 py-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 shrink-0 text-primary" />
                    <span>
                      Bạn có thể tìm kiếm theo từ khóa, hoặc thao tác theo từng nhóm để cập nhật
                      quyền nhanh hơn.
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="border-t bg-background px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {hasChanges
                  ? "Bạn có thay đổi chưa lưu trong hộp thoại này."
                  : "Chưa có thay đổi nào cần lưu."}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" variant="ghost" onClick={() => handleDialogOpenChange(false)}>
                  Hủy
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetSelection}
                  disabled={!role || isPending}
                >
                  Đặt lại
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={!role || !hasChanges || isPending}
                >
                  {isPending ? <Spinner data-icon="inline-start" /> : null}
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
