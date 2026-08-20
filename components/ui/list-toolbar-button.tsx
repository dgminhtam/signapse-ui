"use client"

import * as React from "react"

import { ListStyleType, someList, toggleList } from "@platejs/list"
import { List, ListOrdered } from "lucide-react"
import { useEditorRef, useEditorSelector } from "platejs/react"

import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuContentInOverlay as DropdownMenuContent } from "@/components/ui/dropdown-menu-content-in-overlay"

import {
  ToolbarSplitButton,
  ToolbarSplitButtonPrimary,
  ToolbarSplitButtonSecondary,
} from "./toolbar"

export function BulletedListToolbarButton() {
  const editor = useEditorRef()
  const [open, setOpen] = React.useState(false)

  const pressed = useEditorSelector(
    (editor) =>
      someList(editor, [
        ListStyleType.Disc,
        ListStyleType.Circle,
        ListStyleType.Square,
      ]),
    []
  )

  return (
    <ToolbarSplitButton pressed={open}>
      <ToolbarSplitButtonPrimary
        pressed={pressed}
        onClick={() => {
          toggleList(editor, {
            listStyleType: ListStyleType.Disc,
          })
        }}
      >
        <List className="size-4" />
      </ToolbarSplitButtonPrimary>

      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <ToolbarSplitButtonSecondary
          pressed={open}
          render={<DropdownMenuTrigger />}
        />

        <DropdownMenuContent align="start" alignOffset={-32}>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() =>
                toggleList(editor, {
                  listStyleType: ListStyleType.Disc,
                })
              }
            >
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full border border-current bg-current" />
                Default
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toggleList(editor, {
                  listStyleType: ListStyleType.Circle,
                })
              }
            >
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full border border-current" />
                Circle
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toggleList(editor, {
                  listStyleType: ListStyleType.Square,
                })
              }
            >
              <div className="flex items-center gap-2">
                <div className="size-2 border border-current bg-current" />
                Square
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ToolbarSplitButton>
  )
}

export function NumberedListToolbarButton() {
  const editor = useEditorRef()
  const [open, setOpen] = React.useState(false)

  const pressed = useEditorSelector(
    (editor) =>
      someList(editor, [
        ListStyleType.Decimal,
        ListStyleType.LowerAlpha,
        ListStyleType.UpperAlpha,
        ListStyleType.LowerRoman,
        ListStyleType.UpperRoman,
      ]),
    []
  )

  return (
    <ToolbarSplitButton pressed={open}>
      <ToolbarSplitButtonPrimary
        pressed={pressed}
        onClick={() =>
          toggleList(editor, {
            listStyleType: ListStyleType.Decimal,
          })
        }
      >
        <ListOrdered className="size-4" />
      </ToolbarSplitButtonPrimary>

      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <ToolbarSplitButtonSecondary
          pressed={open}
          render={<DropdownMenuTrigger />}
        />

        <DropdownMenuContent
          className="min-w-[180px]"
          align="start"
          alignOffset={-32}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() =>
                toggleList(editor, {
                  listStyleType: ListStyleType.Decimal,
                })
              }
            >
              Decimal (1, 2, 3)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toggleList(editor, {
                  listStyleType: ListStyleType.LowerAlpha,
                })
              }
            >
              Lower Alpha (a, b, c)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toggleList(editor, {
                  listStyleType: ListStyleType.UpperAlpha,
                })
              }
            >
              Upper Alpha (A, B, C)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toggleList(editor, {
                  listStyleType: ListStyleType.LowerRoman,
                })
              }
            >
              Lower Roman (i, ii, iii)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toggleList(editor, {
                  listStyleType: ListStyleType.UpperRoman,
                })
              }
            >
              Upper Roman (I, II, III)
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ToolbarSplitButton>
  )
}
