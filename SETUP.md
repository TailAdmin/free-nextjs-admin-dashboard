# 🚀 Quick Start Guide - Authentication Setup

## Prerequisites

- Node.js 18.x or later
- PostgreSQL database (or SQLite for local development)
- Git

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment Variables

1. Copy the environment template:
```bash
copy .env.example .env
```

2. Edit `.env` and configure:

### Database (Choose one option):

**Option A: PostgreSQL (Recommended for production)**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/admin_dashboard"
```

**Option B: SQLite (Quick local development)**
```env
DATABASE_URL="file:./dev.db"
```

### NextAuth Configuration

Generate a secret key:
```bash
# On Windows PowerShell:
$bytes = New-Object byte[] 32
(New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
[Convert]::ToBase64String($bytes)

# On Linux/Mac:
openssl rand -base64 32
```

Add to `.env`:
```env
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### OAuth Providers (Optional)

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret to `.env`:
```env
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"
```

**GitHub OAuth:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create New OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env`:
```env
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

## Step 3: Set Up Database

Generate Prisma client and create database tables:

```bash
npx prisma generate
npx prisma db push
```

For production, use migrations instead:
```bash
npx prisma migrate dev --name init
```

## Step 4: Create First Admin User (Optional)

You can create an admin user directly in the database or through the sign-up form and then manually update the role:

```sql
-- After signing up, update user role to ADMIN
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Step 5: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🎉 You're Ready!

### Test Authentication:

1. **Sign Up**: Go to `/signup` and create an account
2. **Sign In**: Go to `/signin` and log in with credentials
3. **OAuth**: Click "Sign in with Google" or "Sign in with GitHub"

### Features Implemented:

✅ Email/Password authentication
✅ Google OAuth (if configured)
✅ GitHub OAuth (if configured)
✅ Protected routes with middleware
✅ Role-based access control (USER/ADMIN)
✅ Session management with JWT
✅ Password hashing with bcrypt
✅ Form validation

## Troubleshooting

### Database Connection Issues

**Error: Can't reach database server**
- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- Try using SQLite for local development

### OAuth Not Working

**Error: Configuration error**
- Verify OAuth credentials in `.env`
- Check callback URLs match exactly
- Ensure OAuth apps are enabled in provider console

### Prisma Generate Fails

**Error: Prisma schema has errors**
- Run `npx prisma format` to format schema
- Check for syntax errors in `schema.prisma`
- Ensure DATABASE_URL is set

### NextAuth Session Issues

**Error: No session found**
- Clear browser cookies
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain

## Next Steps

Now that authentication is working, you can:

1. **Add More Pages**: Create user management, settings, analytics pages
2. **Connect Real Data**: Replace mock data with API calls
3. **Add Tests**: Implement unit and integration tests
4. **Deploy**: Deploy to Vercel, Netlify, or your preferred platform

See `implementation_plan.md` for the complete roadmap!
