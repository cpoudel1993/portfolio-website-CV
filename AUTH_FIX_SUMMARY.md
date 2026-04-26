## Authentication Fix Checklist

### Backend/Code Changes (✅ Completed)

- [x] **Callback Route Fixed** - `/auth/callback/route.ts` now properly exchanges verification code for session and redirects to sign-up-success
- [x] **Sign-up URL Handling** - `/auth/sign-up/page.tsx` uses `NEXT_PUBLIC_SITE_URL` for production email verification URLs
- [x] **Middleware Protection** - `/proxy.ts` runs on all `/protected/*` routes
- [x] **Admin Email Check** - Both middleware and layout verify user email matches admin email (`c.poudel1993@gmail.com`)
- [x] **Session Handling** - Supabase server/client setup properly manages cookies

### Supabase Dashboard Configuration (⚠️ Action Required)

Follow these steps in your Supabase dashboard:

1. **Go to** Authentication → URL Configuration
2. **Set Site URL:**
   ```
   https://www.chiranjivipoudel.com.np
   ```

3. **Set Redirect URLs** (click "Add URL" for each):
   ```
   https://www.chiranjivipoudel.com.np/auth/callback
   https://www.chiranjivipoudel.com.np/auth/sign-up-success
   https://www.chiranjivipoudel.com.np/auth/login
   ```

4. **For local testing, also add:**
   ```
   http://localhost:3000/auth/callback
   ```

5. **Click "Save"**

### Vercel Environment Variables (⚠️ Action Required)

In your Vercel project:

1. Go to **Settings → Environment Variables**
2. Ensure these are set (ask user to verify or provide):
   ```
   NEXT_PUBLIC_SITE_URL = https://www.chiranjivipoudel.com.np
   NEXT_PUBLIC_SUPABASE_URL = [from Supabase → Project Settings]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [from Supabase → Project Settings → API keys]
   SUPABASE_SERVICE_ROLE_KEY = [from Supabase → Project Settings → API keys]
   ```

3. **Redeploy** after setting variables

### How Email Verification Now Works

1. User signs up at `/auth/sign-up`
2. Supabase sends email with link containing `code` parameter
3. Link points to: `https://www.chiranjivipoudel.com.np/auth/callback?code=ABC123`
4. Callback route exchanges code for valid session
5. User redirected to `/auth/sign-up-success` with verified email
6. User can sign in at `/auth/login`

### How Admin Access Works

1. After login, middleware checks if user email = `c.poudel1993@gmail.com`
2. If match → allow access to `/protected/*` routes
3. If no match → redirect to `/auth/unauthorized`
4. Layout also double-checks before rendering admin content

### Testing Locally

```bash
# 1. Set .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# 2. Start dev server
npm run dev

# 3. Go to http://localhost:3000/auth/sign-up
# 4. Sign up with your email
# 5. Check your email for verification link
# 6. Click link (should redirect to /auth/sign-up-success)
# 7. Sign in at /auth/login with your credentials
# 8. Should see admin dashboard at /protected
```

### Testing Production

After setting Supabase dashboard URLs and Vercel env vars:

1. Go to `https://www.chiranjivipoudel.com.np/auth/sign-up`
2. Sign up with email
3. Check email for verification link
4. Click link (should redirect to `/auth/sign-up-success` on production domain)
5. Sign in at `https://www.chiranjivipoudel.com.np/auth/login`
6. Should access dashboard at `/protected`

### If Email Verification Fails

**Symptom:** Email link redirects to localhost or shows "can't reach this page"

**Fix:**
1. Verify Supabase URL Configuration is set to production domain
2. Verify `NEXT_PUBLIC_SITE_URL` env var is set
3. Wait 5 minutes for Supabase to apply URL changes
4. Test again

### Admin Email Configuration

To change admin email from `c.poudel1993@gmail.com`:

1. Find and replace `c.poudel1993@gmail.com` in:
   - `lib/supabase/middleware.ts`
   - `app/protected/layout.tsx`

2. Redeploy to Vercel

### Summary

✅ **Code is ready** - All backend auth logic fixed
⚠️ **Needs configuration** - Supabase dashboard URL settings
⚠️ **Needs verification** - Environment variables in Vercel

See `SUPABASE_AUTH_SETUP.md` for detailed setup instructions.
