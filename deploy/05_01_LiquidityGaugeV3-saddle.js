const TREASURY = '0x3dFc49e5112005179Da613BdE5973229082dAc35' // EMERGENCY RETURN

module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: minter_address } = await deployments.get('Minter')

  // FRAXBP-baoUSD
  const deploy1 = await deployments.deploy('LiquidityGaugeV3_FRAXBP-baoUSD', {
    from: deployer,
    contract: 'LiquidityGaugeV3',
    args: ['0x67e07a06425e862c6ec922a9a54bcb10bc97720d', minter_address, TREASURY],
    gasPrice: 30000000000,
    //gasLimit: 4000000,
    log: true,
  })
}

module.exports.tags = ['LiquidityGaugeV3', 'Phase5', 'Saddle']
module.exports.dependencies = ['Minter']
