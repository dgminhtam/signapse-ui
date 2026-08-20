"use client"

import * as React from "react"

import { importDocx } from "@platejs/docx-io"
import { MarkdownPlugin } from "@platejs/markdown"
import { ArrowUpToLineIcon } from "lucide-react"
import { getEditorDOMFromHtmlString } from "platejs/static"
import { useEditorRef } from "platejs/react"
import { useFilePicker } from "use-file-picker"

import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuContentInOverlay as DropdownMenuContent } from "@/components/ui/dropdown-menu-content-in-overlay"

import { ToolbarButton } from "./toolbar"

type ImportType = "html" | "markdown"

export function ImportToolbarButton(
  props: React.ComponentProps<typeof DropdownMenu>
) {
  const editor = useEditorRef()
  const [open, setOpen] = React.useState(false)

  const getFileNodes = (text: string, type: ImportType) => {
    if (type === "html") {
      const editorNode = getEditorDOMFromHtmlString(text)
      const nodes = editor.api.html.deserialize({
        element: editorNode,
      })

      return nodes
    }

    if (type === "markdown") {
      return editor.getApi(MarkdownPlugin).markdown.deserialize(text)
    }

    return []
  }

  const { openFilePicker: openMdFilePicker } = useFilePicker({
    accept: [".md", ".mdx"],
    multiple: false,
    onFilesSelected: async ({ plainFiles }) => {
      const text = await plainFiles[0].text()

      const nodes = getFileNodes(text, "markdown")

      editor.tf.insertNodes(nodes)
    },
  })

  const { openFilePicker: openHtmlFilePicker } = useFilePicker({
    accept: ["text/html"],
    multiple: false,
    onFilesSelected: async ({ plainFiles }) => {
      const text = await plainFiles[0].text()

      const nodes = getFileNodes(text, "html")

      editor.tf.insertNodes(nodes)
    },
  })

  const { openFilePicker: openDocxFilePicker } = useFilePicker({
    accept: [".docx"],
    multiple: false,
    onFilesSelected: async ({ plainFiles }) => {
      const arrayBuffer = await plainFiles[0].arrayBuffer()
      const result = await importDocx(editor, arrayBuffer)

      editor.tf.insertNodes(result.nodes as typeof editor.children)
    },
  })

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <ToolbarButton
        render={<DropdownMenuTrigger />}
        pressed={open}
        tooltip="Import"
        isDropdown
      >
        <ArrowUpToLineIcon className="size-4" />
      </ToolbarButton>

      <DropdownMenuContent className="min-w-[180px]" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              openHtmlFilePicker()
            }}
          >
            Import from HTML
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              openMdFilePicker()
            }}
          >
            Import from Markdown
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              openDocxFilePicker()
            }}
          >
            Import from Word
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
