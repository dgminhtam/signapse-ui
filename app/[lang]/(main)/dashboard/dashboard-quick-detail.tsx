"use client"

import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react"

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

export function DashboardQuickDetailButton({
  "aria-haspopup": ariaHasPopup = "dialog",
  entity,
  onClick,
  ...props
}: ComponentProps<"button"> & {
  entity: LocalQuickDetailEntity
}) {
  const openQuickDetail = useContext(DashboardQuickDetailContext)

  if (!openQuickDetail) {
    throw new Error(
      "DashboardQuickDetailButton must be used within DashboardQuickDetailProvider"
    )
  }

  const open = openQuickDetail

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event)

    if (event.defaultPrevented) {
      return
    }

    open(entity)
  }

  return (
    <button
      {...props}
      type="button"
      aria-haspopup={ariaHasPopup}
      onClick={handleClick}
    />
  )
}
