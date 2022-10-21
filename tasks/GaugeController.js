const { task } = require("hardhat/config")

task("bao:GaugeController:addGauge", "Add a gauge to the controller.")
  .addParam("gauge", "The deployed gauge from deploy/*_LiquidityGaugeV3.js")
  .addParam("weight", "The weight of the gauge we're setting up")
  .addParam("type", "The index of the gauge type (previously setup) on the controller")

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
      throw new Error(`Cannot parseInt for 'weight'=${taskArgs.weight}`)
    }
    try {
      parseInt(taskArgs.type)
    } catch {
      throw new Error(`Cannot parseInt for 'type'=${taskArgs.type}`)
    }

    const GaugeController_factory = await ethers.getContractFactory('GaugeController')
    const { address: gaugeControllerAddress } = await deployments.get('GaugeController')
    const controllerAbi = GaugeController_factory.connect(signer, gaugeControllerAddress).interface.format()

    const controller = new ethers.Contract(gaugeControllerAddress, controllerAbi, signer)

    //console.log(controller)

    let tx
    tx = await controller['add_gauge(address,int128,uint256)'](gaugeAddress, parseInt(taskArgs.type), parseInt(taskArgs.weight))
    await tx.wait()

    return
  });


task("bao:GaugeController:addGaugeType", "Add a gauge type to the controller.")
  .addParam("name", "The name of the type")
  .addParam("weight", "The weight of the type we're setting up")

  .setAction(async (taskArgs, { network, ethers, deployments, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const accounts = await ethers.getSigners()
    const signer = accounts.find((acc) => acc.address === deployer)
    try {
      parseInt(taskArgs.weight)
    } catch {
      throw new Error(`Cannot parseInt for ${taskArgs.weight}`)
    }

    const GaugeController_factory = await ethers.getContractFactory('GaugeController')
    const { address: gaugeControllerAddress } = await deployments.get('GaugeController')
    const controllerAbi = GaugeController_factory.connect(signer, gaugeControllerAddress).interface.format()
    const controller = new ethers.Contract(gaugeControllerAddress, controllerAbi, signer)

    let tx
    tx = await controller['add_type(string,uint256)'](taskArgs.name, parseInt(taskArgs.weight))
    await tx.wait()
    return
  });


task("bao:GaugeController:changeOwner", "Change the admin of the GaugeController contract.")
  .addParam("admin", "The new admin to use.")
  .setAction(async (taskArgs, { network, ethers, deployments, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const accounts = await ethers.getSigners()
    const signer = accounts.find((acc) => acc.address === deployer)

    const GaugeController_factory = await ethers.getContractFactory('GaugeController')
    const { address: gaugeControllerAddress } = await deployments.get('GaugeController')
    const gcAbi = GaugeController_factory.connect(signer, gaugeControllerAddress).interface.format()
    const gc = new ethers.Contract(gaugeControllerAddress, gcAbi, signer)

    let tx

    tx = await gc.commit_transfer_ownership(taskArgs.admin)
    await tx.wait()
    tx = await gc.apply_transfer_ownership()
    await tx.wait()
    console.log("Owner set")
  })
