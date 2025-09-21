# Blockchain (Hardhat) Workspace

Smart contract: `DigitalIDRegistry.sol` + deploy scripts.

## Prereqs
- Node 18+
- PowerShell

## Install
```powershell
cd C:\Users\gupta\OneDrive\Desktop\SIH-2025\blockchain
npm i
```

## Local (free)
1) Node:
```powershell
npx hardhat node
```
2) Deploy (new terminal):
```powershell
npx hardhat run scripts/deploy.ts --network localhost
```

## Amoy testnet
```powershell
$env:POLYGON_RPC_URL = "https://rpc-amoy.polygon.technology"
$env:POLYGON_CHAIN_ID = "80002"
$env:ISSUER_PRIVATE_KEY = "0xYourFundedTestnetPrivateKey"
npx hardhat run scripts/deploy.ts --network amoy
```

## Backend integration (same shell as uvicorn)
```powershell
$env:POLYGON_RPC_URL = "<rpc url>"             # local or amoy
$env:POLYGON_CHAIN_ID = "<chain id>"           # 31337 or 80002
$env:DIGITAL_ID_CONTRACT = "0xDeployedAddress" # from deploy
$env:ISSUER_PRIVATE_KEY = "0xPrivateKey"
uvicorn main:app --reload
```

## Troubleshooting
- HH1: run in blockchain folder.
- HH19: ESM/CJS mismatch → use the provided versions (CommonJS + Hardhat v2).
- insufficient funds: use local node or fund testnet key.
- anchor_failed: env not set or wrong contract/network; ensure local node is running.

## Scripts
```powershell
npm run compile
npm run deploy:localhost
npm run deploy:amoy
```
```

Create .gitignore (paste into blockchain/.gitignore)
```gitignore
node_modules/
artifacts/
cache/
typechain-types/
.env
```

Update package.json scripts (run in blockchain folder)
```powershell
npm pkg set scripts.compile="hardhat compile"
npm pkg set scripts.deploy:localhost="hardhat run scripts/deploy.ts --network localhost"
npm pkg set scripts.deploy:amoy="hardhat run scripts/deploy.ts --network amoy"
npm pkg set scripts.clean="hardhat clean"
```

Notes
- You already confirmed on-chain anchoring works (onchain_status: issued). If verify ever shows unknown, ensure the backend env (contract address, RPC, chainId) matches the chain where you issued, then re-issue.