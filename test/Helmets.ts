import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

const NAME = "HELMETS";
const SYMBOL = "H";
const MAX_NFT_SUPPLY = 20_000;
const BASE_UTI = "https://nft.rsclabs.io/nft/once-upon-tomorrow/meta/"

describe("Helmets", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployHelmetsFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();


    const Helmets = await hre.ethers.getContractFactory("OnceUponTomorrow");
    const helmets = await Helmets.deploy(NAME, SYMBOL, MAX_NFT_SUPPLY);

    return { helmets, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right MAX HELMETS SUPPLY", async function () {
      const { helmets } = await loadFixture(deployHelmetsFixture);

      expect(await helmets.MAX_HELMETS()).to.equal(MAX_NFT_SUPPLY);
    });

    it("Should set the right owner", async function () {
      const { helmets, owner } = await loadFixture(deployHelmetsFixture);

      expect(await helmets.owner()).to.equal(owner.address);
    });

    it("Mint is not available", async function () {
      const { helmets } = await loadFixture(deployHelmetsFixture);
      await expect(helmets.mintHelmets(1)).to.be.revertedWith("Sale must be active to mint Helmet");
    });

    it("Mint Ether value sent is not correc", async function () {
      const { helmets } = await loadFixture(deployHelmetsFixture);
      await helmets.flipSaleState()
      await expect(helmets.mintHelmets(1)).to.be.revertedWith("Ether value sent is not correct");
    });

    it("Mint token", async function () {
      const { helmets } = await loadFixture(
        deployHelmetsFixture
      );
      await helmets.flipSaleState()
      await helmets.mintHelmets(3, { value: hre.ethers.parseEther("0.15") })

      expect(await helmets.tokenURI(0)).to.equal(
        `${BASE_UTI}0`
      );

      expect(await helmets.tokenURI(1)).to.equal(
        `${BASE_UTI}1`
      );

      expect(await helmets.tokenURI(2)).to.equal(
        `${BASE_UTI}2`
      );

      await expect(helmets.tokenURI(3)).to.be.revertedWithCustomError(helmets, "ERC721NonexistentToken");
    });

    it("Mint max + 1 token amount", async function () {
      const { helmets } = await loadFixture(
        deployHelmetsFixture
      );
      await helmets.flipSaleState()

      await expect(helmets.mintHelmets(11, { value: hre.ethers.parseEther("0.55") })
      ).to.be.revertedWith(
        "Can only mint 10 tokens at a time"
      );
    });
  });

  describe("Withdrawals", function () {
    it("Buy and withdraw", async function () {
      const { owner, helmets } = await loadFixture(deployHelmetsFixture);
      await helmets.flipSaleState()
      await expect(helmets.mintHelmets(1, { value: hre.ethers.parseEther("0.05") })).to.changeEtherBalances(
        [owner, helmets],
        [-hre.ethers.parseEther("0.05"), hre.ethers.parseEther("0.05")]
      )
      await expect(helmets.mintHelmets(1, { value: hre.ethers.parseEther("0.05") })).to.changeEtherBalances(
        [owner, helmets],
        [-hre.ethers.parseEther("0.05"), hre.ethers.parseEther("0.05")]
      )
      await expect(helmets.withdraw()).to.changeEtherBalances(
        [owner, helmets],
        [hre.ethers.parseEther("0.1"), -hre.ethers.parseEther("0.1")]
      );
    });
  })
});

