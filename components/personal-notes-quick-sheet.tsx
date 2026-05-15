"use client"

import * as React from "react"
import {
  CalendarClockIcon,
  ExpandIcon,
  FileTextIcon,
  MinimizeIcon,
  PlusIcon,
  StickyNoteIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  createPersonalNote,
  getPersonalNote,
  getPersonalNotes,
  updatePersonalNote,
} from "@/app/api/personal-notes/action"
import {
  createEmptyPersonalNoteHtml,
  getPersonalNoteLabel,
  isMeaningfulPersonalNoteHtml,
  PersonalNoteResponse,
} from "@/app/lib/personal-notes/definitions"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { PersonalNoteDiscardDialog } from "@/components/personal-note-discard-dialog"
import { PersonalNoteEditor } from "@/components/personal-note-editor"
import { PersonalNoteSaveBar } from "@/components/personal-note-save-bar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface PersonalNotesQuickSheetProps {
  canCreate: boolean
  canUpdate: boolean
}

type PendingDiscardAction = null | (() => void)

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Chưa có dữ liệu"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Ngày không hợp lệ"
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function PersonalNotesQuickSheet({
  canCreate,
  canUpdate,
}: PersonalNotesQuickSheetProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [notes, setNotes] = React.useState<PersonalNoteResponse[]>([])
  const [selectedNote, setSelectedNote] =
    React.useState<PersonalNoteResponse | null>(null)
  const [draftHtml, setDraftHtml] = React.useState(
    createEmptyPersonalNoteHtml()
  )
  const [savedHtml, setSavedHtml] = React.useState(
    createEmptyPersonalNoteHtml()
  )
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [discardOpen, setDiscardOpen] = React.useState(false)
  const [pendingDiscardAction, setPendingDiscardAction] =
    React.useState<PendingDiscardAction>(null)

  const isDirty = draftHtml !== savedHtml
  const isNewNote = selectedNote === null
  const canPersist = isNewNote ? canCreate : canUpdate
  const canSave =
    canPersist && isDirty && isMeaningfulPersonalNoteHtml(draftHtml)

  const hydrateNote = React.useCallback((note: PersonalNoteResponse | null) => {
    const nextHtml = note?.contentHtml ?? createEmptyPersonalNoteHtml()
    setSelectedNote(note)
    setDraftHtml(nextHtml)
    setSavedHtml(nextHtml)
  }, [])

  const loadNotes = React.useCallback(async () => {
    setIsLoading(true)

    try {
      const page = await getPersonalNotes({
        filter: "",
        page: 0,
        size: 10,
        sort: [{ field: "lastModifiedDate", direction: "desc" }],
      })
      const nextNotes = page.content ?? []
      setNotes(nextNotes)

      if (nextNotes[0]) {
        const detail = await getPersonalNote(nextNotes[0].id)
        hydrateNote(detail)
      } else {
        hydrateNote(null)
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể tải ghi chú"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [hydrateNote])

  React.useEffect(() => {
    if (open) {
      void loadNotes()
    }
  }, [loadNotes, open])

  function runOrConfirmDiscard(action: () => void) {
    if (!isDirty) {
      action()
      return
    }

    setPendingDiscardAction(() => action)
    setDiscardOpen(true)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      const closeSheet = () => {
        setIsFullscreen(false)
        setOpen(false)
      }

      if (isDirty) {
        runOrConfirmDiscard(closeSheet)
        return
      }

      closeSheet()
      return
    }

    setOpen(true)
  }

  function handleConfirmDiscard() {
    const action = pendingDiscardAction
    setDiscardOpen(false)
    setPendingDiscardAction(null)
    action?.()
  }

  async function handleSelectNote(noteId: number) {
    runOrConfirmDiscard(async () => {
      try {
        const note = await getPersonalNote(noteId)
        hydrateNote(note)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Không thể tải ghi chú"
        toast.error(message)
      }
    })
  }

  function handleNewNote() {
    runOrConfirmDiscard(() => hydrateNote(null))
  }

  async function handleSave() {
    if (!canSave) {
      return
    }

    setIsSaving(true)

    const result = selectedNote
      ? await updatePersonalNote(selectedNote.id, { contentHtml: draftHtml })
      : await createPersonalNote({ contentHtml: draftHtml })

    setIsSaving(false)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success("Đã lưu ghi chú.")
    hydrateNote(result.data)
    void loadNotes()
    router.refresh()
  }

  function handleToggleFullscreen() {
    setIsFullscreen((current) => !current)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button type="button" variant="outline">
            <StickyNoteIcon data-icon="inline-start" />
            Ghi chú
          </Button>
        </SheetTrigger>
        <SheetContent
          className={cn(
            "gap-0 overflow-hidden",
            isFullscreen
              ? "!inset-0 !h-dvh !w-screen !max-w-none !border-0"
              : "!w-[calc(100vw-1rem)] !max-w-[calc(100vw-1rem)] sm:!w-[min(80vw,calc(100vw-2rem))] sm:!max-w-[calc(100vw-2rem)]"
          )}
        >
          <SheetTitle className="sr-only">Ghi chú</SheetTitle>

          <div className="flex items-center gap-2 border-b p-3 pr-12">
            {canCreate ? (
              <Button type="button" onClick={handleNewNote}>
                <PlusIcon data-icon="inline-start" />
                Ghi chú mới
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={
                isFullscreen ? "Thu nhỏ ghi chú" : "Phóng to ghi chú"
              }
              onClick={handleToggleFullscreen}
            >
              {isFullscreen ? (
                <MinimizeIcon data-icon="inline-start" />
              ) : (
                <ExpandIcon data-icon="inline-start" />
              )}
            </Button>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden xl:grid-cols-[16rem_minmax(0,1fr)]">
            <aside className="min-h-0 border-b p-4 xl:border-r xl:border-b-0">
              <div className="grid max-h-44 grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-2 overflow-y-auto xl:flex xl:max-h-none xl:flex-col">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))
                ) : notes.length > 0 ? (
                  notes.map((note) => {
                    const isSelected = selectedNote?.id === note.id
                    const updatedAt = note.lastModifiedDate ?? note.createdDate

                    return (
                      <button
                        key={note.id}
                        type="button"
                        className={cn(
                          "flex min-w-0 flex-col gap-1 rounded-lg border px-3 py-2 text-left transition-colors hover:bg-muted/50",
                          isSelected ? "bg-muted" : "bg-background"
                        )}
                        onClick={() => void handleSelectNote(note.id)}
                      >
                        <span className="truncate text-sm font-medium">
                          {getPersonalNoteLabel(note.contentHtml)}
                        </span>
                        <AppTimeMetadata icon={CalendarClockIcon}>
                          Cập nhật {formatDateTime(updatedAt)}
                        </AppTimeMetadata>
                      </button>
                    )
                  })
                ) : (
                  <Empty className="min-h-36 border xl:min-h-[220px]">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <FileTextIcon />
                      </EmptyMedia>
                      <EmptyTitle>Chưa có ghi chú</EmptyTitle>
                      <EmptyDescription>
                        Tạo ghi chú đầu tiên để lưu công thức hoặc lệnh trade.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </div>
            </aside>

            <section className="flex min-h-0 flex-col">
              <PersonalNoteEditor
                className="min-h-0 flex-1 rounded-none border-0"
                editorClassName="min-h-[420px]"
                value={draftHtml}
                readOnly={!canPersist}
                onChange={setDraftHtml}
              />
              <PersonalNoteSaveBar
                canSave={canSave}
                dirty={isDirty}
                isPending={isSaving}
                onCancel={() => setDraftHtml(savedHtml)}
                onSave={() => void handleSave()}
                savedLabel={
                  selectedNote ? "Đã tải ghi chú đã lưu" : "Ghi chú mới"
                }
              />
            </section>
          </div>
        </SheetContent>
      </Sheet>

      <PersonalNoteDiscardDialog
        open={discardOpen}
        onOpenChange={setDiscardOpen}
        onConfirm={handleConfirmDiscard}
      />
    </>
  )
}

export { PersonalNotesQuickSheet }
