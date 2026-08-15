export interface LanguageResponse {
  id: number
  isoCode: string
  name: string
}

export interface LanguageCatalogResponse {
  currentLanguage?: LanguageResponse | null
  preferredLanguage?: LanguageResponse | null
  languages: LanguageResponse[]
}
