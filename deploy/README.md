# bao-dao-contracts/deploy

Deployment process specifcally for the BAO DAO.

## Process Overview

### 1. Initial Setup

Before deploying any of the new contracts we will wait for BAOv1 farming to end making BAO of fixed supply for a temporary amount of time, [`here`](https://etherscan.io/block/countdown/16002086) is the block number where that happens. Then a snapshot will be taken ([`snapshot code here`](https://github.com/baofinance/bao-distribution/tree/master/distribution-merkle)) of all those with locked BAOv1 up to that point in time and stored inside a merkle proof for later use in migrating/distributing to BAOv2.

### 2. Deploying process for the BAO DAO (detailed step by step commands [`here`](../DEPLOY.md))

After all the contracts are deployed with proper constructor arguments in sequence, then all the setup functions should also be called in sequence. when deploying both the [`BAO`](../contracts/ERC20BAO.vy) token and [`VotingEscrow`](../contracts/VotingEscrow.vy) token contracts the admin address of both contracts will be set to the deployer which in turn mints the new BAO token supply to the deployer address. The deployer address then sends the amount (total locked BAOv1 / 1000) of BAOv2 tokens to the [`BaoDistribution`](../contracts/BaoDistribution.sol) contract to be distributed according to the merkle proof and root formed during the snapshot in the initial setup. In the same step, the deployer sends the amount (total circulating BAOv1 / 1000) of BAOv2 tokens to the [`Swapper`](../contracts/Swapper.sol) contract in order for people to be able to swap their circulating BAOv1 tokens to the corresponding amount of BAOv2 tokens.

### 3. Result

Once everything is deployed and setup, the contracts will migrate everyone with locked and unlocked BAOv1 tokens to BAOv2 in order to be used in the new voting escrow governance system alongside liquidity gauges/BAO emissions. For the purposes of the explanation we refer to BAOv1 vs BAOv2 bu the new BAO token is still called BAO.