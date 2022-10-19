module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: baov2_address } = await deployments.get('ERC20BAO')
  const { address: vebao_address } = await deployments.get('VotingEscrow')

  const deploy = await deployments.deploy('GaugeController', {
    from: deployer,
    args: [baov2_address, vebao_address],
    log: true,
  })
}

module.exports.tags = ['GaugeController']
module.exports.dependencies = ['BAOv2', 'veBAO']
