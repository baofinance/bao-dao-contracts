const TREASURY = '0x3dFc49e5112005179Da613BdE5973229082dAc35'

module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: feeDistributor_address } = await deployments.get('FeeDistributor')

  const recoveryAddress = TREASURY

  const owner = deployer
  //const owner = TREASURY

  const emergencyOwner = TREASURY

  const deploy = await deployments.deploy('BaseBurner', {
    from: deployer,
    args: [feeDistributor_address, recoveryAddress, "0x632e6920B7c443D92052442e0F230355099a9989", emergencyOwner],
    log: true,
  })

  // TODO: after this is deployed, change the owner to the dao's multisig.
}

module.exports.tags = ['BaseBurner', 'Phase2']
module.exports.dependencies = ['FeeDistributor']
