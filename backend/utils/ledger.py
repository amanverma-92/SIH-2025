import hmac
import hashlib
import os
from datetime import datetime, timezone
from typing import Tuple
from sqlalchemy.orm import Session
from models.digital_id import BlockchainBlock


class Ledger:
    """A simple append-only hash-chained ledger stored in SQL.

    - Each block signs (index, timestamp, data_hash, previous_hash)
    - HMAC secret is read from LEDGER_SECRET or generated once per process
    """

    def __init__(self, db_session: Session):
        self.db: Session = db_session
        self.secret: bytes = (os.environ.get("LEDGER_SECRET") or "dev-secret").encode()

    @staticmethod
    def utcnow() -> datetime:
        return datetime.now(timezone.utc)

    def _get_last_block(self) -> BlockchainBlock | None:
        return (
            self.db.query(BlockchainBlock)
            .order_by(BlockchainBlock.index.desc())
            .first()
        )

    def _timestamp_to_epoch(self, ts: datetime) -> int:
        # Normalize both aware and naive datetimes to UTC epoch seconds
        if ts.tzinfo is None:
            ts = ts.replace(tzinfo=timezone.utc)
        return int(ts.timestamp())

    def _compute_hash(self, index: int, timestamp: datetime, data_hash: str, previous_hash: str) -> str:
        # Canonical payload using epoch seconds to avoid tz/serialization drift
        epoch = self._timestamp_to_epoch(timestamp)
        payload = f"{index}|{epoch}|{data_hash}|{previous_hash}".encode()
        return hashlib.sha256(payload).hexdigest()

    def _compute_hash_legacy(self, index: int, timestamp: datetime, data_hash: str, previous_hash: str) -> str:
        # Legacy format used before normalization: ISO timestamp in payload
        payload = f"{index}|{timestamp.isoformat()}|{data_hash}|{previous_hash}".encode()
        return hashlib.sha256(payload).hexdigest()

    def _sign(self, content_hash: str) -> str:
        return hmac.new(self.secret, content_hash.encode(), hashlib.sha256).hexdigest()

    @staticmethod
    def compute_data_hash(data: str) -> str:
        return hashlib.sha256(data.encode()).hexdigest()

    def append_block(self, data: str) -> BlockchainBlock:
        last = self._get_last_block()
        index = 0 if last is None else last.index + 1
        prev_hash = "0" * 64 if last is None else last.hash
        timestamp = self.utcnow()
        data_hash = self.compute_data_hash(data)
        content_hash = self._compute_hash(index, timestamp, data_hash, prev_hash)
        signature = self._sign(content_hash)

        block = BlockchainBlock(
            index=index,
            timestamp=timestamp,
            data_hash=data_hash,
            previous_hash=prev_hash,
            hash=content_hash,
            signature=signature,
        )
        self.db.add(block)
        self.db.commit()
        self.db.refresh(block)
        return block

    def verify_block(self, block: BlockchainBlock) -> Tuple[bool, str]:
        # Verify signature
        expected_hash = self._compute_hash(block.index, block.timestamp, block.data_hash, block.previous_hash)
        expected_sig = self._sign(expected_hash)
        if not (hmac.compare_digest(expected_hash, block.hash) and hmac.compare_digest(expected_sig, block.signature)):
            # Try legacy hash/signature scheme for backward compatibility
            legacy_hash = self._compute_hash_legacy(block.index, block.timestamp, block.data_hash, block.previous_hash)
            legacy_sig = self._sign(legacy_hash)
            if not (hmac.compare_digest(legacy_hash, block.hash) and hmac.compare_digest(legacy_sig, block.signature)):
                return False, "Hash mismatch"

        # Verify previous linkage (if not genesis)
        if block.index > 0:
            prev = (
                self.db.query(BlockchainBlock)
                .filter(BlockchainBlock.index == block.index - 1)
                .first()
            )
            if prev is None:
                return False, "Missing previous block"
            if not hmac.compare_digest(prev.hash, block.previous_hash):
                return False, "Broken chain"

        return True, "OK"


