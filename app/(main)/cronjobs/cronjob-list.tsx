"use client"

import { CronjobListResponse } from "@/app/lib/cronjobs/definitions"
import { Page } from "@/app/lib/definitions"
import { updateCronjob } from "@/app/api/cronjobs/action"
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
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { useHasPermission } from "@/components/permission-provider"
import { SortSelect } from "@/components/sort-select"
import { CronjobSearch } from "./cronjob-search"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Check,
  CheckCircle,
  Clock,
  FileClock,
  Pause,
  Pencil,
  Play,
  RotateCcw,
  X,
} from "lucide-react"
import { format } from "date-fns"
import {
  pauseCronjob,
  resumeCronjob,
  startCronjob,
} from "@/app/api/cronjobs/action"
import { useRouter } from "next/navigation"
import { FormEvent, useState, useTransition } from "react"
import { toast } from "sonner"

interface CronjobListProps {
  cronjobPage: Page<CronjobListResponse>
}

const CRON_EXPRESSION_MAX_LENGTH = 100

function getStatusBadge(status: string | undefined) {
  const statusValue = status || "SCHEDULED"
  switch (statusValue) {
    case "RUNNING":
      return (
        <Badge>
          <Play data-icon="inline-start" /> Đang chạy
        </Badge>
      )
    case "PAUSED":
      return (
        <Badge variant="secondary">
          <Pause data-icon="inline-start" /> Tạm dừng
        </Badge>
      )
    case "COMPLETE":
      return (
        <Badge variant="secondary">
          <CheckCircle data-icon="inline-start" /> Hoàn tất
        </Badge>
      )
    case "SCHEDULED":
      return (
        <Badge variant="secondary">
          <Clock data-icon="inline-start" /> Đã lên lịch
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function CronjobListPage({ cronjobPage }: CronjobListProps) {
  const cronjobs = cronjobPage.content
  const canUpdateCronjob = useHasPermission("cronjob:update")

  return (
    <div className="w-full">
      <AppListToolbar>
        <AppListToolbarLeading>
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
              <AppListTableHead className="w-[32%]">
                Tên tác vụ
              </AppListTableHead>
              <AppListTableHead className="w-36 text-center">
                Nhóm
              </AppListTableHead>
              <AppListTableHead className="w-36 text-center">
                Trạng thái
              </AppListTableHead>
              <AppListTableHead className="w-64 text-center">
                Biểu thức cron
              </AppListTableHead>
              <AppListTableHead className="w-40 text-center">
                Lần chạy kế tiếp
              </AppListTableHead>
              <AppListTableHead className="w-32 text-center">
                Thao tác
              </AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {cronjobs.length > 0 ? (
              cronjobs.map((cronjob) => (
                <TableRow
                  key={cronjob.id}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell className="align-top font-medium whitespace-normal text-foreground">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="line-clamp-1 break-words">
                        {cronjob.jobName}
                      </span>
                      {cronjob.description && (
                        <span className="line-clamp-2 text-xs break-words text-muted-foreground">
                          {cronjob.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="w-36 max-w-[9rem] text-center text-muted-foreground">
                    <span className="block truncate">{cronjob.jobGroup}</span>
                  </TableCell>
                  <TableCell className="w-36 text-center">
                    {getStatusBadge(cronjob.jobStatus)}
                  </TableCell>
                  <TableCell className="w-64 text-center whitespace-normal">
                    <CronExpressionCell
                      cronjob={cronjob}
                      canUpdate={canUpdateCronjob}
                    />
                  </TableCell>
                  <TableCell className="w-40 text-center">
                    <AppTimeMetadata icon={Clock}>
                      {cronjob.nextTriggeredTime
                        ? format(
                            new Date(cronjob.nextTriggeredTime),
                            "dd/MM/yyyy HH:mm"
                          )
                        : "-"}
                    </AppTimeMetadata>
                  </TableCell>
                  <TableCell className="w-32 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <StatusActions
                        id={cronjob.id}
                        status={cronjob.jobStatus}
                      />
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
                  <EmptyTitle>Chưa có tác vụ định kỳ</EmptyTitle>
                  <EmptyDescription>
                    Chưa có tác vụ hệ thống nào được backend cung cấp.
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

function CronExpressionCell({
  cronjob,
  canUpdate,
}: {
  cronjob: CronjobListResponse
  canUpdate: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftExpression, setDraftExpression] = useState(cronjob.cronExpression)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleCancel = () => {
    setDraftExpression(cronjob.cronExpression)
    setError(null)
    setIsEditing(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const expression = draftExpression.trim()
    if (!expression) {
      setError("Biểu thức cron là bắt buộc.")
      return
    }

    if (expression.length > CRON_EXPRESSION_MAX_LENGTH) {
      setError("Biểu thức cron quá dài.")
      return
    }

    setError(null)
    setIsSaving(true)
    const result = await updateCronjob(cronjob.id, { expression })
    setIsSaving(false)

    if (result.success) {
      toast.success("Đã cập nhật lịch chạy cronjob.")
      setDraftExpression(expression)
      setIsEditing(false)
      router.refresh()
    } else {
      toast.error(result.error || "Không thể cập nhật lịch chạy cronjob.")
    }
  }

  if (!isEditing) {
    return (
      <div className="flex min-w-0 items-center justify-center gap-1">
        <span className="block min-w-0 truncate font-mono text-sm text-muted-foreground">
          {cronjob.cronExpression}
        </span>
        {canUpdate ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            title="Chỉnh sửa biểu thức cron"
            onClick={() => {
              setDraftExpression(cronjob.cronExpression)
              setError(null)
              setIsEditing(true)
            }}
          >
            <Pencil data-icon="inline-start" />
            <span className="sr-only">Chỉnh sửa biểu thức cron</span>
          </Button>
        ) : null}
      </div>
    )
  }

  return (
    <form
      className="flex items-center justify-center gap-1"
      onSubmit={handleSubmit}
    >
      <Field data-invalid={Boolean(error)} className="min-w-0 flex-1">
        <FieldLabel
          htmlFor={`cron-expression-${cronjob.id}`}
          className="sr-only"
        >
          Biểu thức cron
        </FieldLabel>
        <Input
          id={`cron-expression-${cronjob.id}`}
          value={draftExpression}
          onChange={(event) => {
            setDraftExpression(event.target.value)
            if (error) {
              setError(null)
            }
          }}
          autoComplete="off"
          aria-invalid={Boolean(error)}
          disabled={isSaving}
          className="min-w-[8rem]"
        />
        {error ? <FieldError>{error}</FieldError> : null}
      </Field>
      <div className="flex items-center gap-1">
        <Button
          type="submit"
          variant="ghost"
          size="icon-xs"
          title="Lưu biểu thức cron"
          disabled={isSaving}
        >
          {isSaving ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Check data-icon="inline-start" />
          )}
          <span className="sr-only">Lưu biểu thức cron</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          title="Hủy chỉnh sửa"
          disabled={isSaving}
          onClick={handleCancel}
        >
          <X data-icon="inline-start" />
          <span className="sr-only">Hủy chỉnh sửa</span>
        </Button>
      </div>
    </form>
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
        <>
          {canStartCronjob ? (
            <Button
              variant="ghost"
              size="icon"
              title="Khởi chạy"
              disabled={isPending}
              onClick={handleStart}
            >
              {isPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Play data-icon="inline-start" />
              )}
              <span className="sr-only">Khởi chạy</span>
            </Button>
          ) : null}
          {canPauseCronjob ? (
            <Button
              variant="ghost"
              size="icon"
              title="Tạm dừng"
              disabled={isPending}
              onClick={handlePause}
            >
              {isPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Pause data-icon="inline-start" />
              )}
              <span className="sr-only">Tạm dừng</span>
            </Button>
          ) : null}
        </>
      )}
      {statusValue === "PAUSED" && canResumeCronjob ? (
        <Button
          variant="ghost"
          size="icon"
          title="Tiếp tục"
          disabled={isPending}
          onClick={handleResume}
        >
          {isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <RotateCcw data-icon="inline-start" />
          )}
          <span className="sr-only">Tiếp tục</span>
        </Button>
      ) : null}
    </>
  )
}
