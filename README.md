# bao-dao-contracts

Vyper contracts used in [Bao](https://bao.finance/) Governance.

## Overview

Bao Finance consists of multiple smart contracts connected by [Aragon](https://github.com/aragon/aragonOS). Interaction with Aragon occurs through a [modified implementation](https://github.com/curvefi/curve-aragon-voting) of the [Aragon Voting App](https://github.com/aragon/aragon-apps/tree/master/apps/voting) implemented by Curve Finance. Aragon's standard one token, one vote method is replaced with a weighting system based on locking tokens. Bao Finance has a token (BAO) which is used for both governance and value accrual, parellel to the operation of our synthetic asset markets.

View the [documentation](https://docs.bao.finance/) for a more in-depth explanation of how Bao Finance works.

## Testing and Development

### Dependencies

- [python3](https://www.python.org/downloads/release/python-368/) version 3.6 or greater, python3-dev (3.8 recommended)
- [vyper](https://github.com/vyperlang/vyper) version [0.2.4](https://github.com/vyperlang/vyper/releases/tag/v0.2.4)
- [brownie](https://github.com/iamdefinitelyahuman/brownie) - tested with version [1.17.2](https://github.com/eth-brownie/brownie/releases/tag/v1.17.2)
- [brownie-token-tester](https://github.com/iamdefinitelyahuman/brownie-token-tester) - tested with version [0.3.2](https://github.com/iamdefinitelyahuman/brownie-token-tester/releases/tag/v0.3.2)
- [ganache-cli](https://github.com/trufflesuite/ganache-cli) - tested with version [6.12.1](https://github.com/trufflesuite/ganache-cli/releases/tag/v6.12.1)

### Setup

To get started, first create and initialize a Python [virtual environment](https://docs.python.org/3/library/venv.html). Next, clone the repo and install the developer dependencies:

```bash
git clone git@github.com:baofinance/bao-dao-contracts.git
cd bao-dao-contracts
pip install -r requirements.txt
```

### Running the Tests

The test suite is split between [unit](tests/unitary) and [integration](tests/integration) tests. To run the entire suite:

```bash
brownie test
```

To run only the unit tests or integration tests:

```bash
brownie test tests/unitary
brownie test tests/integration
```

## Deployment

See the [deployment documentation](README-DEPLOY.md) for detailed information on how to deploy Bao Finance Governance.

## Audits and Security

TBD - yet to be audited

There is an active [bug bounty](https://immunefi.com/bounty/baofinance/) for issues which can lead to substantial loss of money, critical bugs such as a broken live-ness condition, or irreversible loss of funds, etc.

## Resources

You may find the following guides useful:

1. [Bao Finance Resources](https://docs.bao.finance/)
2. [How to earn and claim BAO](https://docs.bao.finance/)
3. [How to vote and lock veBAO for governance power](https://docs.bao.finance/)
4. [How to claim baoUSD fees](https://docs.bao.finance/)

## Community

Contact our community here:

- [Twitter](https://twitter.com/BaoCommunity)
- [Discord](https://discord.gg/YyugY4XXtE)

## Summary of protocol and contract changes

### Bao Distribution

- Bao Finance has voted to move toward a voting escrow model, from a simple governance ERC20 snapshot on mainnet, and at the same time migrate to a new token that will facilitate these changes without restriction from the master farmer governance model set previously. This process involves migrating all BAO tokens from the original token contract to the new token contract in order to give everyone with previous BAO balances and new users the ability to use the new system for governance/revenue sharing. This includes both circulating and locked BAO tokens. The proposal detailing the Bao token Migration and Distribution can be found here [Bao Distribution Proposal](https://gov.bao.finance/t/bip-14-token-migration-distribution/1140)

- The initial supply of the new BAO token will be given out to those who hold the old BAO token (locked & circulating). The Bao Distribution will be the process by which governance tokens are pre-mined in parellel to liquidity gauge emissions starting.

### Fees

- (subject to change) As of August 2022, fees collected on a weekly basis by veBAO holders are denominated in baoUSD (Synthetic Dollar) and come from the APR generated by the utilization of baoUSD in [Bao Markets](https://github.com/baofinance/bao-markets-contracts).

- In the future there is potential for other fee sources to be voted in by the DAO and would therefore be burned/swapped to baoUSD and subject to the same weekly claim functionality for veBAO holders.

### Liquidity

- Those who provide necessary liquidity for Bao synthetic assets will have BAO liquidity gauges available to them in varying weights to receive BAO emissions.

### Contract Change Overview

- Fee Burning is routed through the [Ballast](https://docs.bao.finance/franchises/bao-markets-hard-synths#ballast) in the [BaseBurner](contracts/burners/BaseBurner.vy) contract and that is where swaps from DAI to baoUSD will occur if the situation arises. After the burning process occurs baoUSD is sent to the [FeeDistributor](contracts/FeeDistributor.vy) in order to be sent to veBAO holders.

- The Voting Escrow contract has added functionality in order for the [distribution contract](https://github.com/baofinance/bao-token/blob/main/src/BaoDistribution.sol) to interact and create locks for existing users that have previously locked BAO in line with the distribution proposal to allow locked Bao holders to lock into veBAO.

- The token contract is an updated version of Curve's token implementation.


## License

This project is licensed under the [MIT](LICENSE) license.
