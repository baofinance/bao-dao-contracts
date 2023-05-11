//const SAFE = '0xFC69e0a5823E2AfCBEb8a35d33588360F1496a00'

module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: baov2_address } = await deployments.get('ERC20BAO')

  const fdpDeploy = await deployments.deploy('FeeDistributorProxy', {
    from: deployer,
    args: [
      deployer,
      deployer,
      baov2_address,
      ethers.utils.parseEther('0.5'),
      ethers.utils.parseEther('0.25'),
      ethers.utils.parseEther('0.25'),
    ],
    log: true,
  })
}

module.exports.tags = ['Phase5', 'FeeDistributorProxy']
module.exports.dependencies = ['BAOv2']
