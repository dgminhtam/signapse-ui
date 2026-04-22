import { z } from "zod"

export type GraphViewNodeKind = "event" | "asset" | "theme" | "news-article"

export type GraphViewEdgeKind =
  | "event-asset"
  | "event-theme"
  | "source-artifact-event"

export interface GraphViewNodeMetadata {
  slug?: string | null
  canonicalKey?: string | null
  symbol?: string | null
  assetType?: string | null
  newsOutletName?: string | null
  url?: string | null
  occurredAt?: string | null
  publishedAt?: string | null
  active?: boolean | null
  confidence?: number | null
}

export interface GraphViewNode {
  id: string
  kind: GraphViewNodeKind
  label: string
  secondaryLabel?: string
  metadata?: GraphViewNodeMetadata
}

export interface GraphViewEdge {
  id: string
  kind: GraphViewEdgeKind
  sourceNodeId: string
  targetNodeId: string
  relationType: string
  weight?: number | null
  confidence?: number | null
  note?: string | null
}

export interface GraphViewResponse {
  nodes: GraphViewNode[]
  edges: GraphViewEdge[]
}

export interface GraphViewEntityReference {
  kind: GraphViewNodeKind
  entityId: number
}

const graphViewNodeKindSchema = z.enum([
  "event",
  "asset",
  "theme",
  "news-article",
])

const graphViewEdgeKindSchema = z.enum([
  "event-asset",
  "event-theme",
  "source-artifact-event",
])

export const graphViewNodeMetadataSchema = z.object({
  slug: z.string().nullish(),
  canonicalKey: z.string().nullish(),
  symbol: z.string().nullish(),
  assetType: z.string().nullish(),
  newsOutletName: z.string().nullish(),
  url: z.string().nullish(),
  occurredAt: z.string().nullish(),
  publishedAt: z.string().nullish(),
  active: z.boolean().nullish(),
  confidence: z.number().nullish(),
}) satisfies z.ZodType<GraphViewNodeMetadata>

export const graphViewNodeSchema = z.object({
  id: z.string().min(1),
  kind: graphViewNodeKindSchema,
  label: z.string().min(1),
  secondaryLabel: z.string().optional(),
  metadata: graphViewNodeMetadataSchema.optional(),
}) satisfies z.ZodType<GraphViewNode>

export const graphViewEdgeSchema = z.object({
  id: z.string().min(1),
  kind: graphViewEdgeKindSchema,
  sourceNodeId: z.string().min(1),
  targetNodeId: z.string().min(1),
  relationType: z.string().min(1),
  weight: z.number().nullish(),
  confidence: z.number().nullish(),
  note: z.string().nullish(),
}) satisfies z.ZodType<GraphViewEdge>

export const graphViewResponseSchema = z.object({
  nodes: z.array(graphViewNodeSchema),
  edges: z.array(graphViewEdgeSchema),
}) satisfies z.ZodType<GraphViewResponse>

export const GRAPH_VIEW_NODE_KIND_LABELS: Record<GraphViewNodeKind, string> = {
  event: "Su kien",
  asset: "Tai san",
  theme: "Chu de",
  "news-article": "Bai viet tin tuc",
}

export const GRAPH_VIEW_EDGE_KIND_LABELS: Record<GraphViewEdgeKind, string> = {
  "event-asset": "Su kien - tai san",
  "event-theme": "Su kien - chu de",
  "source-artifact-event": "Bang chung - su kien",
}

export const GRAPH_VIEW_RELATION_TYPE_LABELS: Record<string, string> = {
  PRIMARY_SUBJECT: "Chu the chinh",
  AFFECTED_ASSET: "Tai san bi anh huong",
  REFERENCE_ASSET: "Tai san tham chieu",
  PRIMARY_THEME: "Chu de chinh",
  SECONDARY_THEME: "Chu de phu",
  PRIMARY: "Chinh",
  SUPPORTING: "Ho tro",
  UPDATE: "Cap nhat",
  CONTRADICTING: "Mau thuan",
}

const graphNodeIdPattern = /^(event|asset|theme|news-article):(\d+)$/

export function parseGraphViewNodeId(nodeId: string): GraphViewEntityReference | null {
  const match = graphNodeIdPattern.exec(nodeId)

  if (!match) {
    return null
  }

  const [, kind, rawEntityId] = match
  const entityId = Number(rawEntityId)

  if (!Number.isInteger(entityId) || entityId <= 0) {
    return null
  }

  return {
    kind: kind as GraphViewNodeKind,
    entityId,
  }
}

export function getGraphViewNodeEntityId(
  nodeId: string,
  kind?: GraphViewNodeKind
): number | null {
  const parsed = parseGraphViewNodeId(nodeId)

  if (!parsed) {
    return null
  }

  if (kind && parsed.kind !== kind) {
    return null
  }

  return parsed.entityId
}

export function getGraphViewRelationLabel(relationType: string): string {
  return GRAPH_VIEW_RELATION_TYPE_LABELS[relationType] || relationType
}
