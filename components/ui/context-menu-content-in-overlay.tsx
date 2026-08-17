"use client"

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"

import { useOverlayPortalContainer } from "@/components/ui/overlay-portal-container"
import { cn } from "@/lib/utils"

type ContextMenuContentInOverlayProps = ContextMenuPrimitive.Popup.Props &
  Pick<
    ContextMenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >

function ContextMenuContentInOverlay({
  className,
  align = "start",
  alignOffset = 4,
  side = "right",
  sideOffset = 0,
  ...props
}: ContextMenuContentInOverlayProps) {
  const portalContainer = useOverlayPortalContainer()

  return (
    <ContextMenuPrimitive.Portal container={portalContainer ?? undefined}>
      <ContextMenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className={cn(
            "cn-menu-target cn-menu-translucent z-50 max-h-(--available-height) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuSubContentInOverlay({
  className,
  ...props
}: ContextMenuContentInOverlayProps) {
  return (
    <ContextMenuContentInOverlay
      data-slot="context-menu-sub-content"
      className={cn("cn-menu-target cn-menu-translucent shadow-lg", className)}
      side="right"
      {...props}
    />
  )
}

export { ContextMenuContentInOverlay, ContextMenuSubContentInOverlay }
export type { ContextMenuContentInOverlayProps }
