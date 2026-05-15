"use client"

import { XEditor } from "@/components/editor-x/editor"

interface PersonalNoteEditorProps {
  className?: string
  editorClassName?: string
  placeholder?: string
  readOnly?: boolean
  value: string
  onChange?: (value: string) => void
}

function PersonalNoteEditor(props: PersonalNoteEditorProps) {
  return <XEditor {...props} />
}

export { PersonalNoteEditor }
