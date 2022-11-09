const TREASURY = '0x3dFc49e5112005179Da613BdE5973229082dAc35'
const MERKLE_ROOT = '0x4ed873ef8243a2b4efe73caaffeec8c2577bbf26320a67dc8a8f9c7dab3cd4bd'

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

module.exports.tags = ['BaoDistribution']
module.exports.dependencies = ['BAOv2', 'veBAO']

