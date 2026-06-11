"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TooltipIconButtonProps extends React.ComponentPropsWithoutRef<
  typeof Button
> {
  tooltip: string
  side?: React.ComponentProps<typeof TooltipContent>["side"]
}

const TooltipIconButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  TooltipIconButtonProps
>(({ tooltip, side = "top", ...props }, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button ref={ref} {...props} />
      </TooltipTrigger>
      <TooltipContent side={side}>{tooltip}</TooltipContent>
    </Tooltip>
  )
})

TooltipIconButton.displayName = "TooltipIconButton"

export { TooltipIconButton }
