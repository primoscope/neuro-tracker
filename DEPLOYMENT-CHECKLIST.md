# 🚀 Deployment Checklist

## Pre-Deployment

### Supabase Setup

- [ ] Create a Supabase project at https://supabase.com
- [ ] Run the database migration from `supabase/migrations/001_create_logs_table.sql`
- [ ] Verify RLS is enabled on the `logs` table
- [ ] Test RLS policies by attempting to access another user's data
- [ ] Note down Project URL and anon key from Settings → API

### Vercel Setup

- [ ] Create a Vercel account at https://vercel.com
- [ ] Connect your GitHub repository
- [ ] Configure environment variables in Vercel project settings:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Apply environment variables to all environments (Production, Preview, Development)

## Deployment

### Initial Deploy

- [ ] Push code to GitHub (triggers automatic Vercel deployment)
- [ ] Or run `vercel --prod` manually
- [ ] Wait for build to complete
- [ ] Check build logs for errors

### Verification

- [ ] Visit the deployed URL
- [ ] Verify redirect to `/login`
- [ ] Create a new account with email/password
- [ ] Verify successful login and redirect to `/logs`
- [ ] Test compound autocomplete (type "caffeine")
- [ ] Create a test log with:
  - At least one compound with dose
  - Some effect tags selected
  - A sentiment score
  - Optional notes
- [ ] Verify auto-save indicator shows "Saved"
- [ ] Check that the log appears in history below
- [ ] Test "Copy Yesterday" button
- [ ] Log out
- [ ] Log back in
- [ ] Verify log persists
- [ ] Test on mobile device or responsive mode

## Post-Deployment

### Monitoring

- [ ] Check Vercel Analytics for traffic
- [ ] Monitor Supabase Dashboard for:
  - Auth users
  - Database queries
  - API requests
  - Storage usage
- [ ] Set up Supabase alerts for:
  - High CPU usage
  - Database connection limits
  - API rate limits

### Security

- [ ] Verify RLS policies are active in Supabase
- [ ] Check that users cannot access other users' data
- [ ] Test authentication edge cases:
  - Invalid credentials
  - Password reset (if implemented)
  - Session expiration
- [ ] Review Supabase Auth settings:
  - Email confirmation requirements
  - Password requirements
  - Rate limiting

### Performance

- [ ] Check Vercel deployment for:
  - Build time (<5 minutes expected)
  - Cold start time
  - Time to First Byte (TTFB)
- [ ] Test RxTerms API caching
- [ ] Verify auto-save doesn't cause lag
- [ ] Check mobile performance on real devices

## Troubleshooting

### Common Issues

**Build Fails**
- Ensure environment variables are set in Vercel
- Check build logs for specific errors
- Verify all dependencies are in package.json

**Auth Doesn't Work**
- Verify Supabase URL and keys are correct
- Check that Site URL is set in Supabase Auth settings
- Clear browser cookies and try again

**Logs Don't Save**
- Check browser console for errors
- Verify RLS policies in Supabase
- Check API routes are deployed correctly

**RxTerms Autocomplete Fails**
- Network issue - RxTerms API may be down
- Check `/api/rxterms` route is working
- Verify CORS isn't blocking requests

## Rollback Plan

If deployment fails or critical issues arise:

1. **Revert in Vercel**: Go to Deployments → Find previous working deployment → Promote to Production
2. **Or revert Git**: `git revert <commit-hash>` and push
3. **Database**: Keep Supabase database - it's backward compatible
4. **Notify Users**: If data loss occurred, communicate clearly

## Success Criteria

✅ Deployment is successful when:
- Users can register and log in
- Logs can be created and saved
- Logs persist across sessions
- History displays correctly
- Auto-save works without errors
- Mobile experience is smooth
- No console errors in production

## Maintenance

### Regular Tasks

**Weekly**
- Check Supabase usage metrics
- Review error logs in Vercel
- Monitor auth success rate

**Monthly**
- Review and optimize slow queries
- Check for dependency updates
- Review storage usage

**Quarterly**
- Security audit of RLS policies
- Performance optimization review
- User feedback integration

---

**Deployment Date**: ___________  
**Deployed By**: ___________  
**Verified By**: ___________  
**Production URL**: ___________  
