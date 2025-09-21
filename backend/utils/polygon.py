import os
from dataclasses import dataclass
from typing import Any, Optional
from web3 import Web3
from web3.contract import Contract


@dataclass
class PolygonConfig:
    rpc_url: str
    chain_id: int
    contract_address: str
    private_key: str


class PolygonService:
    def __init__(self):
        rpc_url = os.environ.get("POLYGON_RPC_URL", "https://rpc-amoy.polygon.technology")
        chain_id = int(os.environ.get("POLYGON_CHAIN_ID", "80002"))
        contract_address = os.environ.get("DIGITAL_ID_CONTRACT", "0x0000000000000000000000000000000000000000")
        private_key = os.environ.get("ISSUER_PRIVATE_KEY", "")

        self.config = PolygonConfig(
            rpc_url=rpc_url,
            chain_id=chain_id,
            contract_address=Web3.to_checksum_address(contract_address) if Web3.is_address(contract_address) else contract_address,
            private_key=private_key,
        )
        self.web3 = Web3(Web3.HTTPProvider(self.config.rpc_url))
        self._contract: Optional[Contract] = None

    def load_contract(self, abi: list[dict[str, Any]]) -> Contract:
        if not Web3.is_address(self.config.contract_address):
            raise ValueError("DIGITAL_ID_CONTRACT is not a valid address")
        self._contract = self.web3.eth.contract(address=self.config.contract_address, abi=abi)
        return self._contract

    def send_tx(self, fn, *args, value: int = 0):
        if not self.config.private_key:
            raise ValueError("ISSUER_PRIVATE_KEY not set")
        account = self.web3.eth.account.from_key(self.config.private_key)
        tx = fn(*args).build_transaction({
            "from": account.address,
            "nonce": self.web3.eth.get_transaction_count(account.address),
            "chainId": self.config.chain_id,
            "value": value,
            "gas": 700000,
            "maxFeePerGas": self.web3.to_wei("50", "gwei"),
            "maxPriorityFeePerGas": self.web3.to_wei("2", "gwei"),
        })
        signed = self.web3.eth.account.sign_transaction(tx, private_key=self.config.private_key)
        tx_hash = self.web3.eth.send_raw_transaction(signed.rawTransaction)
        receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt


