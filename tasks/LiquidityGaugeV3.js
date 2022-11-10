const { task } = require("hardhat/config")

task("bao:LiquidityGaugeV3:changeOwner", "Change the admin of a LiquidityGaugeV3 contract deployment.")
  .addParam("gauge", "The depoloyment name of a deployed gauge.")
  .addParam("admin", "The new admin to use.")
  .setAction(async (taskArgs, { network, ethers, deployments, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const accounts = await ethers.getSigners()
    const signer = accounts.find((acc) => acc.address === deployer)

    const { address: gaugeAddress, abi: gaugeAbi } = await deployments.get(`LiquidityGaugeV3_${taskArgs.gauge}`)
    const gauge = new ethers.Contract(gaugeAddress, gaugeAbi, signer)

    let tx

    tx = await gauge.commit_transfer_ownership(taskArgs.admin)
    await tx.wait()
    console.log("Ownership transfer set")
    console.log("!! accept_transfer_ownership() must be called by the new admin signer!")
  })