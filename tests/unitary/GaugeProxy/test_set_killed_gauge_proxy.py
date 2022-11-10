import brownie
import pytest


@pytest.fixture(scope="module", autouse=True)
def setup(alice, gauge_proxy, gauge_v3, mock_lp_token):
    gauge_v3.commit_transfer_ownership(gauge_proxy, {"from": alice})
    gauge_proxy.accept_transfer_ownership(gauge_v3, {"from": alice})


@pytest.mark.parametrize("is_killed", [True, False])
@pytest.mark.parametrize("idx", range(2))
def test_kill(accounts, gauge_proxy, gauge_v3, is_killed, idx):
    gauge_proxy.set_killed(gauge_v3, is_killed, {"from": accounts[idx]})

    assert gauge_v3.is_killed() == is_killed


@pytest.mark.parametrize("is_killed", [True, False])
@pytest.mark.parametrize("idx", range(2, 4))
def test_only_owner(accounts, gauge_proxy, gauge_v3, is_killed, idx):
    with brownie.reverts():
        gauge_proxy.set_killed(gauge_v3, is_killed, {"from": accounts[idx]})
