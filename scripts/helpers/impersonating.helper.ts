import { HardhatRuntimeEnvironment } from "hardhat/types";

export const mintNativeTokens = async (hre: HardhatRuntimeEnvironment, signer: any, amountHex: string) => {
  if (hre.config.networks[hre.network.name].zksync) {
    throw Error("Cannot use HardhatEVM opcodes to mint native tokens!\n Please, use impersonated whales instead through `hre.zksyncEthers.getImpersonatedSigner: (address: string) => Promise<zk.Signer>`");
  }
  await hre.network.provider.send('hardhat_setBalance', [signer.address || signer, amountHex]);
};

export const withImpersonatedSigner = async (hre: HardhatRuntimeEnvironment, signerAddress: string, action: any) => {
  if (hre.config.networks[hre.network.name].zksync) {
    const impersonatedSigner = await hre.zksyncEthers.getImpersonatedSigner(signerAddress);
    await action(impersonatedSigner);
  } else {
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [signerAddress],
    });
  
    const impersonatedSigner = await hre.ethers.getSigner(signerAddress);
    await action(impersonatedSigner);
  
    await hre.network.provider.request({
      method: 'hardhat_stopImpersonatingAccount',
      params: [signerAddress],
    });
  }
};