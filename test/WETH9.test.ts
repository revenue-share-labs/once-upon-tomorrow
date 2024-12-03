import hre, { ethers } from 'hardhat';
import { ZeroAddress, parseEther } from 'ethers';
import { expect } from "chai";
import { HardhatZksyncSigner } from '@matterlabs/hardhat-zksync-ethers';

import { WETH9 } from '../typechain-types';
import { convertStageToFixture } from '../scripts/helpers/zkSync.helper';

describe('WETH9 (For DockerizedNode testing - no inMemoryNode op-codes utilized)', () => {
  let weth: WETH9;
  let owner: HardhatZksyncSigner;

  let deployedContracts: any;

  before(async () => {
    [owner] = await ethers.getSigners();
    deployedContracts = await (convertStageToFixture(hre, "weth"))();
    weth = deployedContracts.WETH9;
  });

  it('should work', async () => {
    expect(true).to.be.true;
  });
});
