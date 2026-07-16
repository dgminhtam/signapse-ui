"use client"

import { MoreHorizontal, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { deleteNewsArticle } from "@/app/api/news-articles/action"
import { useLocalization } from "@/app/lib/i18n/provider"
import { useLocalizedPath } from "@/components/localized-link"
import { NEWS_ARTICLE_DELETE_PERMISSIONS } from "@/app/lib/news-articles/permissions"
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
}

export function NewsArticleDetailActions({
  id,
  title,
}: NewsArticleDetailActionsProps) {
  const { dictionary, formatMessage } = useLocalization()
  const newsArticlesPath = useLocalizedPath("/news-articles")
  const canDelete = useHasAnyPermission(NEWS_ARTICLE_DELETE_PERMISSIONS)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeletePending, startDeleteTransition] = useTransition()
  const router = useRouter()

  if (!canDelete) {
    return null
  }

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteNewsArticle(id)

      if (result.success) {
        toast.success(dictionary.newsArticles.deleted)
        setDeleteOpen(false)
        router.push(newsArticlesPath)
        router.refresh()
        return
      }

      toast.error(result.error || dictionary.newsArticles.deleteError)
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
                aria-label={dictionary.newsArticles.actionsLabel}
              >
                <MoreHorizontal data-icon="inline-start" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>{dictionary.newsArticles.actionsTooltip}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              disabled={isDeletePending}
              onSelect={() => setDeleteOpen(true)}
            >
              {isDeletePending ? <Spinner /> : <Trash2 />}
              {dictionary.newsArticles.deleteShort}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dictionary.newsArticles.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {formatMessage(dictionary.newsArticles.deleteDescription, { title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletePending}>
              {dictionary.common.cancel}
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
                  {dictionary.newsArticles.deletePending}
                </>
              ) : (
                <>
                  <Trash2 data-icon="inline-start" />
                  {dictionary.newsArticles.delete}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
