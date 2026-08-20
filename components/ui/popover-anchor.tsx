"use client"

import * as React from "react"
import { useRender } from "@base-ui/react/use-render"

import { Popover } from "@/components/ui/popover"
import {
  PopoverContentInOverlay,
  type PopoverContentInOverlayProps,
} from "@/components/ui/popover-content-in-overlay"

const PopoverAnchorContext =
  React.createContext<React.RefObject<HTMLElement | null> | null>(null)

function PopoverWithAnchor({
  children,
  ...props
}: Omit<React.ComponentProps<typeof Popover>, "children"> & {
  children?: React.ReactNode
}) {
  const anchorRef = React.useRef<HTMLElement | null>(null)

  return (
    <Popover {...props}>
      <PopoverAnchorContext.Provider value={anchorRef}>
        {children}
      </PopoverAnchorContext.Provider>
    </Popover>
  )
}

function PopoverAnchor({
  children,
  render,
}: {
  children?: React.ReactNode
  render?: React.ReactElement
}) {
  const anchorRef = React.useContext(PopoverAnchorContext)
  const childElement = React.isValidElement(children) ? children : undefined
  const renderElement = anchorRef ? (render ?? childElement) : render

  return useRender({
    render: renderElement,
    ref: anchorRef ?? undefined,
    props: renderElement ? undefined : { children },
    defaultTagName: "span",
  })
}

function PopoverContentWithAnchor({
  ...props
}: Omit<PopoverContentInOverlayProps, "anchor">) {
  const anchorRef = React.useContext(PopoverAnchorContext)

  return <PopoverContentInOverlay {...props} anchor={anchorRef} />
}

export { PopoverAnchor, PopoverContentWithAnchor, PopoverWithAnchor }
