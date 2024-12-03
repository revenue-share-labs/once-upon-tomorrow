import hre, { ethers } from 'hardhat';
import { ZeroAddress, parseEther } from 'ethers';
import { expect } from "chai";
import { loadFixture, time, takeSnapshot, SnapshotRestorer } from '@nomicfoundation/hardhat-network-helpers';
import { HardhatZksyncSigner } from '@matterlabs/hardhat-zksync-ethers';

import { WETH9 } from '../typechain-types';
import { convertStageToFixture } from '../scripts/helpers/zkSync.helper';

describe('WETH9', () => {
  let weth: WETH9;
  let owner: HardhatZksyncSigner, proxyAdminOwner: HardhatZksyncSigner, otherAccount: HardhatZksyncSigner;

  let deployedContracts: any;
  let snapshot: SnapshotRestorer;

  const maxNftSupply = 20_000n;
  const baseUrl = "https://nft.rsclabs.io/nft/once-upon-tomorrow/meta/"

  before(async () => {
    [owner, proxyAdminOwner, otherAccount] = await ethers.getSigners();
    deployedContracts = await loadFixture(convertStageToFixture(hre, "onceUponTomorrow"));
    weth = deployedContracts.onceUponTomorrow;
  });

  beforeEach(async () => {
    snapshot = await takeSnapshot();
  });

  afterEach(async () => {
    await snapshot.restore();
  });

  it('should work', async () => {
    expect(true).to.be.true;
  });
});
