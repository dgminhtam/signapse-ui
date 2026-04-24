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

import {
  deleteNewsOutlet,
  toggleNewsOutletActive,
} from "@/app/api/news-outlets/action"
import { Page } from "@/app/lib/definitions"
import { NewsOutletListResponse } from "@/app/lib/news-outlets/definitions"
import {
  NEWS_OUTLET_CREATE_PERMISSION,
  NEWS_OUTLET_DELETE_PERMISSION,
  NEWS_OUTLET_UPDATE_PERMISSION,
} from "@/app/lib/news-outlets/permissions"
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
import { Button } from "@/components/ui/button"
import {
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

import { NewsOutletSearch } from "./news-outlet-search"

interface NewsOutletListProps {
  newsOutletPage: Page<NewsOutletListResponse>
}

function formatDateTime(value?: string) {
  if (!value) {
    return "Chưa có"
  }

  return format(new Date(value), "dd/MM/yyyy HH:mm")
}

export function NewsOutletListPage({ newsOutletPage }: NewsOutletListProps) {
  const newsOutlets = newsOutletPage.content ?? []
  const canCreateNewsOutlet = useHasPermission(NEWS_OUTLET_CREATE_PERMISSION)
  const canUpdateNewsOutlet = useHasPermission(NEWS_OUTLET_UPDATE_PERMISSION)
  const canDeleteNewsOutlet = useHasPermission(NEWS_OUTLET_DELETE_PERMISSION)

  return (
    <div className="w-full">
      <AppListToolbar>
        <AppListToolbarLeading>
          {canCreateNewsOutlet ? (
            <Button asChild>
              <Link href="/news-outlets/create">
                <Plus data-icon="inline-start" />
                Thêm nguồn tin
              </Link>
            </Button>
          ) : null}
          <NewsOutletSearch />
        </AppListToolbarLeading>
        <AppListToolbarTrailing>
          <SortSelect
            className="w-full sm:w-auto"
            options={[
              { label: "Mới tạo", value: "id_desc" },
              { label: "Cũ hơn", value: "id_asc" },
              { label: "Tên A-Z", value: "name_asc" },
              { label: "Tên Z-A", value: "name_desc" },
            ]}
            triggerClassName="w-full sm:w-[200px]"
          />
          <AppSelectPageSize
            className="w-full sm:w-auto"
            defaultSize={newsOutletPage.size}
            showLabel={false}
            triggerClassName="w-full sm:w-[120px]"
          />
        </AppListToolbarTrailing>
      </AppListToolbar>

      <AppListTable>
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead>
                Nguồn tin
              </AppListTableHead>
              <AppListTableHead>Slug</AppListTableHead>
              <AppListTableHead>
                Tạo lúc
              </AppListTableHead>
              <AppListTableHead className="text-center">
                Kích hoạt
              </AppListTableHead>
              <AppListTableHead className="text-center">
                Thao tác
              </AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {newsOutlets.length > 0 ? (
              newsOutlets.map((newsOutlet) => (
                <TableRow
                  key={newsOutlet.id}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium text-foreground">
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/news-outlets/${newsOutlet.id}`}
                        className="hover:underline"
                      >
                        {newsOutlet.name}
                      </Link>

                      {newsOutlet.description ? (
                        <p className="max-w-xl text-sm text-muted-foreground">
                          {newsOutlet.description}
                        </p>
                      ) : null}

                      <a
                        href={newsOutlet.homepageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      >
                        <Globe className="h-3 w-3" />
                        Trang chủ: {newsOutlet.homepageUrl}
                        <ExternalLink className="h-2 w-2" />
                      </a>

                      {newsOutlet.rssUrl ? (
                        <a
                          href={newsOutlet.rssUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                        >
                          <Rss className="h-3 w-3" />
                          RSS: {newsOutlet.rssUrl}
                          <ExternalLink className="h-2 w-2" />
                        </a>
                      ) : null}
                    </div>
                  </TableCell>

                  <TableCell>
                    <code className="rounded bg-muted px-2 py-1 text-xs">
                      {newsOutlet.slug || "Tự sinh từ tên"}
                    </code>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateTime(newsOutlet.createdDate)}
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <ToggleNewsOutletActiveSwitch
                        id={newsOutlet.id}
                        active={newsOutlet.active}
                        canUpdate={canUpdateNewsOutlet}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {canUpdateNewsOutlet ? (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Link href={`/news-outlets/${newsOutlet.id}`}>
                            <Edit2 data-icon="inline-start" />
                            <span className="sr-only">Chỉnh sửa</span>
                          </Link>
                        </Button>
                      ) : null}

                      {canDeleteNewsOutlet ? (
                        <DeleteNewsOutletButton
                          id={newsOutlet.id}
                          name={newsOutlet.name}
                        />
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <AppListTableEmptyState colSpan={5}>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Newspaper />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có nguồn tin</EmptyTitle>
                  <EmptyDescription>
                    Thêm nguồn tin đầu tiên để bắt đầu quản lý danh sách nội dung theo
                    contract mới của backend.
                  </EmptyDescription>
                </EmptyHeader>
              </AppListTableEmptyState>
            )}
          </TableBody>
        </Table>
      </AppListTable>

      <AppPaginationControls page={newsOutletPage} className="mt-4" />
    </div>
  )
}

function ToggleNewsOutletActiveSwitch({
  id,
  active,
  canUpdate,
}: {
  id: number
  active: boolean
  canUpdate: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const isDisabled = isPending || !canUpdate

  const handleToggle = () => {
    if (isDisabled) {
      return
    }

    startTransition(async () => {
      const result = await toggleNewsOutletActive(id)

      if (result.success) {
        toast.success(active ? "Đã tạm dừng nguồn tin." : "Đã kích hoạt nguồn tin.")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Switch checked={active} onCheckedChange={handleToggle} disabled={isDisabled} />
      {isPending ? <Spinner className="size-3" /> : null}
    </div>
  )
}

function DeleteNewsOutletButton({
  id,
  name,
}: {
  id: number
  name: string
}) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteNewsOutlet(id)

      if (result.success) {
        toast.success(`Đã xóa nguồn tin "${name}".`)
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
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 />
          <span className="sr-only">Xóa nguồn tin</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Nguồn tin <strong>{name}</strong> sẽ
            bị xóa vĩnh viễn khỏi hệ thống.
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
              "Xóa nguồn tin"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
