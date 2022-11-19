const TREASURY = '0x3dFc49e5112005179Da613BdE5973229082dAc35' // EMERGENCY RETURN
const START_TIME = 1666207259

module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: baov2_address } = await deployments.get('ERC20BAO')
  const { address: vebao_address } = await deployments.get('VotingEscrow')

  // FIXME
  const admin = deployer
  //const admin = TREASURY

  const returnAddress = TREASURY

  const deploy = await deployments.deploy('FeeDistributor', {
    from: deployer,
    args: [vebao_address, START_TIME, baov2_address, admin, returnAddress],
    log: true,
  })

  // TODO: after this is deployed, change the admin to the dao's multisig.
}

module.exports.tags = ['FeeDistributor', 'Phase1']
module.exports.dependencies = ['BAOv2', 'VotingEscrow']
