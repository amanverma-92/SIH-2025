from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from models.tourist import Tourist, TouristCreate, TouristResponse, TouristUpdate
from models.digital_id import DigitalIDIssueRequest, DigitalIDResponse,DigitalIDOnChain
from database.connection import get_db
from datetime import datetime, timedelta
import uuid

router = APIRouter(prefix="/api/tourists", tags=["tourists"])

@router.get("/", response_model=List[TouristResponse])
def get_tourists(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tourists = db.query(Tourist).offset(skip).limit(limit).all()
    
    # Get all digital IDs for these tourists
    from models.digital_id import DigitalID
    tourist_ids = [tourist.id for tourist in tourists]
    digital_ids = db.query(DigitalID).filter(DigitalID.tourist_id.in_(tourist_ids)).all()
    
    # Create a map of tourist_id to digital_id data
    digital_id_map = {}
    for digital_id in digital_ids:
        block = digital_id.block
        onchain = db.query(DigitalIDOnChain).filter(
            DigitalIDOnChain.digital_id_id == digital_id.id
        ).first()

        digital_id_map[digital_id.tourist_id] = {
            "id": digital_id.id,
            "tourist_id": digital_id.tourist_id,
            "kyc_id": digital_id.kyc_id,
            "itinerary": digital_id.itinerary,
            "emergency_contacts": digital_id.emergency_contacts,
            "valid_from": digital_id.valid_from.isoformat(),
            "valid_to": digital_id.valid_to.isoformat(),
            "status": digital_id.status,
            "public_address": digital_id.public_address,
            "block_hash": block.hash if block else None,
            "signature": block.signature if block else None,
            "verification_hash": None,
            "blockchain_id": None,
            "tx_hash": onchain.tx_hash if onchain else None,
            "contract_address": onchain.contract_address if onchain else None,
            "chain_id": onchain.chain_id if onchain else None,
            "decentralized_status": onchain.status if onchain else "local_only",
            "block_index": block.index if block else None,
            "timestamp": block.timestamp.isoformat() if block else None,
        }
    
    # Add digital_id data to each tourist
    result = []
    for tourist in tourists:
        tourist_dict = {
            "id": tourist.id,
            "name": tourist.name,
            "email": tourist.email,
            "phone": tourist.phone,
            "latitude": tourist.latitude,
            "longitude": tourist.longitude,
            "status": tourist.status,
            "last_location_update": tourist.last_location_update,
            "emergency_contact": tourist.emergency_contact,
            "created_at": tourist.created_at,
            "digital_id": digital_id_map.get(tourist.id)
        }
        result.append(tourist_dict)
    
    return result

@router.get("/{tourist_id}", response_model=TouristResponse)
def get_tourist(tourist_id: int, db: Session = Depends(get_db)):
    tourist = db.query(Tourist).filter(Tourist.id == tourist_id).first()
    if tourist is None:
        raise HTTPException(status_code=404, detail="Tourist not found")
    
    # Get digital ID data for this tourist
    from models.digital_id import DigitalID
    digital_id = db.query(DigitalID).filter(DigitalID.tourist_id == tourist_id).first()
    
    digital_id_data = None
    if digital_id:
        block = digital_id.block
        onchain = db.query(DigitalIDOnChain).filter(
            DigitalIDOnChain.digital_id_id == digital_id.id
        ).first()

        digital_id_data = {
            "id": digital_id.id,
            "tourist_id": digital_id.tourist_id,
            "kyc_id": digital_id.kyc_id,
            "itinerary": digital_id.itinerary,
            "emergency_contacts": digital_id.emergency_contacts,
            "valid_from": digital_id.valid_from.isoformat(),
            "valid_to": digital_id.valid_to.isoformat(),
            "status": digital_id.status,
            "public_address": digital_id.public_address,
            "block_hash": block.hash if block else None,
            "signature": block.signature if block else None,
            "verification_hash": None,
            "blockchain_id": None,
            "tx_hash": onchain.tx_hash if onchain else None,
            "contract_address": onchain.contract_address if onchain else None,
            "chain_id": onchain.chain_id if onchain else None,
            "decentralized_status": onchain.status if onchain else "local_only",
            "block_index": block.index if block else None,
            "timestamp": block.timestamp.isoformat() if block else None,
        }
    
    # Create response with digital_id data
    tourist_dict = {
        "id": tourist.id,
        "name": tourist.name,
        "email": tourist.email,
        "phone": tourist.phone,
        "latitude": tourist.latitude,
        "longitude": tourist.longitude,
        "status": tourist.status,
        "last_location_update": tourist.last_location_update,
        "emergency_contact": tourist.emergency_contact,
        "created_at": tourist.created_at,
        "digital_id": digital_id_data
    }
    
    return tourist_dict

@router.post("/", response_model=TouristResponse)
def create_tourist(tourist: TouristCreate, db: Session = Depends(get_db)):
    # Create the tourist first
    db_tourist = Tourist(**tourist.dict())
    db.add(db_tourist)
    db.commit()
    db.refresh(db_tourist)
    
    # Automatically create a digital ID for the tourist
    digital_id_response = None
    try:
        # Generate a unique KYC ID
        kyc_id = f"KYC_{db_tourist.id}_{uuid.uuid4().hex[:8].upper()}"
        
        # Create digital ID request
        digital_id_request = DigitalIDIssueRequest(
            tourist_id=db_tourist.id,
            kyc_id=kyc_id,
            itinerary=f"Tourist visiting location at {tourist.latitude}, {tourist.longitude}",
            emergency_contacts=tourist.emergency_contact or "",
            valid_to=datetime.utcnow() + timedelta(days=365),  # Valid for 1 year
            public_address=None  # Can be provided by frontend if needed
        )
        
        # Create completely decentralized digital ID using deployed smart contract
        from utils.ledger import Ledger
        from utils.polygon import PolygonService
        from utils.contract_abi import DIGITAL_ID_REGISTRY_ABI
        from web3 import Web3
        from models.digital_id import DigitalID, DigitalIDOnChain
        import hashlib
        
        # Prepare data string for decentralized hashing
        valid_to_date = datetime.utcnow() + timedelta(days=365)
        data_string = f"tourist_id={db_tourist.id}|kyc_id={kyc_id}|name={db_tourist.name}|email={db_tourist.email}|valid_to={valid_to_date.isoformat()}"
        
        # Create decentralized blockchain entry
        ledger = Ledger(db_session=db)
        block = ledger.append_block(data_string)
        
        # Create digital ID with decentralized hash
        db_did = DigitalID(
            tourist_id=db_tourist.id,
            kyc_id=kyc_id,
            itinerary=f"Tourist visiting location at {tourist.latitude}, {tourist.longitude}",
            emergency_contacts=tourist.emergency_contact or "",
            valid_to=datetime.utcnow() + timedelta(days=365),  # Valid for 1 year
            status="active",
            public_address=None,
            block_id=block.id,  # Link to decentralized block
        )
        db.add(db_did)
        db.commit()
        db.refresh(db_did)
        
        # Deploy to blockchain using smart contract
        try:
            poly = PolygonService()
            contract = poly.load_contract(DIGITAL_ID_REGISTRY_ABI)
            
            # Convert block hash to bytes32 for smart contract
            try:
                content_hash_bytes32 = Web3.to_bytes(hexstr=block.hash)
                if len(content_hash_bytes32) != 32:
                    content_hash_bytes32 = Web3.keccak(text=block.hash)
            except ValueError:
                # If not a valid hex string, hash it directly
                content_hash_bytes32 = Web3.keccak(text=block.hash)
            
            # Use tourist's email as subject address (hash it to get a valid address)
            subject_hash = Web3.keccak(text=db_tourist.email)
            subject_address = "0x" + subject_hash.hex()[:40]
            
            valid_to_unix = int((datetime.utcnow() + timedelta(days=365)).timestamp())
            
            # Call smart contract to issue digital ID
            receipt = poly.send_tx(contract.functions.issue, content_hash_bytes32, subject_address, valid_to_unix)
            tx_hash = receipt.transactionHash.hex()
            
            # Extract the issued ID from the event
            issued_event = contract.events.Issued().process_receipt(receipt)
            blockchain_id = issued_event[0]["args"]["id"] if issued_event else None
            
            # Store on-chain record
            onchain = DigitalIDOnChain(
                digital_id_id=db_did.id,
                chain_id=str(poly.config.chain_id),
                contract_address=poly.config.contract_address,
                tx_hash=tx_hash,
                issue_block_number=receipt.blockNumber,
                status="issued",
            )
            db.add(onchain)
            db.commit()
            
            # Generate verification hash for additional security
            verification_data = f"{db_did.id}|{db_did.kyc_id}|{blockchain_id}|{block.hash}|{tx_hash}"
            verification_hash = hashlib.sha256(verification_data.encode()).hexdigest()
            
            digital_id_response = {
                "id": db_did.id,
                "tourist_id": db_did.tourist_id,
                "kyc_id": db_did.kyc_id,
                "itinerary": db_did.itinerary,
                "emergency_contacts": db_did.emergency_contacts,
                "valid_from": db_did.valid_from,
                "valid_to": db_did.valid_to,
                "status": db_did.status,
                "public_address": subject_address,
                "block_hash": block.hash,
                "signature": block.signature,
                "verification_hash": verification_hash,
                "blockchain_id": int(blockchain_id) if blockchain_id else None,
                "tx_hash": tx_hash,
                "contract_address": poly.config.contract_address,
                "chain_id": poly.config.chain_id,
                "decentralized_status": "verified_on_blockchain",
                "block_index": block.index,
                "timestamp": block.timestamp.isoformat()
            }
            
        except Exception as blockchain_error:
            # If blockchain fails, still store a placeholder DigitalIDOnChain
            onchain = DigitalIDOnChain(
                digital_id_id=db_did.id,
                chain_id=None,
                contract_address=None,
                tx_hash=None,
                issue_block_number=None,
                status="anchor_failed",
            )
            db.add(onchain)
            db.commit()

            # Compute local verification hash
            verification_data = f"{db_did.id}|{db_did.kyc_id}|{block.hash}"
            verification_hash = hashlib.sha256(verification_data.encode()).hexdigest()
            
            digital_id_response = {
                "id": db_did.id,
                "tourist_id": db_did.tourist_id,
                "kyc_id": db_did.kyc_id,
                "itinerary": db_did.itinerary,
                "emergency_contacts": db_did.emergency_contacts,
                "valid_from": db_did.valid_from,
                "valid_to": db_did.valid_to,
                "status": db_did.status,
                "public_address": None,
                "block_hash": block.hash,
                "signature": block.signature,
                "verification_hash": verification_hash,
                "blockchain_id": None,
                "tx_hash": None,
                "contract_address": None,
                "chain_id": None,
                "decentralized_status": "anchor_failed",
                "block_index": block.index,
                "timestamp": block.timestamp.isoformat()
            }

        
    except Exception as e:
        # If digital ID creation fails, we should still return the tourist
        # but with an error message in the digital_id field
        digital_id_response = {
            "error": f"Failed to create digital ID: {str(e)}",
            "status": "failed"
        }
    
    # Prepare the response
    response_data = {
        "id": db_tourist.id,
        "name": db_tourist.name,
        "email": db_tourist.email,
        "phone": db_tourist.phone,
        "latitude": db_tourist.latitude,
        "longitude": db_tourist.longitude,
        "status": db_tourist.status,
        "last_location_update": db_tourist.last_location_update,
        "emergency_contact": db_tourist.emergency_contact,
        "created_at": db_tourist.created_at,
        "digital_id": digital_id_response
    }
    
    return TouristResponse(**response_data)

@router.put("/{tourist_id}", response_model=TouristResponse)
def update_tourist(tourist_id: int, tourist: TouristUpdate, db: Session = Depends(get_db)):
    db_tourist = db.query(Tourist).filter(Tourist.id == tourist_id).first()
    if db_tourist is None:
        raise HTTPException(status_code=404, detail="Tourist not found")
    
    update_data = tourist.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_tourist, field, value)
    
    db.commit()
    db.refresh(db_tourist)
    return db_tourist

@router.delete("/{tourist_id}")
def delete_tourist(tourist_id: int, db: Session = Depends(get_db)):
    db_tourist = db.query(Tourist).filter(Tourist.id == tourist_id).first()
    if db_tourist is None:
        raise HTTPException(status_code=404, detail="Tourist not found")
    
    db.delete(db_tourist)
    db.commit()
    return {"message": "Tourist deleted successfully"}
