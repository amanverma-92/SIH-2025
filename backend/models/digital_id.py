from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from database.connection import Base


class BlockchainBlock(Base):
    __tablename__ = "blockchain_blocks"

    id = Column(Integer, primary_key=True, index=True)
    index = Column(Integer, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    data_hash = Column(String, index=True)
    previous_hash = Column(String, index=True)
    hash = Column(String, unique=True, index=True)
    signature = Column(String)


class DigitalID(Base):
    __tablename__ = "digital_ids"

    id = Column(Integer, primary_key=True, index=True)
    tourist_id = Column(Integer, index=True)
    kyc_id = Column(String, index=True)
    itinerary = Column(String)
    emergency_contacts = Column(String)
    valid_from = Column(DateTime, default=datetime.utcnow)
    valid_to = Column(DateTime)
    status = Column(String, default="active")
    public_address = Column(String, nullable=True)

    block_id = Column(Integer, ForeignKey("blockchain_blocks.id"), nullable=True)
    block = relationship("BlockchainBlock")


class DigitalIDOnChain(Base):
    __tablename__ = "digital_ids_onchain"

    id = Column(Integer, primary_key=True, index=True)
    digital_id_id = Column(Integer, index=True)
    chain_id = Column(String, index=True)  # e.g., 80002 for Amoy
    contract_address = Column(String, index=True)
    tx_hash = Column(String, index=True)
    issue_block_number = Column(Integer)
    status = Column(String, default="issued")  # issued, revoked


class DigitalIDIssueRequest(BaseModel):
    tourist_id: int
    kyc_id: str
    itinerary: Optional[str] = None
    emergency_contacts: Optional[str] = None
    valid_to: datetime
    public_address: Optional[str] = None


class DigitalIDResponse(BaseModel):
    id: int
    tourist_id: int
    kyc_id: str
    itinerary: Optional[str]
    emergency_contacts: Optional[str]
    valid_from: datetime
    valid_to: datetime
    status: str
    public_address: Optional[str]
    block_hash: Optional[str] = Field(default=None)
    signature: Optional[str] = Field(default=None)
    onchain_tx_hash: Optional[str] = Field(default=None)
    onchain_status: Optional[str] = Field(default=None)

    class Config:
        from_attributes = True


class VerifyResponse(BaseModel):
    is_valid: bool
    reason: Optional[str] = None
    block_index: Optional[int] = None
    block_hash: Optional[str] = None
    onchain_tx_hash: Optional[str] = None
    onchain_status: Optional[str] = None

