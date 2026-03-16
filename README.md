# KYSS Vision

**KYSS Vision** is a digital workforce placement platform connecting pre-qualified seasonal workers with farms and employers across New Zealand and Australia. Built on the pool model — where joining a pool is a confirmed hire, not an application.

**URL**: https://kyssvision.com

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Routing | React Router v6 |
| State | React Query + React Context |
| SEO | react-helmet-async |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A Supabase project (see Database Setup below)

### Installation

```bash
git clone https://github.com/Camy8701/LYNCKIWI.git
cd LYNCKIWI
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

Both values are in your Supabase dashboard under **Project Settings → API**.

### Database Setup

Apply the migrations in order via the Supabase SQL Editor:

```
supabase/migrations/001_kyss_schema.sql          — Core tables + 13 enums
supabase/migrations/002_pools_schema.sql         — Work pools + memberships
supabase/migrations/003_communication_schema.sql — Feed, messages, notifications
supabase/migrations/004_remaining_schema.sql     — Reviews, reports, admin log, prospects
supabase/migrations/005_seed_and_rls.sql         — 9 work categories + RLS policies
```

### Development

```bash
npm run dev
```

The app runs on `http://localhost:8080` by default.

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/           # Shared UI components
│   ├── pools/            # PoolCard, StatusBadge
│   ├── categories/       # CategoryCard, CategoryGrid
│   ├── Navigation.tsx    # Role-aware navigation
│   ├── Footer.tsx
│   ├── WorkerLayout.tsx
│   ├── EmployerLayout.tsx
│   └── AdminLayout.tsx
├── contexts/
│   └── AuthContext.tsx   # Three-role auth (worker/employer/admin)
├── data/
│   ├── workTypeCategoriesData.ts
│   └── regionsData.ts
├── integrations/supabase/
│   ├── client.ts
│   └── types.ts          # Full DB type definitions
├── lib/
│   └── kyss.ts           # All Supabase helper functions
├── pages/
│   ├── auth/             # SignIn, SignUp
│   ├── worker/           # Dashboard, MyPools, Messages, Notifications, Settings, Profile, ProfileWizard
│   ├── employer/         # Dashboard, PoolManagement, Profile
│   ├── admin/            # Dashboard, Workers, Employers, Pools, Revenue, Prospects, FlaggedContent, ActivityLog, BlogCMS
│   ├── FindWork.tsx
│   ├── CategoryPools.tsx
│   ├── PoolDetail.tsx
│   ├── ForEmployers.tsx
│   ├── HowItWorks.tsx
│   ├── Guide.tsx / GuideArticle.tsx
│   ├── WorkTypeDetail.tsx
│   └── SeasonalCalendar.tsx
└── App.tsx               # Full route tree
```

## User Roles

| Role | Portal | Entry Point |
|---|---|---|
| `worker` | `/worker/*` | `/auth/sign-up` → select Worker |
| `employer` | `/employer/*` | `/auth/sign-up` → select Employer |
| `admin` | `/admin/*` | `/admin/login` |

## Database Schema (15 tables)

`user_profiles`, `worker_profiles`, `employer_profiles`, `work_type_categories`, `work_pools`, `pool_memberships`, `pool_posts`, `pool_post_comments`, `conversations`, `messages`, `notifications`, `reviews`, `reports`, `admin_actions`, `prospects`

## Revenue Model

$1 per worker per hour active in any pool.

## Deployment

Deploy to Vercel or Netlify. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as environment variables in your deployment platform.

## License

Copyright © 2025 KYSS Vision. All rights reserved.

For support: support@kyssvision.com
