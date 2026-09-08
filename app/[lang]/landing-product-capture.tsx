"use client"

import Image from "next/image"
import { useState } from "react"

import type { ApprovedLandingProductCapture } from "./landing-product-media"

export type LandingProductCaptureLabels = {
  alt: string
  label: string
  caption: string
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
  const [inlineFailed, setInlineFailed] = useState(false)

  return (
    <figure
      aria-label={labels.label}
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
      </figcaption>
    </figure>
  )
}
