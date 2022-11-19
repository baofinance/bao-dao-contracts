module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: veAddress } = await deployments.get('VotingEscrow')
  const { address: distributionAddress } = await deployments.get('BaoDistribution')

  await deployments.deploy('SmartWalletWhitelist', {
    from: deployer,
    args: [veAddress, distributionAddress],
    log: true,
  })
}

module.exports.tags = ['SmartWalletWhitelist', 'Phase2']
module.exports.dependencies = ['VotingEscrow', 'BaoDistribution']
