const TREASURY = "0x3dFc49e5112005179Da613BdE5973229082dAc35"

module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: baov2_address } = await deployments.get('ERC20BAO')

  await deployments.deploy('VotingEscrow', {
    from: deployer,
    args: [baov2_address, 'Vote Escrowed BAO', 'veBAO', "0.2.4"],
    log: true,
  })
}

module.exports.tags = ['veBAO', 'Phase1']
module.exports.dependencies = ['BAOv2']
