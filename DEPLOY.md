## How to deploy and setup veBAO and BAO liquidity gauges


## Setup

1. Clone this repo then copy `.env.example` to `.env` and fix it up with the right variables for *you*!
2. Run `npm install` from the root of the repo. I'm using Node.js v16.13.2.
3. `npm install --global hardhat-shorthand` to install the *hh* -- hardhat-shorthand executable to your path.
4. `hardhat-completion install`, then run `exec $SHELL` and now you can tab-complete the `hh` command.

Finally:

* Run an `anvil` fork of Ethereum mainnet to give hardhat a working `--network localhost`!
    * Example: `anvil --fork-url https://mainnet.infura.io/v3/$INFURA_ID --chain-id 1 --fork-block-number=16006811`


### Step 1 - Deploy "deploment phase 1" contracts

This phase of deployment deploys all of the contracts necessary to send BAOv2 around.

The phase 1 contracts:
* ERC20BAO (BAOv2)
* VotingEscrow (veBAO)
* BaoDistribution
* Swapper

1. Run `hh deploy --tags Phase1`.


### Step 2 - Fund the distribution and swapper contracts

The Distribution contract gets the total amount of locked BAO in BAOv2 tokens,
reduced by a factor of 1000. The Swapper contract gets the circulating supply
of BAO as BAOv2 tokens, reduced by a factor of 1000.

1. `hh bao:ERC20BAO:transfer --from deployer --to BaoDistribution --amount 832364383418932981187447848`
2. `hh bao:ERC20BAO:transfer --from deployer --to Swapper --amount 166850344226331394130869546`
3. `hh bao:ERC20BAO:transfer --from deployer --to $TREASURY --amount 92538492678164717714597057`

### Step 3 - Setup the BAOv2 token

Set the minter as the minter contract and change the admin.

1. `hh bao:ERC20BAO:changeOwner --admin $TREASURY # calls set_minter and then set_admin`


### Step 4 - Setup the Voting Escrow token

Commit then apply the smart wallet checker, the distribution contract, and 
the ownership of the VE token.

1. `hh bao:VotingEscrow:changeOwner --admin $TREASURY`


### Step 5 - Deploy "deployment phase 2" contracts

Phase 2 contracts:
* GaugeController
* Minter
* FeeDistributor
* BaseBurner
* SmartWalletWhitelist

1. Run `hh deploy --tags Phase2`.


### Step 6 - Setup the FeeDistributor

Transfer ownership from the deployer to the treasury. commit_admin and 
apply_admin.

1. `hh bao:FeeDistributor:changeOwner --admin $TREASURY`


### Step 7 - Setup the BaseBurner

Transfer ownership from deployer to treasury, set emergency recovery address.

TODO: exactly who are the emergency and recovery addresses? Are they a separate multisig? We should consult Baowolf.

1. `hh bao:BaseBurner:changeOwner --admin $TREASURY --emergency $TREASURY --recovery $TREASURY`


### Step 8 - Deploy "deployment phase 3" contracts

Phase 2 contracts:
* LiquidityGaugeV3
    * baoUSD-3CRV
    * bSTBL-DAI
    * BAO-ETH

1. Run `hh deploy --tags Phase3`.


### Step 9 - Setup the GaugeController:

Add new gauge type, add existing gauges to 
controller, and transfer ownership to admin.

1. `hh bao:GaugeController:addGaugeType --name 'Ethereum' --weight 1000000000000000000 # This becomes "--type 0"`
3. `hh bao:GaugeController:addGauge --type 0 --weight 5000000000000000000 --gauge baoUSD-3CRV`
4. `hh bao:GaugeController:addGauge --type 0 --weight 3000000000000000000 --gauge bSTBL-DAI`
5. `hh bao:GaugeController:addGauge --type 0 --weight 2000000000000000000 --gauge BAO-ETH`
6. `hh bao:GaugeController:changeOwner --admin $TREASURY`


### Step 10 - Setup the Gauges (LiquidityGaugeV3)

Transfer ownership from the deployer to the treasury.

1. `hh bao:LiquidityGaugeV3:changeOwner --admin $TREASURY --gauge bSTBL-DAI`
2. `hh bao:LiquidityGaugeV3:changeOwner --admin $TREASURY --gauge BAO-ETH`
3. `hh bao:LiquidityGaugeV3:changeOwner --admin $TREASURY --gauge baoUSD-3CRV`
