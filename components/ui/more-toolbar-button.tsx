"use client"

import * as React from "react"

import {
  KeyboardIcon,
  MoreHorizontalIcon,
  SubscriptIcon,
  SuperscriptIcon,
} from "lucide-react"
import { KEYS } from "platejs"
import { useEditorRef } from "platejs/react"

import { useLocalization } from "@/app/lib/i18n/provider"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuContentInOverlay as DropdownMenuContent } from "@/components/ui/dropdown-menu-content-in-overlay"

import { ToolbarButton } from "./toolbar"

export function MoreToolbarButton(
  props: React.ComponentProps<typeof DropdownMenu>
) {
  const { dictionary } = useLocalization()
  const editor = useEditorRef()
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <ToolbarButton
        render={<DropdownMenuTrigger />}
        aria-label={dictionary.editor.moreFormatting}
        pressed={open}
        tooltip={dictionary.editor.moreFormatting}
      >
        <MoreHorizontalIcon />
      </ToolbarButton>

      <DropdownMenuContent
        className="ignore-click-outside/toolbar flex max-h-[500px] min-w-[180px] flex-col overflow-y-auto"
        align="start"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              editor.tf.toggleMark(KEYS.kbd)
              editor.tf.collapse({ edge: "end" })
              editor.tf.focus()
            }}
          >
            <KeyboardIcon />
            Keyboard input
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              editor.tf.toggleMark(KEYS.sup, {
                remove: KEYS.sub,
              })
              editor.tf.focus()
            }}
          >
            <SuperscriptIcon />
            Superscript
            {/* (⌘+,) */}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.tf.toggleMark(KEYS.sub, {
                remove: KEYS.sup,
              })
              editor.tf.focus()
            }}
          >
            <SubscriptIcon />
            Subscript
            {/* (⌘+.) */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
