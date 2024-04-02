import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const POLYGON_DEPLOYER = process.env.POLYGON_DEPLOYER
const POLYGON_RPC = process.env.POLYGON_RPC
const MATIC_RPC = process.env.MATIC_RPC
const MATIC_DEPLOYER = process.env.MATIC_DEPLOYER
const SEPOILA_RPC = process.env.SEPOILA_RPC
const SEPOILA_DEPLOYER = process.env.SEPOILA_DEPLOYER

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    polygon: {
      timeout: 600000,
      chainId: 137,
      gasPrice: 150000000000,
      url: POLYGON_RPC,
      accounts: [`${POLYGON_DEPLOYER}`],
    },
    matic: {
      timeout: 600000,
      chainId: 80001,
      gasPrice: 150000000000,
      url: MATIC_RPC,
      accounts: [`${MATIC_DEPLOYER}`],
    },
    sepoila: {
      timeout: 600000,
      chainId: 11155111,
      gasPrice: 2500000000000,
      url: SEPOILA_RPC,
      accounts: [`${SEPOILA_DEPLOYER}`],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;