const { task } = require("hardhat/config")

task("bao:BaseBurner:changeOwner", "Change the admin of the BaseBurner contract.")
  .addParam("admin", "The new admin address to use.")
  .addParam("emergency", "The new emergency address to use.")
  .addParam("recovery", "The new recovery address to use.")
  .setAction(async (taskArgs, { network, ethers, deployments, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const accounts = await ethers.getSigners()
    const signer = accounts.find((acc) => acc.address === deployer)

    const BaseBurner_factory = await ethers.getContractFactory('BaseBurner')
    const { address: baseBurnerAddress } = await deployments.get('BaseBurner')
    const bbAbi = BaseBurner_factory.connect(signer, baseBurnerAddress).interface.format()
    const bb = new ethers.Contract(baseBurnerAddress, bbAbi, signer)

    let tx

    const owner = await bb.owner()
    if (owner.toLowerCase() === deployer.toLowerCase()) {
      const emergency = await bb.emergency_owner()
      if (emergency.toLowerCase() === deployer.toLowerCase()) {
        tx = await bb.commit_transfer_emergency_ownership(taskArgs.emergency)
        await tx.wait()
        console.log("Emergency set")
        console.log("!! accept_transfer_emergency_ownership() must be called by the new emergency signer!")
      } else {
        console.log("Cannot set emergency")
      }

      const recovery = await bb.recovery()
      if (recovery.toLowerCase() === deployer.toLowerCase()) {
        tx = await bb.set_recovery(taskArgs.recovery)
        await tx.wait()
        console.log("Recovery set")
      } else {
        console.log("Cannot set recovery")
      }

      tx = await bb.commit_transfer_ownership(taskArgs.admin)
      await tx.wait()
      console.log("Owner set")
      console.log("!! accept_transfer_ownership() must be called by the new admin signer!")
    }
  })
