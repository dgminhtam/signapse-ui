"use client"

import { BlockSelectionPlugin } from "@platejs/selection/react"
import { getPluginTypes, KEYS } from "platejs"
import type { PlateElementProps } from "platejs/react"

import { BlockSelectionAfterEditable } from "./block-selection-after-editable"
import { BlockSelection } from "@/components/ui/block-selection"

export const hasSelectableClass = ({
  attributes,
  className,
}: {
  attributes: { className?: string }
  className?: string
}) =>
  [className, attributes.className]
    .filter(Boolean)
    .join(" ")
    .includes("slate-selectable")

export const BlockSelectionKit = [
  BlockSelectionPlugin.configure(({ editor }) => ({
    options: {
      enableContextMenu: true,
      isSelectable: (element) =>
        !getPluginTypes(editor, [KEYS.column, KEYS.codeLine, KEYS.td]).includes(
          element.type
        ),
    },
    render: {
      afterEditable: BlockSelectionAfterEditable,
      belowRootNodes: (props) => {
        if (!hasSelectableClass(props)) return null

        return (
          <BlockSelection
            {...props}
            plugin={props.plugin as unknown as PlateElementProps["plugin"]}
          />
        )
      },
    },
  })),
]
