const MULTISIG_SAFE = "0x3dFc49e5112005179Da613BdE5973229082dAc35"

module.exports = async ({getNamedAccounts, deployments, ethers}) => {
  const { deployer } = await getNamedAccounts()

  const { address: minter_address } = await deployments.get('Minter')

  const GAS_PRICE = 15000000000
  const GAS_LIMIT = 3586103

  // FIXME
  const admin = MULTISIG_SAFE
  //const admin = TREASURY

  //const provider = await ethers.getDefaultProvider()
  //const block = await provider.getBlock()
  //const start_time = block.timestamp

  const deploy1 = await deployments.deploy('LiquidityGaugeV3_bETH-B-baoETH-ETH-BPT', {
    from: deployer,
    contract: 'LiquidityGaugeV3',
    args: ['0x0bbc7b78ff8453c40718e290b33f1d00ee67274e', minter_address, admin],
    gasPrice: GAS_PRICE,
    gasLimit: GAS_LIMIT,
    log: true,
  })

  // TODO: after this is deployed, change the admin to the dao's multisig.
}

module.exports.tags = ['LiquidityGaugeV3', 'Phase7']
//module.exports.dependencies = ['Minter']
