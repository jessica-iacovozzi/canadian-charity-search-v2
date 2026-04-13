# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack charity search platform that scrapes [Charity Intelligence Canada](https://www.charityintelligence.ca), stores data in PostgreSQL, exposes a FastAPI REST API, and serves a Next.js frontend with multi-select filtering and dynamic search.

**Deployment:** API on Fly.io, database on Supabase (PostgreSQL), frontend on Vercel.

## Commands

### Backend (Python)

```bash
# Install dependencies
pip install -r requirements.txt

# Initialize/setup database
python database/models.py

# Start API server (development)
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
# Or: python api/main.py

# Run scraper
python scraper/charity_scraper.py
python scraper/charity_scraper.py --max-pages 5 --clean-db  # limit + reset DB
```

### Frontend (Next.js)

```bash
cd frontend
npm run dev       # http://localhost:3000
npm run build
npm run lint
```

## Architecture

Three independent layers:

1. **`scraper/charity_scraper.py`** — BeautifulSoup scraper that fetches charity data from Charity Intelligence and writes to PostgreSQL via SQLAlchemy.

2. **`api/main.py`** — FastAPI server exposing REST endpoints. Uses SQLAlchemy with `NullPool` in production (required for Fly.io/Supabase). CORS origins are restricted in production. Key endpoints: `GET /charities` (filterable, paginated), `GET /sectors`, `GET /provinces`, `GET /cities`, `GET /stats`.

3. **`frontend/`** — Next.js 16 App Router app. All API calls go through `NEXT_PUBLIC_API_URL`. Uses `useCallback` + `AbortController` for fetch lifecycle management. Sidebar holds multi-select filters (sector, province, city, rating); `MainContent` handles results and pagination; filters dynamically update based on sibling selections.

**Database schema** (`database/models.py`): Single `charities` table — `id`, `name`, `link` (unique), `star_rating`, `slogan`, `sector`, `city`, `province`, `registration_number`, `created_at`, `updated_at`.

## Environment Variables

**Backend `.env`:**
```
ENVIRONMENT=local|production
DATABASE_URL_LOCAL=postgresql://...
DATABASE_URL_PROD=postgresql://...   # Supabase URL
API_HOST=0.0.0.0
API_PORT=8000
```

**Frontend `frontend/.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The API selects `DATABASE_URL_LOCAL` or `DATABASE_URL_PROD` based on `ENVIRONMENT`. In production, `NullPool` is used instead of the default connection pool.
