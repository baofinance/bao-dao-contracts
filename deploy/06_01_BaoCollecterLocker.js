module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: bao_address } = await deployments.get('ERC20BAO')
  const { address: vebao_address } = await deployments.get('VotingEscrow')

  const deploy1 = await deployments.deploy('BaoCollecterLocker', {
    from: deployer,
    contract: 'BaoCollecterLocker',
    args: [bao_address, vebao_address, deployer],
    log: true,
  })
}

module.exports.tags = ['BaoCollecterLocker', 'Phase6']
module.exports.dependencies = ['BAOv2', 'veBAO']
