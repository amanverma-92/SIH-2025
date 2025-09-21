from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from database.connection import Base

class Tourist(Base):
    __tablename__ = "tourists"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(String, default="active")  # active, inactive, emergency
    last_location_update = Column(DateTime, default=datetime.utcnow)
    emergency_contact = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class TouristCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    latitude: float
    longitude: float
    emergency_contact: Optional[str] = None

class TouristUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: Optional[str] = None
    emergency_contact: Optional[str] = None

class TouristResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    latitude: float
    longitude: float
    status: str
    last_location_update: datetime
    emergency_contact: Optional[str]
    created_at: datetime
    # Digital ID information
    digital_id: Optional[dict] = None
    
    class Config:
        from_attributes = True
        extra = "ignore"  # Ignore extra fields
