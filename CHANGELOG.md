# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2024-11-21

### Added - Supabase Migration

#### Authentication
- Supabase Auth integration with email/password
- Protected route middleware
- Auth route group `(auth)` with login and register pages
- Session management with HTTP-only cookies
- Automatic redirect for authenticated/unauthenticated users

#### Smart Logger
- RxTerms API integration for compound autocomplete
- Debounced search with 300ms delay
- One-tap effect tags across three categories:
  - Cognitive: Flow State, Brain Fog, Sharp, Distracted, Motivation, Creative
  - Physical: High Energy, Jittery, Headache, Nausea, Insomnia, Muscle Tension
  - Mood: Anxious, Calm, Irritable, Euphoric, Social, Numb
- Sentiment scoring (1-5) with emoji icons (😡😕😐🙂🤩)
- Compound chips with popover dose selector
- Quick-select dose presets (25mg, 50mg, 100mg, 200mg, 500mg, 1g)
- Custom dose input support
- Optional notes field
- Adjustable occurred_at timestamp
- "Copy Yesterday" functionality
- Auto-save with 1-second debounce
- Save status indicator (Saving.../Saved)

#### Database
- PostgreSQL database via Supabase
- `logs` table with JSONB and array columns
- Row Level Security (RLS) policies
- User-scoped data isolation
- Indexed queries for performance
- Migration SQL file provided

#### History View
- Server-side data fetching
- Color-coded log cards by sentiment (green/yellow/red)
- Display top 3 compounds per log
- Timestamp and sentiment emoji display
- Initial load of 20 logs

#### API Routes
- `/api/rxterms` - Proxies NIH RxTerms API with caching (1 hour TTL)
- `/api/logs` - CRUD operations for logs (POST, PATCH)
- Server-side authentication verification

#### UI/UX
- Mobile-first responsive design
- Floating Action Button (FAB) on mobile
- Large touch targets (44px minimum)
- shadcn/ui components (Toggle, Popover, Card, Input, Textarea, Button, Label)
- Dark theme with blue accents
- Glassmorphism effects

#### Developer Experience
- TypeScript strict mode
- Zod schemas for validation
- Comprehensive database types
- Environment variable templates (`.env.local.example`)
- Build script with placeholder env vars
- Force dynamic rendering for auth pages

#### Documentation
- `README-SUPABASE.md` - Complete setup guide
- `DEPLOYMENT-CHECKLIST.md` - Deployment verification steps
- Architecture overview
- Troubleshooting guide
- Security best practices
- Vercel deployment instructions

### Changed

- Removed Google Fonts Inter import (build compatibility)
- Updated root page to redirect based on auth status
- Removed LocalStorage-based PIN authentication (kept old components for reference)
- Updated README.md to point to Supabase version

### Technical Notes

- Next.js 16.0.3 with App Router
- Supabase 2.84.0 with SSR helpers
- TypeScript 5.9.3
- Tailwind CSS 4.1.17
- Radix UI components for accessibility
- date-fns for date formatting

### Known Limitations

- Pagination not fully implemented (loads first 20 logs)
- No search/filter functionality
- No data export in new version
- No migration tool from LocalStorage version
- Requires placeholder env vars for build in CI/CD

### Migration from v1.x

The LocalStorage version is still available on the `main` branch. To migrate:

1. Export data from old version
2. Manual data transformation required (schemas have changed)
3. Import to new Supabase database

## [1.0.0] - Previous

### Original Features (LocalStorage Version)

- PIN-based authentication
- LocalStorage data persistence
- Compound pharmacy management
- Stack presets
- Anxiety and functionality scoring (1-10)
- Trends chart and heatmap
- AI analysis integration (Gemini API)
- Import/export functionality
- Settings management

---

[2.0.0]: https://github.com/primoscope/neuro-tracker/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/primoscope/neuro-tracker/releases/tag/v1.0.0
