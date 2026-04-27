"use client"

import { format } from "date-fns"
import { Edit2, FileText, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { deleteSystemPrompt } from "@/app/api/system-prompts/action"
import { Page } from "@/app/lib/definitions"
import {
  formatSystemPromptContentLength,
  getSystemPromptTypeLabel,
  getSystemPromptWorkflowGroup,
  SystemPromptResponse,
} from "@/app/lib/system-prompts/definitions"
import {
  SYSTEM_PROMPT_CREATE_PERMISSIONS,
  SYSTEM_PROMPT_DELETE_PERMISSIONS,
  SYSTEM_PROMPT_UPDATE_PERMISSIONS,
} from "@/app/lib/system-prompts/permissions"
import { AppPaginationControls } from "@/components/app-pagination-controls"
import {
  AppListToolbar,
  AppListToolbarLeading,
  AppListToolbarTrailing,
} from "@/components/app-list-toolbar"
import {
  AppListTable,
  AppListTableEmptyState,
  AppListTableHead,
  AppListTableHeaderRow,
} from "@/components/app-list-table"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { useHasAnyPermission } from "@/components/permission-provider"
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

import { SystemPromptSearch } from "./system-prompt-search"

interface SystemPromptListProps {
  promptPage: Page<SystemPromptResponse>
}

function formatDateTime(value?: string) {
  if (!value) {
    return "Chưa có"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Chưa có"
  }

  return format(date, "dd/MM/yyyy HH:mm")
}

function getPromptHref(promptType: string) {
  return `/system-prompts/${encodeURIComponent(promptType)}`
}

export function SystemPromptList({ promptPage }: SystemPromptListProps) {
  const prompts = promptPage.content ?? []
  const canCreate = useHasAnyPermission(SYSTEM_PROMPT_CREATE_PERMISSIONS)
  const canUpdate = useHasAnyPermission(SYSTEM_PROMPT_UPDATE_PERMISSIONS)
  const canDelete = useHasAnyPermission(SYSTEM_PROMPT_DELETE_PERMISSIONS)

  return (
    <div className="w-full">
      <AppListToolbar>
        <AppListToolbarLeading>
          {canCreate ? (
            <Button asChild>
              <Link href="/system-prompts/create">
                <Plus data-icon="inline-start" />
                Thêm prompt
              </Link>
            </Button>
          ) : null}
          <SystemPromptSearch />
        </AppListToolbarLeading>
        <AppListToolbarTrailing>
          <SortSelect
            className="w-full sm:w-auto"
            label="Sắp xếp prompt hệ thống"
            options={[
              { label: "Cập nhật mới nhất", value: "lastModifiedDate_desc" },
              { label: "Ngày tạo mới nhất", value: "createdDate_desc" },
              { label: "Loại A-Z", value: "promptType_asc" },
              { label: "Loại Z-A", value: "promptType_desc" },
            ]}
            triggerClassName="w-full sm:w-[200px]"
          />
          <AppSelectPageSize
            className="w-full sm:w-auto"
            defaultSize={promptPage.size}
            showLabel={false}
            triggerClassName="w-full sm:w-[120px]"
          />
        </AppListToolbarTrailing>
      </AppListToolbar>

      <AppListTable>
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead>Loại prompt</AppListTableHead>
              <AppListTableHead>Nhóm workflow</AppListTableHead>
              <AppListTableHead>Độ dài</AppListTableHead>
              <AppListTableHead>Cập nhật</AppListTableHead>
              <AppListTableHead>Tạo lúc</AppListTableHead>
              <AppListTableHead className="text-right">Thao tác</AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {prompts.length > 0 ? (
              prompts.map((prompt) => (
                <TableRow
                  key={prompt.promptType}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {canUpdate ? (
                        <Link
                          href={getPromptHref(prompt.promptType)}
                          className="font-medium text-foreground hover:underline"
                        >
                          {getSystemPromptTypeLabel(prompt.promptType)}
                        </Link>
                      ) : (
                        <span className="font-medium text-foreground">
                          {getSystemPromptTypeLabel(prompt.promptType)}
                        </span>
                      )}
                      <span className="font-mono text-xs text-muted-foreground">
                        {prompt.promptType}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getSystemPromptWorkflowGroup(prompt.promptType)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatSystemPromptContentLength(prompt.content)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground tabular-nums">
                    {formatDateTime(prompt.lastModifiedDate)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground tabular-nums">
                    {formatDateTime(prompt.createdDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {canUpdate ? (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Link href={getPromptHref(prompt.promptType)}>
                            <Edit2 data-icon="inline-start" />
                            <span className="sr-only">Chỉnh sửa prompt hệ thống</span>
                          </Link>
                        </Button>
                      ) : null}
                      {canDelete ? <DeletePromptButton prompt={prompt} /> : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <AppListTableEmptyState colSpan={6}>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText className="text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có prompt hệ thống</EmptyTitle>
                  <EmptyDescription>
                    Thêm prompt đầu tiên để cấu hình các workflow AI của hệ thống.
                  </EmptyDescription>
                </EmptyHeader>
              </AppListTableEmptyState>
            )}
          </TableBody>
        </Table>
      </AppListTable>

      <AppPaginationControls page={promptPage} className="mt-4" />
    </div>
  )
}

function DeletePromptButton({ prompt }: { prompt: SystemPromptResponse }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const promptLabel = getSystemPromptTypeLabel(prompt.promptType)

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSystemPrompt(prompt.promptType)

      if (result.success) {
        toast.success(`Đã xóa prompt "${promptLabel}".`)
        setOpen(false)
        router.refresh()
        return
      }

      toast.error(result.error)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 data-icon="inline-start" />
          <span className="sr-only">Xóa prompt hệ thống</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa prompt hệ thống?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác từ giao diện. Prompt{" "}
            <strong>{promptLabel}</strong> có thể đang ảnh hưởng trực tiếp tới các
            workflow AI, vì vậy hãy chắc chắn bạn đã có phương án thay thế.
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
                <Spinner className="size-4" data-icon="inline-start" />
                Đang xóa...
              </>
            ) : (
              "Xóa prompt"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
