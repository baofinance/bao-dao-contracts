const MULTISIG_SAFE = "0x3dFc49e5112005179Da613BdE5973229082dAc35"

module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: minter_address } = await deployments.get('Minter')

  const GAS_PRICE = 45000000000
  const GAS_LIMIT = 3586103

  // FIXME
  const admin = MULTISIG_SAFE
  //const admin = TREASURY

  //const provider = await ethers.getDefaultProvider()
  //const block = await provider.getBlock()
  //const start_time = block.timestamp

  const deploy1 = await deployments.deploy('LiquidityGaugeV3_baoUSD-LUSD', {
    from: deployer,
    contract: 'LiquidityGaugeV3',
    args: ['0x7E9AfD25F5Ec0eb24d7d4b089Ae7EcB9651c8b1F', minter_address, admin],
    gasPrice: GAS_PRICE,
    gasLimit: GAS_LIMIT,
    log: true,
  })

  const deploy2 = await deployments.deploy('LiquidityGaugeV3_baoETH-ETH', {
    from: deployer,
    contract: 'LiquidityGaugeV3',
    args: ['0x1A44E35d5451E0b78621A1B3e7a53DFaA306B1D0', minter_address, admin],
    gasPrice: GAS_PRICE,
    gasLimit: GAS_LIMIT,
    log: true,
  })

  const deploy3 = await deployments.deploy('LiquidityGaugeV3_BAO.baoUSD-LUSD', {
    from: deployer,
    contract: 'LiquidityGaugeV3',
    args: ['0x08cc92fedc1ce2d8525176a63fcff404450f2998', minter_address, admin],
    gasPrice: GAS_PRICE,
    gasLimit: GAS_LIMIT,
    log: true,
  })

  const deploy4 = await deployments.deploy('LiquidityGaugeV3_BAO.baoETH-WETH', {
    from: deployer,
    contract: 'LiquidityGaugeV3',
    args: ['0x3B9Fb87F7d081CEDdb1289258FA5660d955317b6', minter_address, admin],
    gasPrice: GAS_PRICE,
    gasLimit: GAS_LIMIT,
    log: true,
  })

  const deploy5 = await deployments.deploy('LiquidityGaugeV3_bETH.baoETH-ETH', {
    from: deployer,
    contract: 'LiquidityGaugeV3',
    args: ['0x505a889b08b4295ef5412c7b2f9ef8c6fc60e533', minter_address, admin],
    gasPrice: GAS_PRICE,
    gasLimit: GAS_LIMIT,
    log: true,
  })

  // TODO: after this is deployed, change the admin to the dao's multisig.
}

module.exports.tags = ['LiquidityGaugeV3', 'Phase6']
//module.exports.dependencies = ['Minter']
