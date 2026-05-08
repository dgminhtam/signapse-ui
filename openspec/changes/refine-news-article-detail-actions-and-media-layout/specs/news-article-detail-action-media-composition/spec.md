## ADDED Requirements

### Requirement: Header actions use primary plus dropdown composition
The news article detail page SHALL keep the primary event derivation action visible and move secondary actions into a compact action dropdown.

#### Scenario: Header actions render on desktop
- **WHEN** an authorized user opens a news article detail page with all relevant permissions
- **THEN** the header shows a visible `Suy diễn sự kiện` primary action and a `Hành động` dropdown beside it

#### Scenario: Secondary actions are available from dropdown
- **WHEN** an authorized user opens the `Hành động` dropdown
- **THEN** the menu includes `Tải lại nội dung`, `Mở liên kết gốc`, and `Xóa` when the user has permission for those actions

#### Scenario: Delete remains protected
- **WHEN** an authorized user selects `Xóa` from the action dropdown
- **THEN** the system requires the existing destructive confirmation flow before deleting the article

### Requirement: Primary derivation action uses concise copy
The news article detail page SHALL use concise visible copy for the primary event derivation action while preserving clear accessibility or pending text.

#### Scenario: Primary derivation action is idle
- **WHEN** the primary derivation action is not pending
- **THEN** its visible label is `Suy diễn sự kiện`

#### Scenario: Primary derivation action is pending
- **WHEN** the primary derivation action is pending
- **THEN** the action remains disabled and shows pending feedback such as `Đang suy diễn...`

### Requirement: Description and article image use balanced summary columns
The news article detail page SHALL render the article description and article image as two labeled, balanced summary sections on desktop.

#### Scenario: Article has description and image
- **WHEN** an authorized user opens a news article detail page with both description and feature image
- **THEN** the page shows `Mô tả` and `Hình ảnh bài viết` as two columns in the same row on desktop

#### Scenario: Summary row renders balanced surfaces
- **WHEN** the description and image sections render in the desktop summary row
- **THEN** their content surfaces align to the same row height without making the image a hero banner

#### Scenario: Article image renders
- **WHEN** the article has a feature image
- **THEN** the image appears under the `Hình ảnh bài viết` label with stable aspect ratio and object-cover behavior

### Requirement: Summary layout remains responsive
The news article detail page SHALL preserve readable responsive behavior for the summary/media layout.

#### Scenario: Mobile viewport renders summary
- **WHEN** an authorized user views the detail page on a narrow viewport
- **THEN** `Mô tả` appears before `Hình ảnh bài viết` in a stacked layout without horizontal scrolling

#### Scenario: Article lacks image
- **WHEN** an article has a description but no feature image
- **THEN** the page does not reserve an empty image column that leaves unexplained blank space

### Requirement: Loading skeleton mirrors action and media composition
The news article detail loading skeleton SHALL mirror the refined header actions and summary/media composition.

#### Scenario: Detail page is loading
- **WHEN** news article detail data is suspended
- **THEN** the skeleton reserves space for the concise primary action, the action dropdown, and the two labeled summary/media sections

#### Scenario: Loaded page replaces skeleton
- **WHEN** the suspended detail data resolves
- **THEN** the loaded page does not introduce major layout movement caused by a different action cluster or image/description structure
