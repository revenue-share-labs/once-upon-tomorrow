import { HardhatRuntimeEnvironment } from "hardhat/types";
import { StagePriority } from "../../../scripts/helpers/zkSync.helper";

const stage = async (hre: HardhatRuntimeEnvironment) => {
  
}

stage.priority = StagePriority.HIGH;
stage.tags = ["onceUponTomorrow"];

export default stage;