"use client"

import { format } from "date-fns"
import {
  Edit2,
  ExternalLink,
  Globe,
  Newspaper,
  Plus,
  Rss,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { deleteSource, toggleSourceActive } from "@/app/api/sources/action"
import { Page } from "@/app/lib/definitions"
import {
  SOURCE_TYPE_LABELS,
  SourceListResponse,
} from "@/app/lib/sources/definitions"
import { AppPaginationControls } from "@/components/app-pagination-controls"
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
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

import { SourceSearch } from "./source-search"

interface SourceListProps {
  sourcePage: Page<SourceListResponse>
}

function formatDateTime(value?: string) {
  if (!value) {
    return "Chưa có"
  }

  return format(new Date(value), "dd/MM/yyyy HH:mm")
}

function getIngestStatusLabel(status?: string) {
  if (!status) {
    return "Chưa ingest"
  }

  return status
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

function getIngestStatusVariant(
  status?: string
): "outline" | "secondary" | "destructive" {
  if (!status) {
    return "outline"
  }

  const normalizedStatus = status.toUpperCase()
  if (normalizedStatus.includes("FAIL") || normalizedStatus.includes("ERROR")) {
    return "destructive"
  }

  if (normalizedStatus.includes("SUCCESS") || normalizedStatus.includes("DONE")) {
    return "secondary"
  }

  return "outline"
}

export function SourceListPage({ sourcePage }: SourceListProps) {
  const sources = sourcePage?.content || []
  const canCreateSource = useHasPermission("source:create")
  const canUpdateSource = useHasPermission("source:update")
  const canDeleteSource = useHasPermission("source:delete")

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-4 sm:w-auto">
          {canCreateSource ? (
            <Button asChild>
              <Link href="/sources/create">
                <Plus data-icon="inline-start" /> Thêm nguồn
              </Link>
            </Button>
          ) : null}
          <SourceSearch />
        </div>
        <div className="flex items-center gap-2">
          <SortSelect
            options={[
              { label: "Mới tạo", value: "id_desc" },
              { label: "Cũ hơn", value: "id_asc" },
              { label: "Tên A-Z", value: "name_asc" },
              { label: "Ingest mới nhất", value: "lastIngestedAt_desc" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-semibold text-foreground">
                  Nguồn dữ liệu
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Loại
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Ingest gần nhất
                </TableHead>
                <TableHead className="text-center font-semibold text-foreground">
                  Kích hoạt
                </TableHead>
                <TableHead className="text-center font-semibold text-foreground">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.length > 0 ? (
                sources.map((source) => {
                  const isSystemManaged = source.systemManaged === true

                  return (
                    <TableRow
                      key={source.id}
                      className="border-border transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-medium text-foreground">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/sources/${source.id}`}
                              className="flex items-center gap-1.5 hover:underline"
                            >
                              {source.name}
                            </Link>
                            {isSystemManaged ? (
                              <Badge variant="secondary">Nguồn hệ thống</Badge>
                            ) : null}
                          </div>

                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                          >
                            <Globe className="h-3 w-3" /> Website: {source.url}
                            <ExternalLink className="h-2 w-2" />
                          </a>

                          {source.rssUrl ? (
                            <a
                              href={source.rssUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                            >
                              <Rss className="h-3 w-3" /> RSS: {source.rssUrl}
                              <ExternalLink className="h-2 w-2" />
                            </a>
                          ) : null}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {SOURCE_TYPE_LABELS[source.type]}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex flex-col gap-2">
                          <Badge variant={getIngestStatusVariant(source.lastIngestStatus)}>
                            {getIngestStatusLabel(source.lastIngestStatus)}
                          </Badge>
                          <span>{formatDateTime(source.lastIngestedAt)}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <ToggleActiveSwitch
                            id={source.id}
                            active={source.active}
                            canUpdate={canUpdateSource}
                            systemManaged={isSystemManaged}
                          />
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {canUpdateSource ? (
                            isSystemManaged ? (
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                disabled
                                title="Nguồn này do hệ thống quản lý."
                              >
                                <Edit2 className="h-4 w-4" data-icon="inline-start" />
                                <span className="sr-only">Chỉnh sửa</span>
                              </Button>
                            ) : (
                              <Button
                                asChild
                                variant="ghost"
                                size="icon-sm"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Link href={`/sources/${source.id}`}>
                                  <Edit2 className="h-4 w-4" data-icon="inline-start" />
                                  <span className="sr-only">Chỉnh sửa</span>
                                </Link>
                              </Button>
                            )
                          ) : null}

                          {canDeleteSource ? (
                            <DeleteSourceButton
                              id={source.id}
                              name={source.name}
                              disabled={isSystemManaged}
                            />
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-24 text-center">
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Newspaper />
                        </EmptyMedia>
                        <EmptyTitle>Chưa có nguồn dữ liệu</EmptyTitle>
                        <EmptyDescription>
                          Thêm nguồn đầu tiên để bắt đầu ingest tài liệu vào hệ thống.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AppPaginationControls page={sourcePage} className="mt-4" />
    </div>
  )
}

function ToggleActiveSwitch({
  id,
  active,
  canUpdate,
  systemManaged,
}: {
  id: number
  active: boolean
  canUpdate: boolean
  systemManaged: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const isDisabled = isPending || !canUpdate || systemManaged

  const handleToggle = () => {
    if (isDisabled) {
      return
    }

    startTransition(async () => {
      const result = await toggleSourceActive(id)
      if (result.success) {
        toast.success(active ? "Đã tạm ngưng nguồn." : "Đã kích hoạt nguồn.")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div
      className="flex items-center gap-2"
      title={systemManaged ? "Nguồn này do hệ thống quản lý." : undefined}
    >
      <Switch checked={active} onCheckedChange={handleToggle} disabled={isDisabled} />
      {isPending ? <Spinner className="size-3" /> : null}
    </div>
  )
}

function DeleteSourceButton({
  id,
  name,
  disabled,
}: {
  id: number
  name: string
  disabled: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSource(id)
      if (result.success) {
        toast.success(`Đã xóa nguồn "${name}".`)
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  if (disabled) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        disabled
        title="Nguồn này do hệ thống quản lý."
      >
        <Trash2 className="h-4 w-4" data-icon="inline-start" />
        <span className="sr-only">Xóa nguồn</span>
      </Button>
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          title="Xóa nguồn"
        >
          <Trash2 className="h-4 w-4" data-icon="inline-start" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Nguồn dữ liệu <strong>{name}</strong>{" "}
            sẽ bị xóa khỏi hệ thống và có thể ảnh hưởng tới quy trình ingest liên
            quan.
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
            {isPending ? "Đang xóa..." : "Xóa nguồn"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
