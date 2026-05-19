"use client"

import { ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import { useLocalization } from "@/app/lib/i18n/provider"
import { LocalizedLink } from "@/components/localized-link"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface EntityQuickDetailDrawerProps {
  children: ReactNode
  description?: string
  fullDetailHref?: string
  fullDetailLabel?: string
  title: string
}

export function EntityQuickDetailDrawer({
  children,
  description,
  fullDetailHref,
  fullDetailLabel,
  title,
}: EntityQuickDetailDrawerProps) {
  const router = useRouter()
  const { dictionary } = useLocalization()
  const resolvedFullDetailLabel = fullDetailLabel ?? dictionary.common.openFullPage

  return (
    <Drawer open onOpenChange={(open) => !open && router.back()}>
      <DrawerContent className="h-[min(76svh,760px)] max-h-[min(76svh,760px)] gap-0 overflow-hidden">
        <DrawerHeader className="border-b px-5 py-4 text-left">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-1.5">
            <DrawerTitle className="line-clamp-2 leading-snug">
              {title}
            </DrawerTitle>
            {description ? (
              <DrawerDescription>{description}</DrawerDescription>
            ) : null}
          </div>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </div>

        <DrawerFooter className="border-t bg-muted/20 px-5 py-3">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 sm:flex-row sm:justify-end">
            {fullDetailHref ? (
              <Button asChild variant="outline">
                <LocalizedLink href={fullDetailHref}>
                  <ExternalLink aria-hidden="true" data-icon="inline-start" />
                  {resolvedFullDetailLabel}
                </LocalizedLink>
              </Button>
            ) : null}
            <DrawerClose asChild>
              <Button type="button">{dictionary.common.close}</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
