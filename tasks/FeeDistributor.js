const { task } = require("hardhat/config")

task("bao:FeeDistributor:changeOwner", "Change the admin of the FeeDistributor contract.")
  .addParam("admin", "The new admin to use.")
  .setAction(async (taskArgs, { network, ethers, deployments, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const accounts = await ethers.getSigners()
    const signer = accounts.find((acc) => acc.address === deployer)

    const { address: fdAddress, abi: fdAbi } = await deployments.get('FeeDistributor')
    const fd = new ethers.Contract(fdAddress, fdAbi, signer)

    let tx

    tx = await fd.commit_admin(taskArgs.admin)
    await tx.wait()
    tx = await fd.apply_admin()
    await tx.wait()
    console.log("Admin set")
  })
