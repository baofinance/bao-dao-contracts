const TREASURY = '0x3dFc49e5112005179Da613BdE5973229082dAc35' // EMERGENCY RETURN
const START_TIME = 1666207259

module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: minter_address } = await deployments.get('Minter')

  // FIXME
  const admin = deployer
  //const admin = TREASURY

  const provider = await ethers.getDefaultProvider()
  const block = await provider.getBlock()
  const start_time = block.timestamp

  // baoUSD-3CRV
  const deploy1 = await deployments.deploy('LiquidityGaugeV3_baoUSD-3CRV', {
    from: deployer,
    contract: 'LiquidityGaugeV3',
    args: ['0x0FaFaFD3C393ead5F5129cFC7e0E12367088c473', minter_address, admin],
    gasLimit: 4000000,
    log: true,
  })

  // bSTBL-DAI
  const deploy2 = await deployments.deploy('LiquidityGaugeV3_bSTBL-DAI', {
    from: deployer,
    contract: 'LiquidityGaugeV3',
    args: ['0x9fC689CCaDa600B6DF723D9E47D84d76664a1F23', minter_address, admin],
    gasLimit: 4000000,
    log: true,
  })

  // BAO-ETH
  const deploy3 = await deployments.deploy('LiquidityGaugeV3_BAO-ETH', {
    from: deployer,
    contract: 'LiquidityGaugeV3',
    args: ['0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8', minter_address, admin],
    gasLimit: 4000000,
    log: true,
  })

  // TODO: after this is deployed, change the admin to the dao's multisig.
}

module.exports.tags = ['LiquidityGaugeV3', 'Minter']
module.exports.dependencies = ['BaseBurner']
