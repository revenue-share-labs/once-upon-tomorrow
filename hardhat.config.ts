import { extendEnvironment, task } from 'hardhat/config';
import { HardhatUserConfig } from 'hardhat/types';
import '@nomicfoundation/hardhat-ignition-ethers';
import '@nomicfoundation/hardhat-toolbox';
import dotenv from 'dotenv';
import 'hardhat-contract-sizer';
import 'hardhat-tracer';
import 'hardhat-docgen';

dotenv.config();

import getAllArtifactsTaskInitialize from './tasks/getAllArtifacts.task';
import verifyAllTaskInitialize from './tasks/verifyAll.task';

getAllArtifactsTaskInitialize(task);
verifyAllTaskInitialize(task);

const ETHERSCAN_API_KEY: string = process.env.ETHERSCAN_API_KEY ?? '';
const MAINNET_PRIVATE_KEY: string = process.env.MAINNET_PRIVATE_KEY ?? '';
const ALCHEMY_RPC_PRIVATE_URL: string = process.env.ALCHEMY_RPC_API_KEY ?? '';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  mocha: {
    timeout: 200000,
  },
  networks: {
    ethereum: {
      url: `${ALCHEMY_RPC_PRIVATE_URL}`,
      accounts: [MAINNET_PRIVATE_KEY],
    },
    hardhat: {
      accounts: {
        count: 200, // Numbers of account to create. We need to increment it for use in tests like signers
      },
    },
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS == 'true',
  },
  contractSizer: {
    runOnCompile: true,
  },
  docgen: {
    path: './natspecs',
    clear: true,
    runOnCompile: false,
  },
};

// For some additional dependency injections use:
extendEnvironment((hre: any) => {
  hre.xsolla = {};
});

export default config;
