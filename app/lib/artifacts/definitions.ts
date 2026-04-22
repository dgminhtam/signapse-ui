export const artifactTypes = [
  "NEWS_ARTICLE",
  "ECONOMIC_CALENDAR_ENTRY",
  "RESEARCH_DOCUMENT",
  "STRATEGY_PLAYBOOK",
  "OTHER",
] as const

export type ArtifactType = (typeof artifactTypes)[number]

export const ARTIFACT_TYPE_LABELS: Record<ArtifactType, string> = {
  NEWS_ARTICLE: "Bai viet tin tuc",
  ECONOMIC_CALENDAR_ENTRY: "Muc lich kinh te",
  RESEARCH_DOCUMENT: "Tai lieu nghien cuu",
  STRATEGY_PLAYBOOK: "Playbook chien luoc",
  OTHER: "Khac",
}

export function isNewsArticleArtifact(type?: ArtifactType | null): boolean {
  return type === "NEWS_ARTICLE"
}
