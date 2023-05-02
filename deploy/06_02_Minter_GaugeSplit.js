module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: baov2_address } = await deployments.get('ERC20BAO')
  const { address: gaugeController_address } = await deployments.get('GaugeController')

  const deploy = await deployments.deploy('Minter_GaugeSplit', {
    from: deployer,
    args: [baov2_address, gaugeController_address],
    log: true,
  })
}

module.exports.tags = ['Minter_GaugeSplit', 'Phase6']
module.exports.dependencies = ['BAOv2', 'GaugeController']
