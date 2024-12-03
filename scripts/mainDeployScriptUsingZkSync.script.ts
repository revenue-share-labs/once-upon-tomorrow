import hardhatRuntimeEnvironment from 'hardhat';
import { convertStageToFixture } from './helpers/zkSync.helper';

async function main(hre: any) {
  const signers = await hre.ethers.getSigners();
  if (signers.length >= 2) {
    console.log(`ProxyAdmin owner address: ${await signers[1].getAddress()}`);
  }
  const ownerAddr = await signers[0].getAddress();
  const deployedContracts: any = await (convertStageToFixture(hre, "production"))();
  console.log(`WETH9 address: ${await deployedContracts.WETH9.getAddress()}`);
  console.log(`OnceUponTomorrow address: ${await deployedContracts.OnceUponTomorrow.getAddress()}`);
  console.log(`Owner address: ${ownerAddr}`);
}

main(hardhatRuntimeEnvironment).catch(console.error);
