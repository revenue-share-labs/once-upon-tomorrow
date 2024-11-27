import hardhatRuntimeEnvironment from 'hardhat';

import mainStage from '../stages/Main.stage';

async function main(hre: any) {
  const [owner, proxyAdminOwner] = await hre.ethers.getSigners();
  const ownerAddr = await owner.getAddress();
  const proxyAdminOwnerAddr = await proxyAdminOwner.getAddress();

  const name = "Once Upon Tomorrow";
    const symbol = "OUT";
    const maxNftSupply = 20_000n;

    const { onceUponTomorrow } = await mainStage(
      hre,
      name,
      symbol,
      maxNftSupply
    )();

  console.log(`Helmets address: ${await onceUponTomorrow.getAddress()}`);
  console.log(`Owner address: ${ownerAddr}`);
  console.log(`ProxyAdmin owner address: ${proxyAdminOwnerAddr}`);
}

main(hardhatRuntimeEnvironment).catch(console.error);
