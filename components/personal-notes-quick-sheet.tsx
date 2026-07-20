"use client"

import { useRef, useState, useTransition } from "react"
import {
  CircleAlertIcon,
  Clock3Icon,
  SquarePenIcon,
  StickyNoteIcon,
} from "lucide-react"
import type { Value } from "platejs"
import { useDebouncedCallback } from "use-debounce"

import {
  createPersonalNote,
  getPersonalNote,
  getPersonalNotes,
  updatePersonalNote,
} from "@/app/api/personal-notes/action"
import type { Page } from "@/app/lib/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import {
  PERSONAL_NOTE_CONTENT_SCHEMA_VERSION,
  type PersonalNoteMutationRequest,
  type PersonalNoteResponse,
  type PersonalNoteSummaryResponse,
} from "@/app/lib/personal-notes/definitions"
import {
  PERSONAL_NOTE_CREATE_PERMISSION,
  PERSONAL_NOTE_UPDATE_PERMISSION,
} from "@/app/lib/personal-notes/permissions"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { PlateEditor } from "@/components/editor/plate-editor"
import {
  createPersonalNoteAutosave,
  type PersonalNoteSaveStatus,
} from "@/components/personal-note-autosave"
import { useHasPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Item, ItemContent, ItemGroup } from "@/components/ui/item"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

const PERSONAL_NOTES_PAGE_SIZE = 20
const PERSONAL_NOTES_SHEET_CONTENT_ID = "personal-notes-quick-sheet-content"
const EMPTY_PERSONAL_NOTE: Value = [{ children: [{ text: "" }], type: "p" }]

type DetailStatus = "idle" | "loading" | "ready" | "error" | "unsupported"

