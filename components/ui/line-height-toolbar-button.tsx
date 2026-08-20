"use client"

import * as React from "react"

import { LineHeightPlugin } from "@platejs/basic-styles/react"
import { WrapText } from "lucide-react"
import { useEditorRef, useSelectionFragmentProp } from "platejs/react"

import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuContentInOverlay as DropdownMenuContent } from "@/components/ui/dropdown-menu-content-in-overlay"

import { ToolbarButton } from "./toolbar"

export function LineHeightToolbarButton(
  props: React.ComponentProps<typeof DropdownMenu>
) {
  const editor = useEditorRef()
  const { defaultNodeValue, validNodeValues: values = [] } =
    editor.getInjectProps(LineHeightPlugin)

  const value = useSelectionFragmentProp({
    defaultValue: defaultNodeValue,
    getProp: (node) => node.lineHeight,
  })

  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <ToolbarButton
        render={<DropdownMenuTrigger />}
        pressed={open}
        tooltip="Line height"
        isDropdown
      >
        <WrapText />
      </ToolbarButton>

      <DropdownMenuContent className="min-w-[180px]" align="start">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(newValue) => {
            editor
              .getTransforms(LineHeightPlugin)
              .lineHeight.setNodes(Number(newValue))
            editor.tf.focus()
          }}
        >
          {values.map((value) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {value}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
