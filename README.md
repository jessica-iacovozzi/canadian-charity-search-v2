# Canadian Charity Scraper & Search Platform

A comprehensive full-stack application for scraping, storing, and searching Canadian charity data from Charity Intelligence.

## 🏗️ Project Structure

```
scraping-charities/
├── database/
│   └── models.py              # SQLAlchemy models and database setup
├── scraper/
│   └── charity_scraper.py     # Web scraper for Charity Intelligence
├── api/
│   └── main.py                # FastAPI REST API
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Main search interface
│   │   ├── layout.tsx         # App layout
│   │   └── globals.css        # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
└── README.md
```

## 🚀 Features

### Scraper
- Scrapes charity data from Charity Intelligence
- Extracts: name, link, star rating, slogan, sector, city, province, registration number
- Handles pagination automatically
- Stores data in PostgreSQL database
- Prevents duplicate entries

### REST API
- **GET /charities** - List charities with filtering, sorting, and pagination
  - Filter by: search term, sector, province, city, minimum rating
  - Sort by: name, star_rating, city
  - Pagination support
- **GET /charities/{id}** - Get specific charity details
- **GET /sectors** - List all available sectors (with dynamic filtering)
  - Accepts optional filters: search, province, min_rating
  - Returns only sectors available in filtered results
- **GET /provinces** - List all provinces (with dynamic filtering)
  - Accepts optional filters: search, sector, min_rating
  - Returns only provinces available in filtered results
- **GET /cities** - List all cities (optionally filtered by province)
- **GET /stats** - Get database statistics

### Frontend
- Modern, responsive UI built with Next.js 14 and Tailwind CSS
- Real-time search functionality
- **Dynamic Filters**: Filter options automatically adapt based on current selections
  - Selecting a sector updates available provinces
  - Selecting a province updates available sectors
  - Rating filter affects both sector and province options
- Filter by sector, province, and minimum rating
- Sort by name, rating, or city
- Pagination with 20 results per page
- **Optimized Card Layout**: Consistent card heights with "View Details" always at bottom
- Lucide icons for enhanced UX
- Fully responsive design

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## 🛠️ Installation

### 1. Database Setup

Create a PostgreSQL database:

```bash
createdb charities_db
```

### 2. Python Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/charities_db
API_HOST=0.0.0.0
API_PORT=8000
SCRAPER_DELAY=1
MAX_RETRIES=3
```

### 4. Initialize Database

```bash
python database/models.py
```

### 5. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```bash
cp .env.local.example .env.local
```

Edit if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🎯 Usage

### Step 1: Run the Scraper

```bash
python scraper/charity_scraper.py
```

This will:
- Scrape charities from Charity Intelligence
- Store them in the PostgreSQL database
- By default, scrapes 5 pages (modify `max_pages` parameter to scrape more)

### Step 2: Start the API

```bash
cd api
python main.py
```

Or using uvicorn directly:

```bash
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at: `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Step 3: Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 📊 API Examples

### Search charities by name
```bash
curl "http://localhost:8000/charities?search=cancer&page=1&page_size=10"
```

### Filter by sector and province
```bash
curl "http://localhost:8000/charities?sector=Health&province=Ontario"
```

### Get charities with minimum rating
```bash
curl "http://localhost:8000/charities?min_rating=4.0"
```

### Sort by rating (descending)
```bash
curl "http://localhost:8000/charities?sort_by=star_rating&sort_order=desc"
```

## 🎨 Frontend Features

- **Search Bar**: Search by charity name or slogan
- **Dynamic Filters**: 
  - Sector dropdown (adapts based on province and rating filters)
  - Province dropdown (adapts based on sector and rating filters)
  - Minimum rating selector (affects both sector and province options)
  - Filter options update in real-time to show only available combinations
- **Sorting**: 
  - By name, rating, or city
  - Ascending or descending order
- **Pagination**: Navigate through results (20 per page)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Visual Indicators**: Star ratings, location pins, sector icons
- **Optimized Card Layout**: 
  - Flexbox-based design ensures consistent appearance
  - "View Details" button always positioned at bottom
  - Handles missing data gracefully (no blank spaces)

## 🔧 Customization

### Modify Scraper Behavior

Edit `scraper/charity_scraper.py`:

```python
scraper = CharityIntelligenceScraper(delay=2.0)  # Increase delay
scraper.scrape_all_charities(max_pages=10)  # Scrape more pages
```

### Adjust API Pagination

Edit `api/main.py`:

```python
page_size: int = Query(50, ge=1, le=100)  # Change default page size
```

### Customize Frontend Styling

Edit `frontend/app/globals.css` or component styles in `frontend/app/page.tsx`

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env`
- Ensure database exists: `psql -l`