function PersonalNotesQuickSheet() {
  const { dictionary, formatDateTime, formatMessage } = useLocalization()
  const personalNotes = dictionary.personalNotes
  const canCreate = useHasPermission(PERSONAL_NOTE_CREATE_PERMISSION)
  const canUpdate = useHasPermission(PERSONAL_NOTE_UPDATE_PERMISSION)
  const [open, setOpen] = useState(false)
  const [notesPage, setNotesPage] =
    useState<Page<PersonalNoteSummaryResponse> | null>(null)
  const [hasError, setHasError] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)
  const [detailStatus, setDetailStatus] = useState<DetailStatus>("idle")
  const [editorInitialValue, setEditorInitialValue] = useState<Value | null>(
    null
  )
  const [editorReadOnly, setEditorReadOnly] = useState(true)
  const [editorKey, setEditorKey] = useState(0)
  const [saveStatus, setSaveStatus] = useState<PersonalNoteSaveStatus>("idle")
  const [isPending, startTransition] = useTransition()
  const autosaveRef = useRef<ReturnType<
    typeof createPersonalNoteAutosave
  > | null>(null)
  const detailRequestRef = useRef(0)
  const editorKeyRef = useRef(0)

  const debouncedAutosave = useDebouncedCallback(() => {
    void autosaveRef.current?.flush()
  }, 1000)

  function updateLocalSummary(note: PersonalNoteResponse) {
    const summary: PersonalNoteSummaryResponse = {
      id: note.id,
      contentSchemaVersion: note.contentSchemaVersion,
      createdDate: note.createdDate,
      lastModifiedDate: note.lastModifiedDate,
    }

    setSelectedNoteId(note.id)
    setNotesPage((currentPage) => {
      if (!currentPage) return currentPage

      const exists = currentPage.content.some((item) => item.id === note.id)
      return {
        ...currentPage,
        content: exists
          ? currentPage.content.map((item) =>
              item.id === note.id ? summary : item
            )
          : [summary, ...currentPage.content],
        empty: false,
        numberOfElements: exists
          ? currentPage.numberOfElements
          : currentPage.numberOfElements + 1,
        totalElements: exists
          ? currentPage.totalElements
          : currentPage.totalElements + 1,
        totalPages: Math.max(1, currentPage.totalPages),
      }
    })
  }

  function initializeEditor(
    noteId: number | null,
    content: Value,
    editable: boolean
  ) {
    debouncedAutosave.cancel()
    setEditorInitialValue(content)
    setEditorReadOnly(!editable)
    setSaveStatus("idle")
    editorKeyRef.current += 1
    setEditorKey(editorKeyRef.current)

    autosaveRef.current = editable
      ? createPersonalNoteAutosave({
          noteId,
          onSaved: updateLocalSummary,
          onStatusChange: setSaveStatus,
          persist: (currentNoteId, currentContent) => {
            const request: PersonalNoteMutationRequest = {
              content: currentContent,
              contentSchemaVersion: PERSONAL_NOTE_CONTENT_SCHEMA_VERSION,
            }
            return currentNoteId === null
              ? createPersonalNote(request)
              : updatePersonalNote(currentNoteId, request)
          },
        })
      : null

    setDetailStatus("ready")
  }

  async function flushCurrentEditor() {
    debouncedAutosave.cancel()
    return autosaveRef.current?.flush() ?? true
  }

  async function loadNoteDetail(noteId: number) {
    if (
      noteId === selectedNoteId &&
      detailStatus !== "error" &&
      detailStatus !== "unsupported"
    ) {
      return true
    }

    if (!(await flushCurrentEditor())) return false

    const requestId = ++detailRequestRef.current
    autosaveRef.current = null
    setSelectedNoteId(noteId)
    setEditorInitialValue(null)
    setSaveStatus("idle")
    setDetailStatus("loading")

    try {
      const note = await getPersonalNote(noteId)
      if (requestId !== detailRequestRef.current) return false

      if (note.contentSchemaVersion !== PERSONAL_NOTE_CONTENT_SCHEMA_VERSION) {
        setDetailStatus("unsupported")
        return true
      }

      initializeEditor(note.id, note.content, canUpdate)
      return true
    } catch {
      if (requestId === detailRequestRef.current) {
        setDetailStatus("error")
      }
      return false
    }
  }

  function loadNotes(page: number, append: boolean) {
    if (isPending) return

    setHasError(false)
    startTransition(async () => {
      try {
        const nextPage = await getPersonalNotes({
          filter: "",
          page,
          size: PERSONAL_NOTES_PAGE_SIZE,
          sort: [],
        })

        setNotesPage((currentPage) => {
          if (!append || !currentPage) return nextPage

          return {
            ...nextPage,
            content: [...currentPage.content, ...nextPage.content],
          }
        })

        if (!append && autosaveRef.current === null) {
          const firstNote = nextPage.content[0]
          if (firstNote) {
            void loadNoteDetail(firstNote.id)
          } else if (canCreate) {
            initializeEditor(null, EMPTY_PERSONAL_NOTE, true)
          } else {
            setDetailStatus("idle")
          }
        }
      } catch {
        setHasError(true)
      }
    })
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setOpen(true)
      if (!notesPage && !isPending) {
        loadNotes(0, false)
      }
      return
    }

    void (async () => {
      if (!(await flushCurrentEditor())) return
      detailRequestRef.current += 1
      setOpen(false)
    })()
  }

  function handleEditorChange(value: Value) {
    autosaveRef.current?.change(value)
    debouncedAutosave()
  }

  async function handleNewNote() {
    if (!canCreate || !notesPage || hasError) return
    if (!(await flushCurrentEditor())) return

    detailRequestRef.current += 1
    setSelectedNoteId(null)
    initializeEditor(null, EMPTY_PERSONAL_NOTE, true)
  }

  const autosaveStatus =
    saveStatus === "saving" ? (
      <span
        className="flex items-center gap-1 text-xs text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        <Spinner aria-hidden="true" />
        {personalNotes.saving}
      </span>
    ) : saveStatus === "saved" ? (
      <span
        className="text-xs text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        {personalNotes.saved}
      </span>
    ) : saveStatus === "error" ? (
      <span className="line-clamp-2 text-xs text-destructive" role="alert">
        {personalNotes.saveError}
      </span>
    ) : null

  const hasProvisionalNote =
    selectedNoteId === null && detailStatus === "ready" && !editorReadOnly

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild aria-controls={PERSONAL_NOTES_SHEET_CONTENT_ID}>
        <Button type="button" variant="outline">
          <StickyNoteIcon data-icon="inline-start" />
          {personalNotes.trigger}
        </Button>
      </SheetTrigger>
      <SheetContent
        id={PERSONAL_NOTES_SHEET_CONTENT_ID}
        showCloseButton={false}
        className="gap-0 overflow-hidden data-[side=right]:w-full data-[side=right]:sm:max-w-4xl"
      >
        <SheetTitle className="sr-only">{personalNotes.trigger}</SheetTitle>
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <aside
            aria-busy={isPending}
            aria-label={personalNotes.listLabel}
            className="flex max-h-64 shrink-0 flex-col border-b md:max-h-none md:w-72 md:border-r md:border-b-0"
          >
            {canCreate && notesPage && !hasError ? (
              <div className="shrink-0 p-4 pb-0">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => void handleNewNote()}
                >
                  <SquarePenIcon data-icon="inline-start" />
                  {personalNotes.draftLabel}
                </Button>
              </div>
            ) : null}
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {isPending && !notesPage ? (
                <div role="status">
                  <span className="sr-only">{personalNotes.loading}</span>
                  <ItemGroup aria-hidden="true">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Item key={index} size="sm" variant="outline">
                        <ItemContent>
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-36" />
                        </ItemContent>
                      </Item>
                    ))}
                  </ItemGroup>
                </div>
              ) : hasError ? (
                <Empty role="alert">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <CircleAlertIcon />
                    </EmptyMedia>
                    <EmptyTitle>{personalNotes.errorTitle}</EmptyTitle>
                    <EmptyDescription>
                      {personalNotes.errorDescription}
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => loadNotes(0, false)}
                    >
                      {personalNotes.retry}
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : hasProvisionalNote || notesPage?.content.length ? (
                <div className="flex flex-col gap-4">
                  <ItemGroup>
                    {hasProvisionalNote ? (
                      <Item
                        role="listitem"
                        aria-current="true"
                        size="sm"
                        variant="muted"
                      >
                        <ItemContent>
                          <span className="line-clamp-1 text-sm leading-snug font-medium">
                            {personalNotes.draftLabel}
                          </span>
                          {autosaveStatus}
                        </ItemContent>
                      </Item>
                    ) : null}
                    {notesPage?.content.map((note) => {
                      const timestamp =
                        note.lastModifiedDate || note.createdDate
                      const isSelected = selectedNoteId === note.id

                      return (
                        <div key={note.id} role="listitem">
                          <Item
                            asChild
                            size="sm"
                            variant={isSelected ? "muted" : "outline"}
                          >
                            <button
                              type="button"
                              aria-current={isSelected ? "true" : undefined}
                              onClick={() => void loadNoteDetail(note.id)}
                            >
                              <span className="flex min-w-0 flex-1 flex-col gap-1 text-left">
                                <span className="line-clamp-1 text-sm leading-snug font-medium">
                                  {formatMessage(personalNotes.noteLabel, {
                                    id: note.id,
                                  })}
                                </span>
                                <AppTimeMetadata icon={Clock3Icon}>
                                  {formatMessage(personalNotes.lastUpdated, {
                                    time: formatDateTime(timestamp),
                                  })}
                                </AppTimeMetadata>
                                {isSelected ? autosaveStatus : null}
                              </span>
                            </button>
                          </Item>
                        </div>
                      )
                    })}
                  </ItemGroup>
                  {notesPage && !notesPage.last && (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => loadNotes(notesPage.number + 1, true)}
                    >
                      {isPending && (
                        <Spinner
                          data-icon="inline-start"
                          aria-label={personalNotes.loading}
                        />
                      )}
                      {personalNotes.loadMore}
                    </Button>
                  )}
                </div>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <StickyNoteIcon />
                    </EmptyMedia>
                    <EmptyTitle>{personalNotes.emptyTitle}</EmptyTitle>
                    <EmptyDescription>
                      {personalNotes.emptyDescription}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </div>
          </aside>
          <div
            className="min-h-0 min-w-0 flex-1 overflow-auto"
            aria-busy={detailStatus === "loading"}
          >
            {detailStatus === "loading" ? (
              <div className="p-6" role="status">
                <span className="sr-only">{personalNotes.detailLoading}</span>
                <div className="flex flex-col gap-3" aria-hidden="true">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ) : detailStatus === "error" ? (
              <Empty role="alert">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CircleAlertIcon />
                  </EmptyMedia>
                  <EmptyTitle>{personalNotes.detailErrorTitle}</EmptyTitle>
                  <EmptyDescription>
                    {personalNotes.detailErrorDescription}
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (selectedNoteId !== null) {
                        void loadNoteDetail(selectedNoteId)
                      }
                    }}
                  >
                    {personalNotes.retry}
                  </Button>
                </EmptyContent>
              </Empty>
            ) : detailStatus === "unsupported" ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CircleAlertIcon />
                  </EmptyMedia>
                  <EmptyTitle>{personalNotes.unsupportedTitle}</EmptyTitle>
                  <EmptyDescription>
                    {personalNotes.unsupportedDescription}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : detailStatus === "ready" && editorInitialValue ? (
              <PlateEditor
                key={editorKey}
                initialValue={editorInitialValue}
                onValueChange={editorReadOnly ? undefined : handleEditorChange}
                readOnly={editorReadOnly}
              />
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <StickyNoteIcon />
                  </EmptyMedia>
                  <EmptyTitle>{personalNotes.emptyTitle}</EmptyTitle>
                  <EmptyDescription>
                    {personalNotes.emptyDescription}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { PersonalNotesQuickSheet }
