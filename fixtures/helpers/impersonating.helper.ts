export const mintNativeTokens = async (hre: any, signer: any, amountHex: string) => {
  await hre.network.provider.send('hardhat_setBalance', [signer.address || signer, amountHex]);
};

export const withImpersonatedSigner = async (hre: any, signerAddress: string, action: any) => {
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
};
