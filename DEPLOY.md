## How to deploy and setup veBAO


## Setup

1. Clone this repo then copy `.env.example` to `.env` and fix it up with the right variables for *you*!
2. Run `npm install` from the root of the repo. I'm using Node.js v16.13.2.
3. `npm install --global hardhat-shorthand` to install the *hh* -- hardhat-shorthand executable to your path.
4. `hardhat-completion install`, then run `exec $SHELL` and now you can tab-complete the `hh` command.

Finally:

* Run an `anvil` fork of Ethereum mainnet to give hardhat a working `--network localhost`!


### Step 1 - Deploy all the contracts

* Run `hh --network localhost deploy` and confirm all contracts get deployed to your mainnet fork.


### Step 2 - Fund the distribution and swapper contracts

The Distribution contract gets the total amount of locked BAO in BAOv2 tokens,
reduced by a factor of 1000. The Swapper contract gets the circulating supply
of BAO as BAOv2 tokens, reduced by a factor of 1000.

TODO: these numbers are rough estimates :).

1. `hh bao:ERC20BAO:transfer --from deployer --to BaoDistribution --amount 922240000000000000000000000`
2. `hh bao:ERC20BAO:transfer --from deployer --to Swapper --amount 168740000000000000000000000`


### Step 3 - Setup the BAOv2 token

Set the minter as the minter contract and change the admin.

1. `hh bao:ERC20BAO:changeOwner --admin $TREASURY # calls set_minter and then set_admin`


### Step 4 - Setup the Voting Escrow token

Commit then apply the smart wallet checker, the distribution contract, and 
the ownership of the VE token.

1. `hh bao:VotingEscrow:changeOwner --admin $TREASURY`


### Step 5 - Setup the GaugeController:

Add new gauge types (one for crypto, one for stable), add existing gauges to 
controller, and transfer ownership to admin.

TODO: figure out the weights forreal. I think the numbers are wrong!

1. `hh bao:GaugeController:addGaugeType --name 'Ethereum Stable' --weight 500 # This becomes "--type 0"`
2. `hh bao:GaugeController:addGaugeType --name 'Ethereum Crypto' --weight 500 # This becomes "--type 1"`
3. `hh bao:GaugeController:addGauge --type 0 --weight 500 --gauge baoUSD-3CRV`
4. `hh bao:GaugeController:addGauge --type 0 --weight 375 --gauge bSTBL-DAI`
5. `hh bao:GaugeController:addGauge --type 1 --weight 125 --gauge BAO-ETH`
6. `hh bao:GaugeController:changeOwner --admin $TREASURY`


### Step 6 - Setup the FeeDistributor

Transfer ownership from the deployer to the treasury. commit_admin and 
apply_admin.

1. `hh bao:FeeDistributor:changeOwner --admin $TREASURY`


### Step 7 - Setup the BaseBurner

Transfer ownership from deployer to treasury, set emergency recovery address.

TODO: exactly who are the emergency and recovery addresses? Are they a separate multisig? We should consult Baowolf.

1. `hh bao:BaseBurner:changeOwner --admin $TREASURY --emergency $TREASURY --recovery $TREASURY`


### Step 8 - Setup the Gauges (LiquidityGaugeV3)

Transfer ownership from the deployer to the treasury.

1. `hh bao:LiquidityGaugeV3:changeOwner --admin $TREASURY --gauge bSTBL-DAI`
2. `hh bao:LiquidityGaugeV3:changeOwner --admin $TREASURY --gauge BAO-ETH`
3. `hh bao:LiquidityGaugeV3:changeOwner --admin $TREASURY --gauge baoUSD-3CRV`
