"use client"

import { useId, useTransition } from "react"
import { Send } from "lucide-react"
import { toast } from "sonner"

import { sendTelegramTestMessage } from "@/app/api/telegram/action"
import { useLocalization } from "@/app/lib/i18n/provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type TelegramDestinationTestMessageButtonProps = {
  destinationId: number
  destinationLabel: string
  canManage: boolean
  isActive: boolean
}

function isTimeoutError(message: string) {
  return /timeout|timed out|timed-out|aborted|hết thời gian|quá thời gian/i.test(
    message
  )
}

export function TelegramDestinationTestMessageButton({
  destinationId,
  destinationLabel,
  canManage,
  isActive,
}: TelegramDestinationTestMessageButtonProps) {
  const { dictionary, formatMessage } = useLocalization()
  const t = dictionary.telegram.destination
  const [isPending, startTransition] = useTransition()
  const descriptionId = useId()
  const unavailableReason = !canManage
    ? t.testMessagePermissionRequired
    : !isActive
      ? t.testMessageInactive
      : undefined

  function handleClick() {
    if (isPending || unavailableReason) return

    startTransition(async () => {
      const result = await sendTelegramTestMessage(destinationId)

      if (result.success) {
        toast.success(
          formatMessage(t.testMessageSuccess, {
            destination: destinationLabel,
          })
        )
        return
      }

      const errorMessage = result.error || t.testMessageError
      toast.error(
        isTimeoutError(errorMessage) ? t.testMessageTimeout : errorMessage
      )
    })
  }

  const button = (
    <Button
      type="button"
      variant="outline"
      className={cn(unavailableReason && "opacity-60")}
      aria-disabled={unavailableReason ? true : undefined}
      aria-describedby={unavailableReason ? descriptionId : undefined}
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <Send data-icon="inline-start" />
      )}
      {isPending ? t.testMessagePending : t.testMessage}
    </Button>
  )

  if (!unavailableReason) return button

  return (
    <>
      <span id={descriptionId} className="sr-only">
        {unavailableReason}
      </span>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{unavailableReason}</TooltipContent>
      </Tooltip>
    </>
  )
}
