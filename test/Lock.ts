import { ethers } from "hardhat";
import { expect } from "chai";

describe("MyToken", function () {
  let MyToken: any;
  let myToken: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    MyToken = await ethers.getContractFactory("MyToken");
    [owner, addr1, addr2] = await ethers.getSigners();

    const name = "MyToken";
    const symbol = "MTK";
    const decimals = 18;
    const initialSupply = 10000;

    myToken = await MyToken.deploy(name, symbol, decimals, initialSupply);
    await myToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct name, symbol, and decimals", async function () {
      expect(await myToken.name()).to.equal("MyToken");
      expect(await myToken.symbol()).to.equal("MTK");
      expect(await myToken.decimals()).to.equal(18);
    });

    it("Should assign the initial supply to the owner", async function () {
      const ownerBalance = await myToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(10000 * 10**18); // 10000 tokens with 18 decimals
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      await myToken.transfer(addr1.address, 1000);
      const addr1Balance = await myToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(1000);
    });

    it("Should fail if sender doesn't have enough balance", async function () {
      const initialBalance = await myToken.balanceOf(owner.address);
      await expect(myToken.transfer(addr1.address, initialBalance + 1)).to.be.revertedWith(
        "Insufficient balance"
      );
    });

    it("Should update allowances", async function () {
      await myToken.approve(addr1.address, 1000);
      const allowance = await myToken.allowance(owner.address, addr1.address);
      expect(allowance).to.equal(1000);
    });

    it("Should allow transferFrom if allowed", async function () {
      await myToken.approve(addr1.address, 1000);
      await myToken.connect(addr1).transferFrom(owner.address, addr2.address, 500);
      const addr2Balance = await myToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(500);
    });
  });
});
