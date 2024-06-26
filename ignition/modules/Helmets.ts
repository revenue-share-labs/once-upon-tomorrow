import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NAME = "Once Upon Tomorrow";
const SYMBOL = "OUT";
const MAX_NFT_SUPPLY = 20_000;

const HelmetsModule = buildModule("HelmetModule", (m) => {
  const name = m.getParameter("saleStart", NAME);
  const symbol = m.getParameter("saleStart", SYMBOL);
  const maxSupply = m.getParameter("maxSupply", MAX_NFT_SUPPLY);

  const helmet = m.contract("OnceUponTomorrow", [name, symbol, maxSupply]);

  return { helmet };
});

export default HelmetsModule;
