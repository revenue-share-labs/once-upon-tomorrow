import hre, { ethers } from 'hardhat';
import { ZeroAddress, parseEther } from 'ethers';
import { expect } from 'chai';
import { loadFixture, time, takeSnapshot, SnapshotRestorer } from '@nomicfoundation/hardhat-network-helpers';
import { HardhatZksyncSigner } from '@matterlabs/hardhat-zksync-ethers';

import mainFixture from '../ignition/fixtures/MainWithMocks.fixture';
import { OnceUponTomorrow, MockERC20 } from '../typechain-types';

describe('TestUsingIgnitionSample', () => {
  let helmets: OnceUponTomorrow;
  let owner: HardhatZksyncSigner;

  let deployedContracts: any;
  let snapshot: SnapshotRestorer;

  before(async () => {
    [owner] = await ethers.getSigners();
    deployedContracts = await loadFixture(mainFixture(hre));
    helmets = deployedContracts.onceUponTomorrow;
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
