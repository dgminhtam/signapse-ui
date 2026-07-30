import type { Middleware, Placement } from "@platejs/floating"

declare module "@platejs/floating" {
  // @platejs/floating 53.0.0 drops these inherited fields under TypeScript 5.9.
  interface UseVirtualFloatingOptions {
    middleware?: Middleware[]
    placement?: Placement
  }
}
