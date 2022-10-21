const { task } = require("hardhat/config")

task("bao:VotingEscrow:changeOwner", "Set the smart wallet checker, distribution contract, and ownership.")
  .addParam("admin", "The new admin to own the VE contract.")
  .setAction(async (taskArgs, { network, ethers, deployments, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const accounts = await ethers.getSigners()
    const signer = accounts.find((acc) => acc.address === deployer)

    const { address: veAddress, abi: veAbi } = await deployments.get('VotingEscrow')
    const ve = new ethers.Contract(veAddress, veAbi, signer)

    let tx

    const { address: swwAddress } = await deployments.get('SmartWalletWhitelist')
    tx = await ve.commit_smart_wallet_checker(swwAddress)
    await tx.wait()
    tx = await ve.apply_smart_wallet_checker()
    await tx.wait()
    console.log("Setup: smart wallet whitelist")

    const { address: distributionAddress } = await deployments.get('BaoDistribution')
    tx = await ve.commit_distr_contract(distributionAddress)
    await tx.wait()
    tx = await ve.apply_distr_contract()
    await tx.wait()
    console.log("Setup: distribution contract")

    tx = await ve.commit_transfer_ownership(taskArgs.admin)
    await tx.wait()
    tx = await ve.apply_transfer_ownership()
    await tx.wait()
    console.log("Ownership transferred")
  })
