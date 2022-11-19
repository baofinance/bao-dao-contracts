module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: baov2_address } = await deployments.get('ERC20BAO')
  const { address: gaugeController_address } = await deployments.get('GaugeController')

  const deploy = await deployments.deploy('Minter', {
    from: deployer,
    args: [baov2_address, gaugeController_address],
    log: true,
  })
}

module.exports.tags = ['Minter', 'Phase1']
module.exports.dependencies = ['BAOv2', 'GaugeController']
