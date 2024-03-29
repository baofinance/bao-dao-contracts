import brownie

from tests.conftest import bao_distribution

def test_commit_admin_only(voting_escrow, accounts):
    with brownie.reverts("dev: admin only"):
        voting_escrow.commit_transfer_ownership(accounts[1], {"from": accounts[1]})


def test_apply_admin_only(voting_escrow, accounts):
    with brownie.reverts("dev: admin only"):
        voting_escrow.apply_transfer_ownership({"from": accounts[1]})


def test_commit_transfer_ownership(voting_escrow, accounts):
    voting_escrow.commit_transfer_ownership(accounts[1], {"from": accounts[0]})

    assert voting_escrow.admin() == accounts[0]
    assert voting_escrow.future_admin() == accounts[1]


def test_apply_transfer_ownership(voting_escrow, accounts):
    voting_escrow.commit_transfer_ownership(accounts[1], {"from": accounts[0]})
    voting_escrow.apply_transfer_ownership({"from": accounts[0]})

    assert voting_escrow.admin() == accounts[1]


def test_apply_without_commit(voting_escrow, accounts):
    with brownie.reverts("dev: admin not set"):
        voting_escrow.apply_transfer_ownership({"from": accounts[0]})


def test_commit_distr_only(voting_escrow, bao_distribution, accounts):
    with brownie.reverts():
        voting_escrow.commit_distr_contract(bao_distribution, {"from": accounts[1]}) # not admin


def test_apply_distr_only(voting_escrow, accounts):
    with brownie.reverts():
        voting_escrow.apply_distr_contract({"from": accounts[1]}) # not admin


def test_commit_distr_contract(voting_escrow, bao_distribution, accounts):
    voting_escrow.commit_distr_contract(bao_distribution, {"from": accounts[0]})

    assert voting_escrow.admin() == accounts[0]
    assert voting_escrow.future_distr_contract() == bao_distribution


def test_apply_distr_contract(voting_escrow, bao_distribution, accounts):
    voting_escrow.commit_distr_contract(bao_distribution, {"from": accounts[0]})
    voting_escrow.apply_distr_contract({"from": accounts[0]})

    assert voting_escrow.distr_contract() == bao_distribution


def test_apply_distr_without_commit(voting_escrow, accounts):
    with brownie.reverts():
        voting_escrow.apply_distr_contract({"from": accounts[0]})