"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { deleteSourceDocument } from "@/app/api/source-documents/action"
import { SOURCE_DOCUMENT_DELETE_PERMISSIONS } from "@/app/lib/source-documents/permissions"
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

interface SourceDocumentDeleteButtonProps {
  id: number
  title: string
  variant?: "ghost" | "outline" | "destructive"
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm"
  showText?: boolean
  redirectToListOnSuccess?: boolean
  className?: string
}

export function SourceDocumentDeleteButton({
  id,
  title,
  variant = "ghost",
  size = "icon-sm",
  showText = false,
  redirectToListOnSuccess = false,
  className,
}: SourceDocumentDeleteButtonProps) {
  const canDelete = useHasAnyPermission(SOURCE_DOCUMENT_DELETE_PERMISSIONS)
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSourceDocument(id)

      if (result.success) {
        toast.success("Đã xóa tài liệu nguồn.")
        setOpen(false)

        if (redirectToListOnSuccess) {
          router.push("/source-documents")
          router.refresh()
          return
        }

        router.refresh()
        return
      }

      toast.error(result.error || "Không thể xóa tài liệu nguồn.")
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
          {showText ? <span>Xóa</span> : <span className="sr-only">Xóa tài liệu nguồn</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Tài liệu nguồn{" "}
            <strong>{title}</strong> sẽ bị xóa vĩnh viễn khỏi hệ thống.
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
                <Spinner className="mr-2 h-4 w-4" data-icon="inline-start" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" data-icon="inline-start" />
                Xóa tài liệu
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
