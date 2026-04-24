"use client"

import { CronjobListResponse } from "@/app/lib/cronjobs/definitions"
import { Page } from "@/app/lib/definitions"
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
import { useHasPermission } from "@/components/permission-provider"
import { SortSelect } from "@/components/sort-select"
import { CronjobSearch } from "./cronjob-search"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import {
  Edit2,
  Plus,
  Trash2,
  FileClock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import {
  deleteCronjob,
  startCronjob,
  pauseCronjob,
  resumeCronjob,
} from "@/app/api/cronjobs/action"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
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
import { Spinner } from "@/components/ui/spinner"

interface CronjobListProps {
  cronjobPage: Page<CronjobListResponse>
}

function getStatusBadge(status: string | undefined) {
  const statusValue = status || "SCHEDULED"
  switch (statusValue) {
    case "RUNNING":
      return (
        <Badge
          variant="default"
          className="gap-1 bg-green-500/10 text-green-700 dark:text-green-400"
        >
          <Play className="h-3 w-3" /> Đang chạy
        </Badge>
      )
    case "PAUSED":
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
        >
          <Pause className="h-3 w-3" /> Tạm dừng
        </Badge>
      )
    case "COMPLETE":
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-blue-500/10 text-blue-700 dark:text-blue-400"
        >
          <CheckCircle className="h-3 w-3" /> Hoàn tất
        </Badge>
      )
    case "SCHEDULED":
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-gray-500/10 text-gray-700 dark:text-gray-400"
        >
          <Clock className="h-3 w-3" /> Đã lên lịch
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary" className="gap-1">
          {status}
        </Badge>
      )
  }
}

