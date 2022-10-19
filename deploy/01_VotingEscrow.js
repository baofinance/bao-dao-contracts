const TREASURY = "0x3dFc49e5112005179Da613BdE5973229082dAc35"

module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: baov2_address } = await deployments.get('ERC20BAO')

  const deploy = await deployments.deploy('VotingEscrow', {
    from: deployer,
    args: [baov2_address, 'Vote Escrowed BAO', 'veBAO', "0.2.4"],
    log: true,
  })

  //const veBAO_factory = ethers.getContractFactory('VotingEscrow')
  //const veBAO = veBAO_factory.connect(deploy.address, deployer)
}

module.exports.tags = ['veBAO']
module.exports.dependencies = ['BAOv2']
