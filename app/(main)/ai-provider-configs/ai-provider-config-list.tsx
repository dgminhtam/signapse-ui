"use client"

import { format } from "date-fns"
import { Bot, Edit2, Plus, ShieldCheck, Star, Trash2 } from "lucide-react"
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
import { AppPagination } from "@/components/app-pagination"
import { AppSelectPageSize } from "@/components/app-select-page-size"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { AiProviderConfigSearch } from "./ai-provider-config-search"

interface AiProviderConfigListProps {
  providerPage: Page<AiProviderConfigListResponse>
}

export function AiProviderConfigListPage({ providerPage }: AiProviderConfigListProps) {
  const providers = providerPage?.content || []

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-4 sm:w-auto">
          <Button asChild>
            <Link href="/ai-provider-configs/create">
              <Plus data-icon="inline-start" />
              Tạo cấu hình
            </Link>
          </Button>
          <AiProviderConfigSearch />
        </div>
        <div className="flex items-center gap-2">
          <SortSelect
            options={[
              { label: "Mới nhất", value: "id_desc" },
              { label: "Cũ nhất", value: "id_asc" },
              { label: "Tên (A-Z)", value: "name_asc" },
              { label: "Tên (Z-A)", value: "name_desc" },
            ]}
            placeholder="Sắp xếp theo"
          />
        </div>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-muted">
              <TableHead className="font-semibold text-foreground">Tên cấu hình</TableHead>
              <TableHead className="font-semibold text-foreground">Nhà cung cấp</TableHead>
              <TableHead className="font-semibold text-foreground">Model</TableHead>
              <TableHead className="text-center font-semibold text-foreground">Mặc định</TableHead>
              <TableHead className="font-semibold text-foreground">Ngày tạo</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.length > 0 ? (
              providers.map((provider) => (
                <TableRow key={provider.id} className="border-border transition-colors hover:bg-muted/50">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/ai-provider-configs/${provider.id}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {provider.name}
                      </Link>
                      <span className="line-clamp-1 text-xs text-muted-foreground">
                        {provider.description || "Chưa có mô tả"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{provider.providerType}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{provider.model}</TableCell>
                  <TableCell className="text-center">
                    <SetDefaultButton provider={provider} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground tabular-nums">
                    {format(new Date(provider.createdDate), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Link href={`/ai-provider-configs/${provider.id}`}>
                          <Edit2 />
                          <span className="sr-only">Chỉnh sửa</span>
                        </Link>
                      </Button>
                      <DeleteProviderButton provider={provider} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-24 text-center">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Bot />
                      </EmptyMedia>
                      <EmptyTitle>Chưa có cấu hình nào</EmptyTitle>
                      <EmptyDescription>
                        Tạo cấu hình nhà cung cấp AI đầu tiên để bắt đầu quản lý tích hợp AI.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="my-4 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <AppSelectPageSize />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Trang {providerPage.number + 1} / {providerPage.totalPages} ({providerPage.totalElements}{" "}
            cấu hình)
          </span>
        </div>
        <div className="flex gap-2">
          <AppPagination
            totalElements={providerPage.totalElements}
            itemsPerPage={providerPage.size}
          />
        </div>
      </div>
    </div>
  )
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
        toast.success("Đã cập nhật nhà cung cấp AI mặc định")
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
      {isPending ? <Spinner className="size-4" /> : <Star data-icon="inline-start" />}
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

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAiProviderConfig(provider.id)
      if (result.success) {
        toast.success(`Đã xóa cấu hình "${provider.name}"`)
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
          <span className="sr-only">Xóa</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Cấu hình nhà cung cấp AI{" "}
            <strong>{provider.name}</strong> sẽ bị xóa vĩnh viễn.
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
