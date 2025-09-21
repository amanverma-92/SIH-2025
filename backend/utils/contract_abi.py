DIGITAL_ID_REGISTRY_ABI = [
  {
    "inputs": [
      {"internalType": "bytes32", "name": "contentHash", "type": "bytes32"},
      {"internalType": "address", "name": "subject", "type": "address"},
      {"internalType": "uint256", "name": "validTo", "type": "uint256"}
    ],
    "name": "issue",
    "outputs": [{"internalType": "uint256", "name": "id", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "id", "type": "uint256"}],
    "name": "revoke",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "id", "type": "uint256"}],
    "name": "get",
    "outputs": [
      {"internalType": "bytes32", "name": "contentHash", "type": "bytes32"},
      {"internalType": "address", "name": "subject", "type": "address"},
      {"internalType": "uint256", "name": "validTo", "type": "uint256"},
      {"internalType": "bool", "name": "revoked", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": False,
    "inputs": [
      {"indexed": True, "internalType": "uint256", "name": "id", "type": "uint256"},
      {"indexed": False, "internalType": "bytes32", "name": "contentHash", "type": "bytes32"},
      {"indexed": True, "internalType": "address", "name": "subject", "type": "address"},
      {"indexed": False, "internalType": "uint256", "name": "validTo", "type": "uint256"}
    ],
    "name": "Issued",
    "type": "event"
  }
]


