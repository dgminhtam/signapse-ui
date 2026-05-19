import type { vi } from "./dictionaries/vi"

export type WidenDictionary<T> = {
  [K in keyof T]: T[K] extends string ? string : WidenDictionary<T[K]>
}

export type Dictionary = WidenDictionary<typeof vi>