export function CronjobListPage({ cronjobPage }: CronjobListProps) {
  const cronjobs = cronjobPage.content
  const canCreateCronjob = useHasPermission("cronjob:create")
  const canUpdateCronjob = useHasPermission("cronjob:update")
  const canDeleteCronjob = useHasPermission("cronjob:delete")

  return (
    <div className="w-full">
      <AppListToolbar>
        <AppListToolbarLeading>
          {canCreateCronjob ? (
            <Button asChild>
              <Link href="/cronjobs/create">
                <Plus data-icon="inline-start" />
                Tạo cronjob
              </Link>
            </Button>
          ) : null}
          <CronjobSearch />
        </AppListToolbarLeading>
        <AppListToolbarTrailing>
          <SortSelect
            className="w-full sm:w-auto"
            options={[
              { label: "Mới nhất", value: "id_desc" },
              { label: "Cũ hơn", value: "id_asc" },
              { label: "Tên A-Z", value: "jobName_asc" },
              { label: "Tên Z-A", value: "jobName_desc" },
            ]}
            triggerClassName="w-full sm:w-[200px]"
          />
          <AppSelectPageSize
            className="w-full sm:w-auto"
            defaultSize={cronjobPage.size}
            showLabel={false}
            triggerClassName="w-full sm:w-[120px]"
          />
        </AppListToolbarTrailing>
      </AppListToolbar>

      <AppListTable>
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead>Tên tác vụ</AppListTableHead>
              <AppListTableHead className="text-center">Nhóm</AppListTableHead>
              <AppListTableHead className="text-center">Trạng thái</AppListTableHead>
              <AppListTableHead className="text-center">Biểu thức cron</AppListTableHead>
              <AppListTableHead className="text-center">Lần chạy kế tiếp</AppListTableHead>
              <AppListTableHead className="text-center">Thao tác</AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {cronjobs.length > 0 ? (
              cronjobs.map((cronjob) => (
                <TableRow
                  key={cronjob.id}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium text-foreground">
                    <Link href={`/cronjobs/${cronjob.id}`}>
                      {cronjob.jobName}
                    </Link>
                    {cronjob.description && (
                      <>
                        <br />
                        <span className="block max-w-[250px] truncate text-xs text-muted-foreground">
                          {cronjob.description}
                        </span>
                      </>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {cronjob.jobGroup}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(cronjob.jobStatus)}
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm text-muted-foreground">
                    {cronjob.cronExpression}
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {cronjob.nextTriggeredTime
                      ? format(
                          new Date(cronjob.nextTriggeredTime),
                          "dd/MM/yyyy HH:mm"
                        )
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <StatusActions
                        id={cronjob.id}
                        status={cronjob.jobStatus}
                      />
                      {canUpdateCronjob ? (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground"
                          title="Chỉnh sửa cronjob"
                        >
                          <Link href={`/cronjobs/${cronjob.id}`}>
                            <Edit2 />
                            <span className="sr-only">Chỉnh sửa cronjob</span>
                          </Link>
                        </Button>
                      ) : null}
                      {canDeleteCronjob ? <DeleteCronjobButton id={cronjob.id} /> : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <AppListTableEmptyState colSpan={6}>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileClock />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có cronjob</EmptyTitle>
                  <EmptyDescription>
                    Tạo cronjob đầu tiên để bắt đầu quản lý lịch chạy hệ thống.
                  </EmptyDescription>
                </EmptyHeader>
              </AppListTableEmptyState>
            )}
          </TableBody>
        </Table>
      </AppListTable>

      <AppPaginationControls page={cronjobPage} className="mt-4" />
    </div>
  )
}

function StatusActions({ id, status }: { id: number; status: string }) {
  const canStartCronjob = useHasPermission("cronjob:start")
  const canPauseCronjob = useHasPermission("cronjob:pause")
  const canResumeCronjob = useHasPermission("cronjob:resume")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleStart = () => {
    startTransition(async () => {
      const result = await startCronjob(id)
      if (result.success) {
        toast.success("Đã khởi chạy cronjob.")
        router.refresh()
      } else {
        toast.error(result.error || "Không thể khởi chạy cronjob.")
      }
    })
  }

  const handlePause = () => {
    startTransition(async () => {
      const result = await pauseCronjob(id)
      if (result.success) {
        toast.success("Đã tạm dừng cronjob.")
        router.refresh()
      } else {
        toast.error(result.error || "Không thể tạm dừng cronjob.")
      }
    })
  }

  const handleResume = () => {
    startTransition(async () => {
      const result = await resumeCronjob(id)
      if (result.success) {
        toast.success("Đã tiếp tục cronjob.")
        router.refresh()
      } else {
        toast.error(result.error || "Không thể tiếp tục cronjob.")
      }
    })
  }

  const statusValue = status || "SCHEDULED"

  return (
    <>
      {(statusValue === "SCHEDULED" || statusValue === "COMPLETE") && (
        <div className="flex items-center gap-1">
          {canStartCronjob ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-600 hover:bg-green-500/10 hover:text-green-700"
              title="Khởi chạy"
              disabled={isPending}
              onClick={handleStart}
            >
              {isPending ? <Spinner className="size-4" /> : <Play className="h-4 w-4" />}
              <span className="sr-only">Khởi chạy</span>
            </Button>
          ) : null}
          {canPauseCronjob ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-yellow-600 hover:bg-yellow-500/10 hover:text-yellow-700"
              title="Tạm dừng"
              disabled={isPending}
              onClick={handlePause}
            >
              {isPending ? <Spinner className="size-4" /> : <Pause className="h-4 w-4" />}
              <span className="sr-only">Tạm dừng</span>
            </Button>
          ) : null}
        </div>
      )}
      {(statusValue === "PAUSED" && canResumeCronjob) ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-600 hover:bg-blue-500/10 hover:text-blue-700"
          title="Tiếp tục"
          disabled={isPending}
          onClick={handleResume}
        >
          {isPending ? (
            <Spinner className="size-4" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          <span className="sr-only">Tiếp tục</span>
        </Button>
      ) : null}
    </>
  )
}

function DeleteCronjobButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteCronjob(id)
      if (result.success) {
        toast.success("Đã xóa cronjob.")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Không thể xóa cronjob.")
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          title="Xóa cronjob"
        >
          <Trash2 />
          <span className="sr-only">Xóa cronjob</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Cronjob đã chọn sẽ bị xóa vĩnh viễn
            khỏi hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600"
          >
            {isPending ? "Đang xóa..." : "Xóa cronjob"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
