from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from pydantic import BaseModel
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.models import Charity, get_session
from sqlalchemy import or_, and_

app = FastAPI(
    title="Charity Intelligence API",
    description="REST API for searching and filtering Canadian charities",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CharityResponse(BaseModel):
    id: int
    name: str
    link: str
    star_rating: Optional[float]
    slogan: Optional[str]
    sector: Optional[str]
    city: Optional[str]
    province: Optional[str]
    registration_number: Optional[str]
    created_at: Optional[str]
    updated_at: Optional[str]

class CharityListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    charities: List[CharityResponse]

@app.get("/")
def read_root():
    return {
        "message": "Charity Intelligence API",
        "version": "1.0.0",
        "endpoints": {
            "/charities": "Get all charities with filtering and pagination",
            "/charities/{id}": "Get a specific charity by ID",
            "/sectors": "Get list of all sectors",
            "/provinces": "Get list of all provinces"
        }
    }

@app.get("/charities", response_model=CharityListResponse)
def get_charities(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by name or slogan"),
    sector: Optional[str] = Query(None, description="Filter by sector"),
    province: Optional[str] = Query(None, description="Filter by province"),
    city: Optional[str] = Query(None, description="Filter by city"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum star rating"),
    sort_by: Optional[str] = Query("name", description="Sort by: name, star_rating, city"),
    sort_order: Optional[str] = Query("asc", description="Sort order: asc or desc")
):
    session = get_session()
    
    try:
        query = session.query(Charity)
        
        if search:
            search_filter = or_(
                Charity.name.ilike(f"%{search}%"),
                Charity.slogan.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)
        
        if sector:
            query = query.filter(Charity.sector.ilike(f"%{sector}%"))
        
        if province:
            query = query.filter(Charity.province.ilike(f"%{province}%"))
        
        if city:
            query = query.filter(Charity.city.ilike(f"%{city}%"))
        
        if min_rating is not None:
            query = query.filter(Charity.star_rating >= min_rating)
        
        total = query.count()
        
        sort_column = getattr(Charity, sort_by, Charity.name)
        if sort_order.lower() == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())
        
        offset = (page - 1) * page_size
        charities = query.offset(offset).limit(page_size).all()
        
        return CharityListResponse(
            total=total,
            page=page,
            page_size=page_size,
            charities=[CharityResponse(**charity.to_dict()) for charity in charities]
        )
    
    finally:
        session.close()

@app.get("/charities/{charity_id}", response_model=CharityResponse)
def get_charity(charity_id: int):
    session = get_session()
    
    try:
        charity = session.query(Charity).filter(Charity.id == charity_id).first()
        
        if not charity:
            raise HTTPException(status_code=404, detail="Charity not found")
        
        return CharityResponse(**charity.to_dict())
    
    finally:
        session.close()

@app.get("/sectors")
def get_sectors(
    search: Optional[str] = Query(None, description="Search filter"),
    province: Optional[str] = Query(None, description="Province filter"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum star rating")
):
    session = get_session()
    
    try:
        query = session.query(Charity.sector).distinct().filter(Charity.sector.isnot(None))
        
        if search:
            search_filter = or_(
                Charity.name.ilike(f"%{search}%"),
                Charity.slogan.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)
        
        if province:
            query = query.filter(Charity.province.ilike(f"%{province}%"))
        
        if min_rating is not None:
            query = query.filter(Charity.star_rating >= min_rating)
        
        sectors = query.all()
        return {"sectors": sorted([s[0] for s in sectors if s[0]])}
    
    finally:
        session.close()

@app.get("/provinces")
def get_provinces(
    search: Optional[str] = Query(None, description="Search filter"),
    sector: Optional[str] = Query(None, description="Sector filter"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum star rating")
):
    session = get_session()
    
    try:
        query = session.query(Charity.province).distinct().filter(Charity.province.isnot(None))
        
        if search:
            search_filter = or_(
                Charity.name.ilike(f"%{search}%"),
                Charity.slogan.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)
        
        if sector:
            query = query.filter(Charity.sector.ilike(f"%{sector}%"))
        
        if min_rating is not None:
            query = query.filter(Charity.star_rating >= min_rating)
        
        provinces = query.all()
        return {"provinces": sorted([p[0] for p in provinces if p[0]])}
    
    finally:
        session.close()

@app.get("/cities")
def get_cities(province: Optional[str] = Query(None, description="Filter cities by province")):
    session = get_session()
    
    try:
        query = session.query(Charity.city).distinct().filter(Charity.city.isnot(None))
        
        if province:
            query = query.filter(Charity.province.ilike(f"%{province}%"))
        
        cities = query.all()
        return {"cities": sorted([c[0] for c in cities if c[0]])}
    
    finally:
        session.close()

@app.get("/stats")
def get_stats():
    session = get_session()
    
    try:
        total_charities = session.query(Charity).count()
        avg_rating = session.query(Charity.star_rating).filter(Charity.star_rating.isnot(None)).all()
        avg_rating_value = sum([r[0] for r in avg_rating]) / len(avg_rating) if avg_rating else 0
        
        return {
            "total_charities": total_charities,
            "average_rating": round(avg_rating_value, 2),
            "charities_with_ratings": len(avg_rating)
        }
    
    finally:
        session.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
