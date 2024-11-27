import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('DeployMockNFT', (m) => {
  const mockNFT = m.contract('MockNFT');
  return { mockNFT };
});
