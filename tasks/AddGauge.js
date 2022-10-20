const { task } = require("hardhat/config")

task("addGauge", "Add a gauge to the controller.")
  .addParam("gauge", "The deployed gauge from deploy/*_LiquidityGaugeV3.js")
  .addParam("weight", "The weight of the gauge we're setting up")

  .setAction(async (taskArgs, { network, ethers, deployments, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const accounts = await ethers.getSigners()
    //console.log(accounts)
    const signer = accounts.find((acc) => acc.address === deployer)

    const { address: gaugeAddress } = await deployments.get(`LiquidityGaugeV3_${taskArgs.gauge}`)

    if (!gaugeAddress) {
      throw new Error(`No deployed gauge for ${taskArgs.gauge}`)
    }

    try {
      parseInt(taskArgs.weight)
    } catch {
      throw new Error(`Cannot parseInt for ${taskArgs.weight}`)
    }

    const GaugeController_factory = await ethers.getContractFactory('GaugeController')
    const { address: gaugeControllerAddress } = await deployments.get('GaugeController')
    const controller_abi = GaugeController_factory.connect(signer, gaugeControllerAddress).interface.format()

    const controller = new ethers.Contract(gaugeControllerAddress, controller_abi, signer)

    //console.log(controller)

    //console.log(await controller.token())
    const tx = await controller['add_gauge(address,int128,uint256)'](gaugeAddress, 0, parseInt(taskArgs.weight))
    console.log(tx)
    return tx.wait()
  });
