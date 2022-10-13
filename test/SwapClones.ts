import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SwapClones", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySetupFixture() {
    
    // Contracts are deployed using the first signer/account by default
    const [owner, token1, token2] = await ethers.getSigners();
    const SwapPairClones = await ethers.getContractFactory("SwapPairClones");
    const SwapFactoryClones = await ethers.getContractFactory("SwapFactoryClones");
    
    const swapPairClones = await SwapPairClones.deploy();
    await swapPairClones.deployed();

    const swapFactoryClones = await SwapFactoryClones.deploy(swapPairClones.address, owner.address);
    await swapFactoryClones.deployed();
  
    return { swapPairClones, swapFactoryClones, token1, token2};
  }

  it("Should create a pair via Clones library", async function() {
    const {swapFactoryClones, token1, token2} = await loadFixture(deploySetupFixture);
    const clonesAddr =  await swapFactoryClones.callStatic.createPair(token1.address, token2.address);
    await swapFactoryClones.createPair(token1.address, token2.address);
    const SwapPairClones = await ethers.getContractFactory("SwapPairClones");
    const swapPairClonesWrapper = SwapPairClones.attach(clonesAddr);
    
    expect(await swapPairClonesWrapper.token0()).to.eq(token2.address);
    expect(await swapPairClonesWrapper.token1()).to.eq(token1.address);
  });

});
