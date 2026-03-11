# Netlify Deployment Guide - Lynck Services

This guide walks you through migrating from Lovable to Netlify hosting.

---

## 🚨 CRITICAL: Fix Environment Variable Exposure

Your `.env` file is currently committed to GitHub, exposing your Supabase keys publicly. Follow these steps **immediately**:

### Step 1: Remove .env from Git History

```bash
cd /Users/kyss/LYNCKSERVICES

# Remove .env from git tracking (but keep local file)
git rm --cached .env

# Commit the removal
git add .gitignore .env.example
git commit -m "🔒 Remove .env from version control - security fix"

# Push to GitHub
git push origin main
```

### Step 2: Rotate Supabase Keys (IMPORTANT!)

Since your keys were exposed on GitHub, you should rotate them:

1. Go to [Supabase Dashboard](https://app.supabase.com/project/jitrgujjlxampmtunrjj/settings/api)
2. Click "Rotate Keys" or regenerate the anon/public key
3. Update your local `.env` file with new keys
4. Keep `.env` file LOCAL only (never commit it again)

---

## 📦 Environment Variables Needed

Your project uses these environment variables:

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `VITE_SUPABASE_PROJECT_ID` | Your Supabase project ID | Supabase Dashboard → Settings → General |
| `VITE_SUPABASE_URL` | Your Supabase API URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon/public key | Supabase Dashboard → Settings → API |

**Note:** The anon/public key is safe to expose in client-side code. It's protected by Row Level Security (RLS) policies.

---

## 🚀 Deploy to Netlify

### Option 1: Deploy via Netlify UI (Recommended)

#### Step 1: Sign Up / Log In to Netlify

1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Sign up or log in (use GitHub account for easier integration)

#### Step 2: Import Your GitHub Repository

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Authorize Netlify to access your GitHub account
4. Select your repository: **`Camy8701/LYNCKSERVICES`**

#### Step 3: Configure Build Settings

Netlify should auto-detect these settings (verify they're correct):

- **Branch to deploy:** `main`
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** `18` (or leave as default)

#### Step 4: Add Environment Variables

In the Netlify UI, before deploying:

1. Scroll down to **"Environment variables"** section
2. Click **"Add environment variables"**
3. Add these 3 variables:

```
VITE_SUPABASE_PROJECT_ID = jitrgujjlxampmtunrjj
VITE_SUPABASE_URL = https://jitrgujjlxampmtunrjj.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = [your-anon-key-here]
```

**Important:** Use your ROTATED keys from Step 2 above, not the old exposed ones!

#### Step 5: Deploy!

1. Click **"Deploy site"**
2. Netlify will:
   - Install dependencies (`npm install`)
   - Run build (`npm run build`)
   - Deploy the `dist` folder
3. Wait 2-5 minutes for first deploy

#### Step 6: Get Your Netlify URL

Once deployed, you'll get a URL like:
```
https://random-name-12345.netlify.app
```

You can customize this or add your custom domain (see below).

---

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify in your project
cd /Users/kyss/LYNCKSERVICES
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Link to your GitHub repo
# - Set build command: npm run build
# - Set publish directory: dist

# Add environment variables
netlify env:set VITE_SUPABASE_PROJECT_ID "jitrgujjlxampmtunrjj"
netlify env:set VITE_SUPABASE_URL "https://jitrgujjlxampmtunrjj.supabase.co"
netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY "your-anon-key-here"

# Deploy
netlify deploy --prod
```

---

## 🌐 Connect Custom Domain from Hostinger

Since you mentioned your domain is hosted on Hostinger, here's how to connect it to Netlify:

### Step 1: Add Domain in Netlify

1. In Netlify dashboard, go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `lynckservices.com`)
4. Netlify will provide DNS records

### Step 2: Update DNS in Hostinger

You have two options:

#### Option A: Use Netlify DNS (Recommended)

1. In Netlify, you'll see nameservers like:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```
2. Go to Hostinger Control Panel → Domains → Your Domain
3. Change nameservers to Netlify's nameservers
4. Wait 24-48 hours for DNS propagation

#### Option B: Use Hostinger DNS (Keep your DNS)

1. In Netlify, you'll see an A record and CNAME:
   ```
   A record: @ → 75.2.60.5
   CNAME: www → your-site.netlify.app
   ```
2. Go to Hostinger → DNS Zone Editor
3. Add/Update these records:
   - **A Record:** Name: `@`, Points to: `75.2.60.5`
   - **CNAME:** Name: `www`, Points to: `your-site.netlify.app`
4. Wait 1-24 hours for DNS propagation

### Step 3: Enable HTTPS

Netlify automatically provisions free SSL certificates via Let's Encrypt:
1. Once DNS is configured, go to **Domain settings** → **HTTPS**
2. Click **"Verify DNS configuration"**
3. SSL certificate will be provisioned automatically (5-10 minutes)

---

## 🗑️ Disconnect from Lovable

### Step 1: Export Any Data (if needed)

If you have any data or settings in Lovable that aren't in GitHub:
1. Log in to Lovable
2. Export any configurations or settings
3. Save locally

### Step 2: Disconnect Repository

1. Log in to [Lovable](https://lovable.dev)
2. Go to your project settings
3. Find **"Disconnect repository"** or **"Delete project"**
4. Confirm disconnection

**Note:** This won't delete your GitHub repo, only the Lovable connection.

### Step 3: Cancel Lovable Subscription (if applicable)

1. Go to Lovable account settings
2. Cancel any active subscriptions

---

## ✅ Post-Deployment Checklist

After deploying to Netlify, verify everything works:

- [ ] Website loads at Netlify URL
- [ ] All pages accessible (test routing)
- [ ] Contact form submits successfully
- [ ] Admin login works
- [ ] Admin dashboard displays data correctly
- [ ] Images load properly
- [ ] Custom domain works (if configured)
- [ ] HTTPS enabled (green padlock in browser)
- [ ] Contact form emails arrive
- [ ] Supabase Edge Functions work (`create-lead`)

---

## 🔧 Troubleshooting

### Build Fails on Netlify

**Error:** "Command failed with exit code 1"

**Solution:** Check build logs. Common issues:
- Missing environment variables
- TypeScript errors
- Dependency issues

Run locally first:
```bash
npm run build
```
Fix any errors before deploying.

### Environment Variables Not Working

**Symptoms:** API calls fail, blank pages

**Solution:**
1. Verify all 3 env vars are set in Netlify
2. Env vars must start with `VITE_` prefix
3. Redeploy after adding env vars:
   - Go to **Deploys** → **Trigger deploy** → **Deploy site**

### Custom Domain Not Working

**Symptoms:** Domain shows "Site not found"

**Solution:**
1. Verify DNS records in Hostinger match Netlify's requirements
2. Wait 24-48 hours for DNS propagation
3. Check DNS propagation: [https://dnschecker.org](https://dnschecker.org)
4. Clear browser cache

### Supabase Edge Functions Not Working

**Symptoms:** Form submissions fail

**Solution:**
- Edge functions run on Supabase, not Netlify
- Verify Supabase project is active
- Check Supabase function logs
- Ensure CORS headers are correct

---

## 📊 Netlify Features You Get

### Automatic CI/CD
- Every push to `main` triggers automatic deployment
- Preview deploys for pull requests
- Rollback to previous versions instantly

### Performance
- Global CDN (faster than most hosting)
- Automatic image optimization (if enabled)
- HTTP/2 and Brotli compression

### Free Tier Includes
- 100GB bandwidth/month
- Unlimited personal/commercial sites
- Free SSL certificates
- Instant rollbacks
- Deploy previews

---

## 📞 Support

**Netlify Support:**
- Documentation: [https://docs.netlify.com](https://docs.netlify.com)
- Community: [https://answers.netlify.com](https://answers.netlify.com)
- Status: [https://www.netlifystatus.com](https://www.netlifystatus.com)

**Supabase Support:**
- Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Discord: [https://discord.supabase.com](https://discord.supabase.com)

---

## 🎯 Next Steps After Deployment

1. **Update URLs in Code:**
   - Update `siteUrl` in `src/lib/seo.tsx` to your Netlify/custom domain
   - Update sitemap.xml URLs
   - Update Open Graph meta tags

2. **Set Up Monitoring:**
   - Enable Netlify Analytics (paid, but excellent)
   - Set up Google Analytics (free)
   - Configure Sentry for error tracking (optional)

3. **Performance Optimization:**
   - Enable Netlify image optimization
   - Configure build plugins
   - Set up lighthouse CI

4. **Security:**
   - Review Netlify security headers (already in netlify.toml)
   - Enable Netlify Forms honeypot for spam protection
   - Set up security scanning

---

Good luck with your migration! 🚀
