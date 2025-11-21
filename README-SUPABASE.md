# 🧬 NeuroStack V2 - Supabase Migration Guide

This document provides setup instructions for the Supabase-powered version of NeuroStack.

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account ([signup](https://supabase.com))
- A Vercel account for deployment (optional)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/primoscope/neuro-tracker.git
cd neuro-tracker
npm install
```

### 2. Set Up Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Wait for the project to finish setting up
4. Go to **Project Settings** → **API**
5. Copy your **Project URL** and **anon/public** key

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Database Migrations

In your Supabase dashboard:

1. Go to **SQL Editor**
2. Click **New query**
3. Copy the contents of `supabase/migrations/001_create_logs_table.sql`
4. Paste and **Run** the query

This will:
- Create the `logs` table
- Enable Row Level Security (RLS)
- Set up policies so users can only access their own data

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### First Time Setup

1. Navigate to the app (it will redirect to `/login`)
2. Click **"Sign up"** to create an account
3. Enter your email and password (minimum 6 characters)
4. You'll be automatically logged in

### Logging Your Stack

1. Click the **"+ New Log"** button (or FAB on mobile)
2. **Add Compounds**: 
   - Start typing a compound name (e.g., "caffeine")
   - Select from RxTerms suggestions or press Enter to add custom
   - Click the dose button to set amount (quick-select or custom)
3. **Select Effects**: Tap tags for cognitive, physical, and mood effects
4. **Rate Your Day**: Choose a sentiment score (1-5)
5. **Add Notes** (optional): Any observations or context
6. **Set Time**: Adjust when you took the stack
7. The log auto-saves as you type (look for "Saved" indicator)

### Copy Yesterday

Click **"Copy Yesterday"** to pre-fill the form with your most recent log. This is useful for daily stacks that don't change much.

### View History

Your recent logs appear below the logging form, color-coded by sentiment:
- 🟢 Green: Good days (4-5)
- 🟡 Yellow: Neutral (3)
- 🔴 Red: Bad days (1-2)

## 🔐 Security Features

### Row Level Security (RLS)

All logs are protected by Supabase RLS policies:
- Users can only see their own logs
- Users can only create/update/delete their own logs
- The database enforces these rules at the database level

### Authentication

- Email/password authentication via Supabase Auth
- Session managed with HTTP-only cookies
- Protected routes redirect unauthenticated users to login

## 🚢 Deployment to Vercel

### 1. Connect to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/primoscope/neuro-tracker)

Or manually:

```bash
npm install -g vercel
vercel
```

### 2. Configure Environment Variables

In your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Apply to **Production**, **Preview**, and **Development** environments

### 3. Deploy

```bash
vercel --prod
```

## 🎨 Architecture

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **Type Safety**: TypeScript + Zod
- **Drug Data**: NIH RxTerms API

### Project Structure

```
neuro-tracker/
├── app/
│   ├── (auth)/              # Public routes (login, register)
│   ├── (app)/               # Protected routes (logs)
│   ├── api/                 # API routes
│   │   ├── logs/            # Log CRUD operations
│   │   └── rxterms/         # Drug autocomplete proxy
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page (redirects)
├── components/
│   ├── logs/                # Logging-specific components
│   │   ├── SmartLogger.tsx  # Main logging form
│   │   ├── CompoundAutocomplete.tsx
│   │   ├── CompoundChip.tsx
│   │   ├── TagSelector.tsx
│   │   ├── SentimentSelector.tsx
│   │   └── LogHistory.tsx
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── supabase/            # Supabase clients
│   │   ├── client.ts        # Browser client
│   │   ├── server.ts        # Server client
│   │   └── database.types.ts # Generated types
│   ├── schemas.ts           # Zod schemas & constants
│   └── utils.ts             # Utilities
├── supabase/
│   └── migrations/          # Database migrations
├── middleware.ts            # Route protection
└── .env.local.example       # Environment template
```

### Database Schema

#### `logs` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Foreign key to auth.users |
| `created_at` | timestamptz | When log was created |
| `occurred_at` | timestamptz | When stack was taken |
| `compounds` | jsonb | Array of {name, dose} |
| `sentiment_score` | integer | 1-5 rating |
| `tags_cognitive` | text[] | Cognitive effect tags |
| `tags_physical` | text[] | Physical effect tags |
| `tags_mood` | text[] | Mood effect tags |
| `notes` | text | Optional notes |

### Key Features

#### RxTerms API Integration

The app proxies requests to the NIH RxTerms API through `/api/rxterms`:
- Caches results for 1 hour
- Provides autocomplete suggestions
- Falls back gracefully if unavailable

#### Auto-Save

Logs auto-save 1 second after the last change:
- Prevents data loss
- Creates or updates existing log
- Shows save status indicator

#### Mobile-First Design

- Large tap targets (44px minimum)
- Touch-friendly chip selectors
- Responsive grid layouts
- Floating action button on mobile

## 🔧 Development

### Local Development

```bash
npm run dev
```

### Build

```bash
# Requires environment variables
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co \
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder \
npm run build
```

### Lint

```bash
npm run lint
```

## 🐛 Troubleshooting

### "Invalid API key" Error

- Check that your `.env.local` file exists and has the correct values
- Restart the dev server after changing environment variables

### Build Fails

- Make sure you have the correct environment variables set
- For CI/CD, use placeholder values: `NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder`

### Auth Issues

- Clear browser cookies and try again
- Check that your Supabase project is active
- Verify RLS policies are correctly set up

### Database Errors

- Make sure you've run the migration SQL
- Check that RLS is enabled on the `logs` table
- Verify the user is authenticated

## 📝 Migration from LocalStorage Version

If you're migrating from the old LocalStorage version:

1. Export your data using the old app's export feature
2. The new version uses a different data structure - manual migration required
3. Consider writing a script to transform the data format if needed

## 🤝 Contributing

Contributions are welcome! Please ensure:
- TypeScript types are properly defined
- All new routes have proper error handling
- RLS policies are tested for security
- Mobile responsiveness is maintained

## 📄 License

MIT License - feel free to fork and customize.

## ⚠️ Disclaimer

This app is for informational purposes only. Always consult with healthcare professionals before starting, stopping, or modifying any medication or supplement regimen.

---

**Built with 🧠 for bio-hackers, by bio-hackers.**
