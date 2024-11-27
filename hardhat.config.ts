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
    zkSyncSepoliaTestnet: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia",
      zksync: true,
      verifyURL: "https://explorer.sepolia.era.zksync.dev/contract_verification",
    },
    zkSyncMainnet: {
      url: "https://mainnet.era.zksync.io",
      ethNetwork: "mainnet",
      zksync: true,
      verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
    },
    dockerizedNode: {
      url: "http://localhost:3050",
      ethNetwork: "http://localhost:8545",
      zksync: true,
    },
    inMemoryNode: {
      url: "http://127.0.0.1:8011",
      ethNetwork: "", // in-memory node doesn't support eth node; removing this line will cause an error
      zksync: true,
    },
    hardhat_zk: {
      url: "http://127.0.0.1:8011/",
      zksync: true,
      ethNetwork: "sepolia",
    },
    zkxsolla: {
      url: "https://zkrpc.xsollazk.com",
      ethNetwork: "sepolia",
      zksync: true,
      accounts: [MAINNET_PRIVATE_KEY],
      // verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
    }
  },
  zksolc: {
    version: "latest",
    settings: {
      // find all available options in the official documentation
      // https://docs.zksync.io/build/tooling/hardhat/hardhat-zksync-solc#configuration
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
