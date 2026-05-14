"use client"

import { format } from "date-fns"
import {
  Bot,
  Clock3,
  Edit2,
  KeyRound,
  Plus,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import {
  deleteAiProviderConfig,
  setAiProviderConfigDefault,
} from "@/app/api/ai-provider-configs/action"
import { AiProviderConfigListResponse } from "@/app/lib/ai-provider-configs/definitions"
import { Page } from "@/app/lib/definitions"
import { AppPaginationControls } from "@/components/app-pagination-controls"
import {
  AppListTable,
  AppListTableEmptyState,
  AppListTableHead,
  AppListTableHeaderRow,
} from "@/components/app-list-table"
import {
  AppListToolbar,
  AppListToolbarLeading,
  AppListToolbarTrailing,
} from "@/components/app-list-toolbar"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { useHasPermission } from "@/components/permission-provider"
import { SortSelect } from "@/components/sort-select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { getProviderOptionLabel } from "./ai-provider-config-shared"

interface AiProviderConfigListProps {
  providerPage: Page<AiProviderConfigListResponse>
}

export function AiProviderConfigListPage({
  providerPage,
}: AiProviderConfigListProps) {
  const providers = providerPage?.content || []
  const canCreateProvider = useHasPermission("ai-provider-config:create")
  const canUpdateProvider = useHasPermission("ai-provider-config:update")
  const canDeleteProvider = useHasPermission("ai-provider-config:delete")
  const canSetDefaultProvider = useHasPermission(
    "ai-provider-config:set-default"
  )

  return (
    <div className="w-full">
      <AppListToolbar>
        <AppListToolbarLeading>
          {canCreateProvider ? (
            <Button asChild>
              <Link href="/ai-provider-configs/create">
                <Plus data-icon="inline-start" />
                Thêm cấu hình
              </Link>
            </Button>
          ) : null}
        </AppListToolbarLeading>
        <AppListToolbarTrailing>
          <SortSelect
            className="w-full sm:w-auto"
            options={[
              { label: "Mới nhất", value: "id_desc" },
              { label: "Cũ hơn", value: "id_asc" },
            ]}
            triggerClassName="w-full sm:w-[200px]"
          />
          <AppSelectPageSize
            className="w-full sm:w-auto"
            defaultSize={providerPage.size}
            showLabel={false}
            triggerClassName="w-full sm:w-[120px]"
          />
        </AppListToolbarTrailing>
      </AppListToolbar>

      <AppListTable>
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead className="w-[34%]">
                Nhà cung cấp
              </AppListTableHead>
              <AppListTableHead className="w-[30%]">
                Credential
              </AppListTableHead>
              <AppListTableHead className="w-36 text-center">
                Mặc định
              </AppListTableHead>
              <AppListTableHead className="w-40">Tạo lúc</AppListTableHead>
              <AppListTableHead className="w-28 text-right">
                Thao tác
              </AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {providers.length > 0 ? (
              providers.map((provider) => {
                const providerLabel = getProviderOptionLabel(
                  provider.providerType
                )

                return (
                  <TableRow
                    key={provider.id}
                    className="border-border transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="align-top whitespace-normal">
                      <div className="flex min-w-0 flex-col gap-1">
                        <Link
                          href={`/ai-provider-configs/${provider.id}`}
                          className="line-clamp-1 font-medium break-words text-foreground hover:underline"
                        >
                          {providerLabel}
                        </Link>
                        {provider.description ? (
                          <span className="line-clamp-1 text-xs break-words text-muted-foreground">
                            {provider.description}
                          </span>
                        ) : null}
                        {provider.baseUrl ? (
                          <span className="line-clamp-1 text-xs break-all text-muted-foreground">
                            {provider.baseUrl}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <KeyRound
                            className="size-3 shrink-0"
                            aria-hidden="true"
                          />
                          {provider.credentials?.length || 0} credential
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="w-[30%] max-w-[20rem] align-top whitespace-normal">
                      <CredentialSummary provider={provider} />
                    </TableCell>
                    <TableCell className="w-36 text-center">
                      {canSetDefaultProvider ? (
                        <SetDefaultButton provider={provider} />
                      ) : null}
                    </TableCell>
                    <TableCell className="w-40">
                      <CreatedTime value={provider.createdDate} />
                    </TableCell>
                    <TableCell className="w-28">
                      <div className="flex justify-end gap-1">
                        {canUpdateProvider ? (
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Link href={`/ai-provider-configs/${provider.id}`}>
                              <Edit2 />
                              <span className="sr-only">
                                Chỉnh sửa cấu hình
                              </span>
                            </Link>
                          </Button>
                        ) : null}
                        {canDeleteProvider ? (
                          <DeleteProviderButton provider={provider} />
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <AppListTableEmptyState colSpan={5}>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Bot />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có cấu hình nhà cung cấp AI</EmptyTitle>
                  <EmptyDescription>
                    Thêm cấu hình đầu tiên để bắt đầu quản lý tích hợp AI.
                  </EmptyDescription>
                </EmptyHeader>
              </AppListTableEmptyState>
            )}
          </TableBody>
        </Table>
      </AppListTable>

      <AppPaginationControls page={providerPage} className="mt-4" />
    </div>
  )
}

function CredentialSummary({
  provider,
}: {
  provider: AiProviderConfigListResponse
}) {
  const credentials = provider.credentials || []

  if (credentials.length === 0) {
    return <span className="text-sm text-muted-foreground">Chưa có credential</span>
  }

  return (
    <div className="flex min-w-0 flex-col gap-1">
      {credentials.slice(0, 2).map((credential) => (
        <div key={credential.id} className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-sm font-medium text-foreground">
            {credential.model || "Chưa chọn model"}
          </span>
          {credential.keyPreview ? (
            <Badge variant="secondary" className="w-fit max-w-full truncate">
              {credential.keyPreview}
            </Badge>
          ) : null}
        </div>
      ))}
      {credentials.length > 2 ? (
        <span className="text-xs text-muted-foreground">
          +{credentials.length - 2} credential khác
        </span>
      ) : null}
    </div>
  )
}

function CreatedTime({ value }: { value?: string }) {
  const formatted = formatDate(value)

  if (!formatted) {
    return <span className="text-xs text-muted-foreground">Chưa có dữ liệu</span>
  }

  return <AppTimeMetadata icon={Clock3}>{formatted}</AppTimeMetadata>
}

function SetDefaultButton({
  provider,
}: {
  provider: AiProviderConfigListResponse
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSetDefault = () => {
    if (provider.defaultProvider) return

    startTransition(async () => {
      const result = await setAiProviderConfigDefault(provider.id)
      if (result.success) {
        toast.success("Đã cập nhật nhà cung cấp AI mặc định.")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  if (provider.defaultProvider) {
    return (
      <Badge className="gap-1">
        <ShieldCheck data-icon="inline-start" />
        Mặc định
      </Badge>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleSetDefault}
      disabled={isPending}
      className="h-8"
    >
      {isPending ? (
        <Spinner className="size-4" />
      ) : (
        <Star data-icon="inline-start" />
      )}
      Đặt mặc định
    </Button>
  )
}

function DeleteProviderButton({
  provider,
}: {
  provider: AiProviderConfigListResponse
}) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const providerLabel = getProviderOptionLabel(provider.providerType)

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAiProviderConfig(provider.id)
      if (result.success) {
        toast.success(`Đã xóa cấu hình "${providerLabel}".`)
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 />
          <span className="sr-only">Xóa cấu hình</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Cấu hình nhà cung cấp AI{" "}
            <strong>{providerLabel}</strong> sẽ bị xóa vĩnh viễn.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              handleDelete()
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Spinner className="size-4" />
                Đang xóa...
              </>
            ) : (
              "Xóa cấu hình"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function formatDate(value?: string) {
  if (!value) return null

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return null

  return format(date, "dd/MM/yyyy HH:mm")
}
