# Supabase Authentication Setup Guide

This project is configured to use Supabase for authentication. Follow these steps to set up your Supabase project with the provided credentials.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Create a new project
4. Save your Supabase URL and Anon Key

## Step 2: Add Environment Variables

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from:
- **URL**: Supabase Dashboard → Settings → API → Project URL
- **Anon Key**: Supabase Dashboard → Settings → API → Project API keys → anon key

## Step 3: Set Up Authentication User

### Create the User in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Create new user** or invite user
4. Create a test user for your development work or use the sign-up flow in your app. Do NOT commit real credentials into the repository.

   - To create a user in the dashboard: click **Create new user** and provide an email and password, or invite a user.
   - Alternatively, run the app locally and use the sign-up page to create an account.
   - Ensure the account is confirmed (auto-confirm or confirm via email) if you want to sign in immediately.

## Step 4: Test the Login

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Use the sign-up link on the login page to create a new account (you can also add users directly
   from the Supabase dashboard under **Authentication → Users**).

4. Sign in with the email/password you just created.

Important: the repository should never contain actual passwords. Keep `.env.local` listed in
`.gitignore`.

## Features

- ✅ Email/Password authentication with sign‑up flow
- ✅ Form validation with error messages
- ✅ Loading states and spinners
- ✅ Session management
- ✅ Responsive design
- ✅ Dark/Light theme support

## API Endpoint

The login form submits to `/api/login` which handles:
- Email validation
- Password verification via Supabase
- Session token management
- Error handling and response

## Security Notes

- Passwords are never logged
- API keys are used securely server-side
- Sessions are stored with HttpOnly cookies
- Always use HTTPS in production
- Keep `.env.local` in `.gitignore` (already configured)

## Troubleshooting

**"Supabase configuration missing"**
- Check that `.env.local` has both variables set
- Ensure environment variables don't have extra spaces

**"Invalid credentials"**
- Verify the user exists in your Supabase Auth dashboard
- Check that the email and password are correct
- Make sure the user is not disabled

**"CORS errors"**
- Verify your Supabase project settings allow your domain
- In Supabase, go to Settings → CORS - add your domain/localhost

## Next Steps

After authentication works:
1. Add user profile pages
2. Implement logout functionality
3. Add password reset flow
4. Set up session persistence
5. Create protected routes with middleware
