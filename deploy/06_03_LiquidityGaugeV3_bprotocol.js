module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: bao_address } = await deployments.get('ERC20BAO')
  const { address: minter_address } = await deployments.get('Minter_GaugeSplit')

  const deploy1 = await deployments.deploy('LiquidityGaugeV3_bprotocol', {
    from: deployer,
    contract: 'LiquidityGaugeV3',
    args: [bao_address, minter_address, deployer],
    log: true,
  })
}

module.exports.tags = ['LiquidityGaugeV3_bprotocol', 'Phase6']
module.exports.dependencies = ['BAOv2', 'Minter_GaugeSplit', 'BaoCollecterLocker']
