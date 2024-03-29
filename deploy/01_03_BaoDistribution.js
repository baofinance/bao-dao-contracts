const TREASURY = '0x3dFc49e5112005179Da613BdE5973229082dAc35'
const MERKLE_ROOT = '0xbc39affb2a6f4c1e539660ab71ae1554d613a42413e154a6223dd7c868432e58'

module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: baov2_address } = await deployments.get('ERC20BAO')
  const { address: vebao_address } = await deployments.get('VotingEscrow')

  const deploy = await deployments.deploy('BaoDistribution', {
    from: deployer,
    args: [baov2_address, vebao_address, MERKLE_ROOT, TREASURY],
    log: true,
  })
}

module.exports.tags = ['BaoDistribution', 'Phase1']
module.exports.dependencies = ['BAOv2', 'veBAO']

