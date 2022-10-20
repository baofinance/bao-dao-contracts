module.exports = async ({getNamedAccounts, deployments}) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  await deploy('ERC20BAO', {
    from: deployer,
    args: ['BAO DAO Token', 'BAO', 18],
    log: true,
  })
}

module.exports.tags = ['BAOv2']
