import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import dotenv from "dotenv";

dotenv.config();

const ALCHEMY_HTTPS = process.env.ALCHEMY_HTTPS;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

if (!ALCHEMY_HTTPS || !WALLET_PRIVATE_KEY || !ETHERSCAN_API_KEY) {
  throw new Error(
    "Missing ALCHEMY_HTTPS, WALLET_PRIVATE_KEY or ETHERSCAN_API_KEY environment "
  );
}

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: ALCHEMY_HTTPS,
      accounts: [WALLET_PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
