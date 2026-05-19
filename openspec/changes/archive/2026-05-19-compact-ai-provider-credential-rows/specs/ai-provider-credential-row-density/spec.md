## ADDED Requirements

### Requirement: Compact create credential section
The create AI provider form SHALL present credential entry as a compact `API key và model` section instead of the previous `Credential ban đầu` wording.

#### Scenario: Create section label is task-focused
- **WHEN** a user opens the AI provider create form
- **THEN** the credential section legend is `API key và model`
- **AND** the legend uses a visual hierarchy no stronger than other form section labels

#### Scenario: Row identity is secondary
- **WHEN** a create credential row is rendered
- **THEN** row text such as `Credential 1` is shown as secondary descriptive text
- **AND** it does not use heading-like emphasis that competes with field labels

### Requirement: Row-level model action
Each editable credential row SHALL expose model validation and selection as a row-level action near the delete action.

#### Scenario: Model action copy is compact
- **WHEN** a credential row has no selected model
- **THEN** the row-level model action is labeled `Chọn model`
- **AND** it uses a key-style icon

#### Scenario: Selected credential can change model
- **WHEN** a credential row already has a selected model
- **THEN** the row-level model action is labeled `Đổi model`
- **AND** activating it still validates the row API key through the model catalog before model selection

#### Scenario: Model validation pending state is concise
- **WHEN** model catalog validation is pending for a credential row
- **THEN** the row-level model action shows pending feedback with the label `Đang kiểm tra...`
- **AND** the pending state does not change the row layout width in a jarring way

### Requirement: Compact model summary
Editable credential rows SHALL display the selected model beside the API key input on desktop as a compact field-like summary.

#### Scenario: Desktop row aligns API key and model
- **WHEN** a user views an editable credential row on a desktop-width viewport
- **THEN** the API key input and model summary are presented on the same row
- **AND** the model summary height aligns with the default shadcn `Input` height

#### Scenario: Empty model summary is minimal
- **WHEN** no model is selected for a credential row
- **THEN** the model summary displays `Chưa chọn model`
- **AND** it does not use a large decorative icon or tall dashed panel

#### Scenario: Long model id remains contained
- **WHEN** the selected model id is long
- **THEN** the model summary keeps the credential row within its parent width
- **AND** the text is truncated or wrapped without horizontal overflow

### Requirement: Remove repetitive row helper copy
Credential rows SHALL avoid repeated helper descriptions when the row labels and actions already explain the workflow.

#### Scenario: Redundant row explanations are absent
- **WHEN** a create or edit credential row is rendered
- **THEN** it does not show `Model được lưu trực tiếp trên credential này.`
- **AND** it does not show `Xác thực credential để tải catalog model.`

### Requirement: Consistent create and edit credential density
The create credential rows and detail credential add/update controls SHALL use the same compact hierarchy, action copy, and model summary pattern.

#### Scenario: Detail add credential matches create row pattern
- **WHEN** a user adds a credential from an AI provider detail page
- **THEN** the API key input, model summary, and model selection action follow the same compact pattern as the create form

#### Scenario: Detail update credential matches create row pattern
- **WHEN** a user rotates an existing credential API key and model from an AI provider detail page
- **THEN** the editable update controls follow the same compact pattern as the create form
- **AND** saved credential metadata such as model, key preview, last used time, rate limit time, created time, and modified time remains available
