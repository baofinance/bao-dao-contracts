const SAFE = '0xFC69e0a5823E2AfCBEb8a35d33588360F1496a00'
//const SAFE = '0x3dFc49e5112005179Da613BdE5973229082dAc35'
const FED_ADMIN = '0xFC69e0a5823E2AfCBEb8a35d33588360F1496a00'
const MINT_LIMIT = "1000000000000000000000"
const BALLAST_SUPPLY = "200000000000000000000"

module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  let tx


  // comptroller and unitroller
  const comptrollerDeploy = await deployments.deploy('comptroller-baoETH', {
    from: deployer,
    contract: 'Comptroller',
    args: [],
    log: true,
  })
  let comptroller = new ethers.Contract(comptrollerDeploy.address, comptrollerDeploy.abi, await ethers.getSigner(deployer))


  const unitrollerDeploy = await deployments.deploy('unitroller-baoETH', {
    from: deployer,
    contract: 'contracts/markets/Comptroller/Unitroller.sol:Unitroller',
    args: [],
    log: true,
  })
  const unitroller = new ethers.Contract(unitrollerDeploy.address, unitrollerDeploy.abi, await ethers.getSigner(deployer))


  console.log("Becoming the unitroller as the comptroller...")
  tx = await unitroller._setPendingImplementation(comptroller.address)
  await tx.wait()
  tx = await comptroller._become(unitroller.address)
  await tx.wait()
  console.log("... became!")
  comptroller = new ethers.Contract(unitrollerDeploy.address, comptrollerDeploy.abi, await ethers.getSigner(deployer))


  const oracleDeploy = await deployments.deploy('oracle-baoETH', {
    from: deployer,
    contract: 'contracts/InverseFinance/Oracle.sol:Oracle',
    args: [],
    log: true,
  })
  const oracle = new ethers.Contract(oracleDeploy.address, oracleDeploy.abi, await ethers.getSigner(deployer))


  // baoETH
  const baoETHDeploy = await deployments.deploy('baoETH', {
    from: deployer,
    contract: 'contracts/markets/ERC20.sol:ERC20',
    args: ['Bao ETH', 'baoETH', 18],
    log: true,
  })
  const baoETH = new ethers.Contract(baoETHDeploy.address, baoETHDeploy.abi, await ethers.getSigner(deployer))


  //console.log("Setting baoETH's admin to be the DAO treasury...")
  //tx = await baoETH.setPendingOperator(SAFE)
  //await tx.wait()
  //console.log("... set! Now the treasury must call claimOperator().")

  // TODO:
  // check interest rate model numbers
  // check initial numbers for setting up market (collateral factor, IMF factor)


  // bao deposited baoETH - bdbaoETH
  const bdbaoETHDeploy = await deployments.deploy('bdbaoETH', {
    from: deployer,
    contract: 'CErc20Delegator',
    args: [
      baoETHDeploy.address,                         // underlying
      unitrollerDeploy.address,                     // unitroller
      '0x681Cf55f0276126FAD8842133C839AB4D607E729', // interest rate model (JumpRateModelV2)
      '200000000000000000',                         // initial exchange rate mantissa
      'bao deposited baoETH',                       // name
      'bdbaoETH',                                   // symbol
      '8',                                          // decimals
      '0xDb3401beF8f66E7f6CD95984026c26a4F47eEe84', // delegate implementation
      0, // become implementation data
    ],
    log: true,
  })
  const bdbaoETH = new ethers.Contract(bdbaoETHDeploy.address, bdbaoETHDeploy.abi, await ethers.getSigner(deployer))


  const bdEtherDeploy = await deployments.deploy('bdETH', {
    from: deployer,
    contract: 'CEther',
    args: [
      unitrollerDeploy.address,                     // unitroller
      '0xfbc3995AADfAf39896CEAE3d8aAa3AFd1dE261Ad', // interest rate model (WhitePaperInterestRateModel)
      '200000000000000000',                         // initial exchange rate mantissa
      'bao deposited Ether',                        // name
      'bdETH',                                      // symbol
      '8',                                          // decimals
    ],
    log: true,
  })
  const bdEther = new ethers.Contract(bdEtherDeploy.address, bdEtherDeploy.abi, await ethers.getSigner(deployer))


  const bdbETHDeploy = await deployments.deploy('bdbETH', {
    from: deployer,
    contract: 'CErc20Delegator',
    args: [
      '0xa1e3F062CE5825c1e19207cd93CEFdaD82A8A631', // underlying
      unitrollerDeploy.address,                     // unitroller
      '0xfbc3995AADfAf39896CEAE3d8aAa3AFd1dE261Ad', // interest rate model (WhitePaperInterestRateModel)
      '200000000000000000',                         // initial exchange rate mantissa
      'bao deposited bETH',                         // name
      'bdbETH',                                     // symbol
      '8',                                          // decimals
      '0xDb3401beF8f66E7f6CD95984026c26a4F47eEe84', // delegate implementation
      0, // become implementation data
    ],
    log: true,
  })
  const bdbETH = new ethers.Contract(bdbETHDeploy.address, bdbETHDeploy.abi, await ethers.getSigner(deployer))


  const bdbSTBLDeploy = await deployments.deploy('bdbSTBL', {
    from: deployer,
    contract: 'CErc20Delegator',
    args: [
      '0x5ee08f40b637417bcC9d2C51B62F4820ec9cF5D8', // underlying
      unitrollerDeploy.address,                     // unitroller
      '0x681Cf55f0276126FAD8842133C839AB4D607E729', // interest rate model (WhitePaperInterestRateModel)
      '200000000000000000',                         // initial exchange rate mantissa
      'bao deposited bSTBL',                        // name
      'bdbSTBL',                                    // symbol
      '8',                                          // decimals
      '0xDb3401beF8f66E7f6CD95984026c26a4F47eEe84', // delegate implementation
      0, // become implementation data
    ],
    log: true,
  })
  const bdbSTBL = new ethers.Contract(bdbSTBLDeploy.address, bdbSTBLDeploy.abi, await ethers.getSigner(deployer))


  console.log("Setting up price oracle...")
  tx = await oracle.setFeed(bdbaoETH.address, "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419", "18");
  await tx.wait();
  tx = await oracle.setFeed(bdEther.address, "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419", "18");
  await tx.wait();
  tx = await oracle.setFeed(bdbSTBL.address, "0x4626CEB86aBF6B239e3306382Cca44e5B7113160", "18");
  await tx.wait();


  console.log("Setting up baoETH market with collateral of [ETH, bETH, bSTBL]...")
  tx = await comptroller._setPriceOracle(oracle.address)
  await tx.wait()
  tx = await comptroller._setCloseFactor("500000000000000000")
  await tx.wait()
  tx = await comptroller._setLiquidationIncentive("1100000000000000000")
  await tx.wait()
  tx = await comptroller._supportMarket(bdbaoETH.address)
  await tx.wait()
  tx = await comptroller._supportMarket(bdEther.address)
  await tx.wait()
  tx = await comptroller._supportMarket(bdbETH.address)
  await tx.wait()
  tx = await comptroller._supportMarket(bdbSTBL.address)
  await tx.wait()
  tx = await comptroller._setCollateralFactor(bdbaoETH.address, "250000000000000000")
  await tx.wait()
  tx = await comptroller._setCollateralFactor(bdEther.address, "900000000000000000")
  await tx.wait()
  tx = await comptroller._setCollateralFactor(bdbETH.address, "900000000000000000")
  await tx.wait()
  tx = await comptroller._setCollateralFactor(bdbSTBL.address, "750000000000000000")
  await tx.wait()
  tx = await comptroller._setIMFFactor(bdbaoETH.address, "40000000000000000")
  await tx.wait()
  tx = await comptroller._setIMFFactor(bdEther.address, "40000000000000000")
  await tx.wait()
  tx = await comptroller._setIMFFactor(bdbETH.address, "40000000000000000")
  await tx.wait()
  tx = await comptroller._setIMFFactor(bdbSTBL.address, "40000000000000000")
  await tx.wait()
  tx = await comptroller._setMarketBorrowCaps([bdbaoETH.address], [MINT_LIMIT])
  await tx.wait()
  tx = await comptroller._setBorrowRestriction([bdbaoETH.address], [false])
  await tx.wait()
  console.log("... supported!")

  console.log("Setting reserve factors...")
  tx = await bdbaoETH._setReserveFactor("500000000000000000")
  await tx.wait()
  tx = await bdEther._setReserveFactor("500000000000000000")
  await tx.wait()
  tx = await bdbETH._setReserveFactor("500000000000000000")
  await tx.wait()
  tx = await bdbSTBL._setReserveFactor("500000000000000000")
  await tx.wait()
  console.log("... set!")

  //console.log("Setting bdbaoETH's admin to be the DAO treasury...")
  //tx = await bdbaoETH._setPendingAdmin(SAFE)
  //await tx.wait()
  //console.log("... set! Now the treasury must call _acceptAdmin().")


  const fedDeploy = await deployments.deploy('Fed-bdbaoETH', {
    from: deployer,
    contract: 'contracts/InverseFinance/Fed.sol:Fed',
    args: [bdbaoETHDeploy.address],
    log: true,
  })
  const fed = new ethers.Contract(fedDeploy.address, fedDeploy.abi, await ethers.getSigner(deployer))

  console.log("Adding the fed as a minter...")
  tx = await baoETH.addMinter(fedDeploy.address)
  await tx.wait()
  console.log("... added!")

  //TODO: needs the comptroller to start supporting the market first
  console.log("Expanding the fed")
  tx = await fed.expansion(MINT_LIMIT)
  await tx.wait()
  console.log("... expanded!")

  console.log("Accruing interest...")
  tx = await bdbaoETH.accrueInterest()
  await tx.wait()
  tx = await bdEther.accrueInterest()
  await tx.wait()
  console.log("... accrued!")

  //console.log("Setting fed admin...")
  //tx = await fed.changeGov(FED_ADMIN)
  //await tx.wait()
  //tx = await fed.changeChair(FED_ADMIN)
  //await tx.wait()
  //console.log("... set!")


  const ballastDeploy = await deployments.deploy('Ballast-baoETH', {
    from: deployer,
    contract: 'Stabilizer',
    args: [
      baoETHDeploy.address,                         // synthetic
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // non-synth
      100,                                          // buy fee (1%)
      100,                                          // sell fee (1%)
      BALLAST_SUPPLY,                  // supply cap
    ],
    log: true,
  })

  console.table([
    { name: 'comptroller', address: comptrollerDeploy .address },
    { name: 'unitroller' , address: unitrollerDeploy  .address },
    { name: 'oracle' ,     address: oracleDeploy      .address },
    { name: 'baoETH'     , address: baoETHDeploy      .address },
    { name: 'fed'        , address: fedDeploy         .address },
    { name: 'ballast'    , address: ballastDeploy     .address },
    { name: 'bdbaoETH'   , address: bdbaoETHDeploy    .address },
    { name: 'bdEther'    , address: bdEtherDeploy     .address },
    { name: 'bdbETH'     , address: bdbETHDeploy      .address },
    { name: 'bdbSTBL'    , address: bdbSTBLDeploy     .address },
  ])
}

module.exports.tags = ['Phase4', 'baoETH']
module.exports.dependencies = []
