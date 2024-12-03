import hardhatRuntimeEnvironment from 'hardhat';

async function main(hre: any) {
  const signers = await hre.ethers.getSigners();

  if (signers.length >= 2) {
    console.log(`ProxyAdmin owner address: ${await signers[1].getAddress()}`);
  }

  const ownerAddr = await signers[0].getAddress();

  const name = "Once Upon Tomorrow";
  const symbol = "OUT";
  const maxNftSupply = 20_000n;


  // console.log(`Helmets address: ${await onceUponTomorrow.getAddress()}`);
  console.log(`Owner address: ${ownerAddr}`);
}

main(hardhatRuntimeEnvironment).catch(console.error);
