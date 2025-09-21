import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    amoy: {
      url: process.env.POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology",
      accounts: process.env.ISSUER_PRIVATE_KEY ? [process.env.ISSUER_PRIVATE_KEY] : [],
      chainId: Number(process.env.POLYGON_CHAIN_ID) || 80002
    }
  }
};

export default config;