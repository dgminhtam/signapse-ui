"use client"

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

interface PersonalNoteDiscardDialogProps {
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
  open: boolean
}

function PersonalNoteDiscardDialog({
  onConfirm,
  onOpenChange,
  open,
}: PersonalNoteDiscardDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bỏ thay đổi chưa lưu?</AlertDialogTitle>
          <AlertDialogDescription>
            Nội dung bạn vừa chỉnh sửa chưa được lưu. Nếu tiếp tục, các thay
            đổi này sẽ bị mất.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Tiếp tục chỉnh sửa</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Bỏ thay đổi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { PersonalNoteDiscardDialog }
