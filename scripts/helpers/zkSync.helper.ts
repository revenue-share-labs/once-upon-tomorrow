import { Provider, Wallet } from "zksync-ethers";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import "@matterlabs/hardhat-zksync-node/dist/type-extensions";
import "@matterlabs/hardhat-zksync-verify/dist/src/type-extensions";

export enum StagePriority {
  HIGH = 4,
  NORMAL = 3,
  LOW = 2,
  DEBUG = 1 // A priority for the stages that are just gathering info and printing it for debug purposes.
}

export type DeployContractOptions = {
  /**
   * If true, the deployment process will not print any logs
   */
  silent?: boolean;
  /**
   * If true, the contract will not be verified on Block Explorer
   */
  noVerify?: boolean;
  /**
   * If specified, the contract will be deployed using this wallet
   */
  wallet?: Wallet;
};

export const emptyStage = (tag: string, message: string, dependencies: Array<string>) => {
  const emptyDeployScript = async (_: HardhatRuntimeEnvironment) => {
    console.log(message);
  };
  emptyDeployScript.priority = StagePriority.HIGH;
  emptyDeployScript.tags = [tag];
  emptyDeployScript.dependencies = dependencies;
  return emptyDeployScript;
};

export const convertStageToFixture = (
  hre: HardhatRuntimeEnvironment, 
  stageFileName: string, 
  network: string | undefined = undefined // An `undefined` is - to trigger the logic inside deploy-zksync task and deploy `inMemoryMode`.
) => {
  return async () => await hre.run("deploy-zksync", {
    script: stageFileName,
    network
  });
}

export const log = (message: string, options: DeployContractOptions = { silent: false }) => {
  if (!options?.silent) console.log(message);
};

export const getProvider = (hre: HardhatRuntimeEnvironment) => {
  const rpcUrl = hre.network.config.url;
  if (!rpcUrl)
    throw `⛔️ RPC URL wasn't found in "${hre.network.name}"! Please add a "url" field to the network config in hardhat.config.ts`;

  // Initialize ZKsync Provider
  const provider = new Provider(rpcUrl);

  return provider;
};

export const getWallet = (hre: HardhatRuntimeEnvironment, privateKey?: string) => {
  if (!privateKey) {
    // Get wallet private key from .env file
    if (!process.env.WALLET_PRIVATE_KEY)
      throw "⛔️ Wallet private key wasn't found in .env file!";
  }

  const provider = getProvider(hre);

  // Initialize ZKsync Wallet
  const wallet = new Wallet(
    privateKey ?? process.env.WALLET_PRIVATE_KEY!,
    provider
  );

  return wallet;
};

export const verifyEnoughBalance = async (hre: HardhatRuntimeEnvironment, wallet: Wallet, amount: bigint) => {
  // Check if the wallet has enough balance
  // const balance = await wallet.getBalance();
  const balance = await getProvider(hre).getBalance(wallet.address, "latest");

  if (balance < amount)
    throw `⛔️ Wallet balance is too low! Required ${hre.ethers.formatEther(
      amount
    )} ETH, but current ${wallet.address} balance is ${hre.ethers.formatEther(
      balance
    )} ETH`;
};

/**
 * @param {string} data.contract The contract's path and name. E.g., "contracts/Greeter.sol:Greeter"
 */
export const verifyContract = async (
  hre: HardhatRuntimeEnvironment,
  data: {
    address: string;
    contract: string;
    constructorArguments: string;
    bytecode: string;
  }
) => {
  const verificationRequestId: number = await hre.run("verify:verify", {
    ...data,
    noCompile: true,
  });
  return verificationRequestId;
};

export const deployContract = async (
  hre: HardhatRuntimeEnvironment,
  contractArtifactName: string,
  constructorArguments?: any[],
  options: DeployContractOptions = { silent: false }
) => {

  log(`\nStarting deployment process of "${contractArtifactName}"...`, options);

  let deployer: Deployer;
  let wallet: Wallet;
  if (options?.wallet !== undefined) {
    wallet = options?.wallet;
    deployer = new Deployer(hre, wallet);
  } else {
    deployer = hre.deployer as unknown as Deployer;
    wallet = deployer.zkWallet;
  }

  const artifact = await deployer
    .loadArtifact(contractArtifactName)
    .catch((error) => {
      if (
        error?.message?.includes(
          `Artifact for contract "${contractArtifactName}" not found.`
        )
      ) {
        console.error(error.message);
        throw `⛔️ Please make sure you have compiled your contracts or specified the correct contract name!`;
      } else {
        throw error;
      }
    });

  // Estimate contract deployment fee
  const deploymentFee = await deployer.estimateDeployFee(
    artifact,
    constructorArguments || []
  );
  log(`Estimated deployment cost: ${hre.ethers.formatEther(deploymentFee)} ETH`, options);

  // Check if the wallet has enough balance
  await verifyEnoughBalance(hre, wallet, deploymentFee);

  // Deploy the contract to ZKsync
  const contract = await deployer.deploy(artifact, constructorArguments);
  const address = await contract.getAddress();
  const constructorArgs = contract.interface.encodeDeploy(constructorArguments);
  const fullContractSource = `${artifact.sourceName}:${artifact.contractName}`;

  // Display contract deployment info
  log(`\n"${artifact.contractName}" was successfully deployed:`, options);
  log(` - Contract address: ${address}`, options);
  log(` - Contract source: ${fullContractSource}`, options);
  log(` - Encoded constructor arguments: ${constructorArgs}\n`, options);

  if (!options?.noVerify && hre.network.config.verifyURL) {
    log(`Requesting contract verification...`, options);
    await verifyContract(
      hre,
      {
        address,
        contract: fullContractSource,
        constructorArguments: constructorArgs,
        bytecode: artifact.bytecode,
      }
    );
  }

  return contract;
};