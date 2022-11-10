# bao-dao-contracts/contracts

All contracts used in the governance of BAO DAO.

## Subdirectories

* [`burners`](burners): Contracts used to convert fees into baoUSD prior to the fee distribution to veBAO holders, if they are not already collected in baoUSD
* [`gauges`](gauges): Contracts used for measuring provided liquidity, to incentivized liquidity pools.
* [`testing`](testing): Contracts used exclusively for testing. Not considered to be a core part of this project.

## Contracts

* [`BaoDistribution`](BaoDistribution.sol): The Bao Distribution contract used to handle the migration and distribution of locked BAO from the old governance system under the [`BAOv1`](https://etherscan.io/address/0x374cb8c27130e2c9e04f44303f3c8351b9de61c1#code) token to the new [`BAOv2`](ERC20BAO.vy) token
* [`ERC20BAO`](ERC20BAO.vy): BAO DAO Token (BAO), an [ERC20](https://eips.ethereum.org/EIPS/eip-20) token with a piecewise-linear minting supply used in the BAO voting escrow governance protocol
* [`FeeDistributor`](FeeDistributor.vy): Used to determine the amount of fees in baoUSD to be distributed to each veBAO lock holder in proportion to the amount of veBAO they have, claimable once every week (7 days)
* [`GaugeController`](GaugeController.vy): Controls the liquidity gauges, facilitates voting on gauge weights, and handles the issuance of new BAO tokens to the liquidity gauges
* [`GaugeProxy`](GaugeProxy.vy): used for indirect ownership of the liquidity gauges
* [`LiquidityGauge`](LiquidityGaugeV3.vy): Measures the amount of liquidity provided by each user, to an incentivized pool
* [`Minter`](Minter.vy): Token minting contract used for issuing new BAO
* [`SmartWalletWhitelist`](SmartWalletWhitelist.sol): Whitelist contract for allowing non EOA accounts to lock into veBAO
* [`Swapper`](Swapper.sol): Contract used to swap circulating [`BAOv1`](https://etherscan.io/address/0x374cb8c27130e2c9e04f44303f3c8351b9de61c1#code) to [`BAOv2`](ERC20BAO.vy) tokens reduced by a factor of 1000
* [`VotingEscrow`](VotingEscrow.vy): Vesting contract used for locking BAO (veBAO) to participate in DAO governance, both on chain gauge voting and snapshot votes