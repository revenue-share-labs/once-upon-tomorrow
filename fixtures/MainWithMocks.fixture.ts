import DeployMockERC20 from '../ignition/modules/deploy/mocks/DeployMockERC20.ignition';

import mainStage from '../stages/Main.stage';

export default (hre: any) =>
  async function mainFixture() {
    // Skip owner to be able to obtain ProxyAdmin owner for contracts that are deployed with TUPS.
    const [owner, proxyAdminSigner] = await hre.ethers.getSigners();

    const { mockERC20 } = await hre.ignition.deploy(DeployMockERC20);

    const name = "Once Upon Tomorrow";
    const symbol = "OUT";
    const maxNftSupply = 20_000n;

    const { onceUponTomorrow } = await mainStage(
      hre,
      name,
      symbol,
      maxNftSupply
    )();

    return { onceUponTomorrow, mockERC20, proxyAdminSigner };
  };
