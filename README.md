# KYSS Vision

KYSS Vision is a digital workforce placement platform for seasonal farm work in New Zealand and Australia. It connects pre-qualified backpackers with verified employers through a pool-based hiring model.

**URL**: https://kyssvision.com

## Tech Stack

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL + Auth + Realtime)
- React Router v6

## Getting Started

```bash
git clone https://github.com/Camy8701/LYNCKIWI.git
cd KYSS
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

```
KYSS/
├── src/
│   ├── components/     # Shared UI components
│   ├── contexts/       # React contexts (Auth, etc.)
│   ├── data/           # Static data files
│   ├── lib/            # Utility functions, Supabase client
│   ├── pages/          # Route-level page components
│   └── types/          # TypeScript type definitions
├── supabase/
│   └── migrations/     # SQL migration files
├── public/             # Static assets
└── prd.json            # Build execution plan (64 user stories)
```

## License

Copyright © 2025 KYSS Vision. All rights reserved.

For support, please contact: support@kyssvision.com
