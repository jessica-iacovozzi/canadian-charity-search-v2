# 🚀 Quick Start Deployment Guide

## Prerequisites
- [ ] GitHub account
- [ ] Vercel account (sign up with GitHub)
- [ ] Supabase account
- [ ] Railway account (sign up with GitHub)

## 5-Step Deployment

### 1️⃣ Push to GitHub (5 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

### 2️⃣ Setup Supabase Database (10 min)
1. Create new project at [supabase.com](https://supabase.com)
2. Copy connection string from **Settings → Database → URI**
3. Update local `.env` with connection string
4. Run: `python database/models.py`
5. Run: `python scraper/charity_scraper.py`

### 3️⃣ Deploy API to Railway (5 min)
1. Go to [railway.app](https://railway.app)
2. **New Project → Deploy from GitHub**
3. Select your repository
4. Add environment variables:
   - `DATABASE_URL` = (your Supabase connection string)
   - `API_HOST` = `0.0.0.0`
   - `API_PORT` = `8000`
5. Set start command: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`
6. Deploy and copy the URL

### 4️⃣ Deploy Frontend to Vercel (5 min)
1. Go to [vercel.com](https://vercel.com)
2. **New Project → Import** your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = (your Railway URL)
5. Deploy

### 5️⃣ Test Everything (5 min)
- [ ] Visit your Vercel URL
- [ ] Search works
- [ ] Filters work and update dynamically
- [ ] Pagination works
- [ ] Cards display correctly

## 🎉 Done!

**Total Time: ~30 minutes**

Your app is now live! See `DEPLOYMENT.md` for detailed instructions and troubleshooting.

## Quick Links
- Frontend: Check Vercel dashboard
- API: Check Railway dashboard
- Database: Check Supabase dashboard
- API Docs: `https://your-railway-url.app/docs`
