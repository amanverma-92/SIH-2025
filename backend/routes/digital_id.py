from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.connection import get_db
from models.digital_id import (
    DigitalID,
    DigitalIDIssueRequest,
    DigitalIDResponse,
    VerifyResponse,
    BlockchainBlock,
)
from utils.ledger import Ledger
from utils.polygon import PolygonService
from utils.contract_abi import DIGITAL_ID_REGISTRY_ABI
from web3 import Web3
from models.digital_id import DigitalIDOnChain


router = APIRouter(prefix="/api/digital-id", tags=["digital-id"])


@router.post("/issue", response_model=DigitalIDResponse)
def issue_digital_id(payload: DigitalIDIssueRequest, db: Session = Depends(get_db)):
    # Prepare data string for hashing/signing
    data_string = f"tourist_id={payload.tourist_id}|kyc_id={payload.kyc_id}|valid_to={payload.valid_to.isoformat()}"

    ledger = Ledger(db_session=db)
    block = ledger.append_block(data_string)

    db_did = DigitalID(
        tourist_id=payload.tourist_id,
        kyc_id=payload.kyc_id,
        itinerary=payload.itinerary or "",
        emergency_contacts=payload.emergency_contacts or "",
        valid_to=payload.valid_to,
        status="active",
        public_address=payload.public_address,
        block_id=block.id,
    )
    db.add(db_did)
    db.commit()
    db.refresh(db_did)

    # Anchor on Polygon (hash-only, no PII): bytes32(contentHash), subject, validTo
    try:
        poly = PolygonService()
        contract = poly.load_contract(DIGITAL_ID_REGISTRY_ABI)
        # Convert data_string hash (hex str) to bytes32 and subject address or zero
        content_hash_bytes32 = Web3.to_bytes(hexstr=block.hash)
        if len(content_hash_bytes32) != 32:
            # If not 32 bytes, hash again to get 32 bytes
            content_hash_bytes32 = Web3.keccak(text=block.hash)
        subject = payload.public_address or "0x0000000000000000000000000000000000000000"
        subject = Web3.to_checksum_address(subject) if Web3.is_address(subject) else "0x0000000000000000000000000000000000000000"
        valid_to_unix = int(payload.valid_to.timestamp())

        receipt = poly.send_tx(contract.functions.issue, content_hash_bytes32, subject, valid_to_unix)
        tx_hash = receipt.transactionHash.hex()
        # Try to decode Issued event to double-check content and capture id (not persisted)
        try:
            event_abi = [e for e in DIGITAL_ID_REGISTRY_ABI if e.get("type") == "event" and e.get("name") == "Issued"][0]
            issued_event = contract.events.Issued().process_receipt(receipt)
            if issued_event:
                args = issued_event[0]["args"]
                # args: id, contentHash, subject, validTo
                # Optional: validate contentHash matches
                if args.get("contentHash") != content_hash_bytes32:
                    # Mismatch means wrong anchoring
                    pass
        except Exception:
            pass
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
    except Exception as e:
        # Do not fail issuance if anchoring fails; log via response fields
        tx_hash = None

    return DigitalIDResponse(
        id=db_did.id,
        tourist_id=db_did.tourist_id,
        kyc_id=db_did.kyc_id,
        itinerary=db_did.itinerary,
        emergency_contacts=db_did.emergency_contacts,
        valid_from=db_did.valid_from,
        valid_to=db_did.valid_to,
        status=db_did.status,
        public_address=db_did.public_address,
        block_hash=block.hash,
        signature=block.signature,
        onchain_tx_hash=locals().get("tx_hash"),
        onchain_status="issued" if locals().get("tx_hash") else "anchor_failed",
    )


@router.get("/{digital_id_id}", response_model=DigitalIDResponse)
def get_digital_id(digital_id_id: int, db: Session = Depends(get_db)):
    did = db.query(DigitalID).filter(DigitalID.id == digital_id_id).first()
    if did is None:
        raise HTTPException(status_code=404, detail="Digital ID not found")
    block = db.query(BlockchainBlock).filter(BlockchainBlock.id == did.block_id).first()
    return DigitalIDResponse(
        id=did.id,
        tourist_id=did.tourist_id,
        kyc_id=did.kyc_id,
        itinerary=did.itinerary,
        emergency_contacts=did.emergency_contacts,
        valid_from=did.valid_from,
        valid_to=did.valid_to,
        status=did.status,
        public_address=did.public_address,
        block_hash=block.hash if block else None,
        signature=block.signature if block else None,
    )


