## ADDED Requirements

### Requirement: Scheduled market analysis schedule management is nested in feature routing
The system SHALL manage scheduled market analysis schedules inside the `SCHEDULED_MARKET_ANALYSIS` feature routing area rather than as a standalone peer-level Telegram section.

#### Scenario: Scheduled market analysis route includes schedule management
- **WHEN** the Telegram configuration workspace displays the `SCHEDULED_MARKET_ANALYSIS` route
- **THEN** the system shows that route's destination, enabled state, and schedule management surface in the same feature routing area

#### Scenario: Schedule surface is not a peer-level section
- **WHEN** the Telegram configuration workspace is displayed
- **THEN** the system does not render "Lịch phân tích thị trường" as a standalone top-level section after feature routing

#### Scenario: Simple routes remain compact
- **WHEN** the Telegram configuration workspace displays `ECONOMIC_CALENDAR_ALERT` and `MARKET_NEWS_ALERT`
- **THEN** the system keeps those route rows focused on destination, blocked state, and enabled switch without adding schedule controls

### Requirement: Refined Telegram hierarchy reflects shared infrastructure and feature workflows
The system SHALL present bot connections and destinations as shared Telegram infrastructure, and feature routing as the place where workflow-specific Telegram behavior is managed.

#### Scenario: Top-level configuration order is simplified
- **WHEN** the Telegram configuration workspace is displayed
- **THEN** the top-level content order is readiness summary, bot connections, destinations, and feature routing

#### Scenario: Market analysis readiness belongs to routing
- **WHEN** the readiness summary communicates scheduled market analysis state
- **THEN** the copy or placement indicates it is part of route readiness rather than a separate setup pillar

#### Scenario: Nested schedule controls preserve UI-only boundary
- **WHEN** the user opens create, edit, or destructive schedule controls from the scheduled market analysis route area
- **THEN** the system keeps those controls UI-only and does not claim a backend schedule mutation succeeded