### Scraper Not Finding Data
- Website structure may have changed
- Check network connectivity
- Increase delay between requests
- Verify the website is accessible

### API CORS Issues
- Ensure CORS middleware is configured in `api/main.py`
- Check NEXT_PUBLIC_API_URL in frontend `.env.local`

### Frontend Not Loading Data
- Verify API is running on port 8000
- Check browser console for errors
- Ensure `.env.local` has correct API URL

## 📝 Development

### Add New Fields to Database

1. Update `database/models.py` - add new column
2. Create migration or drop/recreate tables
3. Update scraper to extract new field
4. Update API response model
5. Update frontend interface

### Add New API Endpoints

1. Add route in `api/main.py`
2. Update frontend to consume new endpoint

## 🚀 Production Deployment

### Prerequisites
- GitHub account for repository hosting
- Vercel account (for frontend hosting)
- Supabase account (for PostgreSQL database)
- Railway/Render account (for API hosting)

### Step 1: Database Setup (Supabase)

1. Create a new project on [Supabase](https://supabase.com)
2. Navigate to Project Settings → Database
3. Copy the connection string (URI format)
4. Run the database initialization:
   ```bash
   # Update DATABASE_URL in .env with Supabase connection string
   python database/models.py
   ```
5. Run the scraper to populate data:
   ```bash
   python scraper/charity_scraper.py
   ```

### Step 2: API Deployment (Railway/Render)

#### Option A: Railway
1. Create new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables:
   ```
   DATABASE_URL=<your-supabase-connection-string>
   API_HOST=0.0.0.0
   API_PORT=8000
   ```
4. Set start command: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`
5. Deploy and note the public URL

#### Option B: Render
1. Create new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (same as Railway)
6. Deploy and note the public URL

### Step 3: Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Configure build settings:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=<your-api-url-from-step-2>
   ```
5. Deploy

### Step 4: Post-Deployment

1. **Test the application**: Visit your Vercel URL and verify all features work
2. **Set up custom domain** (optional):
   - Add domain in Vercel settings
   - Update DNS records
3. **Monitor performance**:
   - Check Vercel Analytics
   - Monitor Railway/Render logs
   - Review Supabase database metrics
4. **Set up automatic deployments**:
   - Vercel auto-deploys on git push to main
   - Railway/Render can be configured for auto-deploy

### Environment Variables Summary

**API (.env)**:
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
API_HOST=0.0.0.0
API_PORT=8000
```

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=https://your-api-url.railway.app
```

### Security Considerations

- Enable SSL/TLS for database connections
- Use environment variables for all sensitive data
- Set up CORS properly in API (restrict origins in production)
- Enable Supabase Row Level Security if needed
- Use Vercel's environment variable encryption
- Consider rate limiting on API endpoints

### Maintenance

- **Database backups**: Supabase provides automatic backups
- **Update data**: Run scraper periodically (consider setting up cron job)
- **Monitor costs**: Check usage on all platforms
- **Update dependencies**: Keep packages up to date for security

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## ⚠️ Legal Notice

This scraper is for educational purposes. Always respect the website's `robots.txt` and terms of service. Consider rate limiting and be respectful of the server resources.
