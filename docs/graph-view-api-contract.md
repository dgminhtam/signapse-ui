# Graph View API Contract

- Loại tài liệu: Reference
- Độc giả chính: Frontend, backend, QA
- Source of truth cho: Runtime contract của graph view và mapping node/edge cho FE integration
- Không phải là: Thiết kế layout, thuật toán render, hay graph database design

## Mục tiêu

Graph view là một màn browse knowledge map kiểu Obsidian, dùng để nhìn toàn bộ shared knowledge layer dưới dạng node và edge.

Graph view không phải là query answer.

- `POST /query` dùng để trả lời câu hỏi
- `GET /graph-view` dùng để browse shared knowledge graph

## Phạm vi MVP

Graph view MVP chỉ bao gồm các knowledge type đã có persisted relationship rõ ràng và đủ ổn định để frontend render trực tiếp:

- `event`
- `asset`
- `theme`
- `source-document`

Quan hệ hỗ trợ trong MVP:

- `event-asset`
- `event-theme`
- `source-document-event`

Chưa nằm trong MVP:

- `narrative`
- `market-reaction`
- tọa độ node hoặc layout từ backend
- graph edit/mutation
- query-specific graph slice

## API Summary

- Endpoint: `GET /graph-view`
- Auth: cần permission `graph-view:read`
- Request body: không có
- Scope: toàn bộ shared knowledge graph hiện có trong hệ thống

## Response Shape

```json
{
  "nodes": [
    {
      "id": "event:101",
      "kind": "event",
      "label": "Fed holds rates",
      "secondaryLabel": "fed-rate-decision-2026-04",
      "metadata": {
        "slug": "fed-holds-rates",
        "canonicalKey": "fed-rate-decision-2026-04",
        "occurredAt": "2026-04-21T18:00:00Z",
        "active": true,
        "confidence": 0.82
      }
    }
  ],
  "edges": [
    {
      "id": "event:101->asset:12:AFFECTED_ASSET",
      "kind": "event-asset",
      "sourceNodeId": "event:101",
      "targetNodeId": "asset:12",
      "relationType": "AFFECTED_ASSET",
      "weight": 0.91
    }
  ]
}
```

## Top-Level Fields

### `nodes`

Danh sách toàn bộ node trong graph.

FE dùng `nodes` để:

- render node trên graph canvas
- lookup label khi click edge
- mở side panel khi user click node

### `edges`

Danh sách toàn bộ edge trong graph.

FE dùng `edges` để:

- vẽ quan hệ giữa node
- hiển thị edge label hoặc tooltip theo `relationType`
- filter graph theo loại quan hệ nếu cần

## Node Contract

```ts
type GraphNode = {
  id: string;
  kind: "event" | "asset" | "theme" | "source-document";
  label: string;
  secondaryLabel?: string;
  metadata?: {
    slug?: string;
    canonicalKey?: string;
    symbol?: string;
    assetType?: string;
    sourceName?: string;
    url?: string;
    occurredAt?: string | null;
    publishedAt?: string | null;
    active?: boolean;
    confidence?: number | null;
  };
};
```

### Field Meaning

#### `id`

ID ổn định để FE dedupe node, select node, mở detail và map edge.

Rule:

- `event:<eventId>`
- `asset:<assetId>`
- `theme:<themeId>`
- `source-document:<sourceDocumentId>`

#### `kind`

Loại node để FE quyết định:

- icon
- màu
- shape
- click behavior

#### `label`

Text chính hiển thị trên node.

Rule mặc định:

- event -> `title`
- asset -> `symbol`
- theme -> `title`
- source-document -> `title`

#### `secondaryLabel`

Text phụ ngắn, dùng cho subtitle hoặc tooltip nhẹ.

Rule mặc định:

- event -> `canonicalKey` hoặc `slug`
- asset -> `name`
- theme -> `slug`
- source-document -> `sourceName`

#### `metadata`

Metadata để FE hiển thị tooltip hoặc side panel mà chưa cần fetch detail ngay lập tức.

Không nên coi `metadata` là full detail model. Nếu cần màn detail sâu, FE vẫn có thể click-through sang API detail tương ứng.

## Edge Contract

