module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: baov2_address } = await deployments.get('ERC20BAO')

  const deploy = await deployments.deploy('Swapper', {
    from: deployer,
    args: [baov2_address],
    log: true,
  })
}

module.exports.tags = ['Swapper', 'Phase1']
module.exports.dependencies = ['BAOv2']

