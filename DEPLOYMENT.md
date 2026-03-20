# 🚀 Production Deployment Guide

This guide walks you through deploying the Canadian Charity Search Platform to production using GitHub, Vercel, Supabase, and Fly.io.

## 📋 Pre-Deployment Checklist

- [ ] All code committed to Git
- [ ] `.env` files are in `.gitignore` (already configured)
- [ ] Frontend works locally with `npm run dev`
- [ ] API works locally with `python api/main.py`
- [ ] Database has been populated with charity data

## 🗂️ Step 1: GitHub Repository Setup

### 1.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: Canadian Charity Search Platform"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create a new repository (e.g., `canadian-charity-search`)
3. **Do NOT** initialize with README (you already have one)

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/canadian-charity-search.git
git branch -M main
git push -u origin main
```

**Checkpoint:** ✅ Code is now on GitHub

---

## 🗄️ Step 2: Database Setup (Supabase)

### 2.1 Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: `canadian-charities`
   - **Database Password**: (generate strong password - save it!)
   - **Region**: Choose closest to your users
4. Wait for project to be created (~2 minutes)

### 2.2 Get Database Connection String
1. Go to **Project Settings** → **Database**
2. Scroll to **Connection String** → **URI**
3. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your actual password

### 2.3 Initialize Database Schema
```bash
# Update your local .env with Supabase connection string
ENVIRONMENT=production
DATABASE_URL_PROD=postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres

# Run database initialization
python database/models.py
```

### 2.4 Populate Database
```bash
# Run the scraper to populate data
python scraper/charity_scraper.py
```

**Expected output:**
```
Scraping page 1...
Saved 20 charities
Scraping page 2...
...
```

### 2.5 Verify Data in Supabase
1. Go to **Table Editor** in Supabase dashboard
2. You should see `charities` table with data
3. Check a few rows to ensure data looks correct

**Checkpoint:** ✅ Database is set up and populated

---

## 🔧 Step 3: API Deployment (Fly.io)

### 3.1 Install Fly CLI
```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Windows (PowerShell)
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### 3.2 Login to Fly.io
```bash
fly auth login
```
This will open a browser window for authentication.

### 3.3 Create Fly Configuration
From your project root directory:
```bash
fly launch
```

