# Signapse UI - Project Context

## Project Overview

Signapse UI is a **Next.js 16 web application** serving as a management dashboard for an AI-powered trading signal system. The application is built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and uses **Clerk** for authentication.

## Tech Stack

- **Framework:** Next.js 16.1.7 (App Router)
- **UI:** React 19, Tailwind CSS v4
- **Authentication:** Clerk Next.js SDK
- **Component Library:** shadcn/ui (radix-vega style)
- **Icons:** Lucide React
- **State/Theme:** next-themes, sonner (toast notifications)
- **Package Manager:** pnpm

## Project Structure

```
signapse-ui/
├── app/
│   ├── (main)/           # Protected routes with sidebar
│   │   ├── layout.tsx     # Main layout with auth check
│   │   ├── page.tsx      # Dashboard (empty)
│   │   └── news-source/  # News source page
│   ├── (auth)/           # Auth routes
│   │   └── sign-in/      # Clerk sign-in
│   ├── layout.tsx        # Root layout with providers
│   └── globals.css       # Tailwind CSS
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── app-sidebar.tsx  # Main navigation sidebar
│   ├── app-breadcrumbs.tsx
│   ├── mode-toggle.tsx   # Dark/light theme toggle
│   └── providers.tsx    # Theme, toast, tooltip providers
├── config/
│   └── site.ts           # Navigation & site config
├── lib/
│   └── utils.ts          # cn() utility for class merging
├── hooks/                # Custom React hooks
└── .agents/skills/       # Agent skill definitions
```

## Key Features (Planned)

### 1. News Crawling

- **RSS Feeds:** Automatic news aggregation from RSS sources
- **Firecrawl API:** Content extraction from web pages
- Multi-source content detection and collection

### 2. AI Analysis

- **Multi-provider Fallback:** OpenAI, Google Gemini, Groq
- Automatic failover between providers
- Sentiment analysis, trend detection

### 3. Signal Generation

- Trading signals: BUY, SELL, HOLD
- Technical parameters: Entry point, Stop Loss (SL), Take Profit (TP)

### 4. Telegram Integration

- Multi-channel support
- Message tracking and processing
- Trading signal notifications
- Subscription management

### 5. Watchlist

- Asset management and tracking
- Real-time price monitoring
- Custom alerts
- Portfolio grouping

### 6. Settings

- AI configuration (API keys, models, fallback)
- Crawl settings (frequency, sources)
- Signal settings (thresholds, risk management)
- Telegram settings (bot tokens, chat IDs)
- System-wide configuration

### 7. Analytics

- Signal performance tracking
- Sentiment trends
- AI provider usage statistics
- Dashboard reports

### 8. News Management

- News browser with search and filters
- Manual crawl triggers
- Content preview

### 9. System Control

- Service management (start/stop/restart)
- Health monitoring
- Log viewing
- Process management
- Resource monitoring (CPU, Memory, Disk)

### 10. Authentication

- Clerk OAuth2 integration
- API key authentication
- JWT validation
- Data encryption
- Role-based access control

### 11. Scheduled Jobs

- Auto-crawl jobs
- AI analysis jobs
- Signal generation jobs
- Data cleanup jobs

## Current Navigation Structure

From `config/site.ts`:

| Section              | Items                                                           |
| -------------------- | --------------------------------------------------------------- |
| **Bảng điều khiển**  | Tổng quan (/)                                                   |
| **Quản lý nội dung** | Nguồn tin (/news-sources), Bài viết (/articles)                 |
| **AI & Tự động hóa** | Mẫu AI (/prompts), Telegram (/telegram), Wordpress (/wordpress) |
| **Giao dịch Bot**    | Cấu hình Trade (/settings/trade)                                |
| **Báo cáo**          | Danh sách báo cáo (/reports)                                    |

## Current Implementation Status

- ✅ Basic Next.js 16 app structure with App Router
- ✅ Clerk authentication setup
- ✅ Sidebar navigation with collapsible menus
- ✅ Dark/light theme toggle
- ✅ shadcn/ui components integrated
- ✅ Main layout with auth protection
- ⚠️ Dashboard page is empty (just "Hello world")
- ⚠️ No API routes, database, or backend logic implemented

## Development Commands

```bash
pnpm dev          # Start development server (turbopack)
pnpm build        # Build production version
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm typecheck   # TypeScript type checking
```

## Design System

- **Base Color:** Stone
- **Icon Library:** Lucide
- **Theme:** System preference with dark/light toggle
- **Font:** Geist (sans), Geist Mono (monospace)

## Environment Variables

Create `.env` file with:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
