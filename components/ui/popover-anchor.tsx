"use client"

import * as React from "react"

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

  if (!anchorRef) {
    return render ?? <span>{children}</span>
  }

  if (render) {
    return React.cloneElement(render, {
      ref: anchorRef,
    } as React.Attributes & { ref: React.Ref<HTMLElement> })
  }

  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: anchorRef,
    } as React.Attributes & { ref: React.Ref<HTMLElement> })
  }

  return <span ref={anchorRef}>{children}</span>
}

function PopoverContentWithAnchor({
  ...props
}: Omit<PopoverContentInOverlayProps, "anchor">) {
  const anchorRef = React.useContext(PopoverAnchorContext)

  return <PopoverContentInOverlay {...props} anchor={anchorRef} />
}

export { PopoverAnchor, PopoverContentWithAnchor, PopoverWithAnchor }
