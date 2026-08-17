"use client"

import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react"
import {
  CircleAlertIcon,
  EllipsisIcon,
  MaximizeIcon,
  MinimizeIcon,
  NotebookPenIcon,
  PencilIcon,
  SaveIcon,
  SquarePenIcon,
  StickyNoteIcon,
  Trash2Icon,
} from "lucide-react"
import type { Value } from "platejs"
import { toast } from "sonner"

import {
  createPersonalNote,
  deletePersonalNote,
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
  PERSONAL_NOTE_DELETE_PERMISSION,
  PERSONAL_NOTE_UPDATE_PERMISSION,
} from "@/app/lib/personal-notes/permissions"
import { PlateEditor } from "@/components/editor/plate-editor"
import { reconcileDeletedPersonalNote } from "@/components/personal-note-list-state"
import {
  createPersonalNoteAutosave,
  type PersonalNoteSaveStatus,
} from "@/components/personal-note-autosave"
import { useHasPermission } from "@/components/permission-provider"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Item, ItemActions, ItemContent, ItemGroup } from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const PERSONAL_NOTES_PAGE_SIZE = 20
const PERSONAL_NOTES_SHEET_CONTENT_ID = "personal-notes-quick-sheet-content"
const EMPTY_PERSONAL_NOTE: Value = [{ children: [{ text: "" }], type: "p" }]

type DetailStatus = "idle" | "loading" | "ready" | "error" | "unsupported"

