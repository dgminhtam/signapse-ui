"use client"

import * as React from "react"

const OverlayPortalContainerContext = React.createContext<HTMLElement | null>(
  null
)

function OverlayPortalContainerProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: HTMLElement | null }>) {
  return (
    <OverlayPortalContainerContext.Provider value={value}>
      {children}
    </OverlayPortalContainerContext.Provider>
  )
}

function useOverlayPortalContainer() {
  return React.useContext(OverlayPortalContainerContext)
}

export { OverlayPortalContainerProvider, useOverlayPortalContainer }
