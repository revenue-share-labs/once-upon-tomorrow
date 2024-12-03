import hre, { ethers } from 'hardhat';
import { ZeroAddress, parseEther } from 'ethers';
import { expect } from "chai";
import { loadFixture, time, takeSnapshot, SnapshotRestorer } from '@nomicfoundation/hardhat-network-helpers';
import { HardhatZksyncSigner } from '@matterlabs/hardhat-zksync-ethers';

import { OnceUponTomorrow, MockERC20 } from '../typechain-types';
import { convertStageToFixture } from '../scripts/helpers/zkSync.helper';

describe('Helmets', () => {
  let helmets: OnceUponTomorrow;
  let owner: HardhatZksyncSigner, proxyAdminOwner: HardhatZksyncSigner, otherAccount: HardhatZksyncSigner;

  let deployedContracts: any;
  let snapshot: SnapshotRestorer;

  const maxNftSupply = 20_000n;
  const baseUrl = "https://nft.rsclabs.io/nft/once-upon-tomorrow/meta/"

  before(async () => {
    [owner, proxyAdminOwner, otherAccount] = await ethers.getSigners();
    deployedContracts = await loadFixture(convertStageToFixture(hre, "generalTestFixture"));
    helmets = deployedContracts.onceUponTomorrow;
  });

  beforeEach(async () => {
    snapshot = await takeSnapshot();
  });

  afterEach(async () => {
    await snapshot.restore();
  });

  describe("Deployment", () => {
    it("Should set the right MAX HELMETS SUPPLY", async () => {
      expect(await helmets.MAX_HELMETS()).to.equal(maxNftSupply);
    });

    it("Should set the right owner", async () => {
      expect(await helmets.owner()).to.equal(owner.address);
    });

    it("Mint is not available", async () => {
      await expect(helmets.mintHelmets(1)).to.be.revertedWithCustomError(helmets, "SaleInactive");
    });

    it("Mint Ether value sent is not correct", async () => {
      await helmets.flipSaleState();
      await expect(helmets.mintHelmets(1)).to.be.revertedWithCustomError(helmets, "InsufficientPayment");
    });

    it("Mint token", async () => {
      await helmets.flipSaleState();
      await helmets.mintHelmets(3, { value: parseEther("0.15") })

      expect(await helmets.tokenURI(0)).to.equal(
        `${baseUrl}0`
      );

      expect(await helmets.tokenURI(1)).to.equal(
        `${baseUrl}1`
      );

      expect(await helmets.tokenURI(2)).to.equal(
        `${baseUrl}2`
      );

      await expect(helmets.tokenURI(3)).to.be.revertedWithCustomError(helmets, "ERC721NonexistentToken");
    });

    it("Mint max + 1 token amount", async () => {
      await helmets.flipSaleState();

      await expect(helmets.mintHelmets(11, { value: parseEther("0.55") })
      ).to.be.revertedWithCustomError(
        helmets, "MaxPurchaseExceeded"
      );
    });
  });

  describe("Withdrawals", () => {
    it("Buy and withdraw", async () => {
      await helmets.flipSaleState();
      await expect(helmets.mintHelmets(1, { value: parseEther("0.05") })).to.changeEtherBalances(
        [owner, helmets],
        [-parseEther("0.05"), parseEther("0.05")]
      )
      await expect(helmets.mintHelmets(1, { value: parseEther("0.05") })).to.changeEtherBalances(
        [owner, helmets],
        [-parseEther("0.05"), parseEther("0.05")]
      )
      await expect(helmets.withdraw()).to.changeEtherBalances(
        [owner, helmets],
        [parseEther("0.1"), -parseEther("0.1")]
      );
    });
  });
});
