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
import { useLocalization } from "@/app/lib/i18n/provider"

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
  const { dictionary } = useLocalization()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {dictionary.personalNotes.discardTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dictionary.personalNotes.discardDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {dictionary.personalNotes.continueEditing}
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            {dictionary.personalNotes.discardChanges}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { PersonalNoteDiscardDialog }
