from sqlalchemy import Column, Integer, String, Float, DateTime, Text, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

class Charity(Base):
    __tablename__ = 'charities'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(500), nullable=False)
    link = Column(String(1000), unique=True, nullable=False)
    star_rating = Column(Float, nullable=True)
    slogan = Column(Text, nullable=True)
    sector = Column(String(200), nullable=True)
    city = Column(String(200), nullable=True)
    province = Column(String(100), nullable=True)
    registration_number = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'link': self.link,
            'star_rating': self.star_rating,
            'slogan': self.slogan,
            'sector': self.sector,
            'city': self.city,
            'province': self.province,
            'registration_number': self.registration_number,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

def get_engine():
    env = os.getenv('ENVIRONMENT', 'local').lower()
    
    if env == 'production':
        database_url = os.getenv('DATABASE_URL_PROD')
    else:
        database_url = os.getenv('DATABASE_URL_LOCAL')
    
    if not database_url:
        raise ValueError(
            f"Database URL not set for environment '{env}'. "
            f"Set DATABASE_URL_LOCAL for local or DATABASE_URL_PROD for production."
        )
    
    return create_engine(database_url)

def get_session():
    engine = get_engine()
    Session = sessionmaker(bind=engine)
    return Session()

def init_db():
    engine = get_engine()
    Base.metadata.create_all(engine)
    print("Database tables created successfully!")

def clean_db():
    session = get_session()
    try:
        deleted_count = session.query(Charity).delete()
        session.commit()
        print(f"Database cleaned! Deleted {deleted_count} charity records.")
        return deleted_count
    except Exception as e:
        session.rollback()
        print(f"Error cleaning database: {e}")
        raise
    finally:
        session.close()

if __name__ == "__main__":
    init_db()