function PersonalNotesQuickSheet() {
  const { dictionary, formatMessage } = useLocalization()
  const personalNotes = dictionary.personalNotes
  const canCreate = useHasPermission(PERSONAL_NOTE_CREATE_PERMISSION)
  const canUpdate = useHasPermission(PERSONAL_NOTE_UPDATE_PERMISSION)
  const canDelete = useHasPermission(PERSONAL_NOTE_DELETE_PERMISSION)
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
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState<PersonalNoteResponse | null>(
    null
  )
  const [renameValue, setRenameValue] = useState("")
  const [renameError, setRenameError] = useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] =
    useState<PersonalNoteSummaryResponse | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isRenamePending, startRenameTransition] = useTransition()
  const [isDeletePending, startDeleteTransition] = useTransition()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const autosaveRef = useRef<ReturnType<
    typeof createPersonalNoteAutosave
  > | null>(null)
  const sheetContentRef = useRef<HTMLDivElement | null>(null)
  const detailRequestRef = useRef(0)
  const editorKeyRef = useRef(0)
  const activeNoteRef = useRef<PersonalNoteResponse | null>(null)
  const lastActionTriggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === sheetContentRef.current)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  function reconcileSummary(note: PersonalNoteResponse) {
    const summary: PersonalNoteSummaryResponse = {
      id: note.id,
      title: note.title,
      contentSchemaVersion: note.contentSchemaVersion,
      createdDate: note.createdDate,
      lastModifiedDate: note.lastModifiedDate,
    }

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

  function syncActiveNote(note: PersonalNoteResponse) {
    activeNoteRef.current = note
    setSelectedNoteId(note.id)
    setEditorInitialValue(note.content)
    reconcileSummary(note)
  }

  function initializeEditor(
    note: PersonalNoteResponse | null,
    editable: boolean
  ) {
    const content = note?.content ?? EMPTY_PERSONAL_NOTE
    activeNoteRef.current = note
    setEditorInitialValue(content)
    setEditorReadOnly(!editable)
    setSaveStatus("idle")
    editorKeyRef.current += 1
    setEditorKey(editorKeyRef.current)

    autosaveRef.current = editable
      ? createPersonalNoteAutosave({
          noteId: note?.id ?? null,
          onSaved: syncActiveNote,
          onStatusChange: setSaveStatus,
          persist: (currentNoteId, currentContent) => {
            const request: PersonalNoteMutationRequest = {
              title: activeNoteRef.current?.title ?? null,
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
    return autosaveRef.current?.flush() ?? true
  }

  async function loadNoteDetail(noteId: number) {
    if (noteId === selectedNoteId && detailStatus === "ready") {
      return activeNoteRef.current
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
        activeNoteRef.current = note
        setDetailStatus("unsupported")
        return null
      }

      initializeEditor(note, canUpdate)
      return note
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
            initializeEditor(null, true)
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
  }

  function handleSave() {
    if (saveStatus !== "dirty" && saveStatus !== "error") return
    void flushCurrentEditor()
  }

  function handleSheetKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (
      detailStatus !== "ready" ||
      !editorInitialValue ||
      editorReadOnly ||
      (!event.ctrlKey && !event.metaKey) ||
      event.key.toLowerCase() !== "s"
    ) {
      return
    }

    event.preventDefault()
    handleSave()
  }

  async function handleFullscreenToggle() {
    const sheetContent = sheetContentRef.current
    if (!sheetContent || !document.fullscreenEnabled) {
      toast.error(personalNotes.fullscreenUnavailable)
      return
    }

    try {
      if (document.fullscreenElement === sheetContent) {
        await document.exitFullscreen()
      } else {
        await sheetContent.requestFullscreen()
      }
    } catch {
      toast.error(personalNotes.fullscreenFailed)
    }
  }

  async function handleNewNote() {
    if (!canCreate || !notesPage || hasError) return
    if (!(await flushCurrentEditor())) return

    detailRequestRef.current += 1
    setSelectedNoteId(null)
    initializeEditor(null, true)
  }

  async function handleRenameSelect(note: PersonalNoteSummaryResponse) {
    if (!canUpdate || isRenamePending || isDeletePending) return
    if (!(await flushCurrentEditor())) return

    try {
      const detail =
        activeNoteRef.current?.id === note.id
          ? activeNoteRef.current
          : await getPersonalNote(note.id)

      if (
        detail.contentSchemaVersion !== PERSONAL_NOTE_CONTENT_SCHEMA_VERSION
      ) {
        toast.error(personalNotes.renameError)
        return
      }

      setRenameTarget(detail)
      setRenameValue(detail.title ?? "")
      setRenameError(null)
      setRenameOpen(true)
    } catch {
      toast.error(personalNotes.renameError)
    }
  }

  function handleRenameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!renameTarget || isRenamePending) return

    const target = renameTarget
    const trimmedTitle = renameValue.trim()
    setRenameError(null)
    startRenameTransition(async () => {
      const result = await updatePersonalNote(target.id, {
        title: trimmedTitle || null,
        content: target.content,
        contentSchemaVersion: PERSONAL_NOTE_CONTENT_SCHEMA_VERSION,
      })

      if (!result.success) {
        setRenameError(result.error || personalNotes.renameError)
        return
      }

      reconcileSummary(result.data)
      if (activeNoteRef.current?.id === result.data.id) {
        activeNoteRef.current = result.data
      }
      setRenameOpen(false)
      setRenameTarget(null)
      toast.success(personalNotes.renameSuccess)
    })
  }

  function handleDeleteSelect(note: PersonalNoteSummaryResponse) {
    if (!canDelete || isRenamePending || isDeletePending) return
    setDeleteTarget(note)
    setDeleteError(null)
    setDeleteOpen(true)
  }

  function handleDelete() {
    if (!deleteTarget || !notesPage || isDeletePending) return

    const target = deleteTarget
    const reconciled = reconcileDeletedPersonalNote(
      notesPage,
      target.id,
      selectedNoteId
    )
    setDeleteError(null)
    startDeleteTransition(async () => {
      const result = await deletePersonalNote(target.id)
      if (!result.success) {
        setDeleteError(result.error || personalNotes.deleteError)
        return
      }

      setNotesPage(reconciled.page)
      setDeleteOpen(false)
      setDeleteTarget(null)
      toast.success(personalNotes.deleteSuccess)

      if (!reconciled.deletedSelected) return

      detailRequestRef.current += 1
      autosaveRef.current = null
      activeNoteRef.current = null
      setSelectedNoteId(null)
      setEditorInitialValue(null)
      setSaveStatus("idle")

      if (reconciled.nextSelectedId !== null) {
        void loadNoteDetail(reconciled.nextSelectedId)
      } else if (reconciled.page.totalElements > 0) {
        loadNotes(0, false)
      } else if (canCreate) {
        initializeEditor(null, true)
      } else {
        setDetailStatus("idle")
      }
    })
  }

  const hasProvisionalNote =
    selectedNoteId === null && detailStatus === "ready" && !editorReadOnly

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild aria-controls={PERSONAL_NOTES_SHEET_CONTENT_ID}>
        <Button type="button" variant="outline">
          <NotebookPenIcon data-icon="inline-start" />
          {personalNotes.trigger}
        </Button>
      </SheetTrigger>
      <SheetContent
        ref={sheetContentRef}
        id={PERSONAL_NOTES_SHEET_CONTENT_ID}
        showCloseButton={false}
        className={cn(
          "gap-0 overflow-hidden data-[side=right]:w-full",
          isFullscreen
            ? "shadow-none data-[side=right]:border-0 data-[side=right]:sm:max-w-none"
            : "data-[side=right]:sm:max-w-6xl"
        )}
        data-fullscreen={isFullscreen}
        onKeyDownCapture={handleSheetKeyDown}
      >
        <SheetTitle className="sr-only">{personalNotes.trigger}</SheetTitle>
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <aside
            aria-busy={isPending}
            aria-label={personalNotes.listLabel}
            className="flex max-h-64 shrink-0 flex-col border-b md:max-h-none md:w-72 md:border-r md:border-b-0"
          >
            <div className="flex shrink-0 items-center gap-2 p-4 pb-0">
              {canCreate && notesPage && !hasError ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={personalNotes.draftLabel}
                  onClick={() => void handleNewNote()}
                >
                  <SquarePenIcon />
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={
                  isFullscreen
                    ? personalNotes.exitFullscreen
                    : personalNotes.enterFullscreen
                }
                aria-pressed={isFullscreen}
                onClick={() => void handleFullscreenToggle()}
              >
                {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
              </Button>
            </div>
            <ScrollArea className="min-h-0 flex-1 p-4">
              {isPending && !notesPage ? (
                <div role="status">
                  <span className="sr-only">{personalNotes.loading}</span>
                  <ItemGroup aria-hidden="true">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Item key={index} size="sm" variant="outline">
                        <ItemContent>
                          <Skeleton className="h-4 w-24" />
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
                        </ItemContent>
                      </Item>
                    ) : null}
                    {notesPage?.content.map((note) => {
                      const isSelected = selectedNoteId === note.id
                      const displayTitle =
                        note.title?.trim() || personalNotes.untitled
                      const actionsDisabled =
                        isRenamePending ||
                        isDeletePending ||
                        saveStatus === "saving"

                      return (
                        <Item
                          key={note.id}
                          role="listitem"
                          className="cursor-pointer"
                          size="sm"
                          variant={isSelected ? "muted" : "outline"}
                          onClick={() => void loadNoteDetail(note.id)}
                        >
                          <ItemContent>
                            <button
                              type="button"
                              className="w-full min-w-0 cursor-pointer text-left"
                              aria-current={isSelected ? "true" : undefined}
                            >
                              <span className="line-clamp-1 text-sm leading-snug font-medium">
                                {displayTitle}
                              </span>
                            </button>
                          </ItemContent>
                          {canUpdate || canDelete ? (
                            <ItemActions
                              onClick={(event) => event.stopPropagation()}
                            >
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    disabled={actionsDisabled}
                                    aria-label={formatMessage(
                                      personalNotes.actionsLabel,
                                      { title: displayTitle }
                                    )}
                                    onFocus={(event) => {
                                      lastActionTriggerRef.current =
                                        event.currentTarget
                                    }}
                                  >
                                    <EllipsisIcon />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuGroup>
                                    {canUpdate ? (
                                      <DropdownMenuItem
                                        disabled={actionsDisabled}
                                        onSelect={() =>
                                          void handleRenameSelect(note)
                                        }
                                      >
                                        <PencilIcon />
                                        {personalNotes.rename}
                                      </DropdownMenuItem>
                                    ) : null}
                                    {canDelete ? (
                                      <DropdownMenuItem
                                        variant="destructive"
                                        disabled={actionsDisabled}
                                        onSelect={() =>
                                          handleDeleteSelect(note)
                                        }
                                      >
                                        <Trash2Icon />
                                        {personalNotes.delete}
                                      </DropdownMenuItem>
                                    ) : null}
                                  </DropdownMenuGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </ItemActions>
                          ) : null}
                        </Item>
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
            </ScrollArea>
          </aside>
          <div
            className="flex min-h-0 min-w-0 flex-1 flex-col"
            aria-busy={detailStatus === "loading"}
          >
            <div className="relative min-h-0 flex-1 overflow-auto">
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
                <>
                  <PlateEditor
                    bodyPlaceholder={personalNotes.bodyPlaceholder}
                    containerClassName="h-full"
                    key={editorKey}
                    initialValue={editorInitialValue}
                    onValueChange={
                      editorReadOnly ? undefined : handleEditorChange
                    }
                    readOnly={editorReadOnly}
                  />
                  {!editorReadOnly ? (
                    <div className="pointer-events-none absolute right-4 bottom-4 z-10 flex max-w-[calc(100%-2rem)] flex-col items-end gap-2">
                      {saveStatus === "error" ? (
                        <span
                          className="line-clamp-2 max-w-sm text-right text-xs text-destructive"
                          role="alert"
                        >
                          {personalNotes.saveError}
                        </span>
                      ) : null}
                      <span
                        className="sr-only"
                        role="status"
                        aria-live="polite"
                      >
                        {saveStatus === "saving"
                          ? personalNotes.saving
                          : saveStatus === "saved"
                            ? personalNotes.saved
                            : null}
                      </span>
                      <Button
                        type="button"
                        size="icon-lg"
                        className="pointer-events-auto"
                        aria-label={
                          saveStatus === "saving"
                            ? personalNotes.saving
                            : dictionary.common.save
                        }
                        aria-keyshortcuts="Control+S Meta+S"
                        disabled={
                          saveStatus !== "dirty" && saveStatus !== "error"
                        }
                        onClick={handleSave}
                      >
                        {saveStatus === "saving" ? (
                          <Spinner
                            data-icon="inline-start"
                            aria-hidden="true"
                          />
                        ) : (
                          <SaveIcon data-icon="inline-start" />
                        )}
                      </Button>
                    </div>
                  ) : null}
                </>
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
        </div>
      </SheetContent>

      <Dialog
        open={renameOpen}
        onOpenChange={(nextOpen) => {
          if (isRenamePending) return
          setRenameOpen(nextOpen)
          if (!nextOpen) setRenameError(null)
        }}
      >
        <DialogContent
          showCloseButton={!isRenamePending}
          finalFocus={() =>
            lastActionTriggerRef.current?.isConnected
              ? lastActionTriggerRef.current
              : true
          }
        >
          <form className="contents" onSubmit={handleRenameSubmit}>
            <DialogHeader>
              <DialogTitle>{personalNotes.renameTitle}</DialogTitle>
              <DialogDescription>
                {personalNotes.renameDescription}
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field data-invalid={Boolean(renameError)}>
                <FieldLabel htmlFor="personal-note-title">
                  {personalNotes.titleLabel}
                </FieldLabel>
                <Input
                  id="personal-note-title"
                  value={renameValue}
                  maxLength={255}
                  disabled={isRenamePending}
                  aria-invalid={Boolean(renameError)}
                  onChange={(event) => setRenameValue(event.target.value)}
                />
                <FieldError>{renameError}</FieldError>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                disabled={isRenamePending}
                onClick={() => setRenameOpen(false)}
              >
                {dictionary.common.cancel}
              </Button>
              <Button type="submit" disabled={isRenamePending}>
                {isRenamePending ? (
                  <Spinner data-icon="inline-start" aria-hidden="true" />
                ) : null}
                {isRenamePending
                  ? personalNotes.renamePending
                  : dictionary.common.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteOpen}
        onOpenChange={(nextOpen) => {
          if (isDeletePending) return
          setDeleteOpen(nextOpen)
          if (!nextOpen) setDeleteError(null)
        }}
      >
        <AlertDialogContent
          onCloseAutoFocus={(event) => {
            if (lastActionTriggerRef.current?.isConnected) {
              event.preventDefault()
              lastActionTriggerRef.current.focus()
            }
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>{personalNotes.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.id === selectedNoteId &&
              (saveStatus === "dirty" || saveStatus === "error")
                ? personalNotes.deleteDirtyDescription
                : personalNotes.deleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FieldError>{deleteError}</FieldError>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletePending}>
              {dictionary.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeletePending}
              onClick={(event) => {
                event.preventDefault()
                handleDelete()
              }}
            >
              {isDeletePending ? (
                <Spinner data-icon="inline-start" aria-hidden="true" />
              ) : (
                <Trash2Icon data-icon="inline-start" />
              )}
              {isDeletePending
                ? personalNotes.deletePending
                : personalNotes.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  )
}

export { PersonalNotesQuickSheet }
