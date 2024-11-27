import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { ZeroAddress } from 'ethers';

export default (newArtifactName: string, moduleName: string, proxyAdminOwnerIdx: number = 1, initializeParams: any = []) => {
  const upgradeModuleName = `${moduleName}ProxiesUpgrade`;
  return buildModule(upgradeModuleName, (m) => {
    const proxyAdminOwner = m.getAccount(proxyAdminOwnerIdx);
    const proxyAdminAddress = m.getParameter('proxyAdminAddress', ZeroAddress);
    const proxyAddress = m.getParameter('proxyAddress', ZeroAddress);
    const newImplementation = m.contract(newArtifactName);
    const proxyAdmin = m.contractAt('ProxyAdmin', proxyAdminAddress);
    const transparentUpgradeableProxy = m.contractAt('TransparentUpgradeableProxy', proxyAddress);
    const initializerParams = m.encodeFunctionCall(newImplementation, 'initialize', initializeParams);
    m.call(proxyAdmin, 'upgradeAndCall', [transparentUpgradeableProxy, newImplementation, initializerParams], {
      from: proxyAdminOwner,
    });
    const proxy = m.contractAt(newArtifactName, proxyAddress, { id: `${upgradeModuleName}_${newArtifactName}_castProxyToImpl` });
    return { newImplementation, proxy, proxyAdmin };
  });
};
