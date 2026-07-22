type Identifiable = { id: number }

type LoadedPage<T extends Identifiable> = {
  content: T[]
  empty: boolean
  last: boolean
  number: number
  numberOfElements: number
  size: number
  totalElements: number
  totalPages: number
}

export function reconcileDeletedPersonalNote<
  T extends Identifiable,
  P extends LoadedPage<T>,
>(page: P, deletedId: number, selectedId: number | null) {
  const deletedIndex = page.content.findIndex((note) => note.id === deletedId)
  if (deletedIndex < 0) {
    return { page, deletedSelected: false, nextSelectedId: selectedId }
  }

  const content = page.content.filter((note) => note.id !== deletedId)
  const totalElements = Math.max(0, page.totalElements - 1)
  const totalPages =
    totalElements === 0 ? 0 : Math.ceil(totalElements / page.size)
  const deletedSelected = selectedId === deletedId

  const nextPage = {
    ...page,
    content,
    empty: totalElements === 0,
    last: page.number + 1 >= totalPages,
    numberOfElements: Math.max(0, page.numberOfElements - 1),
    totalElements,
    totalPages,
  }

  return {
    page: nextPage,
    deletedSelected,
    nextSelectedId: deletedSelected
      ? (content[Math.min(deletedIndex, content.length - 1)]?.id ?? null)
      : selectedId,
  }
}
