import brownie
import pytest


@pytest.mark.parametrize("idx", range(4))
def test_accept_transfer_ownership(alice, accounts, gauge_proxy, gauge_v3, idx):
    # parametrized becuase anyone should be able to call to accept
    gauge_v3.commit_transfer_ownership(gauge_proxy, {"from": alice})
    gauge_proxy.accept_transfer_ownership(gauge_v3, {"from": accounts[idx]})

    assert gauge_v3.admin() == gauge_proxy


def test_commit_transfer_ownership(alice, bob, gauge_proxy, gauge_v3):
    gauge_v3.commit_transfer_ownership(gauge_proxy, {"from": alice})
    gauge_proxy.accept_transfer_ownership(gauge_v3, {"from": alice})
    gauge_proxy.commit_transfer_ownership(gauge_v3, bob, {"from": alice})

    assert gauge_v3.future_admin() == bob


@pytest.mark.parametrize("idx", range(1, 4))
def test_commit_only_owner(alice, accounts, gauge_proxy, gauge_v3, idx):
    gauge_v3.commit_transfer_ownership(gauge_proxy, {"from": alice})
    gauge_proxy.accept_transfer_ownership(gauge_v3, {"from": alice})
    with brownie.reverts("Access denied"):
        gauge_proxy.commit_transfer_ownership(gauge_v3, alice, {"from": accounts[idx]})