```ts
type GraphEdge = {
  id: string;
  kind: "event-asset" | "event-theme" | "source-document-event";
  sourceNodeId: string;
  targetNodeId: string;
  relationType: string;
  weight?: number | null;
  confidence?: number | null;
  note?: string | null;
};
```

### Field Meaning

#### `id`

ID ổn định cho edge để FE dedupe và track selected edge.

Recommended rule:

- `event:101->asset:12:AFFECTED_ASSET`
- `event:101->theme:8:PRIMARY_THEME`
- `source-document:55->event:101:SUPPORTING`

#### `kind`

Loại edge ở level UI/runtime:

- `event-asset`
- `event-theme`
- `source-document-event`

FE có thể dùng field này để style edge khác nhau.

#### `sourceNodeId` / `targetNodeId`

Liên kết giữa edge và node.

FE không cần đoán hướng edge từ `relationType`; hướng đã được encode sẵn:

- event -> asset
- event -> theme
- source-document -> event

#### `relationType`

Semantics gốc của quan hệ, lấy trực tiếp từ enum/persisted relation trong backend.

Backend mapping:

- `event-asset` -> `EventAssetRelationType`
  - `PRIMARY_SUBJECT`
  - `AFFECTED_ASSET`
  - `REFERENCE_ASSET`
- `event-theme` -> `EventThemeRelationType`
  - `PRIMARY_THEME`
  - `SECONDARY_THEME`
- `source-document-event` -> `EventSourceDocumentEvidenceRole`
  - `PRIMARY`
  - `SUPPORTING`
  - `UPDATE`
  - `CONTRADICTING`

#### `weight`

Độ mạnh của quan hệ ở những edge có numeric score sẵn từ backend, ví dụ:

- `EventAsset.weight`
- `EventTheme.weight`

FE có thể dùng để:

- tăng/giảm opacity
- tăng/giảm thickness
- sort relation trong side panel

#### `confidence`

Độ tin cậy của relation khi quan hệ đó được lưu với confidence riêng, ví dụ evidence edge từ source document sang event.

#### `note`

Giải thích ngắn cho quan hệ nếu backend có lưu note, chủ yếu hữu ích cho evidence edge.

## Backend Entity Mapping

### Node Mapping

| Graph node | Backend source |
| --- | --- |
| `event` | `Event` |
| `asset` | `Asset` |
| `theme` | `Theme` |
| `source-document` | `SourceDocument` |

### Edge Mapping

| Graph edge | Backend source |
| --- | --- |
| `event-asset` | `EventAsset` |
| `event-theme` | `EventTheme` |
| `source-document-event` | `EventSourceDocument` |

## FE Integration Guidance

### 1. FE owns layout

Backend không trả:

- `x`
- `y`
- force layout result
- cluster/group hints

FE tự chọn layout engine và tự quyết định:

- spacing
- physics
- zoom default
- pan behavior

### 2. FE should treat this as browse graph, not answer graph

Graph view là shared browse surface.

Không nên assume:

- graph phản ánh current workspace
- graph phản ánh current watchlist
- graph phản ánh current query

Nếu sau này cần personalization, nên làm dưới dạng FE overlay hoặc endpoint/filter khác, không thay đổi nghĩa của graph gốc.

### 3. Click-through recommendation

Khi user click node, FE có thể mở detail theo mapping sau:

- `event` -> `GET /events/{id}`
- `asset` -> `GET /assets/{id}`
- `source-document` -> `GET /source-documents/{id}`

Với `theme`, nếu chưa có public detail API thì FE có thể hiển thị metadata local hoặc modal nhẹ.

### 4. Dedupe strictly by `id`

Không dedupe bằng `label`, vì:

- label có thể trùng
- secondaryLabel có thể thay đổi
- metadata không phải identity

### 5. Edge direction is part of the contract

FE không tự đảo chiều edge.

Hãy coi hướng edge là canonical:

- `source-document -> event`
- `event -> asset`
- `event -> theme`

## Out Of Scope For This Contract

Các điểm sau chưa phải một phần của graph view API contract hiện tại:

- `narrative` node
- `market-reaction` node
- graph filtering params
- truncation
- pagination
- backend-generated layout
- backend-generated color/style tokens

Nếu sau này mở rộng graph view, nên cập nhật file này cùng lúc với thay đổi backend để FE luôn có một nguồn contract rõ ràng.
