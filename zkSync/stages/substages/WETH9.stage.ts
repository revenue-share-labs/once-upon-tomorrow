import { HardhatRuntimeEnvironment } from "hardhat/types";
import { StagePriority, deployContract } from "../../../scripts/helpers/zkSync.helper";

const stage = async (hre: HardhatRuntimeEnvironment) => {
  await deployContract(hre, "WETH9");
}

stage.priority = StagePriority.HIGH;
stage.tags = ["weth"];

export default stage;