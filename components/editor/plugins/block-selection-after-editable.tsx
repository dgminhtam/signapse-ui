"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import {
  BlockSelectionPlugin,
  copySelectedBlocks,
  pasteSelectedBlocks,
  selectInsertedBlocks,
  useSelectionArea,
} from "@platejs/selection/react"
import { KEYS, PathApi, isHotkey } from "platejs"
import {
  useEditorContainerRef,
  useEditorPlugin,
  useEditorRef,
  usePluginOption,
} from "platejs/react"

import { useOverlayPortalContainer } from "@/components/ui/overlay-portal-container"

// Forked from @platejs/selection@53.1.6 BlockSelectionAfterEditable.
// The intentional difference is the local portal host instead of document.body.
// ponytail: re-sync this renderer when @platejs/selection changes; remove the
// fork when Plate exposes a configurable shadow-input portal host.
export function BlockSelectionAfterEditable() {
  const editor = useEditorRef()
  const { api, getOption, getOptions, setOption } = useEditorPlugin({
    key: KEYS.blockSelection,
  })
  const isSelectingSome = usePluginOption(
    BlockSelectionPlugin,
    "isSelectingSome"
  )
  const selectedIds = usePluginOption(BlockSelectionPlugin, "selectedIds")

  const removeSelectedBlocks = React.useCallback(
    (options: { selectPrevious?: boolean } = {}) => {
      const entries = [
        ...editor.api.nodes({
          at: [],
          match: (node) => {
            const id = (node as { id?: string }).id

            return Boolean(id && selectedIds?.has(id))
          },
        }),
      ]

      if (entries.length === 0) return null

      const firstPath = entries[0][1]

      editor.tf.withoutNormalizing(() => {
        for (const [node, path] of [...entries].reverse()) {
          const id = (node as { id?: string }).id

          editor.tf.removeNodes({ at: path })
          if (id) api.blockSelection.delete(id)
        }

        if (editor.children.length === 0) {
          editor.meta._forceFocus = true
          editor.tf.focus()
          editor.meta._forceFocus = false
        } else if (options.selectPrevious) {
          const prevPath = PathApi.previous(firstPath)

          if (prevPath) {
            const prevEntry = editor.api.block({ at: prevPath })
            const id = (prevEntry?.[0] as { id?: string } | undefined)?.id

            if (id) setOption("selectedIds", new Set([id]))
          }
        }
      })

      return firstPath
    },
    [editor, api.blockSelection, selectedIds, setOption]
  )

  useSelectionArea()

  const inputRef = React.useRef<HTMLInputElement>(null)
  const editorContainerRef = useEditorContainerRef()
  const overlayPortalContainer = useOverlayPortalContainer()
  const [portalContainer, setPortalContainer] =
    React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    setOption("shadowInputRef", inputRef)
  }, [setOption])

  React.useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const host =
        overlayPortalContainer ??
        editorContainerRef.current?.parentElement ??
        editorContainerRef.current

      setPortalContainer(host)
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [editorContainerRef, overlayPortalContainer])

  React.useEffect(() => {
    if (!isSelectingSome) setOption("anchorId", null)
  }, [isSelectingSome, setOption])

  React.useEffect(() => {
    if (isSelectingSome && inputRef.current) {
      inputRef.current.focus({ preventScroll: true })
    } else if (inputRef.current) {
      inputRef.current.blur()
    }
  }, [isSelectingSome])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const isReadonly = editor.api.isReadOnly()

      getOptions().onKeyDownSelecting?.(editor, event.nativeEvent)

      if (!getOption("isSelectingSome")) return

      if (isHotkey("shift+up")(event)) {
        event.preventDefault()
        event.stopPropagation()
        api.blockSelection.shiftSelection("up")
        return
      }

      if (isHotkey("shift+down")(event)) {
        event.preventDefault()
        event.stopPropagation()
        api.blockSelection.shiftSelection("down")
        return
      }

      if (isHotkey("escape")(event)) {
        api.blockSelection.deselect()
        return
      }

      if (isHotkey("mod+z")(event)) {
        editor.undo()
        selectInsertedBlocks(editor)
        return
      }

      if (isHotkey("mod+a")(event)) {
        api.blockSelection.selectAll()
        return
      }

      if (isHotkey("mod+shift+z")(event)) {
        editor.redo()
        selectInsertedBlocks(editor)
        return
      }

      if (isHotkey("mod+d")(event)) {
        event.preventDefault()
        editor.getTransforms(BlockSelectionPlugin).blockSelection.duplicate()
        return
      }

      if (!getOption("isSelectingSome")) return

      if (isHotkey("enter")(event)) {
        const entry = editor.api.node({
          at: [],
          block: true,
          match: (node) => {
            const id = (node as { id?: string }).id

            return Boolean(id && selectedIds?.has(id))
          },
        })

        if (entry) {
          const [, path] = entry

          // eslint-disable-next-line react-hooks/immutability -- Preserve Plate's upstream focus sentinel.
          editor.meta._forceFocus = true
          editor.tf.focus({ at: path, edge: "end" })
          editor.meta._forceFocus = undefined
          event.preventDefault()
        }

        return
      }

      if (isHotkey(["backspace", "delete"])(event) && !isReadonly) {
        event.preventDefault()
        removeSelectedBlocks({ selectPrevious: isHotkey("backspace")(event) })
        return
      }

      if (isHotkey("up")(event)) {
        event.preventDefault()
        event.stopPropagation()
        api.blockSelection.moveSelection("up")
        return
      }

      if (isHotkey("down")(event)) {
        event.preventDefault()
        event.stopPropagation()
        api.blockSelection.moveSelection("down")
        return
      }

      if (
        !isReadonly &&
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.preventDefault()
        const firstPath = removeSelectedBlocks()

        if (firstPath) {
          editor.meta._forceFocus = true
          editor.tf.insertNodes(
            editor.api.create.block({ children: [{ text: event.key }] }),
            { at: firstPath }
          )
          editor.tf.select(firstPath, { edge: "end" })
          editor.meta._forceFocus = false
          editor.tf.focus()
        }

        return
      }
    },
    [
      editor,
      getOptions,
      getOption,
      api.blockSelection,
      removeSelectedBlocks,
      selectedIds,
    ]
  )

  /** Handle copy / cut / paste in block selection. */
  const handleCopy = React.useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      if (getOption("isSelectingSome")) {
        if (copySelectedBlocks(editor, event.clipboardData)) {
          event.preventDefault()
        }
      }
    },
    [editor, getOption]
  )

  const handleCut = React.useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      if (getOption("isSelectingSome")) {
        const copied = copySelectedBlocks(editor, event.clipboardData)

        if (copied) event.preventDefault()
        if (copied && !editor.api.isReadOnly()) removeSelectedBlocks()
      }
    },
    [editor, getOption, removeSelectedBlocks]
  )

  const handlePaste = React.useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault()

      if (!editor.api.isReadOnly()) {
        pasteSelectedBlocks(editor, event.nativeEvent)
      }
    },
    [editor]
  )

  if (!portalContainer || typeof window === "undefined") {
    return null
  }

  return createPortal(
    <input
      ref={inputRef}
      className="slate-shadow-input"
      style={{
        left: "-300px",
        opacity: 0,
        position: "fixed",
        top: "-300px",
        zIndex: 999,
      }}
      onCopy={handleCopy}
      onCut={handleCut}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
    />,
    portalContainer
  )
}
