const TREASURY = '0x3dFc49e5112005179Da613BdE5973229082dAc35' // EMERGENCY RETURN
const START_TIME = 1666207259

module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: minter_address } = await deployments.get('Minter')

  // FIXME
  //const admin = deployer
  //const admin = TREASURY
  const admin = '0x632e6920B7c443D92052442e0F230355099a9989'

  //const provider = await ethers.getDefaultProvider()
  //const block = await provider.getBlock()
  //const start_time = block.timestamp

  // baoUSD-3CRV
  const deploy1 = await deployments.deploy('LiquidityGaugeV3_baoUSD-3CRV', {
    from: deployer,
    contract: 'LiquidityGaugeV3',
    args: ['0x0fafafd3c393ead5f5129cfc7e0e12367088c473', minter_address, admin],
    //gasLimit: 4000000,
    log: true,
  })

  // bSTBL-DAI
  const deploy2 = await deployments.deploy('LiquidityGaugeV3_bSTBL-DAI', {
    from: deployer,
    contract: 'LiquidityGaugeV3',
    args: ['0x7657ceb382013f1ce9ac7b08dd8db4f28d3a7538', minter_address, admin],
    //gasLimit: 4000000,
    log: true,
  })

  // BAO-ETH
  const deploy3 = await deployments.deploy('LiquidityGaugeV3_BAO-ETH', {
    from: deployer,
    contract: 'LiquidityGaugeV3',
    args: ['0x8d7443530d6B03c35C9291F9E43b1D18B9cFa084', minter_address, admin],
    //gasLimit: 4000000,
    log: true,
  })

  // TODO: after this is deployed, change the admin to the dao's multisig.
}

module.exports.tags = ['LiquidityGaugeV3', 'Phase3']
module.exports.dependencies = ['Minter']
