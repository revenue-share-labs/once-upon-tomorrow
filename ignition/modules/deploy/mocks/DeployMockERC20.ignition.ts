import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('DeployMockERC20', (m) => {
  const mockERC20 = m.contract('MockERC20');
  return { mockERC20 };
});
