const { task } = require("hardhat/config")

task("bao:ERC20BAO:changeOwner", "Set the minter as the minter contract and change the admin.")
  .addParam("admin", "The new admin to use.")
  .setAction(async (taskArgs, { network, ethers, deployments, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const accounts = await ethers.getSigners()
    const signer = accounts.find((acc) => acc.address === deployer)

    const { address: baoAddress, abi: baoAbi } = await deployments.get('ERC20BAO')
    const bao = new ethers.Contract(baoAddress, baoAbi, signer)

    let tx

    const { address: minterAddress } = await deployments.get('Minter')
    tx = await bao.set_minter(minterAddress)
    await tx.wait()
    tx = await bao.set_admin(taskArgs.admin)
    await tx.wait()
  })


task("bao:ERC20BAO:transfer", "Send BAOv2 from a named account to a deployed contract.")
  .addParam("from", "The named account to send it from.")
  .addParam("to", "The deployed contract to send it to.")
  .addParam("amount", "The amount to send.")
  .setAction(async (taskArgs, { network, ethers, deployments, getNamedAccounts }) => {
    try {
      parseInt(taskArgs.amount)
    } catch {
      throw new Error(`Cannot parseInt for 'amount'=${taskArgs.amount}`)
    }

    const namedAccounts = await getNamedAccounts()
    const accounts = await ethers.getSigners()
    const signer = accounts.find((acc) => acc.address === namedAccounts[taskArgs.from])

    const { address: baoAddress, abi: baoAbi } = await deployments.get('ERC20BAO')
    const bao = new ethers.Contract(baoAddress, baoAbi, signer)

    const { address: toAddress } = await deployments.get(taskArgs.to)

    console.log("Sending BAOv2...")
    console.log(`  _old_ balance:from:${taskArgs.from}`, (await bao.balanceOf(signer.address)).toString())
    console.log(`  _old_ balance:to:${taskArgs.to}`, (await bao.balanceOf(toAddress)).toString())

    let tx
    tx = await bao.transfer(toAddress, taskArgs.amount)
    await tx.wait()

    console.log("Sent BAOv2!!!")
    console.log(`  NEW balance:from:${taskArgs.from}`, (await bao.balanceOf(signer.address)).toString())
    console.log(`  NEW balance:to:${taskArgs.to}`, (await bao.balanceOf(toAddress)).toString())
  })
