# 🔄 Hybrid Storage System

NeuroStack now supports **two storage modes** that can be used interchangeably:

## Storage Modes

### 🗄️ LocalStorage Mode (Default)
**No backend required** - Perfect for quick deployment and privacy-focused users.

**Features:**
- ✅ Completely offline-first
- ✅ PIN-based authentication (4+ digits)
- ✅ Data stored in browser's LocalStorage
- ✅ Zero configuration needed
- ✅ Works immediately after `npm run dev`
- ✅ No API keys or accounts required
- ✅ Data persists across sessions

**Auth:**
- Username + 4-digit PIN
- Stored locally
- No email required

**Best For:**
- Quick testing and development
- Privacy-conscious users
- Single-device usage
- Vercel deployment without database

### ☁️ Supabase Mode
**Cloud-synced** - Full-featured with authentication and multi-device support.

**Features:**
- ✅ Cloud storage and sync
- ✅ Email/password authentication
- ✅ Multi-device access
- ✅ Row Level Security (RLS)
- ✅ Automatic backups
- ✅ Scalable infrastructure

**Auth:**
- Email + Password (6+ characters)
- Supabase Auth
- Email confirmation (configurable)

**Best For:**
- Production deployments
- Multiple devices
- Data backup and recovery
- Collaborative features (future)

## How It Works

### Auto-Detection

The app automatically detects which storage mode to use:

```typescript
// 1. Check if Supabase is configured
const hasSupabase = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  url !== 'https://placeholder.supabase.co';

// 2. Check user preference (stored in localStorage)
const userPreference = localStorage.getItem('storage-mode');

// 3. Select appropriate adapter
const adapter = userPreference === 'local' 
  ? localAdapter 
  : (hasSupabase ? supabaseAdapter : localAdapter);
```

### Storage Adapters

Both modes implement the same `StorageAdapter` interface:

```typescript
interface StorageAdapter {
  mode: 'local' | 'supabase';
  
  // Auth
  signUp(email: string, password: string): Promise<{error}>;
  signIn(email: string, password: string): Promise<{error}>;
  signOut(): Promise<void>;
  getUser(): Promise<User | null>;
  
  // Logs
  createLog(log): Promise<LogEntry>;
  updateLog(id, updates): Promise<LogEntry>;
  getLogs(limit): Promise<LogEntry[]>;
  getLastLog(): Promise<LogEntry | null>;
  
  // Data Management
  exportData(): Promise<any>;
  importData(data): Promise<void>;
}
```

## Setup Instructions

### LocalStorage Mode (Default)

**No setup required!**

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

1. Open the app
2. You'll see "Local Storage Mode" indicator
3. Create account with any username + 4-digit PIN
4. Start logging!

**Notes:**
- Data is stored in browser only
- Clearing browser data will delete logs
- Use Export feature to backup
- Each browser/device is independent

### Supabase Mode

**Requires Supabase project:**

1. Create a Supabase project at https://supabase.com
2. Run the database migration (see SUPABASE-SETUP.md)
3. Get your credentials from Settings → API
4. Set environment variables:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Restart dev server
6. App will automatically use Supabase mode

## Switching Between Modes

### At Development Time

Just set or unset the environment variables:

```bash
# Use LocalStorage
unset NEXT_PUBLIC_SUPABASE_URL
unset NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev

# Use Supabase
export NEXT_PUBLIC_SUPABASE_URL="your-url"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-key"
npm run dev
```

### At Runtime (Future Feature)

A settings page will allow users to manually switch modes and migrate data.

## Data Export/Import

Both adapters support export/import:

```typescript
// Export
const data = await adapter.exportData();
// Returns: { logs, user, exportedAt, version }

// Import
await adapter.importData(data);
```

This allows migration between modes:
1. Export from LocalStorage
2. Switch to Supabase mode
3. Import data

## API Compatibility

### Supabase Mode
- Uses `/api/logs` route for CRUD operations
- Server-side auth validation
- RLS enforced at database level

### LocalStorage Mode
- Direct LocalStorage access
- Client-side only
- No API calls needed

## UI Indicators

The app shows which mode is active:

**Header:**
- 💾 HardDrive icon + "Local Storage" = LocalStorage mode
- ☁️ Cloud icon + "Cloud Sync" = Supabase mode

**Auth Page:**
- Shows mode-appropriate labels
- LocalStorage: "Username" + "PIN"
- Supabase: "Email" + "Password"

## Deployment

### Vercel with LocalStorage

**No configuration needed:**

```bash
vercel deploy
```

The app works immediately with browser storage.

### Vercel with Supabase

**Set environment variables in Vercel dashboard:**

1. Go to Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy

## Security Considerations

### LocalStorage Mode
- ⚠️ Data visible in browser DevTools
- ⚠️ No encryption at rest
- ⚠️ Vulnerable to XSS attacks
- ⚠️ Lost if browser data is cleared
- ✅ No network transmission
- ✅ No server-side vulnerabilities

**Recommendation:** Use for development or non-sensitive data only.

### Supabase Mode
- ✅ Data encrypted in transit (HTTPS)
- ✅ Data encrypted at rest (Supabase)
- ✅ Row Level Security (RLS)
- ✅ Secure authentication
- ✅ Rate limiting
- ✅ Regular backups

**Recommendation:** Use for production with sensitive data.

## Troubleshooting

### "LocalStorage not available"
- Check if browser allows LocalStorage
- Try different browser
- Check browser privacy settings

### "Supabase not configured"
- Verify environment variables are set
- Check URL format: `https://xxx.supabase.co`
- Verify anon key is correct
- Restart dev server after setting vars

### Data not persisting (LocalStorage)
- Check browser storage isn't full
- Verify LocalStorage is enabled
- Check for browser extensions blocking storage

### Cannot authenticate (Supabase)
- Verify database migration ran successfully
- Check RLS policies are enabled
- Verify auth settings in Supabase dashboard

## Future Enhancements

Potential features for hybrid storage:

- [ ] Settings page to manually switch modes
- [ ] One-click data migration UI
- [ ] Sync conflict resolution
- [ ] Offline queue for Supabase mode
- [ ] Encrypted LocalStorage option
- [ ] Progressive sync (start local, upgrade to cloud)
- [ ] Backup reminders for LocalStorage users

## Technical Details

**Files:**
- `lib/storage/types.ts` - Interface definitions
- `lib/storage/local-adapter.ts` - LocalStorage implementation
- `lib/storage/supabase-adapter.ts` - Supabase implementation
- `lib/storage/provider.tsx` - Context and auto-detection
- `app/(auth)/auth/page.tsx` - Unified auth page

**State Management:**
- `StorageProvider` wraps entire app
- `useStorage()` hook provides adapter
- Components use adapter methods
- No direct storage access in components

---

**Built with flexibility in mind - works everywhere, from localhost to production!**
