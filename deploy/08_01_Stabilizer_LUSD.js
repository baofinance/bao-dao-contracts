const MULTISIG_SAFE = "0x3dFc49e5112005179Da613BdE5973229082dAc35"

module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const GAS_PRICE = 25000000000
  const GAS_LIMIT = 1619735

  // FIXME
  //const admin = TREASURY

  //const provider = await ethers.getDefaultProvider()
  //const block = await provider.getBlock()
  //const start_time = block.timestamp

  const deploy1 = await deployments.deploy('Stabilizer_LUSD', {
    from: deployer,
    contract: 'Stabilizer',
    args: [
      '0x7945b0A6674b175695e5d1D08aE1e6F13744Abb0',
      '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
      ethers.BigNumber.from('100'), // 1%
      ethers.BigNumber.from('100'), // 1%
      ethers.BigNumber.from('500000000000000000000000'),
    ],
    gasPrice: GAS_PRICE,
    gasLimit: GAS_LIMIT,
    log: true,
  })

  // TODO: after this is deployed, change the admin to the dao's multisig.
}

module.exports.tags = ['Stabilizer', 'Ballast', 'Phase8']
//module.exports.dependencies = ['Minter']
