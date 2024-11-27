import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default (artifactName: string, moduleName: string, initializeParams: any = []) => {
  const deployModuleName = `${moduleName}ProxiesDeploy`;
  return buildModule(deployModuleName, (m) => {
    const proxyAdminOwner = m.getParameter('proxyAdminOwner', m.getAccount(1));
    const implementation = m.contract(artifactName);
    const transparentUpgradeableProxy = m.contract('TransparentUpgradeableProxy', [
      implementation,
      proxyAdminOwner,
      m.encodeFunctionCall(implementation, 'initialize', initializeParams),
    ]);
    const proxyAdminAddress = m.readEventArgument(transparentUpgradeableProxy, 'AdminChanged', 'newAdmin');
    const proxy = m.contractAt(artifactName, transparentUpgradeableProxy, {
      id: `${deployModuleName}_${artifactName}_castProxyToImpl`,
    });
    const proxyAdmin = m.contractAt('ProxyAdmin', proxyAdminAddress);
    return { implementation, proxy, proxyAdmin };
  });
};
