"use client"

import { StickyNoteIcon } from "lucide-react"

import { useLocalization } from "@/app/lib/i18n/provider"
import { PlateEditor } from "@/components/editor/plate-editor"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

function PersonalNotesQuickSheet() {
  const { dictionary } = useLocalization()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline">
          <StickyNoteIcon data-icon="inline-start" />
          {dictionary.personalNotes.trigger}
        </Button>
      </SheetTrigger>
      <SheetContent className="gap-0 overflow-hidden data-[side=right]:w-full data-[side=right]:sm:max-w-4xl">
        <SheetHeader>
          <SheetTitle>{dictionary.personalNotes.trigger}</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-auto">
          <PlateEditor />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { PersonalNotesQuickSheet }
