import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import upgradeProxyModuleBuilder from '../../reusables/upgradeProxy.reusable';

const moduleName = 'UpgradeAutoreflectiveStakingERC20';
export default buildModule(moduleName, (m) => {
  const { newImplementation, proxy, proxyAdmin } = m.useModule(
    upgradeProxyModuleBuilder('AutoreflectiveStakingERC20V2', moduleName),
  );
  return {
    autoreflectiveStakingERC20V2Impl: newImplementation,
    autoreflectiveStakingERC20V2: proxy,
    autoreflectiveStakingERC20V2ProxyAdmin: proxyAdmin,
  };
});
