"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { deleteNewsArticle } from "@/app/api/news-articles/action"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface NewsArticleDeleteButtonProps {
  id: number
  title: string
  variant?: "ghost" | "outline" | "destructive"
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm"
  showText?: boolean
  redirectToListOnSuccess?: boolean
  className?: string
}

export function NewsArticleDeleteButton({
  id,
  title,
  variant = "ghost",
  size = "icon-sm",
  showText = false,
  redirectToListOnSuccess = false,
  className,
}: NewsArticleDeleteButtonProps) {
  const canDelete = useHasAnyPermission(NEWS_ARTICLE_DELETE_PERMISSIONS)
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteNewsArticle(id)

      if (result.success) {
        toast.success("Da xoa bai viet tin tuc.")
        setOpen(false)

        if (redirectToListOnSuccess) {
          router.push("/news-articles")
          router.refresh()
          return
        }

        router.refresh()
        return
      }

      toast.error(result.error || "Khong the xoa bai viet tin tuc.")
    })
  }

  if (!canDelete) {
    return null
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            "text-destructive hover:bg-destructive/10 hover:text-destructive",
            showText ? "gap-2 px-3" : undefined,
            className
          )}
        >
          <Trash2 className="h-4 w-4" data-icon="inline-start" />
          {showText ? <span>Xoa</span> : <span className="sr-only">Xoa bai viet</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ban co chac chan muon xoa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hanh dong nay khong the hoan tac. Bai viet <strong>{title}</strong> se bi xoa
            vinh vien khoi he thong.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Huy</AlertDialogCancel>
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
                <Spinner className="mr-2 h-4 w-4" data-icon="inline-start" />
                Dang xoa...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" data-icon="inline-start" />
                Xoa bai viet
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
