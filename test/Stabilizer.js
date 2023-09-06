const { ethers, deployments, getNamedAccounts, getUnnamedAccounts } = require("hardhat")
const { expect } = require("chai")

describe("Stabilizer contract", function () {
  it("Should deploy", async function () {
    const { deployer } = await getNamedAccounts()

    await deployments.fixture(["Stabilizer_LUSD"])
  })
})
