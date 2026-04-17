"use client"

export function WatchlistListPage() {
  return null
}

/*

import { format } from "date-fns"
import {
  FolderOpenIcon,
  LineChartIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import { addAssetToWatchlist, deleteWatchlistAsset } from "@/app/api/watchlists/action"
import { WorkspaceResponse } from "@/app/lib/workspaces/definitions"
import {
  WatchlistGroupResponse,
  WatchlistItemResponse,
} from "@/app/lib/watchlists/definitions"
import { useHasPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

import { WatchlistSearch } from "./watchlist-search"

interface WatchlistListPageProps {
  activeWorkspace: WorkspaceResponse
  watchlists: WatchlistGroupResponse[]
}

export function WatchlistListPage({
  activeWorkspace,
  watchlists,
}: WatchlistListPageProps) {
  const canCreateWatchlist = useHasPermission("watchlist:create")

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-muted/20 p-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">
            Workspace đang hoạt động: {activeWorkspace.name}
          </span>
          <span className="text-sm text-muted-foreground">
            Watchlist và tài sản trong trang này luôn bám theo workspace default/active hiện tại.
          </span>
        </div>
      </div>

      <WatchlistSearch canCreateWatchlist={canCreateWatchlist} />

      {watchlists.length === 0 ? (
        <Empty className="min-h-[320px] rounded-lg border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpenIcon />
            </EmptyMedia>
            <EmptyTitle>Chưa có watchlist nào</EmptyTitle>
            <EmptyDescription>
              Tạo watchlist đầu tiên cho workspace này để bắt đầu theo dõi tài sản.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {watchlists.map((watchlist) => (
            <WatchlistCard
              key={watchlist.id}
              watchlist={watchlist}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function WatchlistCard({ watchlist }: { watchlist: WatchlistGroupResponse }) {
  const canCreateWatchlist = useHasPermission("watchlist:create")

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <CardTitle>{watchlist.name}</CardTitle>
            <CardDescription>
              {watchlist.description?.trim()
                ? watchlist.description
                : "Watchlist này chưa có mô tả."}
            </CardDescription>
            <p className="text-xs text-muted-foreground">
              Tạo lúc {format(new Date(watchlist.createdDate), "dd/MM/yyyy HH:mm")}
            </p>
          </div>

          {canCreateWatchlist ? <AddAssetForm watchlist={watchlist} /> : null}
        </div>
      </CardHeader>

      <CardContent className="py-6">
        {watchlist.items.length === 0 ? (
          <Empty className="min-h-[220px] rounded-lg border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LineChartIcon />
              </EmptyMedia>
              <EmptyTitle>Watchlist chưa có tài sản</EmptyTitle>
              <EmptyDescription>
                Thêm `assetId` đầu tiên để watchlist này bắt đầu có dữ liệu theo dõi.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Tài sản</TableHead>
                  <TableHead>Mã</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Ngày thêm</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watchlist.items.map((item) => (
                  <WatchlistItemRow
                    key={item.id}
                    watchlistId={watchlist.id}
                    item={item}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AddAssetForm({ watchlist }: { watchlist: WatchlistGroupResponse }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [assetId, setAssetId] = React.useState("")
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()

  const handleAddAsset = () => {
    const numericAssetId = Number(assetId)

    if (!Number.isInteger(numericAssetId) || numericAssetId <= 0) {
      toast.error("Vui lòng nhập assetId hợp lệ")
      return
    }

    startTransition(async () => {
      const result = await addAssetToWatchlist({
        watchlistId: watchlist.id,
        assetId: numericAssetId,
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(`Đã thêm asset #${numericAssetId} vào "${watchlist.name}"`)
      setAssetId("")
      setIsOpen(false)
      router.refresh()
    })
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full max-w-sm">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <PlusIcon data-icon="inline-start" />
          Thêm asset
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 rounded-lg border bg-muted/20 p-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Asset ID</label>
            <Input
              type="number"
              min="1"
              value={assetId}
              onChange={(event) => setAssetId(event.target.value)}
              placeholder="Ví dụ: 101"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Phase đầu chỉ hỗ trợ thêm tài sản bằng `assetId`, chưa có module tìm kiếm asset riêng.
          </p>
          <Separator />
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => setIsOpen(false)}
            >
              Hủy
            </Button>
            <Button type="button" disabled={isPending} onClick={handleAddAsset}>
              {isPending ? "Đang thêm..." : "Xác nhận"}
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function WatchlistItemRow({
  watchlistId,
  item,
}: {
  watchlistId: number
  item: WatchlistItemResponse
}) {
  const canDeleteWatchlist = useHasPermission("watchlist:delete")

  return (
    <TableRow className="transition-colors hover:bg-muted/40">
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{item.assetName}</span>
          <span className="text-xs text-muted-foreground">Asset ID: {item.assetId}</span>
        </div>
      </TableCell>
      <TableCell className="font-mono text-sm">{item.assetSymbol}</TableCell>
      <TableCell>
        <Badge variant="outline">{item.assetType}</Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {format(new Date(item.createdDate), "dd/MM/yyyy HH:mm")}
      </TableCell>
      <TableCell className="text-right">
        {canDeleteWatchlist ? (
          <DeleteWatchlistAssetButton watchlistId={watchlistId} item={item} />
        ) : null}
      </TableCell>
    </TableRow>
  )
}

function DeleteWatchlistAssetButton({
  watchlistId,
  item,
}: {
  watchlistId: number
  item: WatchlistItemResponse
}) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteWatchlistAsset(watchlistId, item.assetId)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(`Đã xóa ${item.assetSymbol} khỏi watchlist`)
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          title="Xóa asset khỏi watchlist"
        >
          <Trash2Icon className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa asset khỏi watchlist?</AlertDialogTitle>
          <AlertDialogDescription>
            Asset <strong>{item.assetSymbol}</strong> sẽ bị gỡ khỏi watchlist hiện tại.
            Thao tác này không xóa asset khỏi hệ thống.
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
            className="bg-red-500 hover:bg-red-600"
          >
            {isPending ? "Đang xóa..." : "Xóa khỏi watchlist"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
*/
