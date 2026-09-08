"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ApprovedLandingProductCapture } from "./landing-product-media"

export type LandingProductCaptureLabels = {
  alt: string
  caption: string
  dialogDescription: string
  dialogTitle: string
  enlarge: string
  close: string
  loading: string
  error: string
  annotations?: string[]
}

export function LandingProductCapture({
  capture,
  labels,
}: {
  capture: ApprovedLandingProductCapture
  labels: LandingProductCaptureLabels
}) {
  const [open, setOpen] = useState(false)
  const [inlineFailed, setInlineFailed] = useState(false)
  const [largeImageState, setLargeImageState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle")
  const enlargeButtonRef = useRef<HTMLButtonElement>(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true
      return
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false
      enlargeButtonRef.current?.focus()
    }
  }, [open])

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    setLargeImageState(nextOpen ? "loading" : "idle")
  }

  return (
    <>
      <figure
        aria-label={labels.dialogTitle}
        className="flex min-w-0 flex-col gap-4"
        data-landing-media-slot={capture.feature}
        data-media-state={inlineFailed ? "error" : "approved"}
      >
        {inlineFailed ? (
          <div
            aria-label={labels.alt}
            className="flex aspect-video items-center justify-center border border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground"
            role="img"
          >
            {labels.error}
          </div>
        ) : (
          <Image
            src={capture.src}
            alt={labels.alt}
            width={capture.width}
            height={capture.height}
            sizes="(min-width: 1200px) 50vw, 100vw"
            className="h-auto w-full border border-border object-contain"
            onError={() => setInlineFailed(true)}
          />
        )}

        <figcaption className="flex min-w-0 flex-col gap-3">
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {labels.caption}
          </p>
          {labels.annotations?.length ? (
            <ul className="grid gap-2 border-l-2 border-border pl-4 text-sm leading-6 text-foreground sm:grid-cols-3 sm:border-t sm:border-l-0 sm:pt-3 sm:pl-0">
              {labels.annotations.map((annotation) => (
                <li key={annotation}>{annotation}</li>
              ))}
            </ul>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="self-start"
            ref={enlargeButtonRef}
            onClick={() => handleOpenChange(true)}
          >
            {labels.enlarge}
          </Button>
        </figcaption>
      </figure>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="flex max-h-[calc(100dvh-2rem)] max-w-[min(90vw,80rem)] flex-col gap-5 overflow-hidden p-5 sm:p-6"
        >
          <DialogHeader className="gap-1 pr-12">
            <DialogTitle>{labels.dialogTitle}</DialogTitle>
            <DialogDescription>{labels.dialogDescription}</DialogDescription>
          </DialogHeader>
          <Button
            type="button"
            variant="outline"
            className="absolute top-4 right-4"
            autoFocus
            onClick={() => handleOpenChange(false)}
          >
            {labels.close}
          </Button>
          <div
            aria-busy={largeImageState === "loading"}
            className={cn(
              "min-h-0 overflow-auto border border-border bg-muted/10 p-2",
              largeImageState === "error" && "flex items-center justify-center"
            )}
          >
            {largeImageState === "error" ? (
              <p
                role="alert"
                className="p-8 text-center text-sm text-muted-foreground"
              >
                {labels.error}
              </p>
            ) : (
              <Image
                src={capture.src}
                alt={labels.alt}
                width={capture.width}
                height={capture.height}
                sizes="90vw"
                className={cn(
                  "h-auto w-full object-contain",
                  largeImageState === "loading" && "opacity-0"
                )}
                onLoad={() => setLargeImageState("ready")}
                onError={() => setLargeImageState("error")}
              />
            )}
            {largeImageState === "loading" ? (
              <p
                role="status"
                className="p-8 text-center text-sm text-muted-foreground"
              >
                {labels.loading}
              </p>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
