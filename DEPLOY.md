# BetterTasks — Deployment Guide

## Prerequisites
- Vercel account (free): https://vercel.com/signup
- Convex account (free): https://convex.dev
- GitHub repo with your code pushed

---

## Step 1: Generate Secrets

```bash
# Generate a strong auth secret (copy the output)
openssl rand -base64 32

# Example output:
# jMOtFn2rzeyaDxGa1pkhuQUaH5aHeU+qlwyGBsWfYmM=
```

This secret is already set in `.env.example`. Copy it for Vercel env vars.

---

## Step 2: Deploy Convex Backend (Production)

```bash
# 1. Log in to Convex
npx convex login

# 2. Deploy your backend to Convex Cloud
npx convex deploy
```

After deployment, Convex prints a production URL like:
```
https://your-project.convex.cloud
```

**Copy this URL** — you'll need it in Step 4.

Also get your Convex deploy key:
```bash
npx convex deploy --show-url
# Go to Convex Dashboard → Settings → Deploy Key
```

---

## Step 3: Set Up Vercel Project

```bash
# 1. Link your repo to Vercel
vercel login

# 2. Initialize project (run in repo root)
vercel

# 3. Note the Project ID from .vercel/project.json
```

Get your Vercel credentials:
```bash
# Token: https://vercel.com/account/tokens
vercel tokens create

# Org ID: found in .vercel/project.json after `vercel` command
# Project ID: found in .vercel/project.json
```

---

## Step 4: Add GitHub Secrets

Go to your GitHub repo → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

| Secret Name | Value | How to get |
|-------------|-------|------------|
| `CONVEX_DEPLOY_KEY` | Your Convex deploy key | Convex Dashboard → Settings |
| `VERCEL_TOKEN` | Vercel personal access token | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Your Vercel org ID | `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | `.vercel/project.json` |
| `VITE_CONVEX_URL` | Convex production URL | Output of `npx convex deploy` |
| `BETTER_AUTH_SECRET` | `jMOtFn2rzeyaDxGa1pkhuQUaH5aHeU+qlwyGBsWfYmM=` | From `.env.example` or generate new |

---

## Step 5: Deploy!

Push to `main` branch — GitHub Actions will auto-deploy:

```bash
git add .
git commit -m "Setup deployment"
git push origin main
```

Go to GitHub → Actions tab to watch the deployment.

---

## Step 6: Set Vercel Environment Variables

After first deploy, go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:

| Name | Value |
|------|-------|
| `VITE_CONVEX_URL` | Your Convex production URL |
| `BETTER_AUTH_SECRET` | Your generated secret |

Then redeploy:
```bash
vercel deploy --prod
```

---

## Optional: OAuth Providers

### Google OAuth

1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI:
   ```
   https://your-vercel-app.vercel.app/api/auth/callback/google
   ```
4. Copy Client ID and Client Secret
5. Add to Vercel env vars:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### GitHub OAuth

1. Go to https://github.com/settings/developers
2. New OAuth App
3. Authorization callback URL:
   ```
   https://your-vercel-app.vercel.app/api/auth/callback/github
   ```
4. Copy Client ID and Client Secret
5. Add to Vercel env vars:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`

---

## Local Development

```bash
# Terminal 1 — Convex backend
npx convex dev

# Terminal 2 — Vite frontend
npm run dev
```

---

## Project Structure

```
opencode-ui/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions auto-deploy
├── convex/                 # Convex backend
│   ├── schema.ts           # Database schema
│   ├── tasks.ts            # Task CRUD
│   └── auth.ts             # Auth operations
├── src/
│   ├── components/         # React components
│   ├── components/ui/      # shadcn/ui components (sparkles)
│   ├── contexts/           # Auth context
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities (cn, auth-client)
│   └── App.jsx             # Root component
├── dist/                   # Build output
├── vercel.json             # Vercel SPA config
├── .env.example            # Env template
└── DEPLOY.md               # This file
```

---

## Troubleshooting

### "Failed to resolve import ../convex/_generated/api"
Run `npx convex dev` to regenerate the API client.

### "Convex URL not found"
Make sure `VITE_CONVEX_URL` is set in Vercel environment variables.

### "Auth session not persisting"
Check that `BETTER_AUTH_SECRET` is the same on both local and production.
