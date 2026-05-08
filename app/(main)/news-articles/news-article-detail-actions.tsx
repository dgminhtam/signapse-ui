"use client"

import { ExternalLink, MoreHorizontal, RefreshCcw, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import {
  crawlNewsArticleFullContent,
  deleteNewsArticle,
} from "@/app/api/news-articles/action"
import {
  NEWS_ARTICLE_ANALYZE_PERMISSIONS,
  NEWS_ARTICLE_DELETE_PERMISSIONS,
} from "@/app/lib/news-articles/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface NewsArticleDetailActionsProps {
  id: number
  title: string
  url: string
}

export function NewsArticleDetailActions({
  id,
  title,
  url,
}: NewsArticleDetailActionsProps) {
  const canCrawl = useHasAnyPermission(NEWS_ARTICLE_ANALYZE_PERMISSIONS)
  const canDelete = useHasAnyPermission(NEWS_ARTICLE_DELETE_PERMISSIONS)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isCrawlPending, startCrawlTransition] = useTransition()
  const [isDeletePending, startDeleteTransition] = useTransition()
  const router = useRouter()

  const handleCrawl = () => {
    startCrawlTransition(async () => {
      const result = await crawlNewsArticleFullContent(id)

      if (result.success) {
        toast.success("Đã yêu cầu tải lại nội dung đầy đủ.")
        router.refresh()
        return
      }

      toast.error(result.error || "Không thể tải lại nội dung đầy đủ.")
    })
  }

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteNewsArticle(id)

      if (result.success) {
        toast.success("Đã xóa bài viết tin tức.")
        setDeleteOpen(false)
        router.push("/news-articles")
        router.refresh()
        return
      }

      toast.error(result.error || "Không thể xóa bài viết tin tức.")
    })
  }

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Hành động bài viết"
              >
                <MoreHorizontal data-icon="inline-start" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Hành động</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            {canCrawl ? (
              <DropdownMenuItem
                disabled={isCrawlPending}
                onSelect={handleCrawl}
              >
                {isCrawlPending ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <RefreshCcw />
                )}
                {isCrawlPending ? "Đang tải..." : "Tải lại nội dung"}
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem asChild>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                Mở liên kết gốc
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {canDelete ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={isDeletePending}
                  onSelect={() => setDeleteOpen(true)}
                >
                  {isDeletePending ? <Spinner /> : <Trash2 />}
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bài viết{" "}
              <strong>{title}</strong> sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletePending}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault()
                handleDelete()
              }}
              disabled={isDeletePending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletePending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 data-icon="inline-start" />
                  Xóa bài viết
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
