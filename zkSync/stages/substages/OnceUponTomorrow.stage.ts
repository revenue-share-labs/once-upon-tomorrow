import { HardhatRuntimeEnvironment } from "hardhat/types";
import { StagePriority, deployContract } from "../../../scripts/helpers/zkSync.helper";

const stage = async (hre: HardhatRuntimeEnvironment) => {
  const name = "Once Upon Tomorrow";
  const symbol = "OUT";
  const maxNftSupply = 20_000n;
  await deployContract(hre, "OnceUponTomorrow", [
    name, symbol, maxNftSupply
  ]);
}

stage.priority = StagePriority.HIGH;
stage.tags = ["onceUponTomorrow"];

export default stage;