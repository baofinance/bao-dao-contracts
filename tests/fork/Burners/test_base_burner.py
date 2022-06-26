import pytest


@pytest.fixture(scope="module")
def burner(BaseBurner, alice, receiver):
    yield BaseBurner.deploy(receiver, receiver, alice, alice, {"from": alice})


currencies = (
    ("0x7945b0A6674b175695e5d1D08aE1e6F13744Abb0", "BaoUSD"),
    ("0x6B175474E89094C44Da98b954EedeAC495271d0F", "DAI"),
)

swapped = (
    ("0x6B175474E89094C44Da98b954EedeAC495271d0F", "DAI"),
)


@pytest.mark.parametrize("token", [i[0] for i in currencies], ids=[i[1] for i in currencies])
@pytest.mark.parametrize("burner_balance", (True, False))
@pytest.mark.parametrize("caller_balance", (True, False))
def test_burn_no_swap(
    MintableTestToken, alice, receiver, burner, token, burner_balance, caller_balance
):
    coin = MintableTestToken(token)
    amount = 10 ** 18 #coin.decimals()

    if caller_balance:
        coin._mint_for_testing(alice, amount, {"from": alice})
        coin.approve(burner, 2 ** 256 - 1, {"from": alice})

    if burner_balance:
        coin._mint_for_testing(burner, amount, {"from": alice})
        amount *= 2

    burner.burn(coin, {"from": alice})

    if burner_balance or caller_balance:
        assert coin.balanceOf(alice) == 0
        assert coin.balanceOf(burner) == amount
        assert coin.balanceOf(receiver) == 0


@pytest.mark.parametrize("token", [i[0] for i in swapped], ids=[i[1] for i in swapped])
@pytest.mark.parametrize("has_balance", (True, False))
def test_burn_swap(MintableTestToken, BaoUSD, alice, receiver, burner, token, has_balance):
    coin = MintableTestToken(token)
    amount = 10 ** 18 #coin.decimals()

    coin._mint_for_testing(alice, amount, {"from": alice})
    coin.approve(burner, 2 ** 256 - 1, {"from": alice})

    if has_balance:
        coin._mint_for_testing(burner, amount, {"from": alice})

    burner.burn(coin, {"from": alice})

    assert coin.balanceOf(alice) == 0
    assert coin.balanceOf(burner) == 0
    assert coin.balanceOf(receiver) == 0

    assert BaoUSD.balanceOf(alice) == 0
    assert BaoUSD.balanceOf(burner) > 0
    assert BaoUSD.balanceOf(receiver) == 0


@pytest.mark.parametrize("token", [i[0] for i in currencies], ids=[i[1] for i in currencies])
def test_execute(MintableTestToken, BaoUSD, alice, burner, token, receiver):
    coin = MintableTestToken(token)
    amount = 10 ** 18 #coin.decimals()
    coin._mint_for_testing(burner, amount, {"from": alice})

    burner.execute({"from": alice})

    assert coin.balanceOf(alice) == 0
    assert coin.balanceOf(burner) == 0
    assert coin.balanceOf(receiver) == 0

    assert BaoUSD.balanceOf(alice) == 0
    assert BaoUSD.balanceOf(burner) == 0
    assert BaoUSD.balanceOf(receiver) > 0