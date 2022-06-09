from brownie import (
    ZERO_ADDRESS,
    Contract,
    FeeDistributor,
    BaseBurner,
    accounts,
    chain,
    history,
)

BURNERS = {
    BaseBurner: [
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",  # DAI
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",  # USDC
        "0xdAC17F958D2ee523a2206206994597C13D831ec7",  # USDT
        "0x5ee08f40b637417bcC9d2C51B62F4820ec9cF5D8",  # bSTBL
    ],
}


def test_fee_distribution():

    alice = accounts[0]
    lp_tripool = Contract("0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490")

    # GET LIST OF INCENTIVIZED BAO POOLS
    provider = Contract("0x0000000022D53366457F9d5E68Ec105046FC4383")
    registry = Contract(provider.get_registry())

    chain.sleep(86400 * 3)

    # deploy the fee distributor
    distributor = FeeDistributor.deploy(
        "0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2",  # VotingEscrow
        chain.time(),
        lp_tripool,
        alice,
        alice,
        {"from": alice},
    )

    # deploy the burners
    base_burner = BaseBurner.deploy(distributor, alice, alice, alice, {"from": alice})

    # TAKE PROTOCOL FEES AND SEND THEM TO BURNER
    
    # individually execute the burners for each coin
    for coin in coin_list:
        if coin == "0x57ab1ec28d129707052df4df418d58a2d46d5f51":
            Contract("0x0bfDc04B38251394542586969E2356d0D731f7DE").settle(
                base_burner,
                "0x7355534400000000000000000000000000000000000000000000000000000000",
                {"from": alice},
            )
        proxy.burn(coin, {"from": alice})

    # call execute on base burner
    base_burner.execute({"from": alice})

    # verify zero-balances for all tokens in all contracts
    for coin in coin_list:
        for burner in burner_list:
            assert coin.balanceOf(burner) < 2
        assert coin.balanceOf(proxy) < 2
        assert coin.balanceOf(alice) < 2
        assert coin.balanceOf(distributor) < 2

    # verify zero-balance for 3CRV
    for burner in burner_list:
        assert lp_tripool.balanceOf(burner) == 0
    assert lp_tripool.balanceOf(proxy) == 0
    assert lp_tripool.balanceOf(alice) == 0

    # verify that fee distributor has received 3CRV
    amount = lp_tripool.balanceOf(distributor)
    assert amount > 0
    print(f"Success! bSTBL balance in distributor: {amount/1e18:.4f}")