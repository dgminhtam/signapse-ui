"use client"

import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react"

import { LocalizedLink } from "@/components/localized-link"

import {
  LocalEntityQuickDetailDrawer,
  type LocalQuickDetailEntity,
} from "../local-entity-quick-detail-drawer"

type OpenQuickDetail = (entity: LocalQuickDetailEntity) => void

const DashboardQuickDetailContext = createContext<OpenQuickDetail | null>(null)

export function DashboardQuickDetailProvider({
  children,
}: {
  children: ReactNode
}) {
  const [entity, setEntity] = useState<LocalQuickDetailEntity | null>(null)

  return (
    <DashboardQuickDetailContext.Provider value={setEntity}>
      {children}
      <LocalEntityQuickDetailDrawer
        entity={entity}
        onClose={() => setEntity(null)}
      />
    </DashboardQuickDetailContext.Provider>
  )
}

export function DashboardQuickDetailLink({
  "aria-haspopup": ariaHasPopup = "dialog",
  entity,
  onClick,
  ...props
}: ComponentProps<typeof LocalizedLink> & {
  entity: LocalQuickDetailEntity
}) {
  const openQuickDetail = useContext(DashboardQuickDetailContext)

  if (!openQuickDetail) {
    throw new Error(
      "DashboardQuickDetailLink must be used within DashboardQuickDetailProvider"
    )
  }

  const open = openQuickDetail

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()
    open(entity)
  }

  return (
    <LocalizedLink
      {...props}
      aria-haspopup={ariaHasPopup}
      onClick={handleClick}
    />
  )
}
