export interface SearchParams {
  filter: string;
  page: number;
  size: number;
  sort: Sort[];
}

export interface Sort {
  field: string;
  direction: "asc" | "desc";
}

export interface Page<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number
  pageSize: number
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface Option {
  value: string;
  label: string;
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };