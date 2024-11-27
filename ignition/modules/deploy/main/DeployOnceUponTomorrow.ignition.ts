import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const moduleName = "DeployOnceUponTomorrow";
export default buildModule(moduleName, (m) => {
  const name = m.getParameter("name", "");
  const symbol = m.getParameter("symbols", "");
  const maxSupply = m.getParameter("maxSupply", 0n);
  const onceUponTomorrow = m.contract("OnceUponTomorrow", [name, symbol, maxSupply]);
  return { onceUponTomorrow };
});
