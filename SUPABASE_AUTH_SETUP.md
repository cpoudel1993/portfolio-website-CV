## Supabase Authentication Setup Guide

This guide explains how to configure Supabase for proper email verification and production deployment.

### 1. Supabase Dashboard Configuration

**Go to Supabase Dashboard → Your Project → Authentication → URL Configuration**

Set the following Site URLs and Redirect URLs:

#### Site URL
```
https://www.chiranjivipoudel.com.np
```

#### Redirect URLs
Add these URLs (one per line):
```
https://www.chiranjivipoudel.com.np/auth/callback
https://www.chiranjivipoudel.com.np/auth/sign-up-success
https://www.chiranjivipoudel.com.np/auth/login
```

For local development, also add:
```
http://localhost:3000/auth/callback
```

### 2. Environment Variables

Ensure these are set in your Vercel project environment (Settings → Environment Variables):

**Required for production:**
```
NEXT_PUBLIC_SITE_URL=https://www.chiranjivipoudel.com.np
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

**For local development (.env.local):**
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 3. Email Provider Setup (Supabase Dashboard)

**Go to Authentication → Email Templates**

Make sure "Email Confirmation" template is enabled. The template should send users to the callback URL with a verification code.

### 4. How It Works

#### Sign Up Flow
1. User fills form at `/auth/sign-up` with email and password
2. Frontend calls `supabase.auth.signUp()` with `emailRedirectTo: ${NEXT_PUBLIC_SITE_URL}/auth/callback`
3. Supabase sends verification email to user's email address
4. User clicks email link → redirects to `https://www.chiranjivipoudel.com.np/auth/callback?code=XXX`
5. Callback route (`/auth/callback`) exchanges code for session
6. User redirected to `/auth/sign-up-success`
7. User can then sign in at `/auth/login`

#### Login Flow
1. User enters email and password at `/auth/login`
2. Frontend calls `supabase.auth.signInWithPassword()`
3. If credentials are correct, user session is created
4. User redirected to `/protected` (admin dashboard)

#### Admin Access
- Only emails matching `c.poudel1993@gmail.com` can access `/protected/*` routes
- Non-admin emails are redirected to `/auth/unauthorized`
- Admin check happens in middleware (`lib/supabase/middleware.ts`) and layout (`app/protected/layout.tsx`)

### 5. Troubleshooting

#### Email Verification Redirects to Localhost
**Problem:** After clicking email link, user sees "can't reach this page" or redirects to localhost

**Solution:** 
- Check that `NEXT_PUBLIC_SITE_URL` is set correctly in Supabase dashboard URL Configuration
- Verify Redirect URLs include `/auth/callback`
- Ensure `NEXT_PUBLIC_SITE_URL` environment variable is set in Vercel

#### Can't Access Admin Dashboard
**Problem:** After login, user sees "Unauthorized" page

**Solution:**
- Check that your email matches `c.poudel1993@gmail.com` (configured in middleware)
- Verify email is confirmed (check email confirmation status in Supabase Auth users table)

#### Session Not Persisting
**Problem:** Logged in, but refreshing page logs you out

**Solution:**
- Ensure middleware (`proxy.ts`) is configured to run on protected routes
- Check that cookies are being set properly (browser dev tools → Application → Cookies)
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct

### 6. Testing Production URLs

Before deploying, test with your production domain:

1. Deploy to Vercel with correct environment variables
2. Test sign-up at `https://www.chiranjivipoudel.com.np/auth/sign-up`
3. Check email and click verification link
4. Should redirect to `https://www.chiranjivipoudel.com.np/auth/sign-up-success`
5. Sign in with your credentials
6. Should be able to access `/protected` dashboard

### 7. Important Files

- `lib/supabase/middleware.ts` - Protects `/protected` routes, checks admin email
- `app/protected/layout.tsx` - Double-checks admin access before rendering
- `app/auth/callback/route.ts` - Handles email verification code exchange
- `app/auth/login/page.tsx` - Login page (no changes needed)
- `app/auth/sign-up/page.tsx` - Sign-up page (uses NEXT_PUBLIC_SITE_URL)

### 8. Admin Email Configuration

To change the admin email, update `SUPERADMIN_EMAIL` in:
- `lib/supabase/middleware.ts`
- `app/protected/layout.tsx`

Example:
```typescript
const SUPERADMIN_EMAIL = 'your-email@example.com'
```

Then redeploy to apply changes.