Answer the prompts:
- **App Name**: `canadian-charity-api` (or your preferred name)
- **Region**: Choose closest to your users (e.g., `yyz` for Toronto)
- **PostgreSQL database**: **No** (you're using Supabase)
- **Deploy now**: **No** (we need to configure first)

This creates a `fly.toml` configuration file.

### 3.4 Update fly.toml
Edit the generated `fly.toml`:
```toml
app = "canadian-charity-api"
primary_region = "yyz"

[build]

[http_service]
  internal_port = 8000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

### 3.5 Create Dockerfile
Create `Dockerfile` in project root:
```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 3.6 Set Environment Variables
```bash
fly secrets set ENVIRONMENT=production
fly secrets set DATABASE_URL_PROD="postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres"
```

### 3.7 Deploy
```bash
fly deploy
```

Wait for deployment (~2-3 minutes). Your API will be available at:
```
https://canadian-charity-api.fly.dev
```

### 3.8 Test API
```bash
# Replace with your actual Fly.io URL
curl https://canadian-charity-api.fly.dev/
curl https://canadian-charity-api.fly.dev/charities?page=1&page_size=5
```

**Expected response:** JSON with charity data

### 3.9 Useful Fly.io Commands
```bash
fly status              # Check app status
fly logs               # View logs
fly ssh console        # SSH into machine
fly scale count 1      # Ensure 1 machine running
```

**Checkpoint:** ✅ API is deployed and accessible

---

## 🔄 Alternative: Railway or Render

If you prefer Railway or Render:

**Railway:**
1. Connect GitHub repo
2. Add environment variables
3. Set start command: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`
4. Deploy

**Render:**
1. Create Web Service
2. Connect GitHub repo
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables

---

## 🌐 Step 4: Frontend Deployment (Vercel)

### 4.1 Create Vercel Account
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub (recommended)

### 4.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your `canadian-charity-search` repository
3. Vercel will auto-detect Next.js

### 4.3 Configure Build Settings
1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

### 4.4 Add Environment Variables
1. Click **"Environment Variables"**
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://canadian-charities-api.fly.dev/
   ```
   (Use your Fly.io URL from Step 3.7)

### 4.5 Deploy
1. Click **"Deploy"**
2. Wait for deployment (~2-3 minutes)
3. Vercel will provide a URL (e.g., `https://canadian-charity-search.vercel.app`)

### 4.6 Test Frontend
1. Visit your Vercel URL
2. Test the following:
   - [ ] Search functionality works
   - [ ] Filters work (sector, province, rating)
   - [ ] Dynamic filters update correctly
   - [ ] Pagination works
   - [ ] Cards display correctly with "View Details" at bottom
   - [ ] Clicking "View Details" opens charity page

**Checkpoint:** ✅ Frontend is deployed and working

---

## 🔒 Step 5: Security & CORS Configuration

### 5.1 Update API CORS Settings
Edit `api/main.py` to restrict CORS to your Vercel domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-app.vercel.app",
        "http://localhost:3000"  # Keep for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 5.2 Commit and Push
```bash
git add api/main.py
git commit -m "Update CORS for production"
git push
```

Fly.io will automatically redeploy with `fly deploy`.

**Checkpoint:** ✅ Security configured

---

## 🎯 Step 6: Post-Deployment Tasks

### 6.1 Set Up Custom Domain (Optional)
**Vercel:**
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed

**Fly.io:**
1. Run `fly certs add your-domain.com`
2. Update DNS records as instructed
3. SSL certificates auto-provision

### 6.2 Enable Analytics
**Vercel:**
- Automatically enabled in dashboard
- View at **Analytics** tab

**Supabase:**
- Monitor database usage in **Database** → **Usage**

**Fly.io:**
- Monitor API logs with `fly logs`

### 6.3 Set Up Monitoring
Consider adding:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Uptime Robot** for uptime monitoring

### 6.4 Manual Data Updates
To update charity data (run once a year or as needed):

```bash
# Set environment to production in .env
ENVIRONMENT=production
DATABASE_URL_PROD=<your-supabase-url>

# Run scraper locally
python scraper/charity_scraper.py
```

The scraper will connect to your production Supabase database and update the data.

**Checkpoint:** ✅ Post-deployment tasks complete

---

## 🧪 Step 7: Final Testing

### 7.1 End-to-End Testing Checklist
- [ ] Visit production URL
- [ ] Search for "cancer" - results appear
- [ ] Select "Health" sector - provinces filter updates
- [ ] Select "Ontario" province - sectors filter updates
- [ ] Select "4+ Stars" rating - both filters update
- [ ] Click "Reset Filters" - all filters clear
- [ ] Sort by rating descending - highest rated first
- [ ] Navigate to page 2 - new results load
- [ ] Click "View Details" - opens charity website
- [ ] Test on mobile device - responsive design works
- [ ] Check browser console - no errors

### 7.2 Performance Testing
- [ ] Page loads in < 3 seconds
- [ ] API responses in < 1 second
- [ ] No console errors or warnings

**Checkpoint:** ✅ All tests passing

---

## 📊 Monitoring & Maintenance

### Daily
- Check Vercel Analytics for traffic
- Monitor Railway logs for API errors

### Weekly
- Review Supabase database usage
- Check for any failed deployments

### Monthly
- Update dependencies (`npm update`, `pip list --outdated`)
- Review and update charity data
- Check for security updates

### Quarterly
- Review and optimize database queries
- Analyze user behavior and add features
- Update documentation

---

## 🆘 Troubleshooting

### Issue: Frontend shows "Failed to fetch"
**Solution:**
1. Check API is running: Visit `https://your-api-url.fly.dev/`
2. Verify `NEXT_PUBLIC_API_URL` in Vercel environment variables
3. Check CORS settings in `api/main.py`
4. Check Fly.io status: `fly status`
5. Redeploy frontend after fixing

### Issue: API returns 500 errors
**Solution:**
1. Check Fly.io logs: `fly logs`
2. Verify `ENVIRONMENT` is set to `production`
3. Verify `DATABASE_URL_PROD` is correct: `fly secrets list`
4. SSH into machine: `fly ssh console`
5. Check Supabase is not paused (free tier)

### Issue: Database connection timeout
**Solution:**
1. Verify Supabase project is active
2. Check connection string format
3. Ensure IP allowlist includes Fly.io IPs (Supabase: Settings → Database → Connection Pooling)
4. Consider using Supabase connection pooling for better performance

### Issue: Dynamic filters not working
**Solution:**
1. Check browser console for errors
2. Verify API endpoints `/sectors` and `/provinces` work
3. Test with: `curl https://your-api-url/sectors?province=ON`
4. Clear browser cache and reload

### Issue: Vercel build fails
**Solution:**
1. Check build logs in Vercel dashboard
2. Verify `package.json` has all dependencies
3. Test build locally: `cd frontend && npm run build`
4. Check Node.js version compatibility

---

## 🎉 Success!

Your Canadian Charity Search Platform is now live in production!

**URLs to save:**
- Frontend: `https://your-app.vercel.app`
- API: `https://your-app.fly.dev`
- API Docs: `https://your-app.fly.dev/docs`
- Database: Supabase Dashboard
- GitHub: `https://github.com/YOUR_USERNAME/canadian-charity-search`

**Next Steps:**
1. Share the URL with users
2. Gather feedback
3. Monitor usage and performance
4. Plan feature enhancements
5. Consider adding authentication for admin features

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Fly.io Docs**: https://fly.io/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com

---

**Last Updated:** March 2026
