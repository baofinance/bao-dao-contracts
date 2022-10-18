import json

from brownie import (
    ERC20BAO,
    GaugeController,
    LiquidityGaugeV3,
    Minter,
    VotingEscrow,
    BaoDistribution,
    FeeDistributor,
    accounts,
    history,
)
from importlib_metadata import distribution

from . import deployment_config as config

# TODO set weights!

# name, type weight
GAUGE_TYPES = [
    ("Liquidity", 10 ** 18),
]

# lp token, gauge weight
POOL_TOKENS = {
    "baoUSD-3CRV": ("0x0FaFaFD3C393ead5F5129cFC7e0E12367088c473", 741),
    "bSTBL-DAI": ("0x9fC689CCaDa600B6DF723D9E47D84d76664a1F23", 372),
    "BAO-ETH": ("0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8", 372),
}

def live_part_one():
    admin, _ = config.get_live_admin()
    deploy_part_one(admin, config.REQUIRED_CONFIRMATIONS, config.DEPLOYMENTS_JSON)


def live_part_two():
    admin, _ = config.get_live_admin()
    with open(config.DEPLOYMENTS_JSON) as fp:
        deployments = json.load(fp)
    token = ERC20BAO.at(deployments["ERC20BAO"])
    voting_escrow = VotingEscrow.at(deployments["VotingEscrow"])

    deploy_part_two(admin, token, voting_escrow, config.REQUIRED_CONFIRMATIONS, config.DEPLOYMENTS_JSON)


def development():
    token, voting_escrow = deploy_part_one(accounts[0])
    deploy_part_two(accounts[0], token, voting_escrow)


def deploy_part_one(admin, confs=1, deployments_json="deployments.json"):
    token = ERC20BAO.deploy("BAO DAO Token", "BAO", 18, {"from": admin, "required_confs": confs}) #TOKEN
    voting_escrow = VotingEscrow.deploy(
        token,
        "Vote-escrowed BAO",
        "veBAO",
        "veBAO_1.0.0",
        {"from": admin, "required_confs": confs},
    ) #VE TOKEN

    deployments = {
        "ERC20BAO": token.address,
        "VotingEscrow": voting_escrow.address,
    }
    
    if deployments_json is not None:
        with open(deployments_json, "w") as fp:
            json.dump(deployments, fp)
        print(f"Deployment addresses saved to {deployments_json}")

    return token, voting_escrow


def deploy_part_two(admin, token, voting_escrow, confs=1, deployments_json="deployments.json"):
    distribution = BaoDistribution.deploy(
        token, voting_escrow, 0x41c02385a07002f9d8fd88c8fb950c308c6f7bf7c748b57ae9b892e291900363, admin, {"from": admin, "required_confs": confs}
    )

    gauge_controller = GaugeController.deploy(
        token, voting_escrow, {"from": admin, "required_confs": confs}
    )
    for name, weight in GAUGE_TYPES:
        gauge_controller.add_type(name, weight, {"from": admin, "required_confs": confs})

    minter = Minter.deploy(token, gauge_controller, {"from": admin, "required_confs": confs})
    token.set_minter(minter, {"from": admin, "required_confs": confs})

    #fee distributor

    deployments = {
        "ERC20CRV": token.address,
        "VotingEscrow": voting_escrow.address,
        "GaugeController": gauge_controller.address,
        "Minter": minter.address,
        "LiquidityGaugeV3": {},
    }
    for name, (lp_token, weight) in POOL_TOKENS.items():
        gauge = LiquidityGaugeV3.deploy(lp_token, minter, admin, {"from": admin, "required_confs": confs})
        gauge_controller.add_gauge(gauge, 0, weight, {"from": admin, "required_confs": confs})
        deployments["LiquidityGaugeV3"][name] = gauge.address

    print(f"Deployment complete! Total gas used: {sum(i.gas_used for i in history)}")
    if deployments_json is not None:
        with open(deployments_json, "w") as fp:
            json.dump(deployments, fp)
        print(f"Deployment addresses saved to {deployments_json}")