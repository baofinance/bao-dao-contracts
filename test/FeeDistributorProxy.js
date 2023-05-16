const { ethers, deployments, getNamedAccounts, getUnnamedAccounts } = require("hardhat")
const { expect } = require("chai")

describe("FeeDistributorProxy contract", function () {
  it("Splitting BAOv2 tokens should work properly.", async function () {
    const { deployer, rando, friendo } = await getNamedAccounts()
    console.log({deployer, rando, friendo})

    await deployments.fixture(["ERC20BAO", "FeeDistributorProxy"])

    const baov2 = await ethers.getContract("ERC20BAO", deployer)
    const fdp = await ethers.getContract("FeeDistributorProxy", deployer)

    let tx

    tx = await baov2.set_minter(deployer)
    await tx.wait()
    await ethers.provider.send('evm_increaseTime', [7 * 24 * 60 * 60])
    await ethers.provider.send('evm_mine')
    tx = await baov2.mint(deployer, ethers.utils.parseEther('100'))
    await tx.wait()
    //expect(await baov2.balanceOf(deployer)).to.equal(100)

    tx = await baov2.transfer(fdp.address, ethers.utils.parseEther('100'))
    await tx.wait()

    const bal1 = await baov2.balanceOf(deployer)

    tx = await fdp.splitAllFunds()
    await tx.wait()

    expect((await baov2.balanceOf(deployer)).sub(bal1)).to.equal(ethers.utils.parseEther("50"))
    expect(await baov2.balanceOf(rando)).to.equal(ethers.utils.parseEther("25"))
    expect(await baov2.balanceOf(friendo)).to.equal(ethers.utils.parseEther("25"))
  })
})