@router.get("/verify/{digital_id_id}", response_model=VerifyResponse)
def verify_digital_id(digital_id_id: int, db: Session = Depends(get_db)):
    did = db.query(DigitalID).filter(DigitalID.id == digital_id_id).first()
    if did is None:
        return VerifyResponse(is_valid=False, reason="Digital ID not found")
    if did.status != "active":
        return VerifyResponse(is_valid=False, reason="Digital ID inactive")
    try:
        if did.valid_to.timestamp() < Ledger.utcnow().timestamp():
            return VerifyResponse(is_valid=False, reason="Digital ID expired")
    except Exception:
        # Fallback if timestamp conversion fails
        return VerifyResponse(is_valid=False, reason="Invalid expiry timestamp")

    block = db.query(BlockchainBlock).filter(BlockchainBlock.id == did.block_id).first()
    if block is None:
        return VerifyResponse(is_valid=False, reason="Missing block record")

    ledger = Ledger(db_session=db)
    is_valid, reason = ledger.verify_block(block)

    # Check on-chain (if anchored)
    onchain = db.query(DigitalIDOnChain).filter(DigitalIDOnChain.digital_id_id == did.id).first()
    onchain_tx = None
    onchain_status = None
    if onchain:
        try:
            poly = PolygonService()
            contract = poly.load_contract(DIGITAL_ID_REGISTRY_ABI)
            content_hash_bytes32 = Web3.to_bytes(hexstr=block.hash)
            if len(content_hash_bytes32) != 32:
                content_hash_bytes32 = Web3.keccak(text=block.hash)
            receipt = poly.web3.eth.get_transaction_receipt(onchain.tx_hash)
            onchain_tx = onchain.tx_hash
            if receipt.status != 1:
                onchain_status = "failed"
            else:
                # Decode Issued event to get on-chain id
                issued_event = contract.events.Issued().process_receipt(receipt)
                if not issued_event:
                    onchain_status = "unknown"
                else:
                    args = issued_event[0]["args"]
                    onchain_id = int(args.get("id"))
                    # Read current state
                    (chain_content_hash, _subject, valid_to_unix, revoked) = contract.functions.get(onchain_id).call()
                    # Compare content hash and expiry/revoke
                    if chain_content_hash != content_hash_bytes32:
                        onchain_status = "hash_mismatch"
                    elif revoked:
                        onchain_status = "revoked"
                    elif valid_to_unix < int(Ledger.utcnow().timestamp()):
                        onchain_status = "expired"
                    else:
                        onchain_status = "issued"
        except Exception:
            onchain_status = "unknown"

    return VerifyResponse(
        is_valid=is_valid,
        reason=reason,
        block_index=block.index,
        block_hash=block.hash,
        onchain_tx_hash=onchain_tx,
        onchain_status=onchain_status,
    )


@router.post("/{digital_id_id}/revoke")
def revoke_digital_id(digital_id_id: int, db: Session = Depends(get_db)):
    did = db.query(DigitalID).filter(DigitalID.id == digital_id_id).first()
    if did is None:
        raise HTTPException(status_code=404, detail="Digital ID not found")
    onchain = db.query(DigitalIDOnChain).filter(DigitalIDOnChain.digital_id_id == did.id).first()
    if onchain is None:
        raise HTTPException(status_code=400, detail="Digital ID not anchored on-chain")
    # We need the on-chain ID; decode from Issued event
    poly = PolygonService()
    contract = poly.load_contract(DIGITAL_ID_REGISTRY_ABI)
    receipt = poly.web3.eth.get_transaction_receipt(onchain.tx_hash)
    issued_event = contract.events.Issued().process_receipt(receipt)
    if not issued_event:
        raise HTTPException(status_code=400, detail="Cannot determine on-chain ID from tx")
    onchain_id = int(issued_event[0]["args"].get("id"))
    # Send revoke tx
    revoke_receipt = poly.send_tx(contract.functions.revoke, onchain_id)
    onchain.status = "revoked" if revoke_receipt.status == 1 else onchain.status
    db.commit()
    return {"tx_hash": revoke_receipt.transactionHash.hex(), "status": onchain.status}


